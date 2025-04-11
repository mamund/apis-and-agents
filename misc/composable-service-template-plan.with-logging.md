# 🧰 Composable Service Template Plan

This document outlines the structure and goals for a reusable service template that aligns with the Job-Control ecosystem. The template will streamline the creation of compliant, composable microservices.

---

## ✅ Template Inclusions

### 1. Standard Endpoint Contract
- `POST /execute` – Run the main operation.
- `POST /repeat` – Retry the operation with same or updated input.
- `POST /revert` – Roll back the effect, if supported.

### 2. Optional Lifecycle Endpoints
- `GET /ping` – Returns 200 OK for DISCO health checks.
- `POST /register` – Optionally registers with DISCO on demand.
- `POST /unregister` – Graceful shutdown unregistration.

### 3. Startup Hook
- Auto-registration with DISCO using `DISCO_URL`.
- Sends name, type, and `pingUrl`.

### 4. Config Options
- `.env` or config module:
  - `SERVICE_NAME`
  - `DISCO_URL`
  - `LOG_LEVEL`

### 5. Request Input Schema (Optional)
- Define expected payload shape for `/execute`, `/repeat`, `/revert`.
- Enables linting and future validation.

### 6. Default Logging
- Unified logs per endpoint call.
- Supports timestamp, input summary, and results.


---

### 7. Logging (New Section)

Include structured logging via a shared `logger.js` module. This helps services provide clear insight into:

- When `/execute`, `/repeat`, and `/revert` are called
- Input payloads and results
- Registration and unregistration events
- Errors and retries

#### Logging Format Example:
```json
{
  "timestamp": "2025-04-11T19:32:00Z",
  "level": "info",
  "action": "execute",
  "requestId": "abc-123",
  "input": { "a": 3, "b": 4 },
  "result": { "sum": 7 }
}
```

All logs should go to `stdout` using a minimal format to support containerized and cloud-native execution.
### 7. Developer Instructions (README)
- Endpoint explanations
- Local testing with curl or mock jobs
- How to integrate with the job-control system
- Expected request/response shape

---

## 🛠️ Tech Stack (Node.js Assumption)
- `express` – HTTP routing
- `dotenv` – Configuration
- `axios` – Calls to DISCO server
- `winston` – Structured logging

---

## 🧪 Dev Experience Example

```bash
npx create-composable-service my-service
cd my-service
npm install
npm run dev
```

GitHub template will include:
- Dockerfile or `.devcontainer/`
- Bootstrap script (`generate-service.sh`)
- Example job-control task using the new service

---

## 📦 Future Variants
- Stateless lambda-style service
- Stateful side-effecting service (DB, file system)
- Read-only services (e.g. query-only)
- Effectless mock services for test environments

---

This template provides a contract-first, plug-and-play foundation for adding new services to the job-control ecosystem.
