#!/usr/bin/env node

// job-runner CLI - Phase 1

import fs from 'fs';
import path from 'path';
import { Command } from 'commander';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const program = new Command();

const DEFAULT_CONFIG_FILE = '.job-runner.json';
const DEFAULT_JOB_URL = 'http://localhost:4700';
const DEFAULT_STATE_URL = 'http://localhost:4500';

function loadConfig() {
  const configPath = path.resolve(process.cwd(), DEFAULT_CONFIG_FILE);
  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  }
  return {};
}

function logVerbose(enabled, ...args) {
  if (enabled) console.log('[verbose]', ...args);
}

async function main() {
  program
    .name('job-runner')
    .description('Run a job-control document with optional state handling')
    .argument('<jobFile>', 'Path to the job-control JSON file')
    .option('--state <file>', 'Initial shared state JSON file')
    .option('--job-url <url>', 'Job-control base URL')
    .option('--state-url <url>', 'Shared-state base URL')
    .option('--emit [file]', 'Write final shared state to file or stdout if no file is given')
    .option('--keep', 'Retain shared state after job ends')
    .option('--overwrite', 'Overwrite existing shared state if ID already exists')
    .option('--dry-run', 'Print but don’t execute HTTP requests')
    .option('--verbose', 'Print debug information')
    .parse();

  const options = program.opts();
  const jobFilePath = program.args[0];
  const config = loadConfig();

  const jobURL = options.jobUrl || config.jobURL || DEFAULT_JOB_URL;
  const stateURL = options.stateUrl || config.stateURL || DEFAULT_STATE_URL;
  const stateFile = options.state || config.state || null;
  const emitTarget = options.emit !== undefined ? options.emit : config.emit;
  const keep = options.keep !== undefined ? options.keep : config.keep || false;
  const overwrite = options.overwrite !== undefined ? options.overwrite : config.overwrite || false;
  const dryRun = options.dryRun !== undefined ? options.dryRun : config.dryRun || false;
  const verbose = options.verbose !== undefined ? options.verbose : config.verbose || false;

  // Step 1: Load job-control file
  const job = JSON.parse(fs.readFileSync(jobFilePath, 'utf-8'));
  logVerbose(verbose, 'Loaded job file:', job);

  let stateId = null;

  if (stateFile) {
    // Step 2: Load shared state JSON
    const state = JSON.parse(fs.readFileSync(stateFile, 'utf-8'));
    stateId = state.id || uuidv4();
    state.id = stateId;

    const sharedStateURL = `${stateURL}/state/${stateId}`;
    job.sharedStateURL = sharedStateURL;

    logVerbose(verbose, 'Prepared shared state:', state);
    logVerbose(verbose, 'sharedStateURL injected into job:', sharedStateURL);

    if (!dryRun) {
      try {
        // Check if state already exists
        await axios.get(`${stateURL}/state/${stateId}`);

        if (overwrite) {
          await axios.post(`${stateURL}/state/${stateId}`, state);
          logVerbose(verbose, 'Existing shared state overwritten via POST');
        } else {
          console.error(`Shared state with id '${stateId}' already exists. Use --overwrite to replace it.`);
          process.exit(1);
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          await axios.post(`${stateURL}/state`, state);
          logVerbose(verbose, 'Shared state POSTed to server');
        } else {
          throw err;
        }
      }
    } else {
      console.log('[dry-run] Would create or overwrite shared state at', `${stateURL}/state/${stateId}`);
    }
  }

  // Step 3: POST job to /run-job
  if (!dryRun) {
    const result = await axios.post(`${jobURL}/run-job`, job);
    logVerbose(verbose, 'Job submitted. Server response:', result.data);
  } else {
    console.log('[dry-run] Would POST job-control to', `${jobURL}/run-job`);
  }

  // Step 4: Emit shared state (if requested)
  if (emitTarget && stateId && !dryRun) {
    const getResp = await axios.get(`${stateURL}/state/${stateId}`);
    const output = JSON.stringify(getResp.data, null, 2);

    if (typeof emitTarget === 'string') {
      fs.writeFileSync(emitTarget, output, 'utf-8');
      logVerbose(verbose, 'Final shared state written to', emitTarget);
    } else {
      console.log(output);
    }
  }

  // Step 5: Auto-cleanup unless --keep is used
  if (!keep && stateId && !dryRun) {
    await axios.delete(`${stateURL}/state/${stateId}`);
    logVerbose(verbose, 'Shared state deleted:', `${stateURL}/state/${stateId}`);
  }
}

main().catch((err) => {
  console.error('Error running job:', err.message);
  process.exit(1);
});

