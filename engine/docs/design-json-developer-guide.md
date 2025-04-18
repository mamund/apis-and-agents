# Composable Service `design.json` Developer Guide

This guide is for developers who want to **create services** that follow the composable contract and can be orchestrated via job-control.

## Overview

Each service declares its interface in a `design.json` file:
- Describes available commands
- Defines expected input/output
- Enables hypermedia discovery

## Required Endpoints

Each composable service must support:
- `POST /execute`
- `POST /repeat`
- `POST /revert`
- `GET /forms`

## design.json Structure

```json
{
  "serviceInfo": {
    "name": "my-service",
    "description": "Performs operations on data."
  },
  "commands": {
    "doSomething": {
      "description": "Performs an action",
      "transitionType": { "method": "POST" },
      "input": { "type": "object", "properties": { ... } },
      "output": { "type": "object", "properties": { ... } },
      "errors": { "type": "object", "properties": { ... } }
    }
  }
}
```

## Key Fields

- `commands.<name>` — maps to a supported action
- `transitionType.method` — POST, GET, etc. (defaults to POST if omitted)
- `input/output` — JSON Schema definitions
- `errors` — optional error schema
- `description` — optional but encouraged

## Hypermedia Support

Each service should expose a `/forms` endpoint:
- Generated from `design.json`
- Allows runtime discovery of:
  - Available commands
  - Method, href, input/output structure

## Best Practices

- Use consistent naming (`create`, `update`, `delete`)
- Include `serviceInfo.name` for registration
- Document each command with `description`
- Make forms self-descriptive for agents and humans

---

## Next Steps

Later versions will support:
- Pre/Post command hooks
- Dynamic storage providers
- Custom command handlers (from local functions)