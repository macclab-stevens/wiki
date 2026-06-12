# Troubleshooting: GPU

## Common problems

| Symptom | Likely Cause | Suggested Fix |
|---|---|---|
| `torch.cuda.is_available()` returns `False` | No GPU allocated or CUDA not available | Confirm GPU was requested in Slurm script |
| `CUDA error: no kernel image` | PyTorch/TF version incompatible with CUDA | Install version matching cluster CUDA |
| Out of GPU memory | Model or batch size too large | Reduce batch size; use gradient checkpointing |
| `nvidia-smi` not found | Not on a GPU node | Confirm job was submitted to GPU partition |
| Job stuck pending | GPU partition full | Wait or reduce GPU count requested |
| GPU visible but slow | Incorrect device placement | Confirm tensors are moved to device with `.to(device)` |

## Check GPU availability

Inside a running job or interactive session:

```bash
nvidia-smi
```

In Python:

```python
import torch
print(torch.cuda.is_available())
print(torch.cuda.device_count())
print(torch.cuda.get_device_name(0))
```

## Verify job requested GPU

```bash
scontrol show job <job_id> | grep TRES
```

## What to include when asking for help

- Command run
- Full error message
- Output of `nvidia-smi` if available
- PyTorch or TensorFlow version (`python -c "import torch; print(torch.__version__)"`)
- CUDA version requested vs available
- Job ID and Slurm script
- Approximate time of failure
