# job-runner User Guide

The `job-runner` CLI allows you to submit and manage job-control documents with optional shared state. This guide covers installation, typical usage, configuration, and advanced options.

---

## 📦 Installing the CLI

### Run Locally
```bash
node index.js job.json
```

### Register Globally (for CLI use)
```bash
npm link
job-runner job.json
```

---

## 🧪 Running a Job

The main command:
```bash
job-runner <jobFile> [options]
```

### Example:
```bash
job-runner job.json \
  --state shared.json \
  --emit final.json \
  --overwrite
```

This:
- Loads and injects a shared state
- Posts the job to the job-control service
- Emits final state to a file
- Cleans up the shared-state document unless `--keep` is set

---

## ⚙️ CLI Options

| Option             | Description |
|--------------------|-------------|
| `--state <file>`   | Path to a shared state JSON file. Auto-generates an ID if missing. |
| `--emit [file]`    | Save the final shared state to a file or print to stdout. |
| `--keep`           | Prevent deletion of the shared state after job completion. |
| `--overwrite`      | Overwrite the shared-state doc if it already exists. |
| `--job-url <url>`  | Base URL for job-control service (default: `http://localhost:4700`). |
| `--state-url <url>`| Base URL for shared-state service (default: `http://localhost:4500`). |
| `--dry-run`        | Print actions without making HTTP requests. |
| `--verbose`        | Print detailed debug logs. |

---

## 🧠 Behavior Notes

- Shared state is POSTed to `/state` and referenced using `sharedStateURL` inside the job.
- If the shared state already exists, `--overwrite` must be used to overwrite it.
- After job completion, the final shared state can be fetched and written out using `--emit`.
- Unless `--keep` is specified, the shared-state document is deleted at the end.
- The job-control document is POSTed to `/run-job`.

---

## 🗂 Using `.job-runner.json`

You can define default values for options in a local `.job-runner.json` file.

```json
{
  "state": "shared.json",
  "emit": "result.json",
  "keep": false,
  "overwrite": true,
  "verbose": true
}
```

The config file must reside in the working directory where the CLI is run. CLI flags always take precedence.

---

## 🧪 Testing and Debugging

- Use `--dry-run` to preview all actions without execution.
- Use `--verbose` to see full details of:
  - File loads
  - State injection
  - URL targets
  - Final results

---

## ❌ Common Errors

- **"Shared state with id already exists"** → Use `--overwrite`
- **"Cannot find .job-runner.json"** → Must be in current directory
- **Job fails silently?** → Try `--verbose` for more detail

---

## 🔮 Coming Soon

- `--watch` for polling job status via job ID
- `--patch` for merging values into state post-creation
- Support for user-level/global config files

---

For more details on job-control documents, see the [main project documentation](../job-control).


