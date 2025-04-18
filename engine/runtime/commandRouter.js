// composable-service/runtime/commandRouter.js

const { log } = require('./../utils/logger');
const validateInputs = require('./validateInputs');
const applyRules = require('./applyRules');
const storage = require('./storage');

module.exports = async function routeCommand(context) {
  const { message, designDoc } = context;
  const { command, resource, id, payload = {} } = message;

  const definition = designDoc.commands?.[command];
  if (!definition) {
    throw { statusCode: 400, message: `Unknown command: ${command}` };
  }

  // Validate resource type
  if (resource !== designDoc.resourceType) {
    throw { statusCode: 400, message: `Unsupported resource: ${resource}` };
  }

  // Validate input
  const inputData = payload || {};
  const resourceType = definition.output?.type || designDoc.resourceType;
  const resourceSchema = designDoc.resourceSchema?.[resourceType] || {};
  const { validated, error } = validateInputs(inputData, definition.inputs || {}, resourceSchema);
  //const { validated, error } = validateInputs(inputData, definition.inputs || {});
  if (error) {
    throw { statusCode: 400, message: error };
  }

  // Ensure id from command is included in input during create
  if (command === "create" && id) {
    validated.id = id;
  }

  // Apply input rules (e.g., generateIfMissing)
  const finalInput = applyRules({ input: validated, rules: definition.inputs?.rules || [] });
  
  // Dispatch command
  switch (command) {
    case 'create':
      return storage.create(finalInput, definition.output);
    case 'read':
      return storage.read(message.id, definition.output);
    case 'update':
      return storage.update(message.id, finalInput, definition.output);
    case 'delete':
      return storage.delete(message.id, definition.output);
    case 'list':
      return storage.list(definition.output);
    case 'filter':
      return storage.filter(finalInput, definition.output);
    case 'status':
      return storage.status(message.id, finalInput, definition.output);
    default:
      throw { statusCode: 400, message: `Command not implemented: ${command}` };
  }
};
