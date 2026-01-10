/**
 * MCP Client for TAC Cargo
 * Provides a client interface to interact with the MCP server
 */

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import * as Sentry from "@sentry/nextjs";

export class TacCargoMcpClient {
  private client: Client;
  private transport: StdioClientTransport | null = null;

  constructor() {
    this.client = new Client(
      {
        name: "tac-cargo-mcp-client",
        version: "1.0.0",
      },
      {
        capabilities: {},
      },
    );
  }

  /**
   * Connect to MCP server
   */
  async connect() {
    return await Sentry.startSpan(
      {
        name: "MCP Client Connect",
        op: "mcp.client.connect",
      },
      async () => {
        try {
          this.transport = new StdioClientTransport({
            command: "node",
            args: ["dist/lib/mcp/shipment-server.js"],
          });

          await this.client.connect(this.transport);

          Sentry.addBreadcrumb({
            category: "mcp",
            message: "MCP client connected successfully",
            level: "info",
          });

          return true;
        } catch (error) {
          Sentry.captureException(error, {
            tags: {
              mcp_client: "tac-cargo-mcp-client",
              error_type: "connection_error",
            },
          });
          throw error;
        }
      },
    );
  }

  /**
   * Query shipment by reference
   */
  async queryShipment(reference: string) {
    return await Sentry.startSpan(
      {
        name: "MCP: Query Shipment",
        op: "mcp.tool.query_shipment",
        attributes: {
          "shipment.reference": reference,
        },
      },
      async () => {
        try {
          const result = await this.client.callTool({
            name: "query_shipment",
            arguments: { reference },
          });

          // Validate content structure before type assertion
          if (
            !result.content ||
            !Array.isArray(result.content) ||
            result.content.length === 0
          ) {
            throw new Error("Invalid MCP response: empty or missing content");
          }

          const firstContent = result.content[0];
          if (
            typeof firstContent !== "object" ||
            firstContent === null ||
            !("type" in firstContent) ||
            !("text" in firstContent) ||
            typeof (firstContent as { text: unknown }).text !== "string"
          ) {
            throw new Error(
              "Invalid MCP response: malformed content structure",
            );
          }

          const content = result.content as Array<{
            type: string;
            text: string;
          }>;
          return JSON.parse(content[0].text);
        } catch (error) {
          Sentry.captureException(error, {
            tags: {
              mcp_tool: "query_shipment",
              shipment_reference: reference,
            },
          });
          throw error;
        }
      },
    );
  }

  /**
   * List recent shipments
   */
  async listRecentShipments(limit: number = 10) {
    return await Sentry.startSpan(
      {
        name: "MCP: List Recent Shipments",
        op: "mcp.tool.list_recent_shipments",
        attributes: {
          limit,
        },
      },
      async () => {
        try {
          const result = await this.client.callTool({
            name: "list_recent_shipments",
            arguments: { limit },
          });

          const content = result.content as Array<{
            type: string;
            text: string;
          }>;
          if (!content || !Array.isArray(content) || content.length === 0) {
            throw new Error("Invalid MCP response: empty or missing content");
          }
          return JSON.parse(content[0].text);
        } catch (error) {
          Sentry.captureException(error, {
            tags: {
              mcp_tool: "list_recent_shipments",
            },
          });
          throw error;
        }
      },
    );
  }

  /**
   * Get shipment status
   */
  async getShipmentStatus(reference: string) {
    return await Sentry.startSpan(
      {
        name: "MCP: Get Shipment Status",
        op: "mcp.tool.get_shipment_status",
        attributes: {
          "shipment.reference": reference,
        },
      },
      async () => {
        try {
          const result = await this.client.callTool({
            name: "get_shipment_status",
            arguments: { reference },
          });

          const content = result.content as Array<{
            type: string;
            text: string;
          }>;
          if (!content || !Array.isArray(content) || content.length === 0) {
            throw new Error("Invalid MCP response: empty or missing content");
          }
          return JSON.parse(content[0].text);
        } catch (error) {
          Sentry.captureException(error, {
            tags: {
              mcp_tool: "get_shipment_status",
              shipment_reference: reference,
            },
          });
          throw error;
        }
      },
    );
  }

  /**
   * Disconnect from MCP server
   */
  async disconnect() {
    if (this.transport) {
      await this.client.close();
      this.transport = null;

      Sentry.addBreadcrumb({
        category: "mcp",
        message: "MCP client disconnected",
        level: "info",
      });
    }
  }
}
