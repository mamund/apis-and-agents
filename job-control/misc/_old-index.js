// job-control/index.js

const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = process.env.PORT || 4700;
const discoveryURL = 'http://localhost:4000/find';

app.use(express.json());

// Utility: resolve input from shared state
const resolveInput = async (input, stateURL) => {
  if (!stateURL) return input;
  const resolved = {};
  let state = {};

  try {
    const response = await axios.get(stateURL);
    state = response.data;
  } catch (err) {
    console.warn('Failed to load shared state:', err.message);
  }

  for (const [key, value] of Object.entries(input)) {
    if (typeof value === 'object' && value.$fromState) {
      resolved[key] = state[value.$fromState];
    } else {
      resolved[key] = value;
    }
  }

  return resolved;
};

// POST /run-job
app.post('/run-job', async (req, res) => {
  const job = req.body;
  const jobId = uuidv4();
  const stateURL = job.sharedStateURL;
  const revertStack = [];

  console.log(`Starting job ${jobId}`);

  for (const step of job.steps) {
    const tasks = step.tasks.map(async (task) => {
      try {
        const response = await axios.get(discoveryURL, {
          params: { tag: task.tag }
        });

        if (!response.data.length) throw new Error(`No service found for tag ${task.tag}`);

        const service = response.data[0];
        const form = await axios.get(`${service.serviceURL}/forms`);
        const executeForm = form.data.find(f => f.rel === 'execute');

        const requestId = uuidv4();
        const resolvedInput = await resolveInput(task.input, stateURL);

        const payload = {
          ...resolvedInput,
          requestId
        };

        revertStack.push({ serviceURL: service.serviceURL, requestId });

        const result = await axios.post(executeForm.href, payload);
        const contentType = result.headers['content-type'] || '';
        let resultData = result.data;

        // Handle non-JSON response by wrapping in _raw format
        if (!contentType.includes('application/json')) {
          if (task.storeResultAt) {
            resultData = {
              _raw: typeof result.data === 'string' ? result.data : JSON.stringify(result.data),
              _contentType: contentType
            };
          } else {
            throw new Error('Non-JSON response and no storeResultAt defined');
          }
        }

        // Result-to-state wiring
        if (task.storeResultAt && stateURL) {
          const storeInstructions = Array.isArray(task.storeResultAt)
            ? task.storeResultAt
            : (typeof task.storeResultAt === 'string'
                ? [{ targetPath: task.storeResultAt }]
                : [task.storeResultAt]);

          for (const instruction of storeInstructions) {
            const allowed = !instruction.onlyOnStatus || instruction.onlyOnStatus.includes(result.status);
            if (!allowed) continue;

            const source = instruction.sourcePath
              ? instruction.sourcePath.split('/').filter(Boolean).reduce((o, k) => o && o[k], resultData)
              : resultData;

            if (instruction.sourcePath && source === undefined) {
              throw new Error('sourcePath ' + instruction.sourcePath + ' not found in result');
            }

            try {
              await axios.patch(stateURL, {
                op: 'add',
                path: instruction.targetPath,
                value: source
              });
            } catch (err) {
              console.warn('Failed to write to shared state:', err.message);
            }
          }
        }

        return { status: 'ok', task: task.tag, result: result.data };
      } catch (error) {
        return { status: 'error', task: task.tag, error: error.message };
      }
    });

    const results = await Promise.all(tasks);
    const failed = results.find(r => r.status === 'error');
    if (failed) {
      console.log(`Job ${jobId} failed at task: ${failed.task}`);

      for (const revert of revertStack.reverse()) {
        try {
          await axios.post(`${revert.serviceURL}/revert`, { requestId: revert.requestId });
          console.log(`Reverted requestId ${revert.requestId}`);
        } catch (err) {
          console.warn(`Failed to revert requestId ${revert.requestId}:`, err.message);
        }
      }

      return res.status(500).json({ jobId, error: failed });
    }
  }

  console.log(`Job ${jobId} completed.`);
  res.status(200).json({ jobId, status: 'completed' });
});

// GET /forms — describe this service's interface
app.get('/forms', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  res.status(200).json([
    {
      rel: 'run-job',
      method: 'POST',
      href: `${baseUrl}/run-job`,
      input: '{ sharedStateURL?, steps: [ { tasks: [ { tag, input } ] } ] }',
      output: '{ jobId, status | error }'
    }
  ]);
});

app.listen(port, () => {
  console.log(`Job Control service running on port ${port}`);
});

