# Troubleshooting: Open OnDemand

## Common problems

| Symptom | Likely Cause | Suggested Fix |
|---|---|---|
| App does not start | Resources unavailable or allocation failed | Try smaller resource request or wait |
| VS Code cannot connect | Session startup failed | Check session log in OOD dashboard |
| Notebook kernel missing | Environment not installed or not registered | Install ipykernel and register environment |
| Page does not load | Browser cache or authentication issue | Clear cache, try incognito, log in again |
| Session shows "Failed" | Script error or missing module | Check session log file |
| File browser permission denied | Storage permission issue | Contact lab administrator |
| Can't upload large files | Browser timeout or quota | Use `scp` or `rsync` from terminal instead |

## Checking session logs

1. Go to **My Interactive Sessions** in OOD
2. Find the failed session
3. Click the session folder link to view log files

## What to include when asking for help

- Which app failed (Jupyter, VS Code, shell)
- Resource request used (CPUs, memory, partition, time)
- Error shown in the OOD dashboard
- Contents of the session log file
- Approximate time of failure
