# 🛣️ DISCO Service Health & Lifecycle Roadmap

This roadmap outlines the planned enhancements for improving service lifecycle management and health monitoring in the DISCO registry ecosystem. Each step is prioritized to ensure a smooth, layered rollout that balances immediate benefits with long-term resilience.

---

## ✅ Phase 1: Require `/ping` Support in Services

**Goal:** Establish a universal health check mechanism.

- All services **MUST** expose a `GET /ping` endpoint.
- Response should return HTTP `200 OK`, optionally with a JSON payload like `{ "status": "ok" }`.
- Enables DISCO to perform lightweight, recurring liveness checks.

---

## 🔁 Phase 2: Add Ping-Based Health Checks to DISCO

**Goal:** Actively monitor service availability.

- DISCO will periodically send `GET` requests to each service’s `pingUrl`.
- `pingUrl` is passed at registration time.
- Failed attempts are counted and tracked per service.
- Frequency is configurable (e.g., every 30–60 seconds).

---

## ⚠️ Phase 3: Auto-Evict Unresponsive Services

**Goal:** Keep the registry clean and accurate.

- If a service fails **3 consecutive pings**, it will be **evicted** from the registry.
- Eviction may include:
  - Timestamp
  - Failure reason
  - Optional log/event emission
- Evicted services must re-register to rejoin the pool.

---

## 🟢 Phase 4: Service Self-Registration on Startup _(Already Implemented)_

**Goal:** Automate service discovery.

- Services register themselves with DISCO upon startup.
- Include `name`, `type`, and now also `pingUrl`.

---

## 💨 Phase 5: Attempt Graceful Unregistration on Shutdown

**Goal:** Reduce false positives and stale records.

- On shutdown (`SIGINT`, `SIGTERM`), services should:
  - Send a `DELETE /services/:id` to DISCO.
  - Optionally include a reason (e.g., “intentional shutdown”).
- Not guaranteed (won’t catch crash/kills), but improves responsiveness.

---

## 🧪 Optional Enhancements (Future)

- **TTL support:** Allow services to specify a time-to-live window on registration.
- **DISCO Dashboard:** Visualize registered services, ping status, and eviction history.
- **Webhooks or PubSub:** Notify external systems when services are added/removed.

---

## 🧭 Summary

This roadmap provides a progressive, resilient approach to managing dynamic services in a distributed ecosystem. Each step builds toward a discoverable, self-regulating, and trustworthy service registry.
