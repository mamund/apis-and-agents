# 🩺 Manual Ping Support Snippets for Node.js Services

This doc provides **cut-and-paste-ready** snippets to enable passive health checks via `/ping` in your services. Each service that registers with the Discovery module should include these.

---

## ✅ 1. Add `GET /ping` Endpoint

Place this near your other route definitions (before `app.listen`):

```js
// GET /ping
app.get('/ping', (req, res) => {
  res.status(200).json({ status: 'ok' });
});
```

📝 **Note:** This is what the Discovery service will call every 30 seconds to check if the service is healthy.

---

## ✅ 2. Add `pingURL` to Your `serviceInfo`

In your service registration object (often called `serviceInfo`), add:

```js
pingURL: `http://localhost:${port}/ping`
```

The full object might look like:

```js
const serviceInfo = {
  serviceName: 'service-a',
  serviceURL: `http://localhost:${port}`,
  tags: ['text', 'uppercase'],
  semanticProfile: 'urn:example:uppercase',
  mediaTypes: ['application/json'],
  pingURL: `http://localhost:${port}/ping`
};
```

---

## ✅ 3. Add Ping to `/forms` Endpoint (Optional, but Helpful)

If your service exposes a `GET /forms`, include the ping entry:

```js
{
  rel: 'ping',
  method: 'GET',
  href: `${baseUrl}/ping`,
  input: [],
  output: '{ status: "ok" }'
}
```

📌 **Reminder:** The `baseUrl` is usually something like:

```js
const baseUrl = \`\${req.protocol}://\${req.get('host')}\`;
```

---

## 💡 Final Tip

These three additions are lightweight and do **not require any shared modules** or dependencies. Just copy/paste them into each service and you’re good to go!

