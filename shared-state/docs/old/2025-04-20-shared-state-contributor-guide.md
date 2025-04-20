# Shared-State Service – Contributor Guide

This guide is for developers who want to **extend or contribute** to the Shared-State Service.

## Overview

The Shared-State Service is a simple key-value document store. It supports:
- Create, Read, Patch (Merge), and Replace operations
- JSON Pointer-based access
- Backing store is in-memory (with planned support for Redis)

## Core Endpoints

- `POST /state` — Create a new document
- `GET /state/:id` — Read a document
- `PATCH /state/:id` — Merge data into an existing document
- `PUT /state/:id` — Replace the document entirely

## Contributor Notes

- Patch operations use custom `"op": "merge"` logic
- Consider adding support for JSON Patch or JSON Merge Patch standards
- To support persistence, extract storage layer to a plug-in

## Example Create

```bash
curl -X POST http://localhost:4500/state -H "Content-Type: application/json" -d '{
  "message": "hello world"
}'
```