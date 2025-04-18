# Adding JSON-RPC 2.0 Support to Job-Control

This document outlines a backward-compatible strategy for adding support for the [JSON-RPC 2.0 protocol](https://www.jsonrpc.org/specification) to the existing job-control service, allowing it to interoperate with agent-based systems (e.g. MCP) while preserving the current command format.

---

## 🔧 Goal

Enable `/execute` to accept and process both:
- Native `job-control` commands
- JSON-RPC 2.0 formatted requests

---

## 📥 Step 1: Detect JSON-RPC Requests

Update the `/execute` handler to identify incoming JSON-RPC messages:

```js
if (body.jsonrpc === "2.0" && typeof body.method === "string") {
  // Handle as JSON-RPC
} else {
  // Handle as job-control format
}
```

---

## 🔁 Step 2: Normalize JSON-RPC to Job-Control Format

Translate incoming JSON-RPC like:

```json
{
  "jsonrpc": "2.0",
  "method": "todo.update",
  "params": {
    "id": "job-test-001",
    "done": true
  },
  "id": "12345"
}
```

Into a job-control command:

```json
{
  "command": "update",
  "resource": "todo",
  "id": "job-test-001",
  "payload": {
    "done": true
  },
  "metadata": {
    "protocol": "jsonrpc",
    "version": "2.0",
    "jsonrpcId": "12345"
  }
}
```

---

## 🧾 Step 3: Return JSON-RPC Compliant Responses

If the input was JSON-RPC, format the output accordingly.

**Success:**
```json
{
  "jsonrpc": "2.0",
  "result": {
    "status": "ok"
  },
  "id": "12345"
}
```

**Error:**
```json
{
  "jsonrpc": "2.0",
  "error": {
    "code": -32000,
    "message": "Internal server error"
  },
  "id": "12345"
}
```

---

## 🧰 Suggested Adapter Module

Create `jsonrpc-adapter.js`:

```js
function isJsonRpc(input) {
  return input.jsonrpc === '2.0' && typeof input.method === 'string';
}

function toJobControl(input) {
  const [resource, command] = input.method.split(".");
  return {
    command,
    resource,
    id: input.params?.id || null,
    payload: input.params || {},
    metadata: {
      protocol: "jsonrpc",
      version: "2.0",
      jsonrpcId: input.id
    }
  };
}

function toJsonRpcResult(result, id) {
  return { jsonrpc: "2.0", result, id };
}

function toJsonRpcError(error, id) {
  return {
    jsonrpc: "2.0",
    error: {
      code: error.code || -32000,
      message: error.message || "Unknown error"
    },
    id
  };
}

module.exports = { isJsonRpc, toJobControl, toJsonRpcResult, toJsonRpcError };
```

---

## 🧠 Notes

- Internal logic of the job-control engine remains unchanged
- You can log or trace the origin format using `metadata.protocol`
- JSON-RPC clients will see a fully compliant response
- Enables future use of JSON-RPC features like batch requests or notifications

---

## ✅ Benefits

- No changes required for existing clients
- Opens the door for agentic clients and standard tooling
- Keeps job-control logic clean and extensible
