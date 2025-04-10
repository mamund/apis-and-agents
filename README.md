# APIs and Agents

a set of demos showing a minimal model for supporting uncorrelated sapient services (APIs & Agents).


## 🧭 **Job-Control Feature Roadmap**

### ✅ **CORE (Done)**
- [x] Sequential job execution with parallel task steps  
- [x] Service discovery via tag + `/forms`  
- [x] Revert stack for failure rollback  
- [x] Shared state via `sharedStateURL`  
- [x] `storeResultAt`: full result, partial slices, `onlyOnStatus`, and `_raw` fallback for non-JSON  

---

### 🚀 **PHASE 1: Empower Job Definitions (Short-term, High-Value)**

#### 🟩 1. Transform Support in `storeResultAt`  
Enable inline transformations before storing:
```json
{
  "sourcePath": "/data",
  "targetPath": "/processed",
  "transform": "value.toUpperCase()"
}
```

#### 🟩 2. Conditional Execution Per Task  
```json
"when": "state.data.user.active === true"
```
Skip task if condition fails. Could use JS-like expressions or JSONPath.

#### 🟩 3. Retries + Backoff
```json
"retries": 3,
"backoffMs": 1000
```

---

### 🔧 **PHASE 2: Improve Resilience + Observability**

#### 🟨 4. Timeout Per Task  
Abort tasks if they run too long:
```json
"timeoutMs": 5000
```

#### 🟨 5. Task Tracing + Logging  
Emit detailed trace logs (task started, completed, failed, reverted) with requestIds for audit/debug.

#### 🟨 6. Event Webhooks (Job/Step/Task Lifecycle)  
POST job status to external endpoint:
```json
"onJobComplete": "http://my-logger/jobs",
"onTaskError": "http://alerts/tasks"
```

---

### 🧠 **PHASE 3: Smarter Control Flow**

#### 🟧 7. Mapping and Looping  
```json
"mapOver": "{{ state.users }}",
"taskTemplate": { ... }
```
Fan out one task per user.

#### 🟧 8. Parallelism Control (Concurrency Limit)
Limit how many tasks run concurrently in a step:
```json
"maxParallel": 3
```

#### 🟧 9. Dynamic Step Insertion  
Allow runtime mutation of the job based on prior task results.

---

### 🔒 **PHASE 4: Security + Access**

#### 🟥 10. Auth Context Injection  
Support headers or tokens per task:
```json
"auth": {
  "type": "bearer",
  "tokenFromState": "/auth/token"
}
```

#### 🟥 11. Role-Based Task Access  
Restrict tasks by role or tags (useful for multi-tenant or agent-executed jobs).

---

## 🧩 Bonus: Optional Ecosystem Ideas

- 🧰 **Job Template Registry** — predefined jobs that can be parameterized
- 📜 **State Viewer UI** — live JSON explorer for state documents
- 🤖 **Agent-Facing Forms** — HATEOAS-style links to suggest next actions
- 🧪 **Dry Run Mode** — simulate the job and preview state mutations

---

