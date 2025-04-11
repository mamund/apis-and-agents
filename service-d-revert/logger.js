// logger.js

const LOG_LEVELS = ['debug', 'info', 'warn', 'error'];
const CURRENT_LEVEL = process.env.LOG_LEVEL || 'info';

function shouldLog(level) {
  return LOG_LEVELS.indexOf(level) >= LOG_LEVELS.indexOf(CURRENT_LEVEL);
}

function log(action, data = {}, level = 'info') {
  if (!shouldLog(level)) return;

  const entry = {
    timestamp: new Date().toISOString(),
    level,
    action,
    ...data
  };

  try {
    console.log(JSON.stringify(entry));
  } catch (err) {
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'error',
      action: 'log-failure',
      error: err.message
    }));
  }
}

module.exports = { log };
