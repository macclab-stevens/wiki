# Conda and Mamba

Conda and Mamba are package and environment managers commonly used for scientific Python workflows.

!!! note
    Availability of Conda/Mamba and the recommended installation method depend on cluster configuration. Confirm with the lab administrator whether Conda or Mamba is pre-installed, or whether you should install it in your home directory.

## Check availability

```bash
conda --version
mamba --version
module avail conda
module avail mamba
```

## Create an environment

```bash
conda create -n myenv python=3.12
conda activate myenv
```

With Mamba (faster dependency resolution):

```bash
mamba create -n myenv python=3.12
mamba activate myenv
```

## Install packages

```bash
conda install numpy pandas matplotlib
```

Or:

```bash
mamba install numpy pandas matplotlib
```

## Export environment

```bash
conda env export > environment.yml
```

## Recreate environment

```bash
conda env create -f environment.yml
```

## List environments

```bash
conda env list
```

## Remove an environment

```bash
conda env remove -n myenv
```

## Tips

- Prefer `mamba` over `conda` for faster installs when available
- Avoid installing packages into the `base` environment
- Export `environment.yml` and commit it to version control
