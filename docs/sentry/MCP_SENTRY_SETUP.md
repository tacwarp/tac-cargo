# 🔌 MCP Server with Sentry Integration - Complete Guide

## Overview

TAC Cargo now has a fully configured MCP (Model Context Protocol) server with comprehensive Sentry monitoring for shipment queries.

---

## 📦 What Was Created

### 1. MCP Server

**File:** `@/lib/mcp/shipment-server.ts:1-300`

**Features:**

- ✅ Shipment query tools
- ✅ Sentry error tracking
- ✅ Performance monitoring with spans
- ✅ Breadcrumb tracking
- ✅ Full context capture

**Available Tools:**

1. `query_shipment` - Get full shipment details by reference
2. `list_recent_shipments` - List recent shipments with limit
3. `get_shipment_status` - Get current status of a shipment

### 2. MCP Client

**File:** `@/lib/mcp/client.ts:1-170`

**Features:**

- ✅ Client interface for MCP server
- ✅ Sentry monitoring for all operations
- ✅ Connection management
- ✅ Error handling with context

### 3. Test API Endpoint

**File:** `@/app/api/mcp/test/route.ts:1-80`

**Features:**

- ✅ HTTP interface to test MCP server
- ✅ Sentry monitoring
- ✅ Multiple action support

---

## 🚀 Quick Start

### Step 1: Install Dependencies (if needed)

```bash
npm install tsx --save-dev
```

### Step 2: Build MCP Server

```bash
npm run mcp:build
```

This compiles the TypeScript MCP server to JavaScript.

### Step 3: Test via API Endpoint

The MCP server is accessed through the API endpoint, which handles connection/disconnection automatically.

**Test URLs:**

```bash
# List recent shipments
http://localhost:3000/api/mcp/test?action=list&limit=5

# Query specific shipment
http://localhost:3000/api/mcp/test?action=query&reference=SHP-2024-001

# Get shipment status
http://localhost:3000/api/mcp/test?action=status&reference=SHP-2024-001
```

---

## 🧪 Testing the MCP Server

### Test 1: List Recent Shipments

```bash
# Using curl
curl "http://localhost:3000/api/mcp/test?action=list&limit=10"

# Or visit in browser
http://localhost:3000/api/mcp/test?action=list&limit=10
```

**Expected Response:**

```json
{
  "success": true,
  "action": "list",
  "data": [
    {
      "reference": "SHP-2024-001",
      "status": "in_transit",
      "created_at": "2024-01-01T00:00:00Z",
      "eta": "2024-01-05T00:00:00Z"
    }
  ]
}
```

### Test 2: Query Shipment

```bash
curl "http://localhost:3000/api/mcp/test?action=query&reference=SHP-2024-001"
```

**Expected Response:**

```json
{
  "success": true,
  "action": "query",
  "data": {
    "reference": "SHP-2024-001",
    "status": "in_transit",
    "origin_warehouse": {
      "code": "NYC",
      "name": "New York Hub",
      "city": "New York",
      "state": "NY"
    },
    "destination_warehouse": {
      "code": "LAX",
      "name": "Los Angeles Hub",
      "city": "Los Angeles",
      "state": "CA"
    },
    "customer": {
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

### Test 3: Get Shipment Status

```bash
curl "http://localhost:3000/api/mcp/test?action=status&reference=SHP-2024-001"
```

**Expected Response:**

```json
{
  "success": true,
  "action": "status",
  "data": {
    "reference": "SHP-2024-001",
    "status": "in_transit",
    "eta": "2024-01-05T00:00:00Z",
    "delivered_at": null
  }
}
```

---

## 🔍 Sentry Monitoring

### What's Being Tracked

#### 1. MCP Server Operations

- **Tool calls** - Each tool execution is tracked
- **Database queries** - Supabase queries monitored
- **Errors** - All exceptions captured with context

#### 2. Performance Metrics

- **Spans** - Individual operation timing
- **Transactions** - Complete request flow
- **Database query duration**

#### 3. Context Capture

- **Tool names** - Which tool was called
- **Arguments** - Input parameters
- **Shipment references** - Tracking specific shipments
- **Error types** - Classification of failures

### Sentry Tags Applied

```typescript
{
  mcp_server: "tac-cargo-shipment-server",
  mcp_tool: "query_shipment",
  shipment_reference: "SHP-2024-001",
  error_type: "tool_execution_error"
}
```

### Breadcrumbs Captured

```typescript
{
  category: "mcp",
  message: "Tool called: query_shipment",
  level: "info",
  data: {
    tool: "query_shipment",
    arguments: { reference: "SHP-2024-001" }
  }
}
```

---

## 📊 Verify in Sentry Dashboard

### After Running Tests

1. **Visit Sentry Performance Tab:**
   - https://sentry.io/organizations/your-org/performance/

2. **Look for MCP Transactions:**
   - `MCP Tool: query_shipment`
   - `MCP Tool: list_recent_shipments`
   - `MCP Tool: get_shipment_status`

3. **Check Spans:**
   - `mcp.tool.call` - Tool execution
   - `db.query` - Database operations
   - `mcp.client.connect` - Client connection

4. **Review Tags:**
   - Filter by `mcp_server`
   - Filter by `mcp_tool`
   - Filter by `shipment_reference`

---

## 🛠️ MCP Server Architecture

### Flow Diagram

```
User Request
    ↓
API Endpoint (/api/mcp/test)
    ↓
MCP Client (TacCargoMcpClient)
    ↓
[Sentry Span: MCP Client Connect]
    ↓
MCP Server (shipment-server.ts)
    ↓
[Sentry Span: MCP Tool Call]
    ↓
Tool Handler (query_shipment, etc.)
    ↓
[Sentry Span: Database Query]
    ↓
Supabase Database
    ↓
Response with Sentry Context
```

### Sentry Integration Points

1. **Client Connection** - Tracked with span
2. **Tool Execution** - Wrapped in span with breadcrumbs
3. **Database Queries** - Individual spans for each query
4. **Error Handling** - Exceptions captured with full context
5. **Client Disconnection** - Logged as breadcrumb

---

## 🔧 Configuration

### Environment Variables

All existing Sentry environment variables apply:

```bash
NEXT_PUBLIC_SENTRY_DSN=your-dsn
SENTRY_DSN=your-dsn
SENTRY_ORG=your-org
SENTRY_PROJECT=tac-cargo
```

> [!NOTE]
> Use `SENTRY_DSN` (without `NEXT_PUBLIC_` prefix) for server-side only initialization to prevent accidental client exposure if needed, although `NEXT_PUBLIC_SENTRY_DSN` is safe for error reporting.

### MCP Server Configuration

**File:** `lib/mcp/shipment-server.ts`

```typescript
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0, // 100% for testing
  environment: process.env.NODE_ENV || "development",
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || "development",
});
```

---

## 📈 Performance Monitoring

### Expected Metrics

| Operation      | Expected Duration | Sentry Op            |
| -------------- | ----------------- | -------------------- |
| Client Connect | < 100ms           | `mcp.client.connect` |
| Tool Call      | < 500ms           | `mcp.tool.call`      |
| Database Query | < 200ms           | `db.query`           |
| Full Request   | < 1000ms          | `http.server`        |

### Monitoring in Sentry

1. **Performance Dashboard:**
   - View average response times
   - Identify slow operations
   - Track database query performance

2. **Alerts:**
   - Set up alerts for slow MCP operations
   - Monitor error rates
   - Track tool execution failures

---

## 🐛 Troubleshooting

### Issue: MCP Server Not Starting

**Error:** `Cannot find module 'dist/lib/mcp/shipment-server.js'`

**Solution:**

```bash
# Build the MCP server first
npm run mcp:build
```

### Issue: Database Connection Errors

**Error:** `Failed to query shipment: ...`

**Solution:**

- Verify Supabase credentials in `.env.local`
- Check database tables exist
- Ensure RLS policies allow access

### Issue: No Sentry Events

**Possible Causes:**

1. DSN not configured
2. Sentry blocked by ad-blocker
3. Network issues

**Solution:**

```bash
# Verify DSN
echo $NEXT_PUBLIC_SENTRY_DSN

# Check Sentry initialization
# Look for console logs: "MCP server running with Sentry monitoring"
```

### Issue: TypeScript Errors

**Error:** `'result.content' is of type 'unknown'`

**Status:** Already fixed with type casting in `lib/mcp/client.ts`

---

## 🎯 Use Cases

### 1. AI Assistant Integration

Use the MCP server to allow AI assistants to query shipment data:

```typescript
// AI assistant calls MCP tool
const shipment = await mcpClient.queryShipment("SHP-2024-001");
// Sentry tracks the operation
```

### 2. External Tool Integration

Integrate with external tools that support MCP:

```bash
# Claude Desktop, Cursor, or other MCP-compatible tools
# can connect to the MCP server
```

### 3. Automated Workflows

Build automated workflows using MCP tools:

```typescript
// Check shipment status periodically
const status = await mcpClient.getShipmentStatus("SHP-2024-001");
if (status.status === "delivered") {
  // Trigger notification
}
```

---

## 📚 API Reference

### MCP Tools

#### query_shipment

**Description:** Get full shipment details by reference

**Input:**

```json
{
  "reference": "SHP-2024-001"
}
```

**Output:**

```json
{
  "reference": "SHP-2024-001",
  "status": "in_transit",
  "origin_warehouse": { ... },
  "destination_warehouse": { ... },
  "customer": { ... }
}
```

#### list_recent_shipments

**Description:** List recent shipments with optional limit

**Input:**

```json
{
  "limit": 10
}
```

**Output:**

```json
[
  {
    "reference": "SHP-2024-001",
    "status": "in_transit",
    "created_at": "2024-01-01T00:00:00Z",
    "eta": "2024-01-05T00:00:00Z"
  }
]
```

#### get_shipment_status

**Description:** Get current status of a shipment

**Input:**

```json
{
  "reference": "SHP-2024-001"
}
```

**Output:**

```json
{
  "reference": "SHP-2024-001",
  "status": "in_transit",
  "eta": "2024-01-05T00:00:00Z",
  "delivered_at": null
}
```

---

## ✅ Testing Checklist

- [ ] MCP server builds successfully (`npm run mcp:build`)
- [ ] API endpoint responds to list action
- [ ] API endpoint responds to query action
- [ ] API endpoint responds to status action
- [ ] Sentry captures MCP tool calls
- [ ] Sentry shows performance spans
- [ ] Breadcrumbs appear in Sentry
- [ ] Error handling works correctly
- [ ] Database queries are tracked

---

## 🚀 Next Steps

### 1. Test All Endpoints

Visit each test URL and verify responses:

- List shipments
- Query specific shipment
- Get shipment status

### 2. Check Sentry Dashboard

Visit: https://sentry.io/organizations/your-org/performance/

Look for:

- MCP transactions
- Performance spans
- Breadcrumbs
- Tags

### 3. Trigger Errors (Optional)

Test error handling:

```bash
# Query non-existent shipment
curl "http://localhost:3000/api/mcp/test?action=query&reference=INVALID"
```

Verify error appears in Sentry with proper context.

---

## 📊 Summary

**Status:** ✅ MCP Server Configured with Sentry

**What's Working:**

- MCP server with 3 shipment tools
- Sentry monitoring for all operations
- Performance tracking with spans
- Error capture with context
- API endpoint for testing

**What to Test:**

- List recent shipments
- Query specific shipments
- Get shipment status
- Verify Sentry captures events

**Documentation:**

- `MCP_SENTRY_SETUP.md` - This file
- `SENTRY_MCP_STATUS.md` - MCP overview
- `SENTRY_SETUP.md` - General Sentry setup

---

**Configuration Date:** 2026-01-01  
**Status:** ✅ READY FOR TESTING  
**Next Step:** Test API endpoints and verify Sentry monitoring
