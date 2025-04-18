# Discovery Service – Developer Guide

This guide is for developers who want to **use** the Discovery Service to register and discover composable services.

## Overview

The Discovery Service acts as a lightweight registry. It allows services to:
- Register themselves with a unique `tag`
- Be discovered by other components (like job-control)
- Be monitored via health checks (ping)

## Core Concepts

- Each service declares a `tag` (e.g., "person", "invoice")
- Services are registered with a `serviceURL`
- Optionally, services may include a `pingURL` for health checks
- Consumers (like job-control) use `/find?tag=xyz` to locate services

---

## Registering a Service

A composable service should register itself on startup using:

```bash
curl -X POST http://localhost:4000/register \
  -H "Content-Type: application/json" \
  -d '{
    "tag": "person",
    "serviceURL": "http://localhost:4600",
    "pingURL": "http://localhost:4600/ping"
  }'
```

- `pingURL` is optional but **strongly encouraged**
- If omitted, the system may not detect service failures

---

## Finding a Service

To locate a service by tag:

```bash
curl "http://localhost:4000/find?tag=person"
```

The response includes the registered service metadata:
```json
[
  {
    "tag": "person",
    "serviceURL": "http://localhost:4600",
    "pingURL": "http://localhost:4600/ping",
    "lastSeen": "2025-04-18T10:15:30.000Z"
  }
]
```

---

## Health Checking

If a `pingURL` is provided during registration, the Discovery Service will use it to verify that the service is still healthy:
```bash
curl http://localhost:4600/ping
```

If the service fails to respond over time, it may be evicted from the registry.

---

## Unregistering a Service

To remove a service manually:
```bash
curl -X POST http://localhost:4000/unregister \
  -H "Content-Type: application/json" \
  -d '{ "tag": "person", "serviceURL": "http://localhost:4600" }'
```

---

## Notes

- Registrations are kept in-memory (non-persistent)
- `pingURL` is optional but used for health checks and eviction
- One tag can register multiple instances (e.g., for load balancing)

---

## Best Practices

- Use descriptive tags (`invoice-reader`, `status-checker`)
- Register automatically on service startup
- Include a `pingURL` for better visibility and reliability