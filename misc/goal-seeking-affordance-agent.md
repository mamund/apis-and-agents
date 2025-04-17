# Goal-Seeking Affordance Agent

This document formalizes the design pattern emerging from our recent discussions: a generalized, domain-aware, goal-seeking agent architecture. It draws inspiration from the MAZE+XML project, composable job-control systems, affordance models (like ALPS), and classic goal-driven AI paradigms.

---

## 🔁 Agent Pattern Overview

A **Goal-Seeking Affordance Agent** is a system that:
- Operates within a perceivable, affordance-rich environment
- Pursues an explicit goal state
- Iteratively observes available actions (affordances), evaluates them against rules, and executes steps toward success

This pattern is generalizable across domains: from document approval, to shopping, to dynamic service orchestration.

---

## 🧱 Core Components

### 1. **Goal Definition**
Defines what success looks like.
- ✅ Example: "Approve 10 invoices"
- Can be numeric, logical, or symbolic
- Must be observable within the agent's environment

### 2. **Navigable Environment**
The stateful world the agent can perceive and act upon.
- Could be a file system, database, API surface, or shared-state interface
- Contains dynamic, structured resources

### 3. **Affordance Discovery**
The agent must detect what actions are currently available.
- Affordances may come from:
  - Hypermedia links (e.g. `rel: approve`)
  - ALPS descriptors
  - `/forms` endpoints
  - Job-control metadata

### 4. **Encounter Rules**
Defines what to do when certain affordances or resources are encountered.
- Analogous to maze traversal heuristics (e.g. "go left if possible")
- Can be simple if-else logic, learned policies, or declarative rules
- Must be scoped to the domain

### 5. **Agent Execution Loop**
A generalized control structure:

```
WHILE goal not yet satisfied:
  1. Observe current environment
  2. Discover available affordances
  3. Evaluate options using domain-specific rules
  4. Take action
  5. Update internal state or shared-state
```

---

## 🛠 Example: Invoice Approval Agent

- **Goal**: Approve 10 invoices for payment
- **Environment**: A folder or shared-state list of documents
- **Affordances**: `approve`, `move`, `skip`, `review`
- **Rules**:
  - If document is an invoice and passes all validation checks, approve it
  - Otherwise, skip or mark for review
- **Success**: 10 valid invoices moved to "approved" folder

---

## 🌐 Relationship to Other Systems

| Feature | Auto-GPT / LangChain | GOFAI Planners | Affordance Agent |
|--------|----------------------|----------------|------------------|
| Goal representation | Loose or prompt-based | Formal | Formal & observable |
| Planning | Prompt or chain-based | Symbolic | Iterative, affordance-driven |
| Environment model | None or implicit | Explicit | Observable via API or links |
| Adaptivity | Limited | None | High (via runtime discovery) |
| Domain awareness | Manual / embedded | Requires modeling | Via rules + affordances |

---

## 🧭 Next Directions

- Model agent logic in ALPS descriptors
- Attach schema/validation info to affordances
- Define reusable domain-specific agent shells
- Test in multiple domains (finance, ops, content workflows)

---

This pattern represents a foundational structure for building intelligent, adaptable agents that interact with services and data in a goal-driven, semantically meaningful way.

Saved under: **composable ALPS**
