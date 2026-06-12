# Open OnDemand Troubleshooting

## Common problems

| Problem | Likely Cause | Fix |
|---|---|---|
| App does not start | Resource request unavailable | Try smaller resources or wait for availability |
| VS Code cannot connect | Session startup failed | Check session logs in the OOD dashboard |
| Notebook kernel missing | Environment not installed or not registered | Create environment and register with ipykernel |
| Page does not load | Browser cache or session issue | Clear browser cache and log in again |
| File browser shows permission denied | Missing directory permissions | Verify storage permissions with lab administrator |
| Job shows "Failed" immediately | Script error or missing module | Check the session log file in OOD |

## Checking session logs

In the Open OnDemand dashboard, navigate to **My Interactive Sessions**. Each session has a link to view its log file. Check this first when an app fails to start.

## What to include when asking for help

- Which app you were launching (Jupyter, VS Code, etc.)
- Resource request (CPUs, memory, partition, time)
- Error message shown in the dashboard
- Contents of the session log file
- Approximate time of failure
