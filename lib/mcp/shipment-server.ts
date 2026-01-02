/**
 * TAC Cargo MCP Server - Shipment Query Tool
 * Provides MCP interface for querying shipment data with Sentry monitoring
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import * as Sentry from "@sentry/nextjs";
import { createClient } from "@/lib/supabase/server";
import { fileURLToPath } from 'url';
import path from 'path';

/**
 * Initialize Sentry for MCP server monitoring
 */
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV || 'development',
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || 'development',
});

/**
 * Create MCP server instance
 */
const server = new Server(
  {
    name: "tac-cargo-shipment-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * List available tools
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "query_shipment",
        description: "Query shipment information by reference number",
        inputSchema: {
          type: "object",
          properties: {
            reference: {
              type: "string",
              description: "Shipment reference number (e.g., SHP-2024-001)",
            },
          },
          required: ["reference"],
        },
      },
      {
        name: "list_recent_shipments",
        description: "List recent shipments with optional limit",
        inputSchema: {
          type: "object",
          properties: {
            limit: {
              type: "number",
              description: "Maximum number of shipments to return (default: 10)",
              default: 10,
            },
          },
        },
      },
      {
        name: "get_shipment_status",
        description: "Get current status of a shipment",
        inputSchema: {
          type: "object",
          properties: {
            reference: {
              type: "string",
              description: "Shipment reference number",
            },
          },
          required: ["reference"],
        },
      },
    ],
  };
});

/**
 * Handle tool calls with Sentry monitoring
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  // Wrap entire tool execution in Sentry span
  return await Sentry.startSpan(
    {
      name: `MCP Tool: ${name}`,
      op: "mcp.tool.call",
      attributes: {
        "mcp.tool.name": name,
        "mcp.server": "tac-cargo-shipment-server",
      },
    },
    async () => {
      try {
        // Add breadcrumb for debugging
        Sentry.addBreadcrumb({
          category: "mcp",
          message: `Tool called: ${name}`,
          level: "info",
          data: {
            tool: name,
            arguments: args,
          },
        });

        switch (name) {
          case "query_shipment": {
            const reference = args?.reference;
            if (typeof reference !== "string" || !reference.trim()) {
              throw new Error("query_shipment requires a valid 'reference' string argument");
            }
            return await queryShipment(reference);
          }

          case "list_recent_shipments": {
            const limit = typeof args?.limit === "number" ? args.limit : 10;
            if (limit < 1 || limit > 100) {
              throw new Error("list_recent_shipments 'limit' must be between 1 and 100");
            }
            return await listRecentShipments(limit);
          }

          case "get_shipment_status": {
            const reference = args?.reference;
            if (typeof reference !== "string" || !reference.trim()) {
              throw new Error("get_shipment_status requires a valid 'reference' string argument");
            }
            return await getShipmentStatus(reference);
          }

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        // Capture error in Sentry with context
        Sentry.captureException(error, {
          tags: {
            mcp_server: "tac-cargo-shipment-server",
            tool_name: name,
            error_type: "tool_execution_error",
          },
          extra: {
            tool_arguments: args,
          },
        });

        // Re-throw for MCP error handling
        throw error;
      }
    }
  );
});

/**
 * Query shipment by reference
 */
async function queryShipment(reference: string) {
  return await Sentry.startSpan(
    {
      name: "Query Shipment by Reference",
      op: "db.query",
    },
    async () => {
      const supabase = await createClient();

      const { data, error } = await supabase
        .from("shipments")
        .select(`
          *,
          origin_warehouse:warehouses!origin_warehouse_id(code, name, city, state),
          destination_warehouse:warehouses!destination_warehouse_id(code, name, city, state),
          customer:customers(name, email)
        `)
        .eq("reference", reference)
        .single();

      if (error) {
        throw new Error(`Failed to query shipment: ${error.message}`);
      }

      if (!data) {
        throw new Error(`Shipment not found: ${reference}`);
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    }
  );
}

/**
 * List recent shipments
 */
async function listRecentShipments(limit: number = 10) {
  return await Sentry.startSpan(
    {
      name: "List Recent Shipments",
      op: "db.query",
      attributes: {
        "db.limit": limit,
      },
    },
    async () => {
      const supabase = await createClient();

      const { data, error } = await supabase
        .from("shipments")
        .select("reference, status, created_at, eta")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        throw new Error(`Failed to list shipments: ${error.message}`);
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    }
  );
}

/**
 * Get shipment status
 */
async function getShipmentStatus(reference: string) {
  return await Sentry.startSpan(
    {
      name: "Get Shipment Status",
      op: "db.query",
    },
    async () => {
      const supabase = await createClient();

      const { data, error } = await supabase
        .from("shipments")
        .select("reference, status, eta, delivered_at")
        .eq("reference", reference)
        .single();

      if (error) {
        throw new Error(`Failed to get shipment status: ${error.message}`);
      }

      if (!data) {
        throw new Error(`Shipment not found: ${reference}`);
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              reference: data.reference,
              status: data.status,
              eta: data.eta,
              delivered_at: data.delivered_at,
            }, null, 2),
          },
        ],
      };
    }
  );
}

/**
 * Start MCP server
 */
async function main() {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);

    Sentry.addBreadcrumb({
      category: "mcp",
      message: "MCP server started successfully",
      level: "info",
    });

    console.error("TAC Cargo MCP Shipment Server running with Sentry monitoring");
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        mcp_server: "tac-cargo-shipment-server",
        error_type: "server_startup_error",
      },
    });

    console.error("Failed to start MCP server:", error);
    process.exit(1);
  }
}

// Start server if run directly (ES module compatible, cross-platform)
const currentFilePath = fileURLToPath(import.meta.url);
const executedFilePath = process.argv[1] ? path.resolve(process.argv[1]) : '';

// Strict path comparison - only match exact file path to prevent unintended execution
// Normalize both paths to handle Windows vs Unix path separators
const normalizedCurrentPath = path.normalize(currentFilePath);
const normalizedExecutedPath = path.normalize(executedFilePath);
const isMainModule = normalizedCurrentPath === normalizedExecutedPath;

if (isMainModule) {
  main().catch((error) => {
    Sentry.captureException(error);
    console.error("Server error:", error);
    process.exit(1);
  });
}

export { server };
