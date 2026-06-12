# Troubleshooting: Python Environments

## Common problems

| Symptom | Likely Cause | Suggested Fix |
|---|---|---|
| `ModuleNotFoundError` | Package not installed in active environment | Activate environment and install with `python -m pip install` |
| Wrong Python version | Using system Python instead of environment | Activate virtual environment or Conda env |
| `pip: command not found` | pip not available | Use `python -m pip` instead of bare `pip` |
| Kernel not visible in Jupyter | Environment not registered | Register with `python -m ipykernel install --user` |
| Packages installed but not found | Installed in wrong environment | Confirm environment is active with `which python` |
| `conda: command not found` | Conda not initialized | Load module or initialize with `conda init` |
| Environment creation fails | Disk quota exceeded | Clean old environments; check quota with `df -h $HOME` |

## Check which Python is active

```bash
which python
python --version
```

## Check installed packages

```bash
python -m pip list
```

## Verify environment is active

```bash
# For venv
echo $VIRTUAL_ENV

# For Conda
conda info --envs
```

## What to include when asking for help

- Command run
- Full error message
- Output of `which python`
- Output of `python --version`
- Environment type (venv, Conda, system)
- Approximate time of failure
