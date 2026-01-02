/**
 * MCP Test API Endpoint
 * Demonstrates MCP server usage with Sentry monitoring
 */

import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { TacCargoMcpClient } from "@/lib/mcp/client";

export async function GET(request: Request) {
  return await Sentry.startSpan(
    {
      name: "MCP Test API",
      op: "http.server",
    },
    async () => {
      const { searchParams } = new URL(request.url);
      const action = searchParams.get("action") || "list";
      const reference = searchParams.get("reference");

      const client = new TacCargoMcpClient();

      try {
        // Connect to MCP server
        await client.connect();

        let result;

        switch (action) {
          case "query":
            if (!reference) {
              await client.disconnect();
              return NextResponse.json(
                { error: "Reference parameter required for query action" },
                { status: 400 }
              );
            }
            result = await client.queryShipment(reference);
            break;

          case "status":
            if (!reference) {
              await client.disconnect();
              return NextResponse.json(
                { error: "Reference parameter required for status action" },
                { status: 400 }
              );
            }
            result = await client.getShipmentStatus(reference);
            break;

          case "list":
          default: {
            const limit = parseInt(searchParams.get("limit") || "10");
            result = await client.listRecentShipments(limit);
            break;
          }
        }

        // Disconnect from MCP server
        await client.disconnect();

        return NextResponse.json({
          success: true,
          action,
          data: result,
        });
      } catch (error) {
        // Ensure client is disconnected
        await client.disconnect();

        Sentry.captureException(error, {
          tags: {
            api_endpoint: "/api/mcp/test",
            mcp_action: action,
          },
          extra: {
            reference,
          },
        });

        return NextResponse.json(
          {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
          },
          { status: 500 }
        );
      }
    }
  );
}
