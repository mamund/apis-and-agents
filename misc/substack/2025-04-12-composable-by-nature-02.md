## Composable by Nature: Rethinking Agentic Systems Without the Hype

### The Agent Gold Rush

We’re living through a moment of real excitement in system design.

Frameworks like Langchain, CrewAI, and Auto-GPT are pushing boundaries — blending APIs and LLMs into systems that feel dynamic, exploratory, even alive. The Message-Centric Protocol (MCP) is especially promising: it treats agents not as glue code, but as first-class citizens in an evolving network of services.

This is good news.

It means we’re stretching the boundaries of information systems.  
It means we're starting to blur the lines between AI platforms and API ecosystems.

But here’s the even better news:  
> Many of the **core elements** of these agentic architectures are already in our hands.

- **Discovery** of capabilities  
- **Shared memory/state** between steps  
- **Reversible, retryable interactions**  
- **Composable contracts** that require no prior coordination

These aren't distant dreams — they’re already baked into the most resilient API designs of the past decade.

> “The map is not the territory.” — *Alfred Korzybski*  
We don’t need to replace what we’ve built.  
We just need to recognize how close we already are.

### Not New, Just Rediscovered

The idea of **composable services** has deep roots — stretching from the mashup culture of Web 2.0, to the rise of microservices, to today’s lambda-style event-driven platforms.

I’ve written about this space for years — in blog posts, on stage, and especially in my books on RESTful patterns for APIs and clients.

See:  
[*RESTful Web Clients*](https://www.oreilly.com/library/view/restful-web-clients/9781491921897/)  
[*RESTful Web APIs*](https://www.oreilly.com/library/view/restful-web-apis/9781449358068/)  
[*RESTful Web API Patterns and Practices Cookbook*](https://www.oreilly.com/library/view/restful-web-api/9781492088960/)

In those books, I talked about the flexibility and power of hypermedia, statelessness, and the uniform interface — principles that made it possible to build modular, evolvable, self-descriptive systems at scale.

It turns out all that work over the years was laying the foundation for agentic behavior.

There is now growing interest in **affordances** — and the role they play in enabling ecosystems where services don’t just interoperate, but **adapt**.

Affordance-driven systems let us:
- Compose services without tight coupling
- Navigate functionality without prior integration
- Pass meaning through structure
- Let interaction emerge over time

> Composability isn’t a trend. It’s the design language of **adaptive systems**.

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


