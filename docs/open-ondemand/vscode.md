# VS Code on Open OnDemand

Open OnDemand provides a browser-based VS Code (code-server) environment running on a compute node.

## When to use VS Code on Open OnDemand

- Editing code on the cluster without setting up a local SSH remote extension
- Running scripts directly on cluster hardware
- Exploratory development on compute nodes

## Launching VS Code

1. Log in to Open OnDemand
2. Navigate to **Interactive Apps → VS Code** (or code-server)
3. Select your resource requirements
4. Click **Launch**
5. Wait for the session to start, then click **Connect to VS Code**

## Extensions

!!! note
    Extension persistence depends on the cluster configuration. Installed extensions may not persist between sessions. Confirm with the lab administrator whether extensions are saved to your home directory.

## Using a Python environment

To use a specific Python environment in the integrated terminal:

```bash
source /path/to/.venv/bin/activate
```

Or select the interpreter path via the VS Code Python extension.

## Tips

- Do not run long or resource-intensive scripts inside small interactive allocations
- Use the integrated terminal to submit Slurm jobs for heavy workloads
- Save files before the session time limit expires
