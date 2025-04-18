# Shared-State Service

The **Shared-State Service** provides a simple, in-memory key-value store that can be dynamically updated and queried by job-control agents and other services. It supports JSON Pointer-based mutations and shallow merges, making it suitable for lightweight orchestration tasks.

---

## 📄 Description

- Provides create, read, update, delete (CRUD) for shared state documents
- Supports `PATCH` operations using either `add` or `merge`
- Designed to work with job-control workflows
- Stores data in memory (non-persistent)

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

- **Request Body:**
  ```json
  {
    "id": "optional-id",
    "key": "value"
  }
  ```

- **Response:**
  ```json
  {
    "stateURL": "http://localhost:4500/state/{id}"
  }
  ```

---

### `GET /state/:id`

Retrieve a state document.

- **Response:**
  ```json
  {
    "key": "value"
  }
  ```

---

### `POST /state/:id`

Merge new values into an existing document.

- **Effect:** Shallow object merge

---

### `PATCH /state/:id`

Perform a fine-grained mutation using one of two operations:

#### `op: "add"`

- Use a JSON Pointer path to write to a specific location.

```json
{
  "op": "add",
  "path": "/settings/theme",
  "value": "dark"
}
```

#### `op: "merge"`

- Merge keys into the top-level object.

```json
{
  "op": "merge",
  "value": {
    "user": { "id": "abc", "role": "admin" }
  }
}
```

---

### `DELETE /state/:id`

Delete the state document under the given ID.

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

- All state is stored in memory
- JSON Pointer paths must start with `/`
- The `merge` operation is a shallow merge (top-level keys only)
