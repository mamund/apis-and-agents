// shared-state/index.js

const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const app = express();
const { log } = require('./logger');
const port = process.env.PORT || 4500;
const registryURL = 'http://localhost:4000/register';

app.use(express.json());

// Health check endpoint
app.get('/ping', (req, res) => res.status(200).json({ status: 'ok' }));

// In-memory state store
const stateStore = {}; // id => { id, content, createdAt, lastModified }

// GET /state/:id — read shared state
app.get('/state/:id', (req, res) => {
  const { id } = req.params;
  const entry = stateStore[id];
  if (!entry) return res.status(404).json({ error: 'not found' });
  const state = entry.content;
  log('read-state', { id, result: state });
  res.status(200).json(state);
});

// POST /state/:id — update shared state (merge with existing)
app.post('/state/:id', (req, res) => {
  const { id } = req.params;
  const update = req.body;

  const now = new Date().toISOString();
  if (!stateStore[id]) {
    stateStore[id] = { id, content: {}, createdAt: now, lastModified: now };
  }
  Object.assign(stateStore[id].content, update);
  stateStore[id].lastModified = now;

  log('update-state', { id, update });
  res.status(200).json({ status: 'updated', state: stateStore[id] });
});

// POST /state — create a new shared state doc (optionally with client-supplied id)
app.post('/state', (req, res) => {
  const { id, ...initialState } = req.body || {};
  const stateId = id || uuidv4();

  if (stateStore[stateId]) {
    return res.status(409).json({ error: `State ID '${stateId}' already exists.` });
  }

  const now = new Date().toISOString();
  stateStore[stateId] = {
    id: stateId,
    content: initialState,
    createdAt: now,
    lastModified: now
  };

  log('create-state', { stateId, initialState });
  res.status(201).json({ stateURL: `http://localhost:${port}/state/${stateId}` });
});

// DELETE /state/:id — delete a shared state doc (no error if missing)
app.delete('/state/:id', (req, res) => {
  const { id } = req.params;
  delete stateStore[id];
  log('delete-state', { id });
  res.status(204).send();
});

// GET /forms — describe available endpoints
app.get('/forms', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  res.status(200).json([
    {
      rel: 'create-state',
      method: 'POST',
      href: `${baseUrl}/state`,
      input: '{ id?: string, key: value, ... } (optional)',
      output: '{ stateURL: string }'
    },
    {
      rel: 'read-state',
      method: 'GET',
      href: `${baseUrl}/state/:id`,
      input: 'path param: id',
      output: '{ key: value, ... }'
    },
    {
      rel: 'update-state',
      method: 'POST',
      href: `${baseUrl}/state/:id`,
      input: '{ key: value, ... }',
      output: '{ status: string, state: object }'
    },
    {
      rel: 'patch-state',
      method: 'PATCH',
      href: `${baseUrl}/state/:id`,
      input: '{ op: "add" | "merge", path?: string, value: any }',
      output: '{ status: "patched", state: object }'
    },

    {
      rel: 'delete-state',
      method: 'DELETE',
      href: `${baseUrl}/state/:id`,
      input: 'path param: id',
      output: '204 No Content'
    }
  ]);
});

// PATCH /state/:id — apply { op, path, value } updates (supports "add")
app.patch('/state/:id', (req, res) => {
  const { id } = req.params;
  const { op, path, value } = req.body;

  if (!stateStore[id]) {
    const now = new Date().toISOString();
    stateStore[id] = { id, content: {}, createdAt: now, lastModified: now };
  }

  if (op === 'merge') {
    if (typeof value !== 'object' || value === null) {
      return res.status(400).json({ error: 'Invalid merge value' });
    }
    Object.assign(stateStore[id].content, value);
    stateStore[id].lastModified = new Date().toISOString();
    log('patch-merge', { id, value });
    return res.status(200).json({ status: 'merged', state: stateStore[id] });
  }

  if (op !== 'add') {
    return res.status(400).json({ error: 'Only "add" and "merge" operations are supported' });
  }

  if (!path || typeof path !== 'string' || !path.startsWith('/')) {
    return res.status(400).json({ error: 'Invalid or missing path' });
  }

  const keys = path.split('/').filter(Boolean);
  let target = stateStore[id].content;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in target) || typeof target[key] !== 'object') {
      target[key] = {};
    }
    target = target[key];
  }

  target[keys[keys.length - 1]] = value;

  log('patch-state', { id, op, path, value });
  return res.status(200).json({ status: 'patched', state: stateStore[id] });
});



// GET /state — list all shared state documents with metadata
app.get('/state', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const list = Object.values(stateStore).map(({ id, createdAt, lastModified }) => ({
    id,
    createdAt,
    lastModified,
    rel: 'item',
    href: `${baseUrl}/state/${id}`
  }));
  res.json(list);

});


// GET /state/:id/meta — show metadata only
app.get('/state/:id', (req, res, next) => {
  if (req.query.meta !== undefined) {
    const entry = stateStore[req.params.id];
    if (!entry) return res.status(404).json({ error: 'not found' });
    const { id, createdAt, lastModified } = entry;
    return res.json({ id, createdAt, lastModified });
  }
  next(); // fall through to original /state/:id handler
});
//});


// Service metadata and health
app.get('/', (req, res) => {
  res.json({ name: 'shared-state', version: '1.0.0' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});


app.listen(port, () => {
  log('startup', { port });
  registerService();
});


// Register with DISCO on startup
const registerService = async () => {
  const serviceInfo = {
    serviceName: 'shared-state',
    serviceURL: `http://localhost:${port}`,
    tags: ['state', 'store'],
    semanticProfile: 'urn:example:shared-state',
    mediaTypes: ['application/json'],
    pingUrl: `http://localhost:${port}/ping`
  };

  try {
    const response = await axios.post('http://localhost:4000/register', serviceInfo);
    log('register', { registryID: response.data.registryID });
  } catch (err) {
    log('register-failed', { error: err.message }, 'error');
  }
};
