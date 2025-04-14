# Discovery Service

The **Discovery Service** is a lightweight in-memory registry used by other services in the ecosystem to announce their presence and enable dynamic lookup based on service tags.

It acts as the central index for hypermedia-oriented service orchestration.

---

## 📄 Description

- Registers services at runtime
- Responds to lookup queries using a `tag` system
- Designed for use with the job-control and shared-state services
- Ephemeral (no database — memory only)

---

## 🚀 How to Run

```bash
PORT=4000 node index.js
```

- Default port: `4000`
- No configuration required

---

## 🔗 Endpoints

### `POST /register`
Registers a service.

#### Request Body
```json
{
  "serviceName": "todo-service",
  "serviceURL": "http://localhost:5000",
  "tags": ["todo", "task"],
  "semanticProfile": "urn:example:todo",
  "mediaTypes": ["application/json"],
  "pingUrl": "http://localhost:5000/ping"
}
```

#### Response
```json
{
  "registryID": "generated-uuid"
}
```

---

### `GET /find?tag=todo`
Finds services registered under a given tag.

#### Response
```json
[
  {
    "serviceName": "todo-service",
    "serviceURL": "http://localhost:5000",
    "tags": ["todo", "task"]
  }
]
```

---
---

### `POST /unregister`
Removes a previously registered service from the registry.

#### Request Body
```json
{
  "serviceURL": "http://localhost:5000"
}
```

#### Response
```json
{
  "status": "unregistered"
}
```

- Matching is typically based on `serviceURL`
- If the service was not found, the operation is a no-op


## 🧪 Health Check

```http
GET /ping
```
Responds with `{ "status": "ok" }`

---

## 🧰 Development Notes

- Service registry is in-memory and resets on restart
- Use `/ping` endpoints to ensure services are alive before registering
- 
