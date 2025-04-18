# Shared-State Service

The **Shared-State Service** provides a simple, transient key-value store for orchestrated service environments. It supports lightweight mutations using JSON Pointer paths and shallow object merges — ideal for coordinating state across job-control workflows.

---

## 📄 Description

- Stores structured data in memory (non-persistent)
- Each document is addressable by a unique ID
- Designed for use with job-control and other composable services
- Supports `PATCH` operations using `"add"` or `"merge"`

---

## 🚀 How to Run

```bash
PORT=4500 node index.js
```

- Default port: `4500`
- No external configuration required

---

## 🔗 Endpoints

### `POST /state`

Create a new shared state document.

#### Request Body
```json
{
  "id": "optional-id",
  "message": "hello"
}
```

- If `id` is omitted, one will be generated automatically.

#### Response
```json
{
  "stateURL": "http://localhost:4500/state/{id}"
}
```

#### Example
```bash
curl -X POST http://localhost:4500/state \
  -H "Content-Type: application/json" \
  -d '{ "message": "hello" }'
```

---

### `GET /state/:id`

Retrieve a state document by ID.

#### Response
```json
{
  "message": "hello"
}
```

---

### `PATCH /state/:id`

Apply a targeted mutation using `op: "add"` or `op: "merge"`.

#### Add (JSON Pointer path)
```json
{
  "op": "add",
  "path": "/settings/theme",
  "value": "dark"
}
```

#### Merge (top-level keys)
```json
{
  "op": "merge",
  "value": {
    "user": { "id": "abc", "role": "admin" }
  }
}
```

---

### `POST /state/:id`

Shallow merge values into the state document.

- Equivalent to `PATCH` with `op: "merge"` (legacy fallback)

---

### `DELETE /state/:id`

Delete the document with the specified ID.

---

## 🧪 Health Check

```http
GET /ping
```

Returns:
```json
{ "status": "ok" }
```

---

## 🧰 Development Notes

- State documents are ephemeral and reset on restart
- JSON Pointer paths used in `add` must start with `/`
- `merge` only affects top-level keys — it is not deep
- Validate that `op` is either `"add"` or `"merge"`