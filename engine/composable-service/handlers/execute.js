// composable-service/handlers/execute.js

const { log } = require('../utils/logger');
const routeCommand = require('../runtime/commandRouter');
const buildContext = require('../runtime/buildContext');

module.exports = async function executeHandler(req, res, designDoc) {
  const message = req.body;

  // Basic validation
  if (!message || typeof message !== 'object' || !message.command || !message.resource) {
    log('invalid-message', { message }, 'warn');
    return res.status(400).json({ error: 'Invalid command message format' });
  }

  const context = buildContext({
    message,
    designDoc,
    headers: req.headers
  });

  try {
    const result = await routeCommand(context);
    const statusCode = result?.statusCode || 200;
    log('execute-success', { command: message.command, result }, 'info');
    return res.status(statusCode).json(result);
  } catch (err) {
    log('execute-failed', { error: err.message, command: message.command }, 'error');
    return res.status(err.statusCode || 500).json({ error: err.message });
  }
};
