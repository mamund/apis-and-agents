# Job-Control Service – Contributor Guide

This guide is for developers who want to **extend or contribute** to the Job-Control Service.

## Overview

The Job-Control service:
- Executes declarative jobs
- Resolves dynamic input from shared-state
- Calls services via discovered URLs and tracks results

## Core Behavior

- Steps are executed sequentially
- Tasks within a step run in parallel
- Inputs support `$fromState` resolution (recursive, supports `default`)
- Results can be stored via `storeResultAt`

## Contributor Features

- `$fromState` support is implemented in `resolveInput`
- Logging system uses `log()` wrapper
- Revert stack enables reverse cleanup on error
- Reusable command pattern (execute/repeat/revert)

## Example Run

```bash
curl -X POST http://localhost:4700/run-job -H "Content-Type: application/json" -d @job.json
```

## Extension Ideas

- Add support for branching or conditional logic
- Add pre/post hooks per task or per step
- Enhance `$fromState` to support transformations or filters
- Integrate job monitoring/timeout control