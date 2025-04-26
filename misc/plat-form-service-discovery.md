# 🧭 Platform Service Discovery Reference Guide

This document defines how the **Composable Services Platform** uses a centralized Discovery Service to bootstrap all core and custom services. It applies to all platform components, including `job-runner`, `job-control`, and individual `engine` services (e.g., `uppercase`, `weather`).

---

## 🔑 Core Principle

> Every component in the platform is configured with a single known value:
>
> **`discoveryRootURL`**

All other dependencies are discovered dynamically by querying this Discovery Service.

---

## 🔗 Discovery Endpoint Contract

### `GET /services`
Returns a JSON object with well-known service types and their root URLs:

```json
{
  "shared-state": "http://localhost:4500",
  "job-control": "http://localhost:4700",
  "uppercase": "http://localhost:4605",
  "openweather": "http://localhost:4610",
  "person": "http://localhost:4620"
}
```

Optionally, each entry may include structured metadata:

```json
{
  "shared-state": {
    "url": "http://localhost:4500",
    "tags": ["core"],
    "version": "1.0.0"
  },
  "job-control": {
    "url": "http://localhost:4700",
    "tags": ["core"],
    "version": "1.0.0"
  }
}
```

---

## 🧱 Required Knowledge by Component

| Component      | Baked-In               | Fetched From Discovery         | Notes |
|----------------|------------------------|--------------------------------|-------|
| `engine` service (e.g., `person`) | ✅ `discoveryRootURL` | ❌ Nothing else | Only registers itself |
| `job-control`  | ✅ `discoveryRootURL` | ✅ `shared-state`              | Required to update state during execution |
| `job-runner`   | ✅ `discoveryRootURL` | ✅ `shared-state`<br>✅ `job-control` | Needed to create state and submit jobs |

---

## 🛠️ Implementation Requirements

### Discovery Service
- Must implement `GET /services`
- May return either flat string values or detailed metadata objects
- Must track service registration via `POST /register`

### Job-Control
- On startup or job execution, must query discovery for `shared-state`
- Must fail gracefully if discovery is unavailable or incomplete

### Job-Runner
- Must query discovery to resolve both `job-control` and `shared-state`
- May optionally cache results in memory per execution session

### Engine Services
- On startup, must call `registerWithDiscovery(discoveryRootURL)`
- Must expose:
  - `GET /ping`
  - `GET /forms`
  - `POST /execute`, `POST /repeat`, `POST /revert`

---

## 🧭 Example Usage Flow

### Engine Service Startup
1. Loads `discoveryRootURL` from config/env
2. Calls `POST /register` with service metadata

### Job-Control Startup
1. Loads `discoveryRootURL`
2. Queries `GET /services` to find `shared-state`

### Job-Runner Execution
1. Loads `discoveryRootURL`
2. Queries `GET /services`
3. Finds both `shared-state` and `job-control`
4. Executes job

---

## 🚀 Future Considerations
- Add TTLs or heartbeats to detect stale or unavailable services
- Allow services to unregister on shutdown
- Add support for aliases (e.g., `type: shared-state`, `role: coordinator`)
- Expose discovery metadata as part of `.well-known/ai-plugin.json` for MCP-style agents

---

This document serves as a reference for contributors and implementers who wish to extend or integrate with the platform.


