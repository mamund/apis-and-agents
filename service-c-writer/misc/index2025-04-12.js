// service-c-writer/index.js

const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = process.env.PORT || 4300;
const registryURL = 'http://localhost:4000/register';

const serviceInfo = {
  serviceName: 'service-c-writer',
  serviceURL: `http://localhost:${port}`,
  tags: ['state', 'write'],
  semanticProfile: 'urn:example:state-write',
  mediaTypes: ['application/json']
};

app.use(express.json());

// POST /execute
app.post('/execute', async (req, res) => {
  const { stateURL, newKey, newValue } = req.body;
  if (!stateURL || !newKey || newValue === undefined) {
    return res.status(400).json({ error: 'stateURL, newKey, and newValue are required' });
  }

  try {
    const update = { [newKey]: newValue };
    await axios.post(stateURL, update);
    res.status(200).json({ status: 'state updated', update });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update state', details: error.message });
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
      input: ['stateURL', 'newKey', 'newValue'],
      output: '{ status: string, update: object }'
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
  console.log(`Service C Writer running on port ${port}`);
  registerService();
});

