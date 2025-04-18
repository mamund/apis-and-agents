# Composable Platform Developer Guide

This guide introduces developers to the composable service platform — a set of lightweight, interoperable services and patterns that support building modular, declarative, and evolvable systems.

---

## 🧱 What Is the Platform?

The composable platform is designed for developers who want to build, compose, and orchestrate services using declarative jobs. It is built on a small set of cooperating services and a shared runtime contract.

---

## 🧩 Core Components

### 1. Discovery Service (`discovery`)
Used to register and locate services dynamically.  
- Endpoint: `POST /register`, `GET /find?tag=xyz`
- Optionally supports health checks via `pingURL`

### 2. Shared-State Service (`shared-state`)
Manages transient state during job execution.  
- Endpoint: `POST /state`, `PATCH /state/:id`, `GET /state/:id`
- Used by job-control to pass values between tasks

### 3. Job-Control Service (`job-control`)
Orchestrates multi-step jobs by executing composable tasks.  
- Reads job-control documents
- Executes tasks based on tags and inputs
- Uses `$fromState` to pull values, and `storeResultAt` to push results

### 4. Engine Service (`engine`)
Runs composable services defined by a `design.json`.  
- Exposes `/execute`, `/repeat`, `/revert`, and `/forms`
- Reads `design.json` at startup to define behavior

---

## 🔄 How It All Works Together

1. A composable service is defined using a `design.json`
2. The engine loads the design and exposes HTTP endpoints
3. The service registers with discovery
4. A developer writes a job-control file describing a sequence of tasks
5. Job-control looks up services using `tag`, injects state using `$fromState`, and stores output using `storeResultAt`

---

## 🛠 Developer Workflow

1. Write a `design.json` to describe a service
2. Start the engine service with that design file
3. Register the service with discovery
4. Create a `shared-state` document (if needed)
5. Write a `job-control` JSON file referencing the service(s)
6. Run the job using `POST /run-job` to job-control

---

## 🧰 Tooling and Extensibility

- JSON Schema validation for design and job files
- Pre/post command hooks (planned)
- CLI tools for service startup, registration, job execution (planned)
- Future agentic orchestration features using ALPS and dynamic affordances

---

## 🚀 What's Next?

- Build reusable services using `design.json`
- Register them in a local or distributed discovery service
- Chain them together in rich orchestration jobs
- Extend the platform with new engines, tools, and planners