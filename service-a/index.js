// service-a/index.js

const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const app = express();
const { log } = require('./logger');
const port = process.env.PORT || 4100;
const registryURL = 'http://localhost:4000/register';

const serviceInfo = {
  serviceName: 'service-a',
  serviceURL: `http://localhost:${port}`,
  tags: ['text', 'uppercase'],
  semanticProfile: 'urn:example:uppercase',
  mediaTypes: ['application/json'],
  pingURL: `http://localhost:${port}/ping`
};

app.use(express.json());

// POST /execute
app.post('/execute', (req, res) => {
  const { input } = req.body;
  
  log( "body", {body:req.body}, "info");
  log("input", {input:input},"info");
  
  
  if (!input || typeof input !== 'string') {
    return res.status(400).json({ error: 'Input must be a string' });
  }
  const result = input.toUpperCase();
  log("execute", { input, result });
  res.status(200).json({ result });
});

// POST /repeat (same as execute)
app.post('/repeat', (req, res) => {
  const { input } = req.body;
  const result = input ? input.toUpperCase() : '';
  log("repeat", { input, result });
  res.status(200).json({ result });
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
      rel: 'ping',
      method: 'GET',
      href: `${baseUrl}/ping`,
      input: [],
      output: '{ status: "ok" }'
    },
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
    log("register", { registryID: response.data.registryID });
  } catch (error) {
    log("register-failed", { error: error.message }, "error");
  }
};


// GET /ping
app.get('/ping', (req, res) => {
  log("ping", {status:'ok'},"info");
  res.status(200).json({ status: 'ok' });
});

app.listen(port, () => {
  log("startup", { port });
  registerService();
});

