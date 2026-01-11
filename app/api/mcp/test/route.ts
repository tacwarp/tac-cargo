/**
 * MCP Test Endpoint
 * Tests MCP functionality and Sentry integration
 */

import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  return await Sentry.startSpan(
    {
      name: "MCP Test API",
      op: "http.server",
      attributes: {
        "http.route": "/api/mcp/test",
        "mcp.test": true,
      },
    },
    async () => {
      const { searchParams } = new URL(request.url);
      const action = searchParams.get("action") || "health";

      Sentry.addBreadcrumb({
        category: "mcp.test",
        message: `MCP test endpoint called with action: ${action}`,
        level: "info",
        data: { action },
      });

      try {
        switch (action) {
          case "health":
            return NextResponse.json({
              success: true,
              status: "healthy",
              mcp: {
                version: "1.0.0",
                tools: ["query_shipment", "list_recent_shipments", "get_shipment_status"],
              },
              sentry: {
                configured: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
                environment: process.env.NODE_ENV,
              },
              timestamp: new Date().toISOString(),
            });

          case "connection":
            // Test database connection via Supabase
            const supabase = await createClient();
            const { data, error } = await supabase
              .from("shipments")
              .select("id")
              .limit(1);

            if (error) {
              throw new Error(`Database connection failed: ${error.message}`);
            }

            return NextResponse.json({
              success: true,
              status: "connected",
              database: "supabase",
              test_query: "SELECT id FROM shipments LIMIT 1",
              result: data ? "OK" : "Empty",
            });

          case "error":
            // Intentionally throw error to test Sentry capture
            throw new Error("MCP Test Error - Intentional for Sentry testing");

          case "sentry":
            // Send a test message to Sentry
            Sentry.captureMessage("MCP Test Message", {
              level: "info",
              tags: {
                test: true,
                endpoint: "/api/mcp/test",
                action: "sentry",
              },
            });

            return NextResponse.json({
              success: true,
              message: "Test message sent to Sentry",
              action: "sentry",
            });

          default:
            return NextResponse.json(
              {
                success: false,
                error: `Unknown action: ${action}`,
                available_actions: ["health", "connection", "error", "sentry"],
              },
              { status: 400 }
            );
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        Sentry.captureException(error, {
          tags: {
            api_endpoint: "/api/mcp/test",
            mcp_action: action,
            test: true,
          },
          extra: {
            action,
            url: request.url,
          },
        });

        return NextResponse.json(
          {
            success: false,
            error: errorMessage,
            action,
          },
          { status: 500 }
        );
      }
    }
  );
}
