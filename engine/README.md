# Engine Service

The **Engine Service** is a generic, pluggable runtime that executes services defined declaratively in a `design.json` file. It exposes a consistent interface and enables services to participate in a composable, orchestrated environment using the job-control system.

---

## 📄 Description

- Loads a `design.json` file at startup
- Defines a set of named commands (e.g., `create`, `update`, `delete`)
- Exposes consistent endpoints: `execute`, `repeat`, `revert`, `forms`
- Validates inputs against JSON Schema
- Produces standardized responses
- Optionally supports storage and reversibility

---

## 🚀 How to Run

```bash
PORT=4600 node index.js --design=./path/to/design.json
```

- Default port: `4600`
- Requires a `design.json` file as input
- Can be registered with the discovery service

---

## 🔗 Endpoints

### `POST /execute`

Executes a command defined in the design.

**Request Body:**
```json
{
  "command": "create",
  "resource": "person",
  "input": {
    "email": "test@example.com"
  }
}
```

**Response:**
```json
{
  "status": "ok",
  "data": { ... }
}
```

---

### `POST /repeat`

Repeats a previous command execution using the same requestId.

---

### `POST /revert`

Attempts to reverse a previously executed command using its requestId.

---

### `GET /forms`

Returns a list of supported commands, their input/output schemas, and available HTTP methods.

---

## 📦 Design.json Overview

Each `design.json` file contains:

- `serviceInfo`: name, tags, mediaTypes, semantic profile
- `resourceSchema`: reusable type definitions
- `commands`: named operations with:
  - `inputs`: required, optional, defaults, rules
  - `output`: type, returns, statusCode
  - `errors`: known error conditions
  - `transitionType`: safe, idempotent, reversible

---

## 🧪 Features

- Validates inputs against schema
- Returns structured results (JSON object, array, or status-only)
- Future support for:
  - Pre/post execution hooks
  - Pluggable storage backends (in-memory, Redis, etc.)
  - Custom command handlers

---

## 🧰 Development Notes

- Designed to support dynamic service generation
- Can be wrapped in a service launcher script
- Compatible with job-control orchestration
- Services can be tagged and registered at startup using `/register` on discovery