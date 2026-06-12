# GitHub Workflow

This page describes the lab's standard Git and GitHub workflow for code and documentation contributions.

## Setup

Clone a repository:

```bash
git clone https://github.com/macclab-stevens/<repo-name>.git
cd <repo-name>
```

## Branch naming

Use descriptive branch names with a prefix:

```text
feature/<short-description>
bugfix/<short-description>
docs/<short-description>
experiment/<short-description>
```

Examples:

```text
feature/add-transformer-model
bugfix/fix-dataloader-memory-leak
docs/update-slurm-guide
experiment/test-new-optimizer
```

## Workflow

1. Sync with the latest main:

   ```bash
   git checkout main
   git pull origin main
   ```

2. Create a new branch:

   ```bash
   git checkout -b feature/my-change
   ```

3. Make changes and commit:

   ```bash
   git add <specific-files>
   git commit -m "feat: short description of change"
   ```

4. Push your branch:

   ```bash
   git push -u origin feature/my-change
   ```

5. Open a pull request on GitHub

6. Request review from a labmate or the PI

7. Address feedback with new commits (do not force-push during active review)

8. Merge after approval

## Commit message format

```text
type: short description (max 72 characters)

Optional longer explanation of what and why.
```

Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `data`, `analysis`

## Pull request guidelines

- Write a clear PR description explaining what changed and why
- Link related issues if applicable
- Keep PRs focused on one logical change
- Do not commit secrets, credentials, or controlled data

## .gitignore

Always include a `.gitignore` covering:

```text
.venv/
__pycache__/
*.pyc
.ipynb_checkpoints/
.env
*.key
*.pem
data/raw/
outputs/
```
