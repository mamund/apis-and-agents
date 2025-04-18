// composable-service/runtime/storage.js

const { log } = require('./../utils/logger');
const db = new Map(); // key: id, value: resource object

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function matchFilter(record, filters) {
  return Object.entries(filters).every(([key, value]) => {
    const field = record[key];
    if (typeof value === 'string') {
      return typeof field === 'string' && field.toLowerCase().includes(value.toLowerCase());
    }
    return field === value;
  });
}

module.exports = {
  create(data, outputSpec) {

    log("data",{data:data},"info");

    const { id } = data;
    if (db.has(id)) {
      throw { statusCode: 409, message: `Resource with ID '${id}' already exists.` };
    }
    db.set(id, { ...data });
    return {
      statusCode: outputSpec.statusCode || 201,
      [outputSpec.returns === 'object' ? 'result' : '']: clone(data)
    };
  },

  read(id, outputSpec) {
    if (!db.has(id)) {
      throw { statusCode: 404, message: `Resource not found: ${id}` };
    }
    return {
      [outputSpec.returns === 'object' ? 'result' : '']: clone(db.get(id))
    };
  },

  update(id, data, outputSpec) {
    if (!db.has(id)) {
      throw { statusCode: 404, message: `Resource not found: ${id}` };
    }
    const updated = { ...db.get(id), ...data };
    db.set(id, updated);
    return {
      [outputSpec.returns === 'object' ? 'result' : '']: clone(updated)
    };
  },

  delete(id, outputSpec) {
    if (!db.has(id)) {
      throw { statusCode: 404, message: `Resource not found: ${id}` };
    }
    db.delete(id);
    return {
      statusCode: outputSpec.statusCode || 204
    };
  },

  list(outputSpec) {
    const results = Array.from(db.values()).map(clone);
    return {
      [outputSpec.returns === 'array' ? 'result' : '']: results
    };
  },

  filter(filters, outputSpec) {
    const results = Array.from(db.values())
      .filter(record => matchFilter(record, filters))
      .map(clone);
    return {
      [outputSpec.returns === 'array' ? 'result' : '']: results
    };
  },

  status(id, data, outputSpec) {
    if (!db.has(id)) {
      throw { statusCode: 404, message: `Resource not found: ${id}` };
    }
    const current = db.get(id);
    const updated = { ...current, status: data.status };
    db.set(id, updated);
    return {
      [outputSpec.returns === 'object' ? 'result' : '']: clone(updated)
    };
  }
};
