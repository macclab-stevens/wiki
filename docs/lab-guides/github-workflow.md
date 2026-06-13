# GitHub Workflow

This is the lab's standard Git and GitHub workflow for all code, data, and documentation contributions. Everyone follows the same process — students, collaborators, and maintainers.

For a detailed walkthrough with explanations of *why* each step exists, see the [Git Setup and Workflow Tutorial](../tutorials/git-workflow.md).

---

## One-Time Setup

Do this once per machine:

```bash
git config --global user.name "Your Name"
git config --global user.email "your@stevens.edu"
git config --global pull.rebase true
git config --global init.defaultBranch main
```

### .gitignore

Every repo must include a `.gitignore` covering at minimum:

```
# Python
__pycache__/
*.py[cod]
.env
venv/
.venv/

# Jupyter
.ipynb_checkpoints/

# Outputs and data
outputs/
*.log
*.tmp

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/

# Secrets — never commit these
*.pem
*.key
.env.local
```

---

## Branch Naming

```
feature/short-description        # new capability
fix/what-is-broken               # bug fix
analysis/experiment-name         # research experiment
data/schema-change-description   # data pipeline or schema
docs/what-is-being-documented    # documentation only
```

- Lowercase and hyphens only — no spaces, no underscores
- Descriptive enough that someone else knows what it is without asking
- Keep it under ~40 characters

---

## The Workflow

### 1 — Sync main

```bash
git checkout main
git pull --rebase
```

### 2 — Create a branch

```bash
git checkout -b feature/descriptive-name
```

Never work directly on `main`.

### 3 — Review your baseline

```bash
git status
git log --oneline -10
```

### 4 — Make small, logical changes

Work in small units. Each commit should represent one logical change that can be described in a single sentence.

### 5 — Stage and commit

```bash
git status                    # see what changed
git diff                      # review before staging
git add <specific-files>      # never git add . blindly
git commit -m "type: concise description"
```

### 6 — Rebase onto latest main

```bash
git fetch origin
git rebase origin/main
```

If conflicts arise, resolve them, then `git add <resolved-files>` and `git rebase --continue`. Use `git rebase --abort` to bail out entirely.

### 7 — Push branch

First push:

```bash
git push -u origin feature/descriptive-name
```

After a rebase:

```bash
git push --force-with-lease
```

### 8 — Open a Pull Request

Write a PR description that covers:

```
## What this does
## Why
## Testing / Verification
## Notes for reviewer
```

Link related issues (`Closes #42`). Wait for CI to pass before requesting review.

### 9 — Address review feedback

Add new commits — do not amend or force-push during an active review:

```bash
git add <files>
git commit -m "fix: address review feedback — [description]"
git push
```

### 10 — Merge

Use **Squash and Merge** (default). When squashing, write the final commit message as if it's the only record of this work — it will be.

| Strategy | When |
|---|---|
| **Squash and Merge** ✓ | Default — keeps `main` clean |
| **Rebase and Merge** | Commits are already clean and individually meaningful |
| **Merge commit** ✗ | Avoid |

### 11 — Clean up

```bash
git checkout main
git pull --rebase
git branch -d feature/descriptive-name
```

Enable "Automatically delete head branches" in GitHub Settings → General.

---

## Commit Message Format

```
type: short description (max 72 chars)

Optional longer explanation after a blank line.
What changed and why — not how (the diff shows how).
```

| Type | Use for |
|---|---|
| `feat` | New feature or capability |
| `fix` | Bug fix |
| `analysis` | Research analysis, findings, experiments |
| `data` | Data pipeline changes, schema updates |
| `docs` | Documentation only |
| `refactor` | Code change that doesn't fix a bug or add a feature |
| `test` | Adding or updating tests |
| `chore` | Build process, dependencies, tooling |
| `wip` | Work in progress — squash before opening a PR |

---

## Force Push Rules

Always use `--force-with-lease`, never `--force`:

| Situation | Force-push? |
|---|---|
| Your own feature branch, before PR is open | ✅ Yes — `--force-with-lease` |
| PR is open and under review | ⚠️ Avoid — add new commits instead |
| Branch shared with another contributor | ❌ No — coordinate first |
| `main` or any protected branch | ❌ Never |

---

## Research-Specific Rules

**Never commit generated outputs.** Put outputs, logs, and temporary files in `.gitignore`. Share large files via the lab server or a link in the PR description.

**Commit your environment.** When you change dependencies, commit the updated lockfile in the same commit:

```bash
pip freeze > requirements.txt
git add requirements.txt
```

**Tag research milestones.** When a pipeline version produces results you're publishing or presenting:

```bash
git tag -a v1.0-milcom2025 -m "Pipeline version used for MILCOM 2025 submission"
git push origin v1.0-milcom2025
```

**Link runs to commits.** Record the git commit hash in every run log so outputs are traceable to the exact code that produced them.

**Never commit secrets.** If you accidentally commit an API key or credential, rotate it immediately (assume it's compromised), then remove it from history and notify your supervisor.

---

## Branch Protection (Maintainers)

Enable these on `main` in every lab repo via GitHub Settings → Branches:

| Rule | Setting |
|---|---|
| Require pull request before merging | ✅ |
| Require at least 1 approval | ✅ |
| Dismiss stale approvals on new commits | ✅ |
| Require status checks to pass | ✅ |
| Require branches to be up to date | ✅ |
| Do not allow bypassing the above | ✅ |
| Allow force pushes | ❌ |
| Allow deletions | ❌ |

---

## Quick Reference

```
┌─────────────────────────────────────────────────────────────────┐
│                    DAILY WORKFLOW                                │
├──────┬──────────────────────────────────────────────────────────┤
│  1   │ git checkout main && git pull --rebase                   │
│  2   │ git checkout -b feature/name                             │
│  3   │ git status && git diff          ← always check first     │
│  4   │ [make small, logical changes]                            │
│  5   │ git add <files> && git commit -m "type: description"     │
│  6   │ git fetch origin && git rebase origin/main               │
│  7   │ git push -u origin feature/name                          │
│      │ git push --force-with-lease     ← after rebasing         │
│  8   │ [open PR on GitHub, fill description]                    │
│  9   │ git commit + git push           ← address review         │
│  10  │ [Squash & Merge on GitHub]                               │
│  11  │ git checkout main && git pull --rebase                   │
│      │ git branch -d feature/name                               │
└──────┴──────────────────────────────────────────────────────────┘

COMMIT TYPES: feat | fix | analysis | data | docs | refactor | test | chore | wip

FORCE PUSH:  --force-with-lease  ✅   --force  ❌   main  ❌ never

MERGE STRATEGY: Squash & Merge (default) | Rebase & Merge (clean branches only)

IF IN DOUBT: git status — always your first command
             git rebase --abort — always your escape hatch
```
