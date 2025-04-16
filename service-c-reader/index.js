// service-c-reader/index.js

const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const app = express();
const { log } = require('./logger');
const port = process.env.PORT || 4400;
const registryURL = 'http://localhost:4000/register';

const serviceInfo = {
  serviceName: 'service-c-reader',
  serviceURL: `http://localhost:${port}`,
  tags: ['state', 'read'],
  semanticProfile: 'urn:example:state-read',
  mediaTypes: ['application/json'],
  pingURL: `http://localhost:${port}/ping`  
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
    log('execute', { stateURL, key, value });
    res.status(200).json({ value });
  } catch (error) {
    log('execute-failed', { stateURL, key, error: error.message }, 'error');
    res.status(500).json({ error: 'Failed to read state', details: error.message });
  }
});

// POST /repeat
app.post('/repeat', (req, res) => {
  log('repeat', { status: 'noop-repeat' });
  res.status(200).json({ status: 'noop-repeat' });
});

// POST /revert
app.post('/revert', (req, res) => {
  log('revert', { status: 'noop-revert' });
  res.status(200).json({ status: 'noop-revert' });
});

app.get('/ping', (req, res) => {
  res.status(200).json({ status: 'ok' });
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

