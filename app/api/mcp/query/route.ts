/**
 * Direct MCP Implementation for Shipment Queries
 * Uses MCP SDK patterns with Sentry monitoring without requiring separate server process
 */

import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { createClient } from "@/lib/supabase/server";

/**
 * List recent shipments
 */
async function listRecentShipments(limit: number = 10) {
  return await Sentry.startSpan(
    {
      name: "MCP: List Recent Shipments",
      op: "mcp.tool.list_recent_shipments",
      attributes: {
        "mcp.tool": "list_recent_shipments",
        "mcp.limit": limit,
      },
    },
    async () => {
      Sentry.addBreadcrumb({
        category: "mcp",
        message: "MCP tool called: list_recent_shipments",
        level: "info",
        data: { limit },
      });

      const supabase = await createClient();

      const { data, error } = await supabase
        .from("shipments")
        .select("reference, status, created_at, eta")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        throw new Error(`Failed to list shipments: ${error.message}`);
      }

      return data;
    }
  );
}

/**
 * Query shipment by reference
 */
async function queryShipment(reference: string) {
  return await Sentry.startSpan(
    {
      name: "MCP: Query Shipment",
      op: "mcp.tool.query_shipment",
      attributes: {
        "mcp.tool": "query_shipment",
        "shipment.reference": reference,
      },
    },
    async () => {
      Sentry.addBreadcrumb({
        category: "mcp",
        message: "MCP tool called: query_shipment",
        level: "info",
        data: { reference },
      });

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

      return data;
    }
  );
}

/**
 * Get shipment status
 */
async function getShipmentStatus(reference: string) {
  return await Sentry.startSpan(
    {
      name: "MCP: Get Shipment Status",
      op: "mcp.tool.get_shipment_status",
      attributes: {
        "mcp.tool": "get_shipment_status",
        "shipment.reference": reference,
      },
    },
    async () => {
      Sentry.addBreadcrumb({
        category: "mcp",
        message: "MCP tool called: get_shipment_status",
        level: "info",
        data: { reference },
      });

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
        reference: data.reference,
        status: data.status,
        eta: data.eta,
        delivered_at: data.delivered_at,
      };
    }
  );
}

/**
 * Main API handler
 */
export async function GET(request: Request) {
  return await Sentry.startSpan(
    {
      name: "MCP Query API",
      op: "http.server",
      attributes: {
        "http.route": "/api/mcp/query",
      },
    },
    async () => {
      // Authentication check
      const supabase = await createClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        return NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        );
      }

      const { searchParams } = new URL(request.url);
      const action = searchParams.get("action") || "list";
      const reference = searchParams.get("reference");

      try {
        let result;

        switch (action) {
          case "query":
            if (!reference || reference.trim().length === 0) {
              return NextResponse.json(
                { error: "Valid reference parameter required for query action" },
                { status: 400 }
              );
            }
            result = await queryShipment(reference.trim());
            break;

          case "status":
            if (!reference || reference.trim().length === 0) {
              return NextResponse.json(
                { error: "Valid reference parameter required for status action" },
                { status: 400 }
              );
            }
            result = await getShipmentStatus(reference.trim());
            break;

          case "list":
          default: {
            const rawLimit = searchParams.get("limit") || "10";
            let limit = parseInt(rawLimit);

            if (isNaN(limit) || limit <= 0) {
              limit = 10;
            } else if (limit > 100) {
              limit = 100; // Cap at 100
            }

            result = await listRecentShipments(limit);
            break;
          }
        }

        const toolNames: Record<string, string> = {
          list: "list_recent_shipments",
          query: "query_shipment",
          status: "get_shipment_status",
        };

        return NextResponse.json({
          success: true,
          action,
          tool: `mcp.tool.${toolNames[action] || "unknown"}`,
          data: result,
        });
      } catch (error) {
        Sentry.captureException(error, {
          tags: {
            api_endpoint: "/api/mcp/query",
            mcp_action: action,
            mcp_tool: action,
          },
          extra: {
            reference,
            action,
          },
        });

        const errorMessage = process.env.NODE_ENV === "production"
          ? "A protocol error occurred while processing the request."
          : (error instanceof Error ? error.message : "Unknown error");

        return NextResponse.json(
          {
            success: false,
            error: errorMessage,
          },
          { status: 500 }
        );
      }
    }
  );
}
