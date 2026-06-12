# Python

## Using system Python

Check available Python versions:

```bash
python --version
python3 --version
module avail python
```

## Create a virtual environment

```bash
python -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
```

## Install packages

```bash
python -m pip install numpy pandas matplotlib
```

Always use `python -m pip` rather than bare `pip` to ensure you are installing into the active environment.

## Save dependencies

```bash
python -m pip freeze > requirements.txt
```

## Recreate an environment

```bash
python -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
```

## Deactivate

```bash
deactivate
```

## Register as a Jupyter kernel

To use this environment in Jupyter:

```bash
python -m pip install ipykernel
python -m ipykernel install --user --name=myenv --display-name "My Environment"
```

## Tips

- Keep one virtual environment per project
- Commit `requirements.txt` to version control
- Do not commit the `.venv/` directory
