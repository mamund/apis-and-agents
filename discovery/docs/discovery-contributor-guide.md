# Discovery Service – Contributor Guide

This guide is for developers who want to **extend or contribute** to the Discovery Service.

## Overview

The Discovery Service allows composable services to:
- Register themselves at startup
- Be discoverable via `tag`
- Be periodically checked for health (ping)

## Core Endpoints

- `POST /register` — Register a service with its tag and metadata
- `POST /unregister` — Remove a service by tag or URL
- `GET /find?tag=xyz` — Lookup services by tag
- `GET /ping` — Health check

## Internal Structure

- Registered services are stored in-memory (can be made persistent later)
- A background timer pings services and evicts unreachable ones

## Contributor Notes

- To support clustering, replace in-memory store with Redis or etcd
- To log registrations, modify `logger.js`
- To customize eviction behavior, edit `pingServices()` logic

## Example Registration

```bash
curl -X POST http://localhost:4000/register -H "Content-Type: application/json" -d '{
  "tag": "person",
  "serviceURL": "http://localhost:4600"
}'
```