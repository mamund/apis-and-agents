// service-b/index.js

const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const app = express();
const { log } = require('./logger');
const port = process.env.PORT || 4200;
const registryURL = 'http://localhost:4000/register';

const serviceInfo = {
  serviceName: 'service-b',
  serviceURL: `http://localhost:${port}`,
  tags: ['time', 'timestamp'],
  semanticProfile: 'urn:example:timestamp',
  mediaTypes: ['application/json']
};

app.use(express.json());

// POST /execute
app.post('/execute', (req, res) => {
  const result = new Date().toISOString();
  log("execute", { timestamp: result });
  res.status(200).json({ timestamp: result });
});

// POST /repeat (same result as /execute)
app.post('/repeat', (req, res) => {
  const result = new Date().toISOString();
  log("repeat", { timestamp: result });
  res.status(200).json({ timestamp: result });
});

// POST /revert (noop)
app.post('/revert', (req, res) => {
  log("revert", { status: "noop" });
  res.status(200).json({ status: 'noop' });
});

// GET /forms
app.get('/forms', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  res.json([
    {
      rel: 'execute',
      method: 'POST',
      href: `${baseUrl}/execute`,
      input: [],
      output: '{ timestamp: string }'
    },
    {
      rel: 'repeat',
      method: 'POST',
      href: `${baseUrl}/repeat`,
      input: [],
      output: '{ timestamp: string }'
    },
    {
      rel: 'revert',
      method: 'POST',
      href: `${baseUrl}/revert`,
      input: [],
      output: '{ status: "noop" }'
    }
  ]);
});

// Register with DISCO on startup
const registerService = async () => {
  try {
    const response = await axios.post(registryURL, serviceInfo);
    log("register", { registryID: response.data.registryID });
  } catch (error) {
    log("register-failed", { error: error.message }, "error");
  }
};

app.listen(port, () => {
  log("startup", { port });
  registerService();
});

