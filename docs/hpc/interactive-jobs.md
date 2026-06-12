# Interactive Jobs

Interactive jobs let you work on a compute node in real time, useful for debugging, testing, or exploratory work.

## When to use interactive jobs

- Debugging a script that fails on compute nodes
- Testing resource requirements before submitting a batch job
- Running quick exploratory analysis that needs more resources than the login node allows

## When to use Open OnDemand instead

For browser-based interactive work (Jupyter, VS Code), prefer [Open OnDemand](../open-ondemand/index.md) over command-line interactive jobs.

## Requesting an interactive session

```bash
srun --pty --cpus-per-task=2 --mem=8G --time=01:00:00 bash
```

This opens a shell on a compute node. Your session ends when the time limit expires or you type `exit`.

## Interactive session with GPU

```bash
srun --pty --cpus-per-task=4 --mem=16G --time=01:00:00 --gres=gpu:1 --partition=<gpu-partition-name> bash
```

!!! note
    Placeholder: Replace `<gpu-partition-name>` with the actual GPU partition name.

## Alternatively using salloc

```bash
salloc --cpus-per-task=2 --mem=8G --time=01:00:00
```

`salloc` allocates a node and returns its name. You can then `ssh` to it or use `srun` within the allocation.

## Tips

- Interactive jobs count against your allocation
- Close your session when done to free resources for others
- Do not run long-duration work interactively — submit a batch job instead
