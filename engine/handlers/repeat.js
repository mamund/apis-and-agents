// composable-service/handlers/repeat.js

const executeHandler = require('./execute');

module.exports = function repeatHandler(req, res, designDoc) {
  return executeHandler(req, res, designDoc); // Reuses execute logic
};
