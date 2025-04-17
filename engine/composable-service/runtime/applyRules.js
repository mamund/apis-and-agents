// composable-service/runtime/applyRules.js

const { log } = require('./../utils/logger');
const { v4: uuidv4 } = require('uuid');

module.exports = function applyRules({ input, rules }) {
  const result = { ...input };

  log("result",{result:result},"info");

  for (const rule of rules) {
    if (rule.id === 'generateIfMissing') {
      result.id = result.id || uuidv4();
    }
  }

  return result;
};
