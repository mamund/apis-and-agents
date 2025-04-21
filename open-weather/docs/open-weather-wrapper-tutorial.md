# OpenWeather Wrapper: Converting a Third-Party API into a Composable Service

## Purpose

This document walks through the process of converting a third-party API — in this case, the OpenWeather API — into a fully functional **composable service** that can participate in a declarative, job-controlled platform. This service will:

- Act like any native composable service (exposing `/execute`, `/repeat`, `/revert`, `/forms`, `/ping`)
- Proxy requests to the real OpenWeather API
- Normalize results into a job-control-friendly structure
- Register itself with the discovery service

---

## Overview of the Wrapper Architecture

```
+--------------------------+
|   Composable Wrapper     |
|--------------------------|
|  /execute                | --> calls OpenWeather API
|  /repeat                 | --> replays last call
|  /revert                 | --> no-op
|  /forms                  | --> serves design.json
|  /ping                   | --> health check
+--------------------------+
         |
         v
  [OpenWeather Public API]
```

---

## Project Layout

```
open-weather-wrapper/
├── index.js               # Main Express server
├── design.json            # Composable command metadata
├── weather-adapter.js     # Logic for calling OpenWeather API
├── register.js            # Auto-registration with discovery
├── .env                   # Stores OpenWeather API key
├── package.json
└── README.md
```

---

## Step-by-Step Implementation Guide

### Step 1: Setup the Project

```bash
mkdir open-weather-wrapper && cd open-weather-wrapper
npm init -y
npm install express axios dotenv
```

Create a `.env` file to store your API key:
```env
OPENWEATHER_API_KEY=your_api_key_here
```

---

### Step 2: Create `design.json`

This file defines the available composable commands and must comply with the platform's `design.schema.json`.

```json
{
  "title": "OpenWeather Wrapper",
  "version": "1.0.0",
  "description": "Composable wrapper for querying current weather from the OpenWeather API",
  "serviceInfo": {
    "serviceName": "openweather",
    "description": "Provides weather data via the OpenWeather API",
    "tags": ["weather", "proxy", "external"],
    "mediaTypes": ["application/json"]
  },
  "resourceType": "weather",
  "resourceSchema": {
    "weather": {
      "temperature": { "type": "number" },
      "conditions": { "type": "string" }
    }
  },
  "authorization": {
    "roles": []
  },
  "commands": {
    "getWeather": {
      "description": "Gets current weather by city",
      "transitionType": {
        "safe": true,
        "idempotent": true,
        "reversible": false
      },
      "inputs": {
        "required": ["city"],
        "optional": ["units"],
        "defaults": { "units": "metric" }
      },
      "output": {
        "type": "weather",
        "returns": "object"
      },
      "errors": [],
      "authorization": {
        "roles": []
      }
    }
  }
}
```

---

### Step 3: Create `weather-adapter.js`

This file maps composable `args` to an OpenWeather API call.

```js
require('dotenv').config();
const axios = require('axios');

let lastCall = null;

async function getWeather(args) {
  const { city, units = 'metric' } = args;
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;

  const res = await axios.get(url);
  const data = res.data;

  const result = {
    temperature: data.main.temp,
    conditions: data.weather[0].main
  };

  lastCall = { args, result };
  return result;
}

function repeatLast() {
  if (!lastCall) throw new Error('No previous call to repeat');
  return lastCall.result;
}

function revert() {
  // OpenWeather is read-only; revert is a no-op
  return { message: 'Nothing to revert' };
}

module.exports = { getWeather, repeatLast, revert };
```

---

### Step 4: Create `index.js`

This file sets up the composable interface.

```js
const express = require('express');
const fs = require('fs');
const { getWeather, repeatLast, revert } = require('./weather-adapter');
const { registerWithDiscovery } = require('./register');

const app = express();
app.use(express.json());

const design = JSON.parse(fs.readFileSync('./design.json', 'utf-8'));

// GET /ping – required by discovery service
app.get('/ping', (req, res) => res.json({ ok: true }));

app.get('/forms', (req, res) => res.json(design));

app.post('/execute', async (req, res) => {
  const { name, args } = req.body;
  if (name !== 'getWeather') return res.status(400).json({ error: 'Unsupported command' });

  try {
    const result = await getWeather(args);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/repeat', (req, res) => {
  try {
    const result = repeatLast();
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/revert', (req, res) => {
  const result = revert();
  res.json(result);
});

const PORT = process.env.PORT || 4602;
app.listen(PORT, () => {
  console.log(`OpenWeather wrapper listening on port ${PORT}`);
  registerWithDiscovery(PORT, design);
});
```

---

### Step 5: Add `register.js` and Integrate Service Registration

```js
const axios = require('axios');

async function registerWithDiscovery(PORT, design) {
  try {
    const registryURL = 'http://localhost:4600/register';

    const serviceInfo = {
      serviceName: design.serviceInfo.serviceName || 'openweather',
      serviceURL: `http://localhost:${PORT}`,
      tags: design.serviceInfo.tags || [],
      semanticProfile: design.serviceInfo.semanticProfile || 'urn:example:weather',
      mediaTypes: design.serviceInfo.mediaTypes || ['application/json'],
      pingURL: `http://localhost:${PORT}/ping`
    };

    const response = await axios.post(registryURL, serviceInfo);
    console.log('[register] Registered service:', response.data);
  } catch (err) {
    console.error('[register] Registration failed:', err.message);
  }
}

module.exports = { registerWithDiscovery };
```

---

## Testing

Use the job-runner CLI or a manual `curl` call to test:

```bash
curl -X POST http://localhost:4602/execute   -H 'Content-Type: application/json'   -d '{"name": "getWeather", "args": { "city": "London" }}'
```

Expect a result like:

```json
{
  "temperature": 13.5,
  "conditions": "Clouds"
}
```

---

## Notes

- This wrapper demonstrates how *any API* can be adapted into the composable ecosystem.
- This pattern is reusable: weather, news, finance, chat, etc.
- You can later generate `design.json` from OpenAPI specs to automate wrapper creation.

---

## Next Steps

- Extend to support hourly/forecast endpoints.
- Add richer argument validation.
- Wrap more APIs using this pattern (e.g., GitHub, Stripe).
- Create a wrapper generator tool.

---
