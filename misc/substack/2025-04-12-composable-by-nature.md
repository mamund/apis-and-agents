## Composable by Nature: Rethinking Agentic Systems Without the Hype

### The Agent Gold Rush

Everyone's chasing the AI agent dream.
Langchain, CrewAI, Auto-GPT — new agent frameworks launch weekly. The Message-Centric Protocol (MCP) is rightly drawing attention for its decentralized coordination model.

But let’s pause for a second.
**What if we've already had the building blocks for agentic behavior this whole time?**
Not in LLM wrappers — but in the very shape of a good API ecosystem.

> “The map is not the territory.” — Alfred Korzybski  
We don’t need to redraw the map. We just need to **learn to navigate differently**.

### Not New, Just Rediscovered

The idea of **composable services** isn’t new.
I’ve written about it for years — in blog posts, conference talks, and in my books on RESTful service patterns.

See:  
[*RESTful Web Clients*](https://www.oreilly.com/library/view/restful-web-clients/9781491921897/) and  
[*RESTful Web APIs*](https://www.oreilly.com/library/view/restful-web-apis/9781449358068/)

Back then, we talked about hypermedia, statelessness, and uniform interfaces.  
Today, those same ideas re-emerge — not as constraints, but as **affordances** for building systems that behave more and more like agents.

Composable isn’t a trend. It’s the substrate.

### The Three Pillars of Composable Infrastructure

Long before "agent" was a buzzword, we were building **composable systems** — using simple contracts, shared memory, and discoverable services.

#### 1. Composable Interfaces: `execute`, `repeat`, `revert`

Inspired by the Unix process model and REST’s uniform interface constraint (Fielding, 2000), the Composable Interface Pattern gives each service a minimal yet complete contract.
- No special clients.
- No coordination assumptions.
- Just tell me what you can do, how to undo it, and how to try again.

#### 2. Discovery as Hypermedia

“Hypermedia as the engine of application state” isn’t just REST dogma — it’s an architectural principle that **enables dynamic behavior**.

Like Doug Engelbart envisioned in NLS:
> “The system should help you discover what actions are possible.”

That’s exactly what a discovery service does.

#### 3. Shared State as Semantic Memory

> “Structure without semantics is a corpse.” — Dan Klyn

The shared-state service acts as a semantic substrate — a memory field that jobs can read from and write to.
This is not just data passing — it’s how coordination emerges.

### Jobs Behave Like Agents

Each job document is a declarative plan — like a shell script for the open web.

- Steps are run sequentially.  
- Tasks fan out in parallel.  
- Results get piped through shared memory.  
- Recovery, retries, reversals — all built in.

> “Form follows function.” — Louis Sullivan  
Here, **form follows affordance**.
We don’t wrap complexity in frameworks. We expose simplicity in protocol.

### SIDEBAR: Orchestration vs. Agentic Coordination

| Aspect                | Traditional Orchestration                 | Agentic Coordination (Composable Pattern)       |
|----------------------|-------------------------------------------|-------------------------------------------------|
| **Control Location** | Centralized controller drives flow        | Distributed logic via declarative job documents |
| **Service Awareness**| Orchestrator must understand all services | Services expose only their minimal contract     |
| **Coupling**         | Tight coupling between orchestrator and services | Loose coupling via shared interface       |
| **Resilience**       | Failure in orchestrator can halt system   | Jobs can recover or retry locally               |
| **Reusability**      | Orchestrators often hardcode logic        | Jobs and services are reusable in new combos    |
| **Discovery**        | Static bindings or preconfigured systems  | Dynamic runtime discovery and late binding      |
| **Analogy**          | Conductor with a score                    | Explorers with a shared map and rules           |

> "In orchestration, the conductor knows all. In emergence, the players know the score." — loosely adapted from Christopher Alexander

### The Punchline: Ready for the Future

Engelbart called for systems that augmented human intellect — not replaced it.  
Alexander showed us how form could emerge from pattern.  
Fielding reminded us that the web succeeds by **not knowing the future** ahead of time.

That’s the real promise of composability.
Not that it solves everything today — but that it **doesn’t prevent anything tomorrow**.

When AI agents truly arrive — trustworthy, autonomous, scalable — they will need platforms that support:
- **Dynamic discovery**
- **Explicit memory**
- **Reversible actions**
- **Minimal contracts**

You already have that in a composable platform.

> “The future is already here — it’s just not evenly distributed.” — William Gibson

If you’ve built your services with this pattern — or even just started thinking this way —  
**you’re not behind. You’re early.**

Let the AI come. We’ll be ready.
Because we **already know how to build for agents** — with nothing more than a registry, a few endpoints, and the humility to design for emergence.


