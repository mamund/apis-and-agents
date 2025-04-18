# Composable Service `design.json` – Contributor Guide

This guide is for developers who want to **extend or contribute** to the core service engine that consumes `design.json` files to generate composable services.

## Purpose of `design.json`

The `design.json` file serves as a declarative contract between the service engine and the outside world. It enables:
- Dynamic service generation
- Command dispatching based on metadata
- Hypermedia exposure via `/forms`

---

## How the Engine Uses `design.json`

1. Loads the file at startup
2. Parses `serviceInfo` for registry metadata
3. Parses `commands` to:
   - Route requests to handlers
   - Validate input/output
   - Generate hypermedia forms

---

## Key Areas for Contributors

### 1. Command Routing

The engine uses the command name to:
- Route to a built-in default handler
- OR, look for a custom handler in a local folder (e.g., `commands/myCommand.js`)

To extend this:
- Update the dispatcher logic to support more resolution strategies
- Add support for fallback or templated commands

---

### 2. Validation

Input and output schemas are defined per command using JSON Schema:
- Input validation occurs before execution
- Output schema is advisory but may be enforced later
- Consider plugging in a library like AJV for full validation support

---

### 3. Forms Generation

The `/forms` endpoint should dynamically reflect:
- All available commands
- Their method (`transitionType`)
- Expected input/output
- Rel value (usually command name or a logical label)

If modifying this logic:
- Ensure backward compatibility with clients consuming forms
- Optionally, support ALPS or HAL-style discovery in the future

---

## Future Contributor Opportunities

- Add support for pre/post command hooks (via middleware)
- Plug in alternative storage providers (Redis, Mongo, etc.)
- Improve error handling using the `errors` schema block
- Support conditional forms or affordance negotiation

---

## Example: Custom Command Handler Structure

```
/commands/
  myCommand.js
```

Each file should export:
```js
module.exports = async function(context) {
  // context.input, context.storage, context.serviceInfo, etc.
  return { status: 'ok', result: ... };
};
```

---

## Testing Tips

- Validate your `design.json` against a schema
- Start the engine with debug logging to see parsed commands
- Use curl or Postman to test `/execute` and `/forms`