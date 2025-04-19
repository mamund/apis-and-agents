
# Composable Platform Roadmap

This document tracks key enhancements, features, and ideas for evolving the composable service platform.

---

## 🛠️ Core Platform Enhancements

### 🔍 Observability & Diagnostics
- Improve **shared-state** and **job-control** logging:
  - Add `GET /jobs/:jobId` for per-job introspection
  - Support log correlation ID
  - Add `GET /jobs/` and `GET /state/` listing endpoints
  - Enhanced execution logs and summaries

### 🔁 Runtime Capabilities
- Add support for **custom commands** in the engine
- Support **pre/post hooks** for default and custom commands
- Add support for **remote storage backends** (via SDKs or HTTP)
- Implement `PATCH` with `{ op: "merge", value: {...} }` for shared-state

### ⚙️ Control Flow Expansions
- Add support for:
  - `mapOver`
  - `if` / `when` conditional steps
  - `earlyExit`, `retry`, `aggregate`, `guard`, etc.
  - Structured error handling (`onError`, fallback jobs)

---

## 🧱 Developer Experience Tools

### ✨ Job Creation
- CLI wizard: `job-gen` or integrated in `job-runner`
- Support `.job-runner.json` for default configuration
- Allow injecting state before job run
- Enable `sharedStateURL` reuse across multiple jobs

### ✨ Service Creation
- CLI wizard: `design-gen` for building `design.json`
- Offer templates: CRUD, echo, transform, proxy
- Include built-in JSON Schema validation

### 🖥️ Visual Builder (Future)
- Optional web UI to build jobs and design files
- Drag-and-drop step/task/command creation
- Export to JSON and validate live

---

## 🌐 Discovery & Registration

- Auto-register and `ping` on service startup
- Add richer `serviceInfo` metadata (name, tags, etc.)
- Explore future support for:
  - ALPS affordance hints in discovery
  - Dynamic capability negotiation

---

## 🧠 Strategic / Long-Term Directions

### 🤖 Agentic Systems
- Treat jobs as **goal-seeking agents**
- Support **partial plans** and **local decision making**
- Enable planning by affordance rather than hardcoded steps

### 🌍 Composable ALPS
- Map job-control `command` to ALPS `descriptor` IDs
- Resolve `method` and `url` from ALPS at runtime
- Enable **dynamic execution planning** from ALPS affordances

### 🧪 System Simulation
- Simulate ALPS+MCP multi-agent environments
- Model decentralized coordination and stigmergy-like behaviors

---

_Last updated: April 2025_


---

## 🚀 Future Direction: Hypermedia + Goal-Seeking Control

This will likely require a significant departure from the current RPC-style model.

### 🔄 From RPC to Hypermedia

**Current model:**
- Jobs call `POST /execute` on services
- Commands are abstract names resolved by internal service logic

**Future model:**
- Jobs express *intent* with real HTTP methods (`GET`, `PUT`, `DELETE`, etc.)
- Each task becomes a full HTTP request to a discovered affordance
- Services expose native endpoints and ALPS metadata instead of generic `/execute`

### 🔧 Implications

- **job-control → hyperjob-control**:
  - Resolve method + URI dynamically via ALPS
  - Plan steps based on discovered affordances, not static definitions

- **Services**:
  - Must expose full HTTP verbs
  - Serve metadata (ALPS, JSON Schema, etc.)
  - Drop reliance on centralized `command` dispatching

- **Metadata layer**:
  - ALPS for affordances
  - JSON Schema for inputs/outputs
  - Potential for richer vocabularies (Hydra, profiles, etc.)

### 🧭 Next-phase goals (for later):
- Prototype `hyperjob-control`
- Build one affordance-native service
- Resolve job steps dynamically from ALPS descriptors
- Explore minimal planner integration

This future track will run in parallel to the current work on the RPC-style system and provide a strong foundation for agentic systems that reason and act dynamically.

