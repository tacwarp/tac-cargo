# 🔌 Sentry MCP Integration Status

## Current Status

### ✅ Installed

- `@modelcontextprotocol/sdk` package is installed
- Sentry is configured and working

### ⏳ Not Yet Active

The MCP SDK is installed but **not actively monitoring** because:

- No MCP servers are currently running in your application
- MCP integration requires actual MCP servers to monitor

---

## What is MCP?

**Model Context Protocol (MCP)** is a protocol for AI assistants to interact with external tools and data sources through servers.

**Use Cases:**

- Database query servers
- File system access servers
- API integration servers
- Custom tool servers

---

## When to Use Sentry MCP Monitoring

Use Sentry MCP monitoring when you:

1. Add MCP servers to your application
2. Want to track MCP server performance
3. Need to debug MCP server errors
4. Monitor resource requests and tool executions

---

## How Sentry MCP Monitoring Works

When you add an MCP server, Sentry automatically tracks:

- **Server startup/shutdown**
- **Tool executions**
- **Resource requests**
- **Errors and exceptions**
- **Performance metrics**

---

## Example: Adding Sentry to an MCP Server

### Basic MCP Server with Sentry

```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import * as Sentry from "@sentry/nextjs";

// Initialize Sentry for MCP server
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV || "development",
});

// Create MCP server
const server = new Server(
  {
    name: "example-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  },
);

// Wrap tool handler with Sentry
server.setRequestHandler("tools/call", async (request) => {
  return await Sentry.startSpan(
    {
      name: `MCP Tool: ${request.params.name}`,
      op: "mcp.tool.call",
    },
    async () => {
      try {
        // Your tool logic here
        const result = await executeTool(
          request.params.name,
          request.params.arguments,
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result),
            },
          ],
        };
      } catch (error) {
        // Capture errors in Sentry
        Sentry.captureException(error, {
          tags: {
            mcp_server: "example-mcp-server",
            tool_name: request.params.name,
          },
        });
        throw error;
      }
    },
  );
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.log("MCP server running with Sentry monitoring");
}

main().catch((error) => {
  Sentry.captureException(error);
  console.error("Server error:", error);
  process.exit(1);
});
```

---

## Current TAC Cargo Application

Your application **does not currently use MCP servers**, so there's nothing to monitor yet.

### What You Have

- ✅ Sentry fully configured
- ✅ Error tracking working
- ✅ Performance monitoring enabled
- ✅ MCP SDK installed (ready for future use)

### What You Don't Have (Yet)

- ❌ No MCP servers running
- ❌ No MCP tools defined
- ❌ No MCP resources configured

---

## If You Want to Add MCP to TAC Cargo

### Potential Use Cases

1. **Database MCP Server**
   - Query shipments
   - Fetch customer data
   - Update tracking information

2. **File System MCP Server**
   - Access shipping documents
   - Read configuration files
   - Manage uploads

3. **API Integration MCP Server**
   - Third-party shipping APIs
   - Weather data for logistics
   - Address validation

### Example: Shipment Query MCP Server

```typescript
// lib/mcp/shipment-server.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import * as Sentry from "@sentry/nextjs";
import { createClient } from "@/lib/supabase/server";

const server = new Server({
  name: "tac-cargo-shipment-server",
  version: "1.0.0",
});

// Tool: Query shipment by reference
server.setRequestHandler("tools/call", async (request) => {
  if (request.params.name === "query_shipment") {
    return await Sentry.startSpan(
      {
        name: "MCP: Query Shipment",
        op: "mcp.tool.query_shipment",
      },
      async () => {
        try {
          const { reference } = request.params.arguments;

          const supabase = await createClient();
          const { data, error } = await supabase
            .from("shipments")
            .select("*")
            .eq("reference", reference)
            .single();

          if (error) throw error;

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(data),
              },
            ],
          };
        } catch (error) {
          Sentry.captureException(error, {
            tags: {
              mcp_server: "shipment-server",
              tool: "query_shipment",
            },
          });
          throw error;
        }
      },
    );
  }
});
```

---

## Testing Sentry MCP (When You Add MCP Servers)

### 1. Create MCP Server

Add an MCP server to your application (like the examples above)

### 2. Wrap Operations with Sentry

Use `Sentry.startSpan()` for performance tracking
Use `Sentry.captureException()` for error tracking

### 3. Trigger MCP Operations

Call your MCP tools/resources

### 4. Verify in Sentry Dashboard

- Check Performance tab for MCP spans
- Check Issues tab for MCP errors
- Look for tags: `mcp_server`, `tool_name`

---

## Summary

**Current Status:**

- ✅ Sentry is fully working
- ✅ MCP SDK is installed
- ⏳ No MCP servers to monitor yet

**To Test MCP Monitoring:**

1. Add an MCP server to your application
2. Wrap operations with Sentry spans
3. Trigger operations
4. Check Sentry dashboard

**For Now:**

- Your Sentry integration is complete and working
- MCP monitoring will activate when you add MCP servers
- The SDK is ready for future use

---

**Note:** TAC Cargo currently doesn't use MCP servers. The MCP SDK was installed for future extensibility, but there's nothing to test until you add actual MCP server functionality to your application.
