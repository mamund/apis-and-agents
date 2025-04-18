# Discovery Service

The **Discovery Service** is a lightweight in-memory registry used by other services in the ecosystem to announce their presence and enable dynamic lookup based on service tags.

It acts as the central index for hypermedia-oriented service orchestration.

---

## 📄 Description

- Registers services at runtime
- Responds to lookup queries using a `tag` system
- Designed for use with other platform services like job-control, shared-state, and engine service
- Ephemeral (in-memory only; no persistent database)

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
  "pingURL": "http://localhost:5000/ping"
}
```

- `pingURL`, `semanticProfile`, and `mediaTypes` are optional but strongly encouraged
- Re-registering with the same `serviceURL` updates the existing entry

#### Response
```json
{
  "registryID": "generated-uuid"
}
```

#### Example with `curl`
```bash
curl -X POST http://localhost:4000/register \
  -H "Content-Type: application/json" \
  -d '{
    "serviceName": "example",
    "serviceURL": "http://localhost:6000",
    "tags": ["example"],
    "pingURL": "http://localhost:6000/ping"
  }'
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

- Matching is based on `serviceURL`
- If the service was not found, the operation is a no-op

---

## 🧪 Health Check

```http
GET /ping
```

Responds with:

```json
{ "status": "ok" }
```

---

## 🧰 Development Notes

- Service registry is in-memory and resets on restart
- Use `pingURL` endpoints to ensure services remain healthy
- Consider re-registering periodically if running in volatile environments