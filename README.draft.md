# Composable API Platform

A lightweight, modular platform for building and orchestrating composable services and agent-ready APIs.

This platform provides the core building blocks for dynamic service discovery, transient shared state, declarative job execution, and plug-and-play service behaviors — ideal for evolving architectures and experimental agent ecosystems.

---

## 🧱 Platform Overview

This platform is made up of four cooperating services:

| Component         | Description |
|------------------|-------------|
| **Discovery**     | Registers and locates services via tag-based lookup |
| **Shared-State**  | Manages transient, structured state across job steps |
| **Job-Control**   | Executes structured, reversible, multi-step jobs |
| **Engine Service**| Generic runtime for executing composable `design.json`-based services |

---

## 🚀 Quick Start

1. **Start Discovery**
```bash
npm run start:discovery
```

2. **Start Shared-State**
```bash
npm run start:shared-state
```

3. **Start Job-Control**
```bash
npm run start:job-control
```

4. **Run a Composable Service**
```bash
npm run start:engine -- --design=./examples/design.json
```

5. **Submit a Job**
```bash
curl -X POST http://localhost:4700/run-job -d @./examples/job.json -H "Content-Type: application/json"
```

---

## 📦 Project Structure

```
/discovery         # Service registry
/shared-state      # Transient shared state store
/job-control       # Job runner with task wiring and reversal
/engine            # Generic composable service runtime
/examples          # Sample jobs and service definitions
/docs              # Developer and contributor guides
```

---

## 🧑‍💻 Developer Resources

- 📘 [Composable Platform Developer Guide](docs/composable-platform-developer-guide.md)
- 📗 [design.json Developer Guide](docs/design-json-developer-guide.md)
- 📕 [Job-Control Developer Guide](docs/job-control-developer-guide.md)
- 🧾 [Shared-State Developer Guide](docs/shared-state-developer-guide.md)
- 🧭 [Discovery Developer Guide](docs/discovery-developer-guide.md)

> Contributor guides are also available for those extending the platform core.

---

## 📌 Feature Roadmap

See [Job-Control Feature Roadmap](#🧭-job-control-feature-roadmap) below.

---

## 🧭 Job-Control Feature Roadmap

### ✅ CORE (Done)
- [x] Sequential job execution with parallel task steps  
- [x] Service discovery via tag + `/forms`  
- [x] Revert stack for failure rollback  
- [x] Shared state via `sharedStateURL`  
- [x] `storeResultAt`: full result, partial slices, `onlyOnStatus`, and `_raw` fallback  

### 🚀 PHASE 1: Empower Job Definitions
- Transform support
- Conditional execution
- Retries and backoff

### 🔧 PHASE 2: Resilience + Observability
- Timeouts, tracing, lifecycle webhooks

### 🧠 PHASE 3: Smarter Control Flow
- Mapping, looping, concurrency limits

### 🔒 PHASE 4: Security + Access
- Auth injection
- Role-based task filtering

---

## 🤖 Bonus Ecosystem Ideas

- Template registry for reusable jobs
- Live shared-state viewer
- HATEOAS-style agent forms
- Dry-run preview mode