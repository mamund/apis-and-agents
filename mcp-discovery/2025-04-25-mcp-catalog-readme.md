# MCP-Catalog Service

## Overview
The **MCP-Catalog** service is a standalone discovery service designed to support machine clients (such as AI agents and planners) by providing structured, machine-readable metadata about available services and their callable methods.

This service complements, but does not replace, the existing CSP Discovery service. While Discovery focuses on runtime dynamic lookup, MCP-Catalog focuses on static planning and build-time discovery.

---

## Key Features
- **Agent-Friendly Catalog**: Provides a lightweight index of services suitable for MCP-style clients.
- **Full Service Manifests**: Supports retrieval of detailed service capabilities, inputs, outputs, and endpoints.
- **Scalable Design**: Enables ecosystems with hundreds or thousands of services without overloading clients.
- **Separation of Concerns**: Keeps runtime coordination (Discovery) and static planning (MCP-Catalog) cleanly separate.

---

## API Endpoints

### `POST /catalog/register`
Registers a new service manifest.

**Request Body:**
```json
{
  "serviceManifest": {
    "name": "Person Service",
    "description": "Manages person records.",
    "methods": [
      {
        "name": "create",
        "description": "Creates a new person record.",
        "parameters": { "type": "object", "properties": { ... }, "required": ["email"] },
        "returns": { "type": "object", "description": "The created person record." },
        "endpoint": "http://person-service.local/rpc"
      }
    ]
  }
}
```

### `GET /catalog`
Returns a lightweight list of registered services.

**Example Response:**
```json
{
  "services": [
    {
      "name": "person-service",
      "description": "Manages person records.",
      "manifestURL": "/catalog/person-service"
    },
    ...
  ]
}
```

### `GET /catalog/:serviceName`
Returns the full manifest for a single registered service.

**Example Response:**
```json
{
  "name": "Person Service",
  "description": "Manages person records.",
  "methods": [ ... ]
}
```

### `DELETE /catalog/:serviceName` (Optional)
Removes a registered service from the catalog.

---

## Registration Workflow
1. **At Startup**, each CSP service should:
   - Register with the CSP Discovery service (`POST /register`).
   - Register separately with the MCP-Catalog service (`POST /catalog/register`) providing its full manifest.

2. **Agents/Planners** can:
   - Query `GET /catalog` to browse available services.
   - Retrieve full service and method details using `GET /catalog/:serviceName`.

---

## Notes
- Registration with MCP-Catalog is **optional but recommended** for agent-discoverable services.
- If a service updates its method capabilities, it should re-register with MCP-Catalog to update the manifest.
- Future extensions may include search, pagination, and manifest versioning.

---

## Status
**MCP-Catalog Service is under active development.**

---

**Authors:** CSP Core Team  
**Date:** 2025-04-25


