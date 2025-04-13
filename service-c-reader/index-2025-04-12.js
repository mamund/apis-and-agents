// service-c-reader/index.js

const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = process.env.PORT || 4400;
const registryURL = 'http://localhost:4000/register';

const serviceInfo = {
  serviceName: 'service-c-reader',
  serviceURL: `http://localhost:${port}`,
  tags: ['state', 'read'],
  semanticProfile: 'urn:example:state-read',
  mediaTypes: ['application/json']
};

app.use(express.json());

// POST /execute
app.post('/execute', async (req, res) => {
  const { stateURL, key } = req.body;
  if (!stateURL || !key) {
    return res.status(400).json({ error: 'stateURL and key are required' });
  }

  try {
    const response = await axios.get(stateURL);
    const value = response.data[key];
    res.status(200).json({ value });
  } catch (error) {
    res.status(500).json({ error: 'Failed to read state', details: error.message });
  }
});

// POST /repeat
app.post('/repeat', (req, res) => {
  res.status(200).json({ status: 'noop-repeat' });
});

// POST /revert
app.post('/revert', (req, res) => {
  res.status(200).json({ status: 'noop-revert' });
});

// GET /forms
app.get('/forms', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  res.json([
    {
      rel: 'execute',
      method: 'POST',
      href: `${baseUrl}/execute`,
      input: ['stateURL', 'key'],
      output: '{ value: any }'
    }
  ]);
});

const registerService = async () => {
  try {
    const response = await axios.post(registryURL, serviceInfo);
    console.log(`Registered as ${response.data.registryID}`);
  } catch (error) {
    console.error('Service registration failed:', error.message);
  }
};

app.listen(port, () => {
  console.log(`Service C Reader running on port ${port}`);
  registerService();
});

