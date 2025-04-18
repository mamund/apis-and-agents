// composable-service/utils/logger.js

function log(label, details = {}, level = 'info') {
  const entry = {
    time: new Date().toISOString(),
    level,
    label,
    ...details
  };
  console.log(JSON.stringify(entry));
}

module.exports = { log };
