# First Login Checklist

Complete these steps after your first successful SSH or Open OnDemand login.

## Checklist

- [ ] Confirm your username
- [ ] Change or verify your password if required
- [ ] Check your home directory
- [ ] Check project storage access
- [ ] Load a software module
- [ ] Submit a small test job

## Verify your home directory

```bash
echo $HOME
ls $HOME
```

## Check available storage

```bash
df -h $HOME
```

Ask the lab administrator for the path to shared project storage and verify you have read/write access.

## Load a software module

```bash
module avail
module load <module-name>
```

Replace `<module-name>` with an available module shown by `module avail`.

## Submit a test job

See the [Slurm guide](../hpc/slurm.md) for a minimal batch script to confirm job submission works.

## Next steps

- Review the [HPC overview](../hpc/index.md)
- Set up your [Python environment](../software/python.md)
- Review [lab onboarding](../lab-guides/onboarding.md)
