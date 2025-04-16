// service-d/index.js

const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const app = express();
const { log } = require('./logger');
const port = process.env.PORT || 4600;
const registryURL = 'http://localhost:4000/register';

const serviceInfo = {
  serviceName: 'service-d',
  serviceURL: `http://localhost:${port}`,
  tags: ['revertible', 'state'],
  semanticProfile: 'urn:example:revertible-op',
  mediaTypes: ['application/json'],
  pingURL: `http://localhost:${port}/ping`
};

app.use(express.json());

// In-memory operation history
const operationHistory = {}; // keyed by requestId

// POST /execute
app.post('/execute', async (req, res) => {
  const { stateURL, key, newValue, requestId } = req.body;
  if (!stateURL || !key || newValue === undefined || !requestId) {
    return res.status(400).json({ error: 'stateURL, key, newValue, and requestId are required' });
  }

  try {
    const response = await axios.get(stateURL);
    const previousValue = response.data[key];

    // Save revert info
    operationHistory[requestId] = {
      stateURL,
      key,
      previousValue
    };

    // Apply update
    await axios.post(stateURL, { [key]: newValue });
    log('execute', { stateURL, key, newValue, requestId, previousValue });
    res.status(200).json({ status: 'updated', newValue, previousValue });
  } catch (error) {
    log('execute-failed', { stateURL, key, requestId, error: error.message }, 'error');
    res.status(500).json({ error: 'Failed to execute update', details: error.message });
  }
});

// POST /repeat (noop)
app.post('/repeat', (req, res) => {
  log('repeat', { status: 'noop-repeat' });
  res.status(200).json({ status: 'noop-repeat' });
});

// POST /revert
app.post('/revert', async (req, res) => {
  const { requestId } = req.body;
  const history = operationHistory[requestId];

  if (!history) {
    return res.status(404).json({ error: 'No history found for requestId' });
  }

  try {
    await axios.post(history.stateURL, { [history.key]: history.previousValue });
    delete operationHistory[requestId];
    log('revert', { requestId, key: history.key, restoredValue: history.previousValue });
  res.status(200).json({ status: 'reverted', key: history.key, restoredValue: history.previousValue });
  } catch (error) {
    res.status(500).json({ error: 'Failed to revert update', details: error.message });
  }
});

// GET /ping
app.get('/ping', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// GET /forms
app.get('/forms', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  res.status(200).json([
    {
      rel: 'execute',
      method: 'POST',
      href: `${baseUrl}/execute`,
      input: ['stateURL', 'key', 'newValue', 'requestId'],
      output: '{ status, newValue, previousValue }'
    },
    {
      rel: 'repeat',
      method: 'POST',
      href: `${baseUrl}/repeat`,
      input: [],
      output: '{ status: "noop-repeat" }'
    },
    {
      rel: 'revert',
      method: 'POST',
      href: `${baseUrl}/revert`,
      input: ['requestId'],
      output: '{ status, key, restoredValue }'
    },
    {
      rel: 'ping',
      method: 'GET',
      href: `${baseUrl}/ping`,
      input: [],
      output: '{ status: "ok" }'
    }
  ]);
});

// Register service on startup
const registerService = async () => {
  try {
    const response = await axios.post(registryURL, serviceInfo);
    log('register', { registryID: response.data.registryID });
  } catch (error) {
    log('register-failed', { error: error.message }, 'error');
  }
};

app.listen(port, () => {
  log('startup', { port });
  registerService();
});

