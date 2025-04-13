// service-a/index.js

const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = process.env.PORT || 4100;
const registryURL = 'http://localhost:4000/register';

const serviceInfo = {
  serviceName: 'service-a',
  serviceURL: `http://localhost:${port}`,
  tags: ['text', 'uppercase'],
  semanticProfile: 'urn:example:uppercase',
  mediaTypes: ['application/json']
};

app.use(express.json());

// POST /execute
app.post('/execute', (req, res) => {
  const { input } = req.body;
  if (!input || typeof input !== 'string') {
    return res.status(400).json({ error: 'Input must be a string' });
  }
  const result = input.toUpperCase();
  res.status(200).json({ result });
  console.log(result);
});

// POST /repeat (same as execute)
app.post('/repeat', (req, res) => {
  const { input } = req.body;
  const result = input ? input.toUpperCase() : '';
  res.status(200).json({ result });
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
      input: ['input (string)'],
      output: '{ result: string }'
    },
    {
      rel: 'repeat',
      method: 'POST',
      href: `${baseUrl}/repeat`,
      input: ['input (string)'],
      output: '{ result: string }'
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
  console.log(`Service A running on port ${port}`);
  registerService();
});

