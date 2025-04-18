# job-runner Contributor Guide

This guide is for developers who want to extend, maintain, or debug the `job-runner` CLI.
It covers the project structure, how to test locally, and conventions to follow.

---

## 📁 Project Layout

```
job-runner/
├── index.js              # Main CLI entry point
├── package.json          # Project metadata and dependencies
├── .job-runner.json      # Optional project-local config (not versioned)
├── docs/
│   ├── user-guide.md     # End-user documentation
│   └── contributor-guide.md
└── README.md
```

---

## 🧠 Core Design Principles

- **Minimal install**: No build steps, single-file CLI
- **Configurable but predictable**: Supports JSON config with CLI override priority
- **Fails safe**: Never overwrites or deletes without intent (requires `--overwrite`, skips `--keep`)
- **Debug-friendly**: Always traceable with `--dry-run` and `--verbose`

---

## 🧪 Running and Testing

### Run locally
```bash
node index.js run job.json --verbose
```

### Link globally
```bash
npm link
job-runner run job.json
```

### Test config loading
Use `.job-runner.json` in the same directory you run the command from:
```json
{
  "state": "sample.json",
  "emit": "final.json",
  "verbose": true
}
```

---

## 🛠 Editing the CLI

Main file: `index.js`

### Key functions:
- `loadConfig()` – loads `.job-runner.json` from working dir
- `logVerbose()` – safe debug print wrapper
- `main()` – CLI entry point and dispatcher

### Things to know:
- Uses `commander` for CLI arg parsing
- Uses `axios` for all HTTP requests
- Uses `uuid` to generate shared state IDs when missing
- `--emit` with no file = stdout
- Default behavior is to delete state unless `--keep` is passed

---

## 🧱 Adding New Flags

1. Add the `.option()` call inside `program` definition
2. Add config fallback logic:
```js
const myOption = options.myOption !== undefined ? options.myOption : config.myOption || defaultValue;
```
3. Use your value in `main()` logic
4. Update the README and user guide

---

## ✅ Conventions

- Prefer clarity over cleverness
- Always support dry-run for risky actions
- Add verbose logs for new features
- Keep CLI output clean and scriptable
- Preserve override order: CLI > config > hardcoded default

---

## 🧪 Manual Test Checklist (Before Commit)
- ✅ CLI works without config file
- ✅ CLI works with config file
- ✅ `--emit` works with and without a filename
- ✅ `--overwrite` overwrites existing state
- ✅ `--keep` retains state
- ✅ `--dry-run` logs without executing

---

## 📬 Future Ideas
- Watch job status via `jobId`
- Support PATCH merging of shared state
- Config file fallback to home dir or XDG paths
- Test harness for job+state simulation

---

Thanks for contributing!


