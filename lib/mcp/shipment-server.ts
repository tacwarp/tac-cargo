/**
 * TAC Cargo MCP Server - Shipment Query Tool
 * Provides MCP interface for querying shipment data with Sentry monitoring
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import * as Sentry from "@sentry/nextjs";
import { createClient } from "@/lib/supabase/server";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { z } from "zod";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

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
 * Create MCP server instance
 */
const server = new McpServer({
  name: "tac-cargo-shipment-server",
  version: "1.0.0",
});

function createTextContent(text: string): CallToolResult {
  const result: CallToolResult = {
    content: [
      {
        type: "text",
        text,
      },
    ],
  };

  return result;
}

/**
 * Register tools with Sentry monitoring
 */
server.registerTool(
  "query_shipment",
  {
    title: "Query shipment",
    description: "Query shipment information by reference number",
    inputSchema: {
      reference: z.string().min(1, "Reference is required"),
    },
  },
  async ({ reference }) =>
    Sentry.startSpan(
      {
        name: "MCP Tool: query_shipment",
        op: "mcp.tool.call",
        attributes: {
          "mcp.tool.name": "query_shipment",
          "mcp.server": "tac-cargo-shipment-server",
        },
      },
      async () => {
        try {
          Sentry.addBreadcrumb({
            category: "mcp",
            message: "Tool called: query_shipment",
            level: "info",
            data: {
              tool: "query_shipment",
              arguments: { reference },
            },
          });

          return await queryShipment(reference);
        } catch (error) {
          Sentry.captureException(error, {
            tags: {
              mcp_server: "tac-cargo-shipment-server",
              tool_name: "query_shipment",
              error_type: "tool_execution_error",
            },
            extra: {
              tool_arguments: { reference },
            },
          });

          throw error;
        }
      },
    ),
);

server.registerTool(
  "list_recent_shipments",
  {
    title: "List recent shipments",
    description: "List recent shipments with optional limit",
    inputSchema: {
      limit: z
        .number()
        .int()
        .min(1)
        .max(100)
        .optional(),
    },
  },
  async ({ limit }) => {
    const effectiveLimit = typeof limit === "number" ? limit : 10;

    return Sentry.startSpan(
      {
        name: "MCP Tool: list_recent_shipments",
        op: "mcp.tool.call",
        attributes: {
          "mcp.tool.name": "list_recent_shipments",
          "mcp.server": "tac-cargo-shipment-server",
        },
      },
      async () => {
        try {
          Sentry.addBreadcrumb({
            category: "mcp",
            message: "Tool called: list_recent_shipments",
            level: "info",
            data: {
              tool: "list_recent_shipments",
              arguments: { limit: effectiveLimit },
            },
          });

          return await listRecentShipments(effectiveLimit);
        } catch (error) {
          Sentry.captureException(error, {
            tags: {
              mcp_server: "tac-cargo-shipment-server",
              tool_name: "list_recent_shipments",
              error_type: "tool_execution_error",
            },
            extra: {
              tool_arguments: { limit: effectiveLimit },
            },
          });

          throw error;
        }
      },
    );
  },
);

server.registerTool(
  "get_shipment_status",
  {
    title: "Get shipment status",
    description: "Get current status of a shipment",
    inputSchema: {
      reference: z.string().min(1, "Reference is required"),
    },
  },
  async ({ reference }) =>
    Sentry.startSpan(
      {
        name: "MCP Tool: get_shipment_status",
        op: "mcp.tool.call",
        attributes: {
          "mcp.tool.name": "get_shipment_status",
          "mcp.server": "tac-cargo-shipment-server",
        },
      },
      async () => {
        try {
          Sentry.addBreadcrumb({
            category: "mcp",
            message: "Tool called: get_shipment_status",
            level: "info",
            data: {
              tool: "get_shipment_status",
              arguments: { reference },
            },
          });

          return await getShipmentStatus(reference);
        } catch (error) {
          Sentry.captureException(error, {
            tags: {
              mcp_server: "tac-cargo-shipment-server",
              tool_name: "get_shipment_status",
              error_type: "tool_execution_error",
            },
            extra: {
              tool_arguments: { reference },
            },
          });

          throw error;
        }
      },
    ),
);

/**
 * Query shipment by reference
 */
async function queryShipment(reference: string): Promise<CallToolResult> {
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

      return createTextContent(JSON.stringify(data, null, 2));
    },
  );
}

/**
 * List recent shipments
 */
async function listRecentShipments(limit: number = 10): Promise<CallToolResult> {
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

      return createTextContent(JSON.stringify(data, null, 2));
    },
  );
}

/**
 * Get shipment status
 */
async function getShipmentStatus(reference: string): Promise<CallToolResult> {
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

      return createTextContent(
        JSON.stringify(
          {
            reference: data.reference,
            status: data.status,
            eta: data.eta,
            delivered_at: data.delivered_at,
          },
          null,
          2,
        ),
      );
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

    console.error("Failed to start MCP server:", error);
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
    console.error("Server error:", error);
    process.exit(1);
  }
}

export { server };
