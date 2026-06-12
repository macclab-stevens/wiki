# Storage

This page describes storage locations available on MACC Lab compute resources.

## Home directory

Your home directory (`$HOME` or `~`) is your personal workspace.

- Suitable for: configuration files, scripts, small code files
- Not suitable for: large datasets, model checkpoints, job outputs
- Quota: confirm current limits with the lab administrator

## Project directory

Shared project storage is used for research data, datasets, and outputs shared across the team.

- Path: `<project-storage-path>` (confirm with lab administrator)
- Suitable for: datasets, model checkpoints, shared code, job outputs
- Not suitable for: private credentials or keys

## Scratch directory

Scratch storage (if available) is fast temporary storage for active job I/O.

- Path: confirm with lab administrator
- Not backed up
- Files may be purged after a retention period

## What belongs where

| Data type | Location |
|---|---|
| Personal scripts and config | Home directory |
| Shared datasets | Project directory |
| Active job output | Scratch or project directory |
| Large model checkpoints | Project directory |
| Temporary job scratch files | Scratch directory |

## Backups

!!! warning
    Do not assume any storage location is backed up unless confirmed by the lab administrator. Keep copies of irreplaceable data in an approved backup location.
