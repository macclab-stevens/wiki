# Jupyter on Open OnDemand

Open OnDemand lets you launch a Jupyter notebook server on a compute node through your browser.

## When to use Jupyter

- Interactive data exploration
- Prototyping and testing code
- Visualization
- Teaching and demos

## Launching Jupyter

1. Log in to Open OnDemand
2. Navigate to **Interactive Apps → Jupyter**
3. Select your resource requirements (CPUs, memory, time, partition)
4. Click **Launch**
5. Wait for the job to start, then click **Connect to Jupyter**

## Resource selection

Choose resources appropriate to your work:

- For light exploration: 1–2 CPUs, 4–8 GB RAM
- For data-heavy work: more CPUs and RAM as needed
- For GPU work: select the GPU partition and request a GPU

## Using the correct Python kernel

Select the kernel that matches your Python environment. If your environment does not appear:

1. Install `ipykernel` in your environment:
   ```bash
   python -m pip install ipykernel
   python -m ipykernel install --user --name=myenv --display-name "My Environment"
   ```
2. Restart the Jupyter server

## Tips

- Compute-heavy notebooks should use appropriate resource requests — do not run intensive work on minimal allocations
- Save your work frequently
- Close the session when done to free resources
