// composable-service/index.js

const express = require('express');
const fs = require('fs');
const path = require('path');
const { log } = require('./utils/logger');

// Load design document
const designPath = path.join(__dirname, 'design.json');
let designDoc = {};
try {
  const rawData = fs.readFileSync(designPath);
  designDoc = JSON.parse(rawData);
  log('design-loaded', { title: designDoc.title }, 'info');
} catch (error) {
  console.error('Failed to load design.json:', error.message);
  process.exit(1);
}

const app = express();
const port = process.env.PORT || 4600;

app.use(express.json());

// Routes
const executeHandler = require('./handlers/execute');
const repeatHandler = require('./handlers/repeat');
const revertHandler = require('./handlers/revert');
const formsHandler = require('./handlers/forms');

app.post('/execute', (req, res) => executeHandler(req, res, designDoc));
app.post('/repeat', (req, res) => repeatHandler(req, res, designDoc));
app.post('/revert', (req, res) => revertHandler(req, res, designDoc));
app.get('/forms', (req, res) => formsHandler(req, res, designDoc));
app.get('/ping', (req, res) => res.status(200).json({ status: 'ok' }));

app.listen(port, () => {
  log('engine startup', { port }, 'info');
});
