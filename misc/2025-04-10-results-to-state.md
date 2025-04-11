# WOrking Design Document for "Result-to-State Wiring" Feature

This is an excellent next-level challenge — and it’s totally the kind of affordance that makes a job-control system powerful and reusable.

You're essentially talking about enabling **result-to-state wiring** — where the **output** of a service call is automatically **stored** (whole or in part) into the shared state doc, so that **future tasks can read from it** (e.g. via variable substitution). ✅

Let’s break this into a few pieces so we can think it through cleanly.

---

### **Key Idea**
> After a task executes, its result can be piped into the shared state, optionally at a specified path, so that later steps can reuse the data.

---

### Building Blocks to Consider

#### 1. **Capture Output**  
Each task's execution should capture the full JSON result of the HTTP request.

- Already likely happening — but we’ll formalize this as `taskResult`.

#### 2. **Define "Where to Store"**  
In the job definition, we could allow:

```json
{
  "target": {
    "stateId": "job-abc",
    "path": "/results/service-x"
  }
}
```

This tells the orchestrator: *“When this task finishes, store its result at `/results/service-x` in the shared state doc.”*

Optional shorthand:
```json
"storeResultAt": "/results/service-x"
```

#### 3. **Specify Partial Paths (Optional)**  
To support piping *part of the response*, we could allow:

```json
"storeResultAt": {
  "sourcePath": "/data/thing",
  "targetPath": "/results/service-x/thing"
}
```

This opens up JSON Pointer-style extraction.

#### 4. **Apply After Hook**  
This logic is executed **after** the task completes successfully. Could be part of a `postTaskHook`, or handled directly by the job executor.

---

### Example Flow

#### Job Step:
```json
{
  "service": "fetch-user",
  "method": "GET",
  "url": "http://user-service/users/42",
  "storeResultAt": "/data/users/42"
}
```

#### Then another step:
```json
{
  "service": "send-email",
  "method": "POST",
  "url": "http://mailer/send",
  "body": {
    "to": "{{ data.users.42.email }}",
    "message": "Welcome aboard!"
  }
}
```

The email service doesn’t need to know where the data came from — just that it’s available via shared state.

---

### Considerations

- **Error Handling**: Should we write failed task output? Only on 2xx? Allow user to specify conditions?
- **Overwrite Policy**: Allow overwriting state paths? Or enforce immutability?
- **Transformation Hooks?** Maybe later, support a small JS expression or template transform before storing.

---

### Implementation Options

1. **No Change to Services** (preferred):
   - Orchestrator handles piping result into shared-state.
   - Job definition declares where to store it.

2. **Optionally Extend Services (low priority)**:
   - Services could optionally POST their own results back to the shared-state service.
   - Only needed for agent-driven or peer-to-peer flows.

---

What do you think? Want to sketch out the JSON shape for how this could look in job definitions? Or should we mock up a specific task chain example to walk it through in full?
