// job-control/index.js

const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = process.env.PORT || 4700;
const discoveryURL = 'http://localhost:4000/find';

app.use(express.json());

// POST /run-job
app.post('/run-job', async (req, res) => {
  const job = req.body;
  const jobId = uuidv4();
  const jobState = job.sharedState || {};
  const revertStack = [];

  console.log(`Starting job ${jobId}`);

  for (const step of job.steps) {
    const tasks = step.tasks.map(async (task) => {
      try {
        const response = await axios.get(discoveryURL, {
          params: { tag: task.tag }
        });
        console.log(task.tag);
        
        if (!response.data.length) throw new Error(`No service found for tag ${task.tag}`);

        const service = response.data[0];
        const form = await axios.get(`${service.serviceURL}/forms`);
        const executeForm = form.data.find(f => f.rel === 'execute');

        const requestId = uuidv4();
        const payload = {
          ...task.input,
          requestId
        };

        // Track revert info
        revertStack.push({ serviceURL: service.serviceURL, requestId });

        console.log(revertStack);
        
        const result = await axios.post(executeForm.href, payload);
        return { status: 'ok', task: task.tag, result: result.data };
      } catch (error) {
        return { status: 'error', task: task.tag, error: error.message };
      }
    });

    const results = await Promise.all(tasks);
    const failed = results.find(r => r.status === 'error');
    if (failed) {
      console.log(`Job ${jobId} failed at task: ${failed.task}`);

      // Roll back previous steps
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
      input: '{ sharedState?, steps: [ { tasks: [ { tag, input } ] } ] }',
      output: '{ jobId, status | error }'
    }
  ]);
});

app.listen(port, () => {
  console.log(`Job Control service running on port ${port}`);
});

