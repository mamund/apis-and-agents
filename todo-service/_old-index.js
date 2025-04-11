// todo-service/index.js

const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4001;

// In-memory store of todos
const todos = {}; // { id: { id, title, done } }

// Utility to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 10);

// Command handler
function handleCommand(message, mode = 'execute') {
  const { command, resource, id, payload, metadata } = message;

  if (resource !== 'todo') {
    return { error: `Unsupported resource '${resource}'`, status: 400 };
  }

  switch (command) {
    case 'create': {
      const todoId = id || generateId();
      if (!id && mode === 'repeat') {
        return { error: 'Repeat create must include id', status: 400 };
      }
      if (id && todos[id] && mode === 'execute') {
        return { error: `Resource with ID '${id}' already exists.`, status: 409 };
      }
      todos[todoId] = { id: todoId, ...payload };
      return { result: todos[todoId], status: 201 };
    }

    case 'read': {
      if (!todos[id]) return { error: 'Not found', status: 404 };
      return { result: todos[id], status: 200 };
    }

    case 'update': {
      if (!todos[id]) return { error: 'Not found', status: 404 };
      todos[id] = { ...todos[id], ...payload };
      return { result: todos[id], status: 200 };
    }

    case 'delete': {
      if (!todos[id]) return { error: 'Not found', status: 404 };
      delete todos[id];
      return { result: { deleted: true }, status: 200 };
    }

    case 'list': {
      return { result: Object.values(todos), status: 200 };
    }

    case 'filter': {
      const filters = payload;
      const matches = Object.values(todos).filter(todo => {
        return Object.entries(filters).every(([key, val]) => {
          const recordVal = todo[key];
          if (typeof val === 'string' && typeof recordVal === 'string') {
            return recordVal.toLowerCase().includes(val.toLowerCase());
          }
          return recordVal === val;
        });
      });
      return { result: matches, status: 200 };
    }

    default:
      return { error: `Unsupported command '${command}'`, status: 400 };
  }
}

function handleRevert(message) {
  const { command, resource, id } = message;

  if (resource !== 'todo') {
    return { error: `Unsupported resource '${resource}'`, status: 400 };
  }

  switch (command) {
    case 'create': {
      if (!todos[id]) return { error: 'Cannot revert create: ID not found', status: 404 };
      delete todos[id];
      return { result: { reverted: true }, status: 200 };
    }
    default:
      return { error: `Revert not implemented for command '${command}'`, status: 501 };
  }
}

function createHandler(mode) {
  return (req, res) => {
    try {
      const message = req.body;
      const handler = mode === 'revert' ? handleRevert : handleCommand;
      const { result, error, status } = handler(message, mode);
      if (error) return res.status(status).json({ error });
      res.status(status).json(result);
    } catch (err) {
      res.status(500).json({ error: 'Internal error' });
    }
  };
}

app.post('/execute', createHandler('execute'));
app.post('/repeat', createHandler('repeat'));
app.post('/revert', createHandler('revert'));

// Forms endpoint
app.get('/forms', (req, res) => {
  res.json({
    resource: 'todo',
    messageStructure: {
      command: 'string',
      resource: 'string',
      id: 'string (optional)',
      payload: {
        title: 'string',
        done: 'boolean'
      },
      metadata: 'object (optional)'
    },
    affordances: [
      {
        command: 'create',
        requiredFields: ['title']
      },
      {
        command: 'update',
        requiredFields: ['id', 'title']
      },
      {
        command: 'filter',
        optionalFields: ['title', 'done']
      }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`TODO service running on port ${PORT}`);
  registerWithDiscovery();
});

// Self-registration with discovery
async function registerWithDiscovery() {
  try {
    const registration = {
      name: "todo-service",
      url: `http://localhost:${PORT}`,
      endpoints: ["/execute", "/repeat", "/revert", "/forms"],
      resources: ["todo"]
    };

    await axios.post("http://localhost:4000/register", registration);
    console.log("Registered with discovery service.");
  } catch (err) {
    console.error("Discovery registration failed:", err.message);
  }
}

