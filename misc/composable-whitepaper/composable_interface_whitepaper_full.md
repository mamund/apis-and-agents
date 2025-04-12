# The Composable Interface Pattern
## Building Agentic Systems from Stable Contracts and Simple Services

### Abstract

This paper introduces the **Composable Interface Pattern**, a design model for building dynamic, adaptable, and agent-ready systems from independently deployable services. The approach is grounded in real-world code and experience, not just theory. At its core is a powerful constraint: every service must expose a standard three-endpoint interface (`/execute`, `/repeat`, `/revert`) over a single HTTP method (`POST`). This contract unlocks a new kind of composability—where services can be orchestrated, reused, and recombined without coordination, without awareness of each other, and without rewriting. 

Surrounding this pattern is a lightweight platform made up of three foundational services: `discovery`, `shared-state`, and `job-control`. Together, these services form a stable runtime substrate for composing workflows and planning behaviors across independently authored actions. The result is a framework where each job behaves like a bounded agent—discovering affordances, executing steps, maintaining context, and recovering from failure. This paper outlines the motivation behind this model, the details of the pattern, the implementation architecture, and the broader implications for systems built for change.

---

### 1. Introduction

The dream of software composability is simple: take small parts, each doing one thing well, and plug them together to create complex behaviors. But in practice, composability across distributed services is hard. Interfaces drift. Integrations become brittle. Systems become too tightly coupled or too loosely defined. Over time, things break.

I wanted to find a path that balanced structure with freedom—a way to create services that didn’t need to know who would use them, when, or how. A way to build **systems that could grow without rework**. And most of all, I wanted to create something I could actually run—something real.

This led me to the **Composable Interface Pattern**, a strict-but-simple model for writing services that could be orchestrated without custom integration. Paired with a minimalist runtime platform, it became more than just a service model. It became a way to think about coordination, flow, and even agent-like behavior.

In this paper, I’ll walk through:

- The three foundational services that make up the composable platform
- The interface pattern that enables true service interchangeability
- The structure of jobs as dynamic, declarative, agent-like systems
- The implications for AI integration, agentic platforms, and future systems

Every concept here is backed by working code. This isn’t a proposal—it’s a pattern I’ve tested, refined, and now offer for others to use, critique, or extend.

Let’s begin where all coordination begins: with a place to stand.

---

### 2. The Three Platform Pillars

At the heart of the composable system are three foundational services. These aren’t just utilities or infrastructure—they’re the enabling forces that make the whole architecture work. Each one corresponds to a key function in any agentic or orchestrated environment: discovery, memory, and execution.

#### 🧭 2.1 Discovery
> *How do I find what services are available?*

The **discovery** service is a lightweight registry. Every composable service announces itself at startup and registers its canonical name and endpoint locations. This allows jobs to locate services by intent rather than by fixed URLs. Discovery decouples services from their location and identity—enabling orchestration that adapts to real-world changes.

Think of discovery as the system’s **sensory input layer**. It allows a job (or an agent) to perceive what’s available in the environment and begin planning accordingly.

#### 🧠 2.2 Shared-State
> *How do I connect steps without coupling services?*

Each service in the system is stateless. They don’t remember the last call or anticipate the next. Instead, jobs rely on the **shared-state** service—a centralized context store that holds evolving job data. Task results are stored here, keyed by step name or explicit path. Services read and write from shared-state without ever needing to know who came before or who comes next.

This forms the job’s **working memory**—a place to maintain state, share knowledge, and evaluate branching logic.

#### 🎼 2.3 Job-Control
> *How do I define and execute a job?*

The **job-control** service is the orchestrator. It interprets declarative job definitions and executes them one step at a time (or many steps in parallel). It uses discovery to find the right services, shared-state to move data between steps, and a runtime engine to manage execution, failure handling, retries, and reversals.

Job-control is the system’s **planner and executor**. It’s what gives form and structure to the otherwise disconnected pieces. It’s also what gives jobs their agency.

Each of these three pillars can be developed independently, scaled separately, and replaced over time—but together, they make up a powerful foundation for building dynamic, decoupled systems that are greater than the sum of their parts.

---

### 3. The Composable Interface Pattern

Services that participate in this system aren’t built around domain-specific contracts, RESTful resource hierarchies, or complex message schemas. Instead, each service adheres to a **strict, stable, and minimal contract**:

- One HTTP method: `POST`
- Three canonical endpoints: `/execute`, `/repeat`, and `/revert`

This constraint does two things: it **simplifies orchestration** and **maximizes reusability**.

Job-control doesn’t have to know about verbs, paths, or versioning schemes. It just knows how to `POST` to a known endpoint with a JSON body. Every service looks and behaves the same—at least from the outside. That consistency is what makes composition possible.

#### 🔁 Execute, Repeat, Revert

Each endpoint plays a distinct role:

- `/execute` is called to run the core logic of the service
- `/repeat` is called to retry the last operation with the same or slightly adjusted parameters
- `/revert` is called to undo or compensate for a previously successful action

This triad creates a contract for **forward motion, retry, and rollback**—the essential verbs of orchestration.

#### 🔒 Why the Constraint Matters

The `POST`-only, 3-endpoint model avoids the ambiguity and variation that often derail composability. There’s no guesswork about method safety, no assumptions about idempotency. Every service defines its own semantics inside the request body. That uniformity means services can be:

- Swapped in and out without orchestration changes
- Called repeatedly in different job contexts
- Introspected or planned against by tools, agents, or humans

Yes, some richness is lost—there’s no native support for `GET`, `PUT`, or caching layers. But in return, I gain a **predictable, programmable surface area** that makes long-term system evolution not just possible, but safe.

---

### 4. Jobs as Declarative Agents

A job in this system isn’t just a workflow — it’s a bounded, context-aware actor. It discovers available services, plans a sequence of actions, adapts based on results, and maintains a form of memory. In short: **every job is a kind of agent**.

#### 🧠 Jobs Have Purpose
Each job begins with a definition — a declarative intent. It encodes a goal in the form of a sequence (or graph) of steps. Each step calls a service, feeds outputs to the next, and records results in shared-state. From the system’s point of view, the job *knows what it wants* and works toward that outcome.

#### 👀 Jobs Perceive and Adapt
Jobs use discovery to perceive what’s available. They can branch based on shared-state values. They can retry or halt or revert. They don’t just execute blindly — they **react** to what they learn during execution.

This gives the job a kind of reflexivity. It's not just doing what it's told — it's *interpreting* a plan in the context of real-world responses.

#### 🧾 Jobs Accumulate Knowledge
As a job runs, it builds up a trail of decisions and outcomes in shared-state. This context becomes a form of memory — available for audit, replay, or real-time introspection. It’s also what makes planning across uncertain environments possible.

An external planner (human or AI) can examine this memory to decide what to do next. This opens the door to *dynamic jobs*, *self-modifying jobs*, and even *cooperative job clusters*.

#### 🛠 Jobs Are the New Runtime
Because services are stable and interchangeable, the job becomes the true unit of expression. I don’t write service-specific logic — I compose jobs. These jobs become a kind of runtime programming model — one that is dynamic, agent-like, and expressive.

Each job is a system of intentions expressed through action and state. It’s a living, runtime agent built from composable parts.

---

### 5. Agentic Systems Without the Buzzwords

Let’s drop the jargon and look at what this system actually is: a lightweight agent platform that doesn’t require a research grant to run. There’s no ontology, no protocol gymnastics, no bespoke language. Just simple services, a shared context, and a planner that executes jobs one step at a time.

And yet — out of that simplicity, **agency emerges**.

Each job perceives, plans, acts, and remembers. It reacts to failures, retries when needed, and undoes what no longer makes sense. It navigates a changing environment with a combination of declarative structure and contextual flexibility. 

I didn’t set out to build an agentic runtime. But by constraining my services and elevating my jobs, that’s what I ended up with.

#### 🔍 Reframing the Pillars
Here’s how the three platform services map cleanly onto agentic behavior:

- **Discovery** → *Perception*: what actions are available to me now?
- **Shared-State** → *Memory*: what have I done, and what do I know?
- **Job-Control** → *Planning + Execution*: what should I do next?

This trio makes each job more than just a flow—it becomes a behavior.

#### 🤖 The Emergent Agent
There’s no central intelligence. No hidden scheduler. No master control loop. Instead, what emerges is a **distributed execution model** where each job is its own small, bounded agent—capable of real coordination and adaptation through nothing more than declarative structure and stable contracts.

This is what makes the composable system scalable—not just in performance, but in meaning. You don’t need to rewire the world to build adaptive behavior. You just need:

- Stable services
- Clear contracts
- Dynamic jobs

With those in place, you can scale coordination without central control.

#### 📡 Looking Ahead
This architecture isn’t just ready for agents. It’s already one. But as tooling improves, it’s easy to imagine a world where jobs are authored by AIs, stitched together by planners, visualized by humans, and modified in real time based on ongoing results.

We’re not there yet. But I’ve built the foundation. And I believe others will take it further.

---

### 6. What Comes Next

This system wasn’t built to be a thought experiment. It was built to run. And it does. The ideas I’ve outlined here are backed by real, working code — small, composable services and a lightweight orchestration platform that anyone can run locally or deploy across a distributed environment.

#### 🧪 Code, Kits, and Tools
What I’ll be releasing shortly includes:

- A complete Node.js implementation of the three core services:
  - `discovery`
  - `shared-state`
  - `job-control`
- A starter set of **composable services** that follow the `/execute`, `/repeat`, `/revert` contract
- Sample **job definitions** that show conditional logic, retries, and reversibility
- A growing library of **patterns and templates** for designing your own services and workflows

All of it will be open source, modular, and extensible.

#### 🧰 What You Can Do With It
If you want to:
- Build automation pipelines without writing orchestration code
- Create agent-like behavior without deploying AI infrastructure
- Design services once and reuse them across hundreds of workflows
- Teach new developers the fundamentals of flow, state, and coordination

...this platform can help.

I’ve been using it to explore ideas around fault recovery, composable DevOps steps, long-running transactions, and even dynamic API generation. The flexibility is in the form. Once you adopt the contract, the rest follows.

#### 🛤️ Where This Leads
This is just the beginning.

There’s potential to build:
- **Visual job editors** that let humans compose agents
- **LLM-based planners** that synthesize jobs on demand
- **Runtime diagnostics** that trace and debug long-running jobs
- **Composable marketplaces** where services can be discovered, invoked, and recombined live

The groundwork is in place. The pattern is repeatable. And I’m excited to see where others take it.

If you’re building something in this space — or want to — let’s talk. This system is designed to be used, extended, and evolved. It works. And it’s just getting started.

---

### Conclusion

The Composable Interface Pattern isn’t about enforcing minimalism for its own sake — it’s about creating room to grow. By narrowing the interface and stabilizing the orchestration model, I’ve opened up space for dynamic behavior, adaptive planning, and true long-term reuse.

This isn’t the end state of anything. It’s a foundation — a composable substrate for systems that are built to evolve. Whether you’re designing services, crafting jobs, or thinking about the future of agentic platforms, this model is a place to start.

It works now. It scales later. And if I’ve done my job, it invites you to build forward from here.


