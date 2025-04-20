# Shared-State Contributor Guide

This guide is for developers who want to **extend or improve** the shared-state service.

---

## Architecture

- Service runs as an Express.js app on port `4500`
- Maintains an in-memory dictionary of documents:
  ```js
  const stateStore = {
    [id]: {
      id,
      content: { ... },
      createdAt,
      lastModified
    }
  };
  ```

---

## Metadata System

Each document tracks:
- `id`: unique string
- `createdAt`: ISO timestamp
- `lastModified`: ISO timestamp

These fields are not exposed via `/state/:id` but are returned:
- In `GET /state` (for all docs)
- In `GET /state/:id?meta` (for a single doc)

---

## Representation Rules

- `GET /state` — only metadata + link
- `GET /state/:id` — only content
- `GET /state/:id?meta` — only metadata

---

## Suggested Extensions

- Add expiration logic (TTL per document)
- Add role-based metadata filtering
- Persist state using Redis or file storage
- Add support for tag-based queries or indexing
