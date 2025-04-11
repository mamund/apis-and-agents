# DISCO-Compliant Service Guide

## 🧭 What is DISCO?

DISCO (Discovery Service) enables dynamic registration, lookup, and orchestration of composable services. Services that wish to participate in a composable ecosystem must register themselves with the DISCO registry using a simple, consistent schema.

---

## ✅ Minimum Requirements for DISCO Compliance

### 1. Register on Startup

Each service must send a POST request to the discovery registry at:

```
POST http://localhost:4000/register
```

### 2. Required Registration Payload

```json
{
  "serviceName": "todo-service",
  "serviceURL": "http://localhost:4001",
  "tags": ["todo", "create", "read", "update", "delete", "filter"],
  "semanticProfile": "urn:example:todo",
  "mediaTypes": ["application/json"]
}
```

### 3. Field Descriptions

| Field             | Required | Description |
|------------------|----------|-------------|
| `serviceName`     | ✅       | Unique identifier for the service |
| `serviceURL`      | ✅       | The base URL of the service |
| `tags`            | ✅       | Keywords or supported command verbs |
| `semanticProfile` | ✅       | A URI/URN describing the affordance model or domain |
| `mediaTypes`      | ✅       | List of supported content types (e.g., `application/json`) |

---

## 🔄 Registration Behavior

- Services must register themselves at startup.
- If DISCO is temporarily unavailable, services should retry after a delay.
- Each registration should be idempotent (same service should not create duplicates).

---

## ✅ Example: Node.js Self-Registration Code

```js
const registryURL = 'http://localhost:4000/register';

const serviceInfo = {
  serviceName: 'todo-service',
  serviceURL: `http://localhost:4001`,
  tags: ['todo', 'create', 'read', 'update', 'delete', 'filter'],
  semanticProfile: 'urn:example:todo',
  mediaTypes: ['application/json']
};

const registerService = async () => {
  try {
    const response = await axios.post(registryURL, serviceInfo);
    console.log(`Registered as ${response.data.registryID}`);
  } catch (error) {
    console.error('Service registration failed:', error.message);
  }
};
```

---

## 🧪 Testing Registration

You can verify registration by checking console logs of both the service and the discovery service. DISCO will return a `registryID` on successful registration.

---

## 🧩 Future Enhancements

In later phases, DISCO-compliant services may support:
- `/forms` for introspection
- Health check URLs
- Deregistration on shutdown
- Semantic profile negotiation
