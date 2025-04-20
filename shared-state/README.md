# Shared-State Service

The **Shared-State Service** manages ephemeral key-value documents with JSON content. It's designed to support coordination between services and workflows by storing and updating shared data structures during execution.

---

## 🚀 How to Run

```bash
PORT=4500 node index.js
```

- Default port: `4500`
- Requires no backing database (in-memory only)
- Automatically registers with the discovery service at startup

---

## 🔗 Endpoints

### `POST /state`
Create a new shared state document.
- **Body:** `{ id?: string, key: value, ... }`
- **Response:** `{ stateURL: string }`

### `GET /state/:id`
Get document contents (no metadata).
- **Returns:** Raw JSON
- **No metadata is included**
- **No link to metadata is provided (for security)**

### `GET /state/:id?meta`
Get only metadata for the document.
- **Returns:** `{ id, createdAt, lastModified }`

### `POST /state/:id`
Merge new values into an existing document.
- **Body:** `{ key: value, ... }`

### `PATCH /state/:id`
Patch an existing document using:
- `{ op: "add", path: "/some/path", value: ... }`
- `{ op: "merge", value: { ... } }`

### `DELETE /state/:id`
Remove a document. No error if it does not exist.

### `GET /state`
List metadata for all known state documents.
- Each entry includes: `{ id, createdAt, lastModified, rel: "item", href }`
- **Does not include document content**

### `GET /health`, `GET /`
Returns basic service status and metadata.

---

## 🧭 Representation Rules

- Metadata (`createdAt`, `lastModified`) is stored internally
- `GET /state/:id` always returns **content only**
- `GET /state` returns **metadata only**
- `GET /state/:id?meta` returns **metadata only**
