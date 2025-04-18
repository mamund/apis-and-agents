// composable-service/runtime/validateInputs.js


module.exports = function validateInputs(input = {}, inputSpec = {}, resourceSchema = {}) {
//`module.exports = function validateInputs(input = {}, inputSpec = {}) {
  let { required = [], optional = [], defaults = {} } = inputSpec;
  required = required.filter(f => f !== 'id');
  optional = optional.filter(f => f !== 'id');
  const validated = {};

  // Apply defaults
  for (const [key, value] of Object.entries(defaults)) {
    validated[key] = value;
  }

  // Check required fields
  for (const key of required) {
    if (input[key] == null && validated[key] == null) {
      return { error: `Missing required input: ${key}` };
    }
    if (input[key] != null) {
      validated[key] = input[key];
    }
  }

  // Copy optional fields if provided
  for (const key of optional) {
    if (input[key] != null) {
      validated[key] = input[key];
    }
  }

  // Enforce enums based on resourceSchema
  for (const [field, value] of Object.entries(validated)) {
    const fieldSchema = resourceSchema[field];
    if (fieldSchema?.enum && !fieldSchema.enum.includes(value)) {
      return { error: `Invalid value for '${field}': '${value}'. Must be one of [${fieldSchema.enum.join(', ')}]` };
    }
  }

  return { validated };
};
