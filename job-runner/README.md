# job-runner

A lightweight CLI tool for executing [job-control](../job-control) documents with optional shared-state management.  
Ideal for orchestrating tasks across distributed services in environments that support declarative job definitions.

---

## Features

- Runs job-control documents with minimal setup
- Supports dynamic shared state documents (`--state`)
- Emits final state to stdout or file (`--emit`)
- Auto-deletes shared state unless `--keep` is specified
- Supports local `.job-runner.json` config overrides
- Safe overwrite logic for shared state (`--overwrite`)
- Dry-run and verbose modes for safe debugging

---

## Installation

### Local
```bash
npm install
node index.js job.json
```

### Global (for CLI-style usage)
```bash
npm link
job-runner job.json
```

---

## Basic Usage

```bash
job-runner job.json \
  --state shared.json \
  --emit final-state.json \
  --overwrite
```

This will:
1. Load the job-control file.
2. Load and POST `shared.json` to the shared-state service.
3. Inject the resulting `sharedStateURL` into the job.
4. POST the job to the job-control service.
5. Emit final shared state to `final-state.json`.
6. Auto-delete the shared state document (unless `--keep` is used).

---

## CLI Options

| Option             | Description |
|--------------------|-------------|
| `--state <file>`   | Initial shared state JSON file to upload. |
| `--emit [file]`    | Emit final shared state to a file or to stdout. |
| `--keep`           | Keep the shared state after the job completes. |
| `--overwrite`      | Overwrite existing shared state if the ID exists. |
| `--job-url <url>`  | Job-control base URL (default: `http://localhost:4700`). |
| `--state-url <url>`| Shared-state base URL (default: `http://localhost:4500`). |
| `--dry-run`        | Print requests instead of executing them. |
| `--verbose`        | Print debug info during job execution. |

---

## Configuration

You can create a `.job-runner.json` in your working directory to supply default values for most flags.

### Example `.job-runner.json`:
```json
{
  "jobURL": "http://localhost:4700",
  "stateURL": "http://localhost:4500",
  "state": "default-state.json",
  "emit": "final.json",
  "keep": false,
  "overwrite": true,
  "verbose": true
}
```

---

## Documentation

- [User Guide](docs/user-guide.md)
- [Contributor Guide](docs/contributor-guide.md)

---

## License

MIT


