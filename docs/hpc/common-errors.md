# Common Errors

This page lists common errors encountered when using the cluster.

## Error table

| Error | Likely Cause | Fix |
|---|---|---|
| `sbatch: command not found` | Slurm not available in current environment | Confirm you are on the cluster login node |
| Job stuck pending | Resources unavailable or request too large | Check queue with `squeue` and review requested resources |
| Out of memory | Job requested too little memory | Increase `--mem` or optimize workload |
| `srun: error: Unable to allocate resources` | Partition or resource unavailable | Check partition name and available resources |
| `CANCELLED by 0` | Job exceeded wall time | Increase `--time` limit |
| `DUE TO TIME LIMIT` | Job ran past the requested time | Increase `--time` limit or checkpoint work |
| Module not found | Module name incorrect or not available | Run `module avail` to see available modules |
| Permission denied on storage | Missing group permissions | Contact lab administrator to verify storage access |
| `CUDA error: no kernel image` | GPU driver / CUDA version mismatch | Confirm PyTorch/TF version matches CUDA version on the node |

## Checking job output

Job stdout and stderr go to the files specified by `--output` and `--error`. Always check these first when a job fails:

```bash
cat logs/example_<job_id>.out
cat logs/example_<job_id>.err
```

## Getting more information

```bash
scontrol show job <job_id>
sacct -j <job_id> --format=JobID,State,ExitCode,MaxRSS,Elapsed
```

## Asking for help

When asking for help, include:

- The exact error message
- Your batch script
- The job ID
- The output and error file contents
