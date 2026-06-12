# PyTorch and TensorFlow

This page covers setting up PyTorch and TensorFlow GPU environments on MACC Lab resources.

!!! note
    CUDA versions and GPU availability depend on cluster hardware. Confirm the available CUDA version with the lab administrator before installing deep learning frameworks.

## Check CUDA version

```bash
nvidia-smi
nvcc --version
```

## PyTorch

### Install PyTorch

Visit [pytorch.org](https://pytorch.org/get-started/locally/) to find the correct install command for your CUDA version.

Example for CUDA 12.1:

```bash
python -m pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
```

### Verify GPU access

```python
import torch
print(torch.cuda.is_available())
print(torch.cuda.device_count())
print(torch.cuda.get_device_name(0))
```

### Example training script structure

```python
import torch

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = MyModel().to(device)
```

## TensorFlow

### Install TensorFlow

```bash
python -m pip install tensorflow
```

### Verify GPU access

```python
import tensorflow as tf
print(tf.config.list_physical_devices('GPU'))
```

## Using a container instead

For reproducible GPU environments, consider using a pre-built container from NVIDIA NGC. See the [Containers guide](containers.md).

## Tips

- Always verify GPU availability in Python before running training jobs
- Check PyTorch or TensorFlow compatibility matrices for your CUDA version
- Submit GPU training jobs through Slurm — see [GPU Jobs](../hpc/gpu-jobs.md)
