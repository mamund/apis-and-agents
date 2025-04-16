// service-b/index.js

const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const app = express();
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
  res.status(200).json({ timestamp: result });
  console.log(result);
});

// POST /repeat (same result as /execute)
app.post('/repeat', (req, res) => {
  const result = new Date().toISOString();
  res.status(200).json({ timestamp: result });
});

// POST /revert (noop)
app.post('/revert', (req, res) => {
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
    console.log(`Registered as ${response.data.registryID}`);
  } catch (error) {
    console.error('Service registration failed:', error.message);
  }
};

app.listen(port, () => {
  console.log(`Service B running on port ${port}`);
  registerService();
});

