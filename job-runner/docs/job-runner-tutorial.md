# Job-Control Walkthrough: Composing Jobs with Composable Services

This tutorial walks through the creation of job-control files step by step using simple demo services like `uppercase` and `openweather`. We'll begin with the most basic job structure and progressively introduce features like shared state, state injection, and value binding.

---

## 🧱 Step 1: A Minimal Job Without Shared State

To run this job (and see the result):

```bash
job-runner job-uppercase-basic.json --emit
```

We'll start with a one-step job that calls the `uppercase` service with a static string.

```json
{
  "name": "uppercase-demo",
  "steps": [
    {
      "name": "capitalize",
      "tasks": [
        {
          "tag": "uppercase",
          "input": {
            "input": "hello world"
          },
          "storeResultAt": [
            { "targetPath": "/results/message" }
          ]
        }
      ]
    }
  ]
}
```

- No shared state is used.
- The job simply transforms the string and stores the result in `/results/message`.

---

## 🧱 Step 2: Introducing Inline Initial State

To run this job with inline state and output the final shared state:

```bash
job-runner job-uppercase-inline.json --emit
```

You can define `initialState` inside the job file to inject values at runtime.

```json
{
  "name": "uppercase-inline-state",
  "initialState": {
    "text": "good morning"
  },
  "steps": [
    {
      "name": "capitalize",
      "tasks": [
        {
          "tag": "uppercase",
          "input": {
            "input": { "$fromState": "/text" }
          },
          "storeResultAt": [
            { "targetPath": "/results/message" }
          ]
        }
      ]
    }
  ]
}
```

- The `input` field uses `$fromState` to pull from `/text` in the initial state.
- This pattern is good for jobs that need templated or reusable inputs.

---

## 🧱 Step 3: Using Shared State from a File

To run this job with external shared state and output the final result:

```bash
job-runner job-weather.json --state state.json --emit --keep --overwrite
```

If your job-runner supports it, you can use the `--state` flag to load an external shared state document.

```bash
job-runner job.json --state state.json
```

**`state.json`**:

```json
{
  "location": "Paris"
}
```

**`job.json`**:

```json
{
  "name": "weather-lookup",
  "steps": [
    {
      "name": "get-weather",
      "tasks": [
        {
          "tag": "getWeather",
          "serviceName": "openweather",
          "input": {
            "name": "getWeather",
            "args": {
              "city": { "$fromState": "/location", "default": "New York" },
              "units": "imperial"
            }
          },
          "storeResultAt": [
            { "targetPath": "/weather/current" }
          ]
        }
      ]
    }
  ]
}
```

- This version shows how a reusable job can be driven by external state.

---

## 🧠 Summary

| Feature                | Demonstrated In            |
| ---------------------- | -------------------------- |
| Basic job definition   | Step 1                     |
| `storeResultAt` usage  | All steps                  |
| `initialState` inline  | Step 2                     |
| External state loading | Step 3 with `--state` flag |
| `$fromState` usage     | Step 2 & 3                 |

This approach helps build robust, testable, and dynamic workflows around simple composable services. You can layer on parallel steps, conditional logic, and reversibility next.

---

Let us know if you'd like to see examples for multi-step jobs, parallel tasks, or chaining one service’s output into another!


