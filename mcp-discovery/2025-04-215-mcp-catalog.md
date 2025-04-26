# Architectural Decision Record (ADR): Add MCP-Style Discovery to CSP

## Status
Accepted (Updated for Catalog Scalability)

## Context
The Composable Services Platform (CSP) currently supports service discovery via a custom `/find` endpoint, which enables dynamic lookup of services at runtime. However, as agent ecosystems like OpenAI's plugin system and Anthropic's MCP emerge, a new discovery model is needed to:

- Allow machine clients (LLMs, planners, agent systems) to automatically discover available services and their callable methods.
- Support machine-readable service descriptions similar to OpenAI's `openai-plugin.json` or Anthropic's tool manifests.
- Future-proof CSP for participation in broader agent-driven architectures.

This new discovery model is focused on **metadata generation** and **exposure**, not on modifying how services are invoked (which will be addressed in later phases).

## Decision
We will **create a new MCP-Catalog service** separate from the existing Discovery service.

Key points:

- The existing Discovery service remains focused on **runtime coordination** (dynamic service registration, lookup, and orchestration).
- A new **MCP-Catalog service** will be added, focused on **static discovery** for agents and planners.
- Services will register **twice** at startup:
  - Once to **Discovery** (for runtime coordination)
  - Once to **MCP-Catalog** (to register their static `serviceManifest` for agent discovery)
- The MCP-Catalog service will:
  - Accept service manifests at a `POST /catalog/register` endpoint.
  - Serve a **lightweight** service index via `GET /catalog` (service names + links to full manifests).
  - Serve **full service manifests** via `GET /catalog/:serviceName`.
- Full method information (inputs, outputs, schemas) must be reachable without requiring runtime interaction.
- This separation maintains clarity between runtime dynamism and agent planning stability.

## Consequences
**Positive:**
- Clean separation of concerns between runtime discovery and agent planning.
- Scalability to hundreds or thousands of services without overloading LLM clients.
- Future-proofing for MCP-specific extensions, versioning, or search capabilities.
- Easier maintenance and clearer system boundaries.

**Negative:**
- Slightly increased service complexity: services must register with two systems at startup.
- Deployment of an additional service (MCP-Catalog).

## Implementation Plan
- [ ] Build a new `mcp-catalog` service.
- [ ] Define API endpoints:
  - `POST /catalog/register` (submit a serviceManifest)
  - `GET /catalog` (return a lightweight index of available services)
  - `GET /catalog/:serviceName` (return full manifest for a single service)
- [ ] Define JSON schema for `serviceManifest` documents.
- [ ] Update service startup scripts to register with both Discovery and MCP-Catalog.
- [ ] Update documentation to clarify runtime vs planning discovery models.

---

**Authors:** CSP Core Team  
**Date:** 2025-04-25 (Updated)


