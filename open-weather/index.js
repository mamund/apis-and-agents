const express = require('express');
const fs = require('fs');
const path = require('path');
const { log } = require('./logger');
const { getWeather, repeatLast, revert } = require('./weather-adapter');
const { registerWithDiscovery } = require('./register');

const PORT = process.env.PORT || 4602;
const app = express();
app.use(express.json());

const designPath = path.join(__dirname, 'design.json');
const design = JSON.parse(fs.readFileSync(designPath, 'utf-8'));

const BASE_URL = `http://localhost:${PORT}`;

app.get('/ping', (req, res) => {
  res.status(200).json({ status: 'OK', service: design.serviceInfo.serviceName });
});

app.get('/design', (req, res) => res.json(design));

app.get('/forms', (req, res) => {
  res.json([
    {
      rel: 'execute',
      method: 'POST',
      href: `${BASE_URL}/execute`,
      input: ['command', 'resource', 'id', 'payload', 'metadata'],
      output: '{ result: object | error: object }'
    },
    {
      rel: 'repeat',
      method: 'POST',
      href: `${BASE_URL}/repeat`,
      input: ['command', 'resource', 'id', 'payload', 'metadata'],
      output: '{ result: object | error: object }'
    },
    {
      rel: 'revert',
      method: 'POST',
      href: `${BASE_URL}/revert`,
      input: ['command', 'resource', 'id'],
      output: '{ status: "noop" | reverted: true }'
    },
    {
      rel: 'ping',
      method: 'GET',
      href: `${BASE_URL}/ping`,
      input: [],
      output: '{ status: "ok" }'
    },
    {
      rel: 'design',
      method: 'GET',
      href: `${BASE_URL}/design`,
      input: [],
      output: '{ full: design.json }'
    }
  ]);
});

app.post('/execute', async (req, res) => {
  const { name, args } = req.body;
  if (name !== 'getWeather') return res.status(400).json({ error: 'Unsupported command' });

  try {
    const result = await getWeather(args);
    log('execute-success', { name, args, result });
    res.json(result);
  } catch (err) {
    log('execute-error', { error: err.message }, 'error');
    res.status(500).json({ error: err.message });
  }
});

app.post('/repeat', (req, res) => {
  try {
    const result = repeatLast();
    log('repeat-success', { result });
    res.json(result);
  } catch (err) {
    log('repeat-error', { error: err.message }, 'error');
    res.status(400).json({ error: err.message });
  }
});

app.post('/revert', (req, res) => {
  const result = revert();
  log('revert-complete', { result });
  res.json(result);
});

app.listen(PORT, () => {
  log('startup', { service: 'openweather', port: PORT });
  registerWithDiscovery(PORT, design);
});
