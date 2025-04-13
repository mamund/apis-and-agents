## Composable by Nature: Rethinking Agentic Systems Without the Hype

### The Agent Gold Rush

We’re living through a moment of real excitement in system design.

Frameworks like Langchain, CrewAI, and Auto-GPT are pushing boundaries — blending APIs and LLMs into systems that feel dynamic, exploratory, even alive. The Message-Centric Protocol (MCP) is especially promising: it treats agents not as glue code, but as first-class citizens in an evolving network of services.

This is good news.

It means we’re stretching the boundaries of information systems.\
It means we're starting to blur the lines between AI platforms and API ecosystems.

But here’s the even better news:

> Many of the **core elements** of these agentic architectures are already in our hands.

- **Discovery** of capabilities
- **Shared memory/state** between steps
- **Reversible, retryable interactions**
- **Composable contracts** that require no prior coordination

These aren't distant dreams — they’re already baked into the most resilient API designs of the past decade.

> “The map is not the territory.” — *[Alfred Korzybski](https://en.wikipedia.org/wiki/Alfred_Korzybski)*\
> We don’t need to replace what we’ve built.\
> We just need to recognize how close we already are.

### Not New, Just Rediscovered

The idea of **composable services** has deep roots — stretching from the mashup culture of Web 2.0, to the rise of microservices, to today’s lambda-style event-driven platforms.

I’ve written about this space for years — in blog posts, on stage, and especially in my books on RESTful patterns for APIs and clients.

See:\
*[RESTful Web Clients](https://www.oreilly.com/library/view/restful-web-clients/9781491921897/)*\
*[RESTful Web APIs](https://www.oreilly.com/library/view/restful-web-apis/9781449358068/)*\
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

No matter what we call it — affordance-based, lambda-style, agentic, event-driven — the secret to building flexible, stable, and decoupled systems usually comes down to the same three elements:

- **Composable Interfaces**
- **Dynamic Discovery**
- **Shared Semantic State**

Long before "agent" was a buzzword, we were building **composable systems** — using simple contracts, shared memory, and discoverable services.

#### 1. Composable Interfaces

Inspired by the Unix process model and REST’s uniform interface constraint ([Roy Fielding](https://en.wikipedia.org/wiki/Roy_Fielding), 2000), the Composable Interface Pattern applies the idea of **interface constraints** to improve flexibility, stability, and reuse. Each service adheres to a consistent contract, offering just three essential actions:

- `execute`: perform the primary operation
- `repeat`: retry the same action safely
- `revert`: undo or compensate for the action

This minimalist interface lowers the cost of reuse and coordination. It allows services to behave more like interchangeable components — or autonomous tools — without prior integration assumptions. (Fielding, 2000), the Composable Interface Pattern gives each service a minimal yet complete contract.

- No special clients.
- No coordination assumptions.
- Just tell me what you can do, how to undo it, and how to try again.

#### 2. Discovery as Hypermedia

“Hypermedia as the engine of application state” isn’t just REST dogma — it’s an architectural principle that **enables dynamic behavior**.

Like [Doug Engelbart](https://en.wikipedia.org/wiki/Douglas_Engelbart) envisioned in NLS:

> “The system should help you discover what actions are possible.”

That’s exactly what a discovery service does.

For composable, agentic systems to work at scale, all participating services need to **broadcast their availability**. That means advertising capabilities — not in some static directory or config file, but in a way that clients and jobs can query in real time.

Clients — human or machine — should be able to **search and select services on demand**, based on what they need to do next. And this needs to happen dynamically, as the environment changes.

Static registries may help you get started. But truly adaptive systems rely on **runtime discovery**, where services self-describe and declare affordances openly.

In truly composable systems, the discovery layer becomes an ambient map — one that agents (or jobs) can consult, traverse, and respond to as they go.

#### 3. Shared State as Semantic Memory

> “Structure without semantics is a corpse.” — [Dan Klyn](https://www.linkedin.com/in/danklyn)

Just as LLMs rely on context to help them interact meaningfully with users, a composable platform depends on shared state to provide context between independent services.

The shared-state service acts as a semantic substrate — a memory field that jobs can read from and write to. It’s not just data passing — it’s the **glue** that enables collaboration across time and task boundaries.

Much like the Unix philosophy of pipes and filters, where small programs communicate through standard input and output, a composable platform uses shared contextual state to make powerful composition possible.

This state makes it possible for clients — human or machine — to build unique, responsive solutions from loosely connected parts.

### Jobs Behave Like Agents

Today, composable systems often rely on orchestrators to "drive" the process — calling services, mixing their responses, and ultimately solving a problem. The same is true for agentic systems: someone has to come up with the script, the template, the plan.

In the early days of computing, this work was handled by a **job control language** — JCL for short. That model still holds up. What's needed now is a **job control system for the web** — something that works like a Unix shell, but for distributed service ecosystems.

A job control system should:

- Accept declarative job definitions as input
- Execute steps in a sequence, each with one or more parallel tasks
- Route outputs to shared state that can be used later
- Support retry and reversal at any point in the process
- Allow jobs to respond dynamically based on runtime conditions

Each job document becomes a kind of **scripted agent** — capable of perceiving (via shared state), reasoning (via conditional logic), and acting (via service execution).

> “Form follows function.” — [Louis Sullivan](https://en.wikipedia.org/wiki/Louis_Sullivan)\
> Here, **form follows affordance**.
> We don’t wrap complexity in frameworks. We expose simplicity in protocol.

### SIDEBAR: Orchestration vs. Agentic Coordination

| Aspect                | Traditional Orchestration                        | Agentic Coordination (Composable Pattern)       |
| --------------------- | ------------------------------------------------ | ----------------------------------------------- |
| **Control Location**  | Centralized controller drives flow               | Distributed logic via declarative job documents |
| **Service Awareness** | Orchestrator must understand all services        | Services expose only their minimal contract     |
| **Coupling**          | Tight coupling between orchestrator and services | Loose coupling via shared interface             |
| **Resilience**        | Failure in orchestrator can halt system          | Jobs can recover or retry locally               |
| **Reusability**       | Orchestrators often hardcode logic               | Jobs and services are reusable in new combos    |
| **Discovery**         | Static bindings or preconfigured systems         | Dynamic runtime discovery and late binding      |
| **Analogy**           | Conductor with a score                           | Explorers with a shared map and rules           |

> "In orchestration, the conductor knows all. In emergence, the players know the score." — loosely adapted from [Christopher Alexander](https://en.wikipedia.org/wiki/Christopher_Alexander)

### Ready for the Future

So, what's the message here? For those who have already been working on creating composable systems, the arrival of MCP and other agent-centric platforms is nothing new. And for those who want to take advantage of the oncoming wave of AI-driven API consumption, investing in the three pillars of composable systems is a great way to set yourself up for success.

> Engelbart called for systems that augmented human intellect — not replaced it.\
> Alexander showed us how form could emerge from pattern.\
> Fielding reminded us that the web succeeds by **not knowing the future** ahead of time.

That’s the real promise of composability.
Not that it solves everything today — but that it **doesn’t prevent anything tomorrow**. As AI agents become more powerful — trustworthy, autonomous, scalable — they will need platforms that support:

- **Dynamic discovery**
- **Explicit memory**
- **Reversible actions**
- **Minimal contracts**

You already have that in a composable platform.

> “The future is already here — it’s just not evenly distributed.” — [William Gibson](https://en.wikipedia.org/wiki/William_Gibson)

If you’ve built your services with this pattern — or even just started thinking this way; you’re not behind. You’re early.


