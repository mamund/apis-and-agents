## ✅ Final Pre-Engine Checklist

### 1. **Formal JSON Schema for Validation**  
Would let us:
- Validate `design.json` before runtime
- Power editor integrations (e.g. VS Code schema autocompletion)
- Use in testing or CI pipelines

> 💡 Can generate this from the Markdown spec with a bit of work.

---

### 2. **Default Error Map Definition**  
You already said we’ll implement a `defaultErrorMap` in the engine. We could:
- Define it now
- Include it in the engine scaffold
- Make it overrideable per design

---

### 3. **Command Execution Semantics Draft**  
Before coding, we could sketch out:
- How `execute` will dispatch a command
- Where input validation, default filling, and role-checking live
- How errors and `revert` snapshots are managed

This helps split engine responsibilities into modules: validator, executor, reverser, etc.

---

### 4. **Decide on First Adapter (In-Memory)**  
We’re planning to use pluggable storage. Shall we:
- Lock in `adapters/in-memory.js` as the default?
- Define the standard adapter interface now?

---

### 5. **Runtime Loading Strategy**  
Do we want the engine to:
- Load one `design.json` per service?
- Or support multiple services at once?

This affects directory structure and job orchestration down the road.

---

