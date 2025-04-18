// discovery/index.js (with logging)

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const { log } = require('./logger');  // <- Added logger import
// === Configurable Values (easy to externalize later) ===
const config = {
  pingIntervalMs: 30000,      // 30 seconds between checks
  pingMaxFailures: 3,         // evict after 3 consecutive failures
  pingTimeoutMs: 5000         // 5 second timeout per ping
};

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

// In-memory registry and bindings
const pingFailures = {};
const registry = {};
const bindings = {};

// POST /register
app.post('/register', (req, res) => {
  const { serviceName, serviceURL, tags = [], semanticProfile = '', mediaTypes = [], pingURL = '' } = req.body;
  if (!serviceName || !serviceURL) {
    log('register-failed', { reason: 'missing fields', input: req.body }, 'warn');
    return res.status(400).json({ error: 'serviceName and serviceURL are required' });
  }

  const registryID = uuidv4();
  registry[registryID] = {
    registryID,
    serviceName,
    serviceURL,
    tags,
    semanticProfile,
    mediaTypes,
    pingURL,
    lastRenewed: new Date().toISOString()
  };

  log('register', { registryID, serviceName, serviceURL });
  res.status(201).location(`/services/${registryID}`).json({ registryID });
});

// POST /renew
app.post('/renew', (req, res) => {
  const { registryID } = req.body;
  if (!registryID || !registry[registryID]) {
    log('renew-failed', { registryID }, 'warn');
    return res.status(404).json({ error: 'Service not found in registry' });
  }
  registry[registryID].lastRenewed = new Date().toISOString();
  log('renew', { registryID });
  res.status(200).json({ status: 'renewed' });
});

// POST /unregister
app.post('/unregister', (req, res) => {
  const { registryID } = req.body;
  if (!registryID || !registry[registryID]) {
    log('unregister-failed', { registryID }, 'warn');
    return res.status(404).json({ error: 'Service not found in registry' });
  }
  delete registry[registryID];
  delete pingFailures[registryID];

  // Remove any bindings involving this service
  Object.keys(bindings).forEach(bindingID => {
    const binding = bindings[bindingID];
    if (binding.sourceRegistryID === registryID || binding.targetRegistryID === registryID) {
      delete bindings[bindingID];
      log('unbind-auto', { bindingID });
    }
  });

  log('unregister', { registryID });
  res.status(204).send();
});

// GET /find
app.get('/find', (req, res) => {
  const { tag, profile, mediaType } = req.query;
  const matches = Object.values(registry).filter(service => {
    const tagMatch = !tag || service.tags.includes(tag);
    const profileMatch = !profile || service.semanticProfile.includes(profile);
    const mediaMatch = !mediaType || service.mediaTypes.includes(mediaType);
    return tagMatch && profileMatch && mediaMatch;
  });
  log('find', { filters: req.query, matches: matches.length });
  res.status(200).json(matches);
});

// POST /bind
app.post('/bind', (req, res) => {
  const { sourceRegistryID, targetRegistryID } = req.body;
  if (!registry[sourceRegistryID] || !registry[targetRegistryID]) {
    log('bind-failed', { sourceRegistryID, targetRegistryID }, 'warn');
    return res.status(404).json({ error: 'Source or target service not found' });
  }

  const bindingID = uuidv4();
  bindings[bindingID] = {
    bindingID,
    sourceRegistryID,
    targetRegistryID,
    createdAt: new Date().toISOString()
  };

  log('bind', { bindingID, sourceRegistryID, targetRegistryID });
  res.status(201).location(`/bindings/${bindingID}`).json({ bindingID });
});

// POST /unbind
app.post('/unbind', (req, res) => {
  const { bindingID } = req.body;
  if (!bindings[bindingID]) {
    log('unbind-failed', { bindingID }, 'warn');
    return res.status(404).json({ error: 'Binding not found' });
  }
  delete bindings[bindingID];
  log('unbind', { bindingID });
  res.status(204).send();
});

// GET /endpoints
app.get('/endpoints', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  res.status(200).json([
    {
      method: 'POST',
      url: `${baseUrl}/register`,
      input: ['serviceName', 'serviceURL', 'tags?', 'semanticProfile?', 'mediaTypes?'],
      output: '{ registryID }'
    },
    {
      method: 'POST',
      url: `${baseUrl}/renew`,
      input: ['registryID'],
      output: "{ status: 'renewed' }"
    },
    {
      method: 'POST',
      url: `${baseUrl}/unregister`,
      input: ['registryID'],
      output: '204 No Content'
    },
    {
      method: 'GET',
      url: `${baseUrl}/find`,
      input: ['tag?', 'profile?', 'mediaType?'],
      output: '[ ...serviceEntries ]'
    },
    {
      method: 'POST',
      url: `${baseUrl}/bind`,
      input: ['sourceRegistryID', 'targetRegistryID'],
      output: '{ bindingID }'
    },
    {
      method: 'POST',
      url: `${baseUrl}/unbind`,
      input: ['bindingID'],
      output: '204 No Content'
    }
  ]);
});

app.listen(port, () => {
  log('startup', { port });
});


setInterval(async () => {
  const entries = Object.entries(registry);
  for (const [registryID, service] of entries) {
    if (!service.pingURL) continue;

    try {
      const response = await axios.get(service.pingURL, { timeout: config.pingTimeoutMs });
      if (response.status === 200) {
        pingFailures[registryID] = 0;
        log('ping-ok', { registryID, pingURL: service.pingURL });
      } else {
        throw new Error(`Non-200 status: ${response.status}`);
      }
    } catch (err) {
      pingFailures[registryID] = (pingFailures[registryID] || 0) + 1;
      log('ping-failed', { registryID, attempt: pingFailures[registryID], error: err.message }, 'warn');

      if (pingFailures[registryID] >= config.pingMaxFailures) {
        log('evict', { registryID, reason: '3 consecutive ping failures' }, 'error');
        delete registry[registryID];
        delete pingFailures[registryID];

        Object.keys(bindings).forEach(bindingID => {
          const binding = bindings[bindingID];
          if (binding.sourceRegistryID === registryID || binding.targetRegistryID === registryID) {
            delete bindings[bindingID];
            log('unbind-auto', { bindingID });
          }
        });
      }
    }
  }
}, config.pingIntervalMs);
