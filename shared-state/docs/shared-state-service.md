# Shared-State Service Guide

## Overview

The **Shared-State Service** provides an in-memory state store that supports basic CRUD operations and JSON Pointer-based patching. It is intended for use by job-control systems and other lightweight orchestration agents.

Each state object is stored under a unique `id` and can be manipulated using HTTP methods.

---

## Endpoints

### 🔹 `POST /state`

Create a new shared state object.

- **Request Body**:
  ```json
  {
    "id": "optional-id",
    "key": "value"
  }
  ```
- **Response**:
  ```json
  {
    "stateURL": "http://localhost:4500/state/{id}"
  }
  ```

---

### 🔹 `GET /state/:id`

Retrieve the full shared state object for the given `id`.

- **Response**:
  ```json
  {
    "foo": "bar",
    "count": 3
  }
  ```

---

### 🔹 `POST /state/:id`

Merge the given object into the existing state using shallow object assignment.

- **Request Body**:
  ```json
  {
    "foo": "updated",
    "newField": true
  }
  ```

- **Effect**: Overwrites or adds keys in the top-level object

---

### 🔹 `PATCH /state/:id`

Perform a state mutation using either `"add"` or `"merge"` operation.

#### `op: "add"`

Use a JSON Pointer `path` to write a specific value.

- **Request**:
  ```json
  {
    "op": "add",
    "path": "/nested/key",
    "value": 42
  }
  ```

#### `op: "merge"`

Merge a value object into the existing state.

- **Request**:
  ```json
  {
    "op": "merge",
    "value": {
      "user": { "id": "abc", "role": "admin" }
    }
  }
  ```

- **Effect**: `{ ...state, ...value }`

---

### 🔹 `DELETE /state/:id`

Delete the state object under the given ID.

---

## Notes

- All paths for `add` operations must follow [JSON Pointer](https://datatracker.ietf.org/doc/html/rfc6901) syntax
- Merge operations are shallow and will overwrite keys at the top level
- The service is in-memory only and not persistent
