# Composable Services Platform

This repository contains a modular system for defining, discovering, and orchestrating composable services using a dynamic job-control model. It is designed to support flexible, runtime-bound service interactions across a network of loosely coupled Node.js services.

## Core Components

### `discovery/`
A lightweight in-memory discovery service that allows services to register themselves, provide metadata, and respond to health checks.  
**Key endpoints:** `/register`, `/unregister`, `/ping`, `/services`

### `shared-state/`
A shared-state document store for holding structured state across job runs.  
**Key endpoints:** `POST /state`, `GET /state/:id`, `PATCH /state/:id`, `DELETE /state/:id`

### `job-control/`
Orchestrates multi-step jobs with sequential steps and parallel tasks. Each task is a call to a registered service, and results can be stored in shared-state.  
**Key features:**
- Declarative job definitions
- `$fromState` syntax for dynamic input resolution
- Result storage via `storeResultAt`
- Reversible execution model
- Support for step/task-level disabling (`enabled: false`)

### `engine-service/`
A generic runtime service engine that reads a `design.json` file to expose commands dynamically using a three-endpoint pattern:  
`/execute`, `/repeat`, `/revert`.  
Supports developer-defined commands and default behavior with support for discovery registration.

## Tooling

### `job-runner/`
A command-line utility to simplify job execution against the platform.  
**Features:**
- Creates shared state documents
- Submits job-control files
- Injects values from a JSON file
- Watches job progress via polling (`/jobs/:id`)
- Emits or deletes shared state results
- Reads local `.job-runner.json` for defaults

```bash
npx job-runner run my-job.json --emit final.json --cleanup
```

## Getting Started

1. Start the platform services:
   ```bash
   ./scripts/start-all.sh
   ```

2. Register your composable services (e.g., service-a, service-b)

3. Use `job-runner` to submit and monitor jobs:
   ```bash
   npx job-runner examples/sample-job.json --emit
   ```

## Future Directions

- Affordance-aware ALPS integration
- Persistent job replay & audit logs
- Remote storage for shared-state
- Runtime-discoverable service contracts

