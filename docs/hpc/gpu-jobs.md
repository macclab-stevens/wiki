# GPU Jobs

This page explains how to request and use GPU resources through Slurm.

!!! warning
    Partition names and GPU resource names vary by cluster configuration. Confirm the correct partition and GPU type names with the lab administrator before submitting GPU jobs.

## Requesting a GPU

Add the following to your batch script to request one GPU:

```bash
#SBATCH --gres=gpu:1
#SBATCH --partition=<gpu-partition-name>
```

Replace `<gpu-partition-name>` with the actual GPU partition name on your cluster.

## Example GPU batch script

```bash
#!/bin/bash
#SBATCH --job-name=gpu_example
#SBATCH --output=logs/gpu_%j.out
#SBATCH --error=logs/gpu_%j.err
#SBATCH --time=01:00:00
#SBATCH --cpus-per-task=4
#SBATCH --mem=16G
#SBATCH --gres=gpu:1
#SBATCH --partition=<gpu-partition-name>

# Verify GPU is visible
nvidia-smi

# Activate your environment
source .venv/bin/activate

# Run your script
python train.py
```

## Verify GPU availability in Python

```python
import torch
print(torch.cuda.is_available())
print(torch.cuda.device_count())
print(torch.cuda.get_device_name(0))
```

## Requesting multiple GPUs

To request multiple GPUs on a single node:

```bash
#SBATCH --gres=gpu:2
```

## Tips

- Request only as many GPUs as your job uses
- Monitor GPU utilization with `nvidia-smi` during interactive jobs
- Check available GPU partitions and resource names with the lab administrator
