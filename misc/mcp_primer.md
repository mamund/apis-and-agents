# 🧠 MCP: A Quick Primer for Wrapping APIs for Agentic Use

## 🧩 What is MCP?

**MCP (Message-Centric Protocol)** is a way to help **AI agents** collaborate by exchanging **structured messages** — instead of hardcoding workflows or relying on static APIs.

It acts as a **coordination and message-passing layer** for agent ecosystems.

> Think of MCP as a universal adapter format: all actions happen via self-describing, typed messages.

---

## 🔧 What is an MCP Wrapper?

An **MCP wrapper** is a lightweight adapter that:
- Accepts **MCP-style messages** (JSON-based)
- Translates them into **real-world API calls**
- Returns structured responses, optionally with **affordances**

This lets agents "talk to" systems that weren’t built for them — safely and flexibly.

---

## 🧱 Message Format (JSON-RPC 2.0 Roots)

MCP often borrows from **JSON-RPC 2.0** as a baseline:

```json
{
  "from": "agent://planner-bot",
  "to": "mcp://todo-wrapper",
  "type": "command",
  "action": "create-task",
  "input": {
    "title": "Buy milk"
  },
  "trace": {
    "jobId": "job-1234",
    "step": "1"
  }
}
```

And the response:

```json
{
  "status": "success",
  "result": {
    "id": "abc123",
    "title": "Buy milk"
  },
  "affordances": [
    {
      "action": "update-task",
      "href": "mcp://todo-wrapper/tasks/abc123",
      "transitionType": "idempotent"
    }
  ]
}
```

---

## 🏗️ How MCP Wrappers Are Built

1. **Start with an existing system** (API, database, CLI, etc.)
2. **Build a wrapper** that:
   - Accepts structured MCP messages
   - Calls the real system
   - Returns a structured response (with status, result, affordances)
3. **Optional**: Publish to an **MCP registry** so others can discover and use it.

---

## 🔍 How Agents Use MCP

LLMs (or agentic runtimes) use MCP like a **machine-native browser + task planner**:

1. **Plan**: Decide which action or tool to invoke
2. **Compose**: Build a valid MCP message
3. **Execute**: Send the message
4. **Interpret**: Read result + possible follow-up actions (affordances)
5. **Adapt**: Retry, change plans, or proceed based on response

MCP gives LLMs structured guidance so they don’t have to hallucinate tool behavior or parse unstructured output.

---

## 🚫 Current Gaps

- No formal **MCP message schema** (yet)
- No standardized **affordance model** (ALPS is a good fit)
- No common **MCP service registry** (manual and ad hoc today)

---

## ✅ TL;DR

- MCP is a **message-first adapter pattern** for enabling AI agents to safely and flexibly invoke real-world systems.
- Developers create **wrappers** that expose structured messages for existing APIs or tools.
- LLMs use MCP to **discover, plan, and execute** actions like a browser navigating the Web — but for machines.
