## 🏗️ **Phase 1 Runtime Engine: Node.js**

### ✅ Core Behaviors
- [ ] Load and validate design document on startup
- [ ] Register with platform (e.g., `discovery` or `job-control`)
- [ ] Expose `POST /execute`, `POST /repeat`, `POST /revert` endpoints
- [ ] Interpret commands dynamically from the loaded design doc

### 🧠 Runtime Design
- [ ] Apply default values for `transitionType`, `statusCode`, etc.
- [ ] Route each command by name (`req.body.command`) to a dispatcher
- [ ] Validate and normalize `inputs` based on `required`, `optional`, `defaults`

### 🗂 Data Storage
- [ ] In-memory store using a simple JavaScript object
- [ ] Abstracted storage layer (e.g., `storage.js`) to support future Redis/Mongo/etc.

### 🧪 Observability
- [ ] Log missing best practices (e.g., `transitionType` not declared)
- [ ] Include `x-*` metadata in logs for debugging (but don’t act on it yet)

---

Whenever you're ready, I can help you:
- Scaffold the directory structure
- Stub out the entrypoint and service registration logic
- Implement `execute` for a working CRUD command

Just say the word and we’ll get building!
