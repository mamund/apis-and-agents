# Shared State as a Pipe: Coordinating Services Without Tight Coupling

## The Core Idea

The `shared-state` service acts like a **named memory pipe**, enabling independent services to exchange data through a common medium — without ever talking to each other.

It's the same idea behind **Unix pipes**:

```bash
cat file.txt | grep "error" | sort
```

Each command runs independently, but shared output streams connect them.

---

## In This System

Every job step in the `job-control` system can read from and write to a **shared state document**, hosted and managed by the `shared-state` service.

### Input
Tasks can dynamically fetch input from state:

```json
"input": {
  "email": { "$fromState": "user.email" }
}
```

### Output
Tasks can store results into state using `storeResultAt`:

```json
"storeResultAt": {
  "sourcePath": "/data/email",
  "targetPath": "/emails/latest"
}
```

---

## The Magic

Each service:
- Only needs to **read input**
- Perform its **local operation**
- Return **its own result**

It doesn't need to:
- Know where the data came from
- Know where the result goes
- Be aware of the job system at all

All coordination happens **externally**, via `job-control` and `shared-state`.

---

## Benefits

| ✅ Simplicity | Services are clean, single-purpose, and stateless. |
| ✅ Composability | Easily swap or reorder services in jobs. |
| ✅ Decoupling | No hardcoded links or shared protocols. |
| ✅ Debuggability | Inspect shared state at any time. |
| ✅ Flexibility | Jobs can evolve without touching the services.

---

## Recap: Shared-State = System Pipe

- Think of `shared-state` as a **/tmp/bus.json** for your distributed services.
- It lets data flow cleanly between steps, without ever binding the services together.

