# Troubleshooting: Slurm

## Common problems

| Symptom | Likely Cause | Suggested Fix |
|---|---|---|
| Job stuck in PD (pending) | Resources unavailable | Check queue with `squeue`; reduce resource request |
| Job cancelled immediately | Wall time exceeded or user cancelled | Check job state with `sacct` |
| `sbatch: command not found` | Not on login node | Confirm you are SSH'd into the cluster |
| Out of memory (OOM) | `--mem` too low | Increase `--mem`; check job memory usage with `sacct` |
| `DUE TO TIME LIMIT` | Job ran past wall time | Increase `--time` or checkpoint and restart |
| Wrong partition | Partition name typo | Check available partitions with `sinfo` |
| Module not found | Module name wrong or unavailable | Run `module avail` and check spelling |
| Job output file empty | Job failed before writing output | Check `--error` file for crash messages |

## Useful diagnostic commands

```bash
# Check queue
squeue -u $USER

# Check job details
scontrol show job <job_id>

# Check completed job accounting
sacct -j <job_id> --format=JobID,State,ExitCode,MaxRSS,Elapsed

# Check available partitions
sinfo

# Check available modules
module avail
```

## What to include when asking for help

- Command run
- Full error message
- Your batch script contents
- Job ID
- Contents of output and error files
- Approximate time of failure
