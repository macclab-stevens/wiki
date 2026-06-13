# Hardware

## Turing — GPU Compute Server

Turing is the lab's primary GPU compute server for machine learning, simulation, and GPU-accelerated research.

## At a Glance

| | |
|---|---|
| GPUs | 5 × NVIDIA RTX A6000 (240 GB total VRAM) |
| CPU | 2 × AMD EPYC 7313 — 32 cores / 64 threads |
| Memory | 251 GB RAM |
| Storage | 14 TB local SSD (2 × 7 TB Intel Enterprise) |
| Driver / CUDA | 535.309.01 / CUDA 12.2 |

---

## GPUs

Five NVIDIA RTX A6000 cards, each with 48 GB of GDDR6 ECC VRAM (~240 GB total).

**Well suited for:** deep learning training, large-model inference, computer vision, scientific ML, CUDA workflows, and multi-GPU experiments.

Request only the GPUs you need — idle allocations block other researchers.

---

## CPU & NUMA

Dual AMD EPYC 7313 (16 cores each, SMT enabled). Cores are split across two NUMA nodes:

| NUMA node | Cores |
|---|---|
| 0 | 0–15, 32–47 |
| 1 | 16–31, 48–63 |

Most ML workflows don't need manual NUMA tuning. Bind processes to a node only when optimizing CPU↔GPU data movement or memory bandwidth.

---

## Memory & Storage

- **251 GB RAM** for CPU-side workloads, preprocessing, simulation, and model staging. Prefer streaming, batching, or memory-mapped access over loading huge datasets entirely into RAM.
- **14 TB local SSD** for active project data, working directories, scratch space, and checkpoints. Not intended for long-term archival — follow the lab storage policy for that.

---

## Software Environment

| | |
|---|---|
| NVIDIA driver | 535.309.01 |
| CUDA API | 12.2 |

Pin your CUDA, PyTorch, or TensorFlow versions to ones compatible with CUDA 12.2. Use isolated environments — `venv`, `conda`, `mamba`, or containers.

---

## Verifying Resources

```bash
nvidia-smi          # GPUs and driver
lscpu               # CPU topology
numactl --hardware  # NUMA layout
free -h             # System memory
lsblk && df -h      # Local disks
```

---

## Usage Notes

- Request only the GPUs and memory your job needs.
- Store active data in the appropriate project directory; clean up scratch when jobs finish.
- Run large workloads through the scheduler — not directly on login sessions.
- Monitor with `nvidia-smi` when debugging or benchmarking.
