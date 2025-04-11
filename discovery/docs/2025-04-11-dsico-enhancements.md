## DISCO Service Enhancements
---

### ✅ 1. Service SHOULD register on startup
Already implemented — great. This bootstraps presence in the DISCO directory.

---

### ✅ 2. Service SHOULD support a `/ping` endpoint
**Purpose**: Let the DISCO server confirm liveness via simple health checks.

**Recommendation**:
- Use a simple, no-auth `GET /ping` that responds with `200 OK` and possibly a short JSON like `{ "status": "ok" }`.
- Add version info or uptime if you want richer diagnostics later.

---

### ⚠️ 3. Service SHOULD unregister on shutdown  
This is trickier — processes that crash won’t call any cleanup.

**Options**:
- **On graceful shutdown**: Hook into `SIGINT` and `SIGTERM` signals to send a DELETE to DISCO.
- **On crash or kill -9**: Can’t be captured. So you must rely on a heartbeat (see 4–5).
- Optionally support a `/unregister` endpoint in DISCO for manual removal.

---

### ✅ 4. DISCO server should use the `/ping` endpoint (provided at registration)  
**Implementation**:
- Each registered service includes its `pingUrl`.
- DISCO periodically calls that URL (e.g., every 30s or 1m).
- If the ping fails (connection refused, timeout, 5xx), log the failure count.

---

### ✅ 5. Evict after repeated ping failures (e.g., 3 strikes)
**Eviction strategy**:
- On 3 consecutive failed pings (with an optional exponential backoff), remove the service from the registry.
- Optional: publish an event or webhook on eviction (for observability).
- Mark the eviction with a timestamp or reason if you’re keeping history.

---

### 🧠 Bonus ideas
- Add an optional `ttlSeconds` field at registration, so services can expire if not refreshed in time (pull vs. push heartbeat models).
- DISCO dashboard view? Could show healthy/unhealthy status and eviction logs.
- Use the job-control system to ping in parallel batches if you scale this up.

---
