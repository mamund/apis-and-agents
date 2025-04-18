// composable-service/runtime/buildContext.js

module.exports = function buildContext({ message, headers, designDoc }) {
  return {
    message,
    headers,
    designDoc,
    timestamp: new Date().toISOString()
  };
};
