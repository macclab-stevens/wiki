# Containers

Containers provide reproducible, portable software environments. MACC Lab compute resources support Apptainer (formerly Singularity) for running containers without root privileges.

!!! note
    Container availability and the recommended workflow depend on cluster configuration. Confirm with the lab administrator whether Apptainer or Singularity is available.

## Check availability

```bash
apptainer --version
singularity --version
module avail apptainer
module avail singularity
```

## Pull a container image

```bash
apptainer pull docker://python:3.12-slim
```

## Run a container

```bash
apptainer run python_3.12-slim.sif python --version
```

## Execute a command inside a container

```bash
apptainer exec python_3.12-slim.sif python my_script.py
```

## Run with GPU access

```bash
apptainer exec --nv my_gpu_image.sif python train.py
```

The `--nv` flag enables NVIDIA GPU access inside the container.

## Bind a directory

```bash
apptainer exec --bind /path/to/data:/data my_image.sif python my_script.py
```

## Use in a Slurm job

```bash
#!/bin/bash
#SBATCH --job-name=container_job
#SBATCH --output=logs/%j.out
#SBATCH --time=01:00:00
#SBATCH --cpus-per-task=4
#SBATCH --mem=16G

apptainer exec my_image.sif python train.py
```

## Tips

- Store large container images in project storage, not your home directory
- Use images from trusted sources (Docker Hub official images, NVIDIA NGC, etc.)
- Check with the lab administrator for any pre-built images available on the cluster
