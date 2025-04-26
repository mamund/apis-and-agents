# MCP-Catalog Service: Implementation Plan

## Purpose
This document outlines the implementation plan for building the new **MCP-Catalog** service to support scalable, agent-friendly discovery within the Composable Services Platform (CSP).

The MCP-Catalog service is designed to:
- Accept structured service manifests at startup.
- Provide lightweight service indexes for agent discovery.
- Serve full service manifests on demand.
- Scale cleanly to support hundreds or thousands of registered services.

---

## Guiding Principles
- **Separation of Concerns**: Runtime coordination (Discovery) and agent planning (MCP-Catalog) are separate systems.
- **Agent-First Design**: MCP-Catalog is optimized for machine clients, not humans.
- **Future Scalability**: Design for scaling up the number of services without significant architectural changes.
- **Pluggable Storage**: Start with in-memory storage, but design all data operations to support async, replaceable persistence layers.
- **Observability**: Include structured logging from day one.
- **Ease of Extension**: Clean modular architecture, making it easy to add paging, search, or filtering later.
- **Postel's Law Compliance**: Use schema validation at build/test time but **be liberal in what we accept** at runtime, performing only minimal critical checks.

---

## Initial System Architecture

### Core Components
- **Express.js HTTP Server**
- **Registry Layer**
  - In-memory JavaScript object store (Phase 1)
  - Async storage interface to allow future pluggable backends (Phase 2)
- **Logging Layer**
  - Structured JSON logs to stdout (Phase 1)
  - Future integration with external log aggregation (Phase 2)
- **Validation Layer**
  - Validate incoming manifests during development using a JSON Schema
  - Perform **minimal critical checks at runtime**: ensure `name` and `methods` array exist, log warnings for other issues without hard failure
- **Service API Layer**
  - `POST /catalog/register`
  - `GET /catalog`
  - `GET /catalog/:serviceName`
  - `DELETE /catalog/:serviceName` (optional)


---

## Immediate Development Plan

### Phase 1: Minimal Working Service
- [ ] Scaffold a minimal Express.js server
- [ ] Define internal `registry` object to hold service manifests keyed by service name
- [ ] Implement `POST /catalog/register` to accept and store service manifests
- [ ] Implement `GET /catalog` to return lightweight list of services (name, description, manifestURL)
- [ ] Implement `GET /catalog/:serviceName` to return full manifest
- [ ] Add basic structured logging using a simple `logger.js` module
- [ ] Validate incoming `serviceManifest` during development against a JSON Schema
- [ ] Apply **minimal runtime validation** (name and methods array presence) to incoming registration requests

### Phase 2: Pluggable Storage Support
- [ ] Abstract registry operations behind an async `StorageProvider` interface
- [ ] Provide in-memory provider as the default implementation
- [ ] Sketch stubs for possible future external providers (e.g., file-based, Redis, DynamoDB)

### Phase 3: Enhancements
- [ ] Add support for deleting a service (`DELETE /catalog/:serviceName`)
- [ ] Support pagination on `GET /catalog` (optional)
- [ ] Add tag-based filtering or searching (optional)
- [ ] Expose catalog schema version in API responses
- [ ] Add health check endpoint (`GET /health`) for liveness probes

---

## Early Design Considerations

| Concern | Design Response |
|:--------|:-----------------|
| **Large numbers of services** | Keep `GET /catalog` lightweight; defer full manifest loading to per-service calls. |
| **Agent compatibility** | Ensure full manifests include all fields needed for LLM planners (methods, parameters, returns, endpoints). |
| **Storage flexibility** | Use async storage operations from the start, even if using an in-memory implementation first. |
| **Observability** | Structured logging on every major operation: registration, retrieval, error. |
| **Postel's Law (Resilience)** | Strict schema validation during service build/test time, minimal validation at runtime (accept manifests that meet critical minimums). |
| **Scalability** | No strong coupling to memory storage — be ready to plug in external storage easily. |

---

## Deliverables for MVP
- Working MCP-Catalog service with minimal endpoints
- In-memory storage backend
- Structured logging for register/retrieve operations
- JSON Schema validation of manifests during development
- Minimal runtime critical field checks
- Example service registration scripts
- Updated README documentation

---

## Stretch Goals (Post-MVP)
- Persistent storage options
- Catalog search and filtering
- Service manifest versioning support
- Distributed MCP-Catalog instances with sync protocols
- CLI tools for catalog inspection and manifest validation

---

**Authors:** CSP Core Team  
**Date:** 2025-04-25 (Updated)


