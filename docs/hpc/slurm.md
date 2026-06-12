# Slurm

Slurm is the scheduler used to submit jobs to the cluster.

## Basic batch job

Create a file named `example_job.sh`:

```bash
#!/bin/bash
#SBATCH --job-name=example
#SBATCH --output=logs/example_%j.out
#SBATCH --error=logs/example_%j.err
#SBATCH --time=00:10:00
#SBATCH --cpus-per-task=1
#SBATCH --mem=4G

hostname
python --version
```

Make the logs directory if it does not exist:

```bash
mkdir -p logs
```

Submit the job:

```bash
sbatch example_job.sh
```

## Managing jobs

Check your running and pending jobs:

```bash
squeue -u $USER
```

Check detailed job information:

```bash
scontrol show job <job_id>
```

Cancel a job:

```bash
scancel <job_id>
```

View completed job accounting:

```bash
sacct -u $USER --format=JobID,JobName,State,Elapsed,CPUTime,MaxRSS
```

## Common SBATCH options

| Option | Description | Example |
|---|---|---|
| `--job-name` | Name shown in queue | `--job-name=train_run` |
| `--output` | Standard output file | `--output=logs/%j.out` |
| `--error` | Standard error file | `--error=logs/%j.err` |
| `--time` | Wall time limit | `--time=02:00:00` |
| `--cpus-per-task` | CPU cores | `--cpus-per-task=4` |
| `--mem` | Memory per node | `--mem=16G` |
| `--partition` | Queue partition | `--partition=<partition-name>` |
| `--gres` | Generic resources (GPUs) | `--gres=gpu:1` |

## Do not run heavy work on login nodes

Login nodes are for editing files, submitting jobs, and light setup work.

Use compute nodes for CPU, GPU, memory-heavy, or long-running work.
