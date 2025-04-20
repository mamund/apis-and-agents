// job-control/index.js

const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const app = express();
const { log } = require('./logger');
const port = process.env.PORT || 4700;
const discoveryURL = 'http://localhost:4000/find';

app.use(express.json());


const resolvePointer = (obj, pointer) => {
  if (!pointer.startsWith('/')) return undefined;
  return pointer
    .slice(1)
    .split('/')
    .reduce((acc, key) => acc && acc[key], obj);
};

// Utility: resolve input from shared state
const resolveInput = async (input, stateURL) => {
  if (!stateURL) return input;

  let state = {};
  try {
    const response = await axios.get(stateURL);
    state = response.data;
  } catch (err) {
    log('shared-state-load-failed', { error: err.message }, 'warn');
  }

  const resolveFromState = (obj) => {
    if (Array.isArray(obj)) {
      return obj.map(resolveFromState);
    }

    if (typeof obj === 'object' && obj !== null) {
      if (typeof obj.$fromState === 'string') {
        const resolved = resolvePointer(state, obj.$fromState);
        if (resolved !== undefined) return resolved;
        if ('default' in obj) {
          log('fromState-missing-default-used', {
            path: obj.$fromState,
            default: obj.default
          }, 'debug');
          return obj.default;
        }
        
        log('fromState-missing-no-default', {path: obj.$fromState}, 'warn');
        return undefined;
      }

      const resolved = {};
      for (const [key, value] of Object.entries(obj)) {
        resolved[key] = resolveFromState(value);
      }
      return resolved;
    }

    return obj;
  };

  return resolveFromState(input);
};

// POST /run-job
app.post('/run-job', async (req, res) => {
  const job = req.body;
  const jobId = uuidv4();

  // TODO: merge job.sharedState into sharedStateURL via PATCH when available
  if (job.sharedState && job.sharedStateURL) {
    log('shared-state-inline-detected', { jobId }, 'debug');
    // merge logic will go here
  try {
      await axios.patch(job.sharedStateURL, {
        op: 'merge',
        value: job.sharedState
      });
      log('shared-state-merged', { jobId });
    } catch (err) {
      log('shared-state-merge-failed', { error: err.message }, 'warn');
    }
  }
  
  const stateURL = job.sharedStateURL;
  const revertStack = [];

  log('job-start', { jobId });

  for (const step of job.steps) {
    const activeTasks = step.tasks.filter(t => t.enabled !== false);
    if (activeTasks.length === 0) {
      log("step-all-tasks-disabled", { step: step.name }, "info");
      continue;
    }
    if (step.enabled === false) {
      log("step-skipped", { step: step.name }, "info");
      continue;
    }
    const tasks = step.tasks.map(async (task) => {
      if (task.enabled === false) {
        log("task-skipped", { step: step.name, task: task.tag }, "info");
        return { status: "skipped", task: task.tag };
      }
      try {
        if (!task.tag) {
        log('task-missing-tag', { step: step.name }, 'warn');
        return { status: 'error', task: null, error: 'Missing tag in task' };
      }
      const response = await axios.get(discoveryURL, {
          params: { tag: task.tag }
        });

        if (!response.data.length) throw new Error(`No service found for tag ${task.tag}`);

        const service = response.data[0];
        const form = await axios.get(`${service.serviceURL}/forms`);

        const mode = step.mode || 'execute';
        const targetForm = form.data.find(f => f.rel === mode);
        if (!targetForm) {
          //throw new Error(`No form found for mode '${mode}'`);
          log('step-unknown-mode', { step: step.name, mode }, 'warn');
          return { status: 'skipped', reason: 'unknown mode', step: step.name };
        }

        const requestId = uuidv4();
        const resolvedInput = await resolveInput(task.input, stateURL);

        const payload = {
          ...resolvedInput,
          requestId
        };

        revertStack.push({ serviceURL: service.serviceURL, requestId });

        const result = await axios.post(targetForm.href, payload);
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
              log('shared-state-write-failed', { error: err.message }, 'warn');
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
      log('job-failed', { jobId, task: failed.task, error: failed.error }, 'error');

      for (const revert of revertStack.reverse()) {
        try {
          await axios.post(`${revert.serviceURL}/revert`, { requestId: revert.requestId });
          log('job-revert', { jobId, requestId: revert.requestId });
        } catch (err) {
          log('job-revert-failed', { jobId, requestId: revert.requestId, error: err.message }, 'warn');
        }
      }

      return res.status(500).json({ jobId, error: failed });
    }
  }

  log('job-complete', { jobId });
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
  log('startup', { port });
});
