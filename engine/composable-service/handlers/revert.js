// composable-service/handlers/revert.js

const { log } = require('../utils/logger');

module.exports = function revertHandler(req, res, designDoc) {
  log('revert-noop', { design: designDoc.title }, 'info');
  return res.status(200).json({ status: 'noop' });
};
