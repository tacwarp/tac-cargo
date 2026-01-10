/**
 * TAC Cargo MCP Server - Shipment Query Tool
 * Provides MCP interface for querying shipment data with Sentry monitoring
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import * as Sentry from "@sentry/nextjs";
import { createClient } from "@/lib/supabase/server";
import { fileURLToPath } from "node:url";
import path from "node:path";

/**
 * Initialize Sentry for MCP server monitoring
 */
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1,
  environment: process.env.NODE_ENV || "development",
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || "development",
});

/**
 * Create MCP server instance using the new McpServer API
 */
const server = new McpServer({
  name: "tac-cargo-shipment-server",
  version: "1.0.0",
});

/**
 * Tool: Query shipment by reference number
 */
server.tool(
  "query_shipment",
  {
    reference: z.string().describe("Shipment reference number (e.g., SHP-2024-001)"),
  },
  async ({ reference }) => {
    return await executeTool("query_shipment", { reference }, () => queryShipment(reference));
  }
);

/**
 * Tool: List recent shipments
 */
server.tool(
  "list_recent_shipments",
  {
    limit: z.number().min(1).max(100).default(10).describe("Maximum number of shipments to return (default: 10)"),
  },
  async ({ limit }) => {
    return await executeTool("list_recent_shipments", { limit }, () => listRecentShipments(limit));
  }
);

/**
 * Tool: Get shipment status
 */
server.tool(
  "get_shipment_status",
  {
    reference: z.string().describe("Shipment reference number"),
  },
  async ({ reference }) => {
    return await executeTool("get_shipment_status", { reference }, () => getShipmentStatus(reference));
  }
);

/**
 * MCP Tool content response type
 */
type ToolResponse = {
  content: Array<{ type: "text"; text: string }>;
};

/**
 * Execute tool with Sentry monitoring wrapper
 */
async function executeTool(
  toolName: string,
  args: Record<string, unknown>,
  handler: () => Promise<ToolResponse>
): Promise<ToolResponse> {
  return await Sentry.startSpan(
    {
      name: `MCP Tool: ${toolName}`,
      op: "mcp.tool.call",
      attributes: {
        "mcp.tool.name": toolName,
        "mcp.server": "tac-cargo-shipment-server",
      },
    },
    async () => {
      try {
        Sentry.addBreadcrumb({
          category: "mcp",
          message: `Tool called: ${toolName}`,
          level: "info",
          data: { tool: toolName, arguments: args },
        });

        return await handler();
      } catch (error) {
        Sentry.captureException(error, {
          tags: {
            mcp_server: "tac-cargo-shipment-server",
            tool_name: toolName,
            error_type: "tool_execution_error",
          },
          extra: { tool_arguments: args },
        });
        throw error;
      }
    }
  );
}

/**
 * Query shipment by reference
 */
async function queryShipment(reference: string): Promise<ToolResponse> {
  return await Sentry.startSpan(
    {
      name: "Query Shipment by Reference",
      op: "db.query",
    },
    async () => {
      const supabase = await createClient();

      const { data, error } = await supabase
        .from("shipments")
        .select(
          `
          *,
          origin_warehouse:warehouses!origin_warehouse_id(code, name, city, state),
          destination_warehouse:warehouses!destination_warehouse_id(code, name, city, state),
          customer:customers(name, email)
        `,
        )
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
            type: "text" as const,
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    },
  );
}

/**
 * List recent shipments
 */
async function listRecentShipments(limit: number = 10): Promise<ToolResponse> {
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
            type: "text" as const,
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    },
  );
}

/**
 * Get shipment status
 */
async function getShipmentStatus(reference: string): Promise<ToolResponse> {
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
            type: "text" as const,
            text: JSON.stringify(
              {
                reference: data.reference,
                status: data.status,
                eta: data.eta,
                delivered_at: data.delivered_at,
              },
              null,
              2,
            ),
          },
        ],
      };
    },
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

    console.error(
      "TAC Cargo MCP Shipment Server running with Sentry monitoring",
    );
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        mcp_server: "tac-cargo-shipment-server",
        error_type: "server_startup_error",
      },
    });

    console.error("Failed to start MCP server:", error instanceof Error ? error.message : "Unknown error");
    process.exit(1);
  }
}

// Start server if run directly (ES module compatible, cross-platform)
const currentFilePath = fileURLToPath(import.meta.url);
const executedFilePath = process.argv[1] ? path.resolve(process.argv[1]) : "";

// Strict path comparison - only match exact file path to prevent unintended execution
// Normalize both paths to handle Windows vs Unix path separators
const normalizedCurrentPath = path.normalize(currentFilePath);
const normalizedExecutedPath = path.normalize(executedFilePath);
const isMainModule = normalizedCurrentPath === normalizedExecutedPath;

if (isMainModule) {
  try {
    await main();
  } catch (error) {
    Sentry.captureException(error);
    console.error("Server error:", error instanceof Error ? error.message : "Unknown error");
    process.exit(1);
  }
}

export { server };
