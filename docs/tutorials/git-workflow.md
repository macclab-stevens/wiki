# Git Workflow — Research Lab Standard

> **Purpose:** A shared, consistent workflow for all contributors — students, collaborators, and maintainers.
> Keep this file in the root of every repository.

---

## Contents

1. [Core Concepts](#core-concepts)
2. [Before You Start — One-Time Setup](#before-you-start-one-time-setup)
3. [The Workflow — Step by Step](#the-workflow-step-by-step)
4. [Commit Message Convention](#commit-message-convention)
5. [Force Push — When and How](#force-push-when-and-how)
6. [Branch Naming](#branch-naming)
7. [The Squash vs Rebase Question](#the-squash-vs-rebase-question)
8. [Research-Specific Rules](#research-specific-rules)
9. [Branch Protection Rules](#branch-protection-rules)
10. [Quick Reference Card](#quick-reference-card)

---

## Core Concepts

Understanding *why* each step exists prevents blind rule-following and helps you recover when things go wrong.

| Concept | What it means | Why it matters |
|---|---|---|
| **Rebase** | Replay your commits on top of the latest `main` | Keeps history linear — no "merge commit" noise |
| **Squash & Merge** | Collapse all branch commits into one when merging to `main` | `main` stays clean; one commit per feature |
| **`--force-with-lease`** | Force-push that fails safely if someone else pushed since your last fetch | Prevents accidentally overwriting others' work |
| **Branch protection** | Rules that prevent direct pushes to `main` | Enforces the PR review process for everyone |

> **The key tension to understand:** If you use Squash & Merge at the PR step, your branch's individual commit history is thrown away when it lands on `main`. That means the rebase step is primarily about *resolving conflicts cleanly*, not about preserving commit history on `main`. Both things are still worth doing — just for different reasons.

---

## Before You Start — One-Time Setup

Do this once per machine, not once per project.

```bash
# Set your identity
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# Make rebase the default pull strategy (avoids accidental merge commits)
git config --global pull.rebase true

# Set a default branch name
git config --global init.defaultBranch main

# Useful: show branch in terminal prompt (optional but recommended)
# Add to your ~/.zshrc or ~/.bashrc:
# parse_git_branch() { git branch 2>/dev/null | sed -n 's/* //p'; }
# PS1="\u@\h \W \$(parse_git_branch) $ "
```

### Set up your `.gitignore`

Every research repo should have a `.gitignore` that covers common artifacts. At minimum:

```
# Python
__pycache__/
*.py[cod]
.env
venv/
.venv/

# Jupyter
.ipynb_checkpoints/

# Outputs and data (adjust per project)
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

> **Rule:** If you find yourself about to commit a file that isn't source code, a config, or documentation — stop and ask whether it belongs in `.gitignore`.

---

## The Workflow — Step by Step

### Step 1 — Sync Local Main

Always start new work from the latest upstream `main`.

```bash
git checkout main
git pull --rebase
```

> **Why `--rebase` and not just `git pull`?** Plain `git pull` can create a merge commit on your local `main` if your local and remote have diverged. `--rebase` keeps `main` clean. If you set `pull.rebase true` in your global config above, this is the default automatically.

---

### Step 2 — Create a Feature Branch

```bash
git checkout -b feature/descriptive-name
```

See [Branch Naming](#branch-naming) for conventions. Never work directly on `main`.

---

### Step 3 — Review Before You Touch Anything

Before making changes, know your baseline:

```bash
git status       # what files exist / are tracked
git log --oneline -10   # where you are in history
```

---

### Step 4 — Make Small, Logical Changes

Work in small units. A good commit is one that could be described in a single sentence and, if reverted, undoes exactly one logical thing.

**Bad:** Edit 12 files across 3 different features, commit everything at once.
**Good:** Finish one logical piece, commit it, move to the next.

---

### Step 5 — Review, Stage, and Commit

```bash
git status                  # see what changed
git diff                    # review changes before staging
git add <specific-files>    # stage intentionally — avoid git add .
git commit -m "type: concise description"
```

> **Never use `git add .` blindly.** Always check `git status` first. Generated outputs, temporary files, and secrets get committed this way.

See [Commit Message Convention](#commit-message-convention) for the message format.

---

### Step 6 — Rebase onto Latest Main

Before pushing, bring your branch up to date with `main` to catch and resolve any conflicts locally rather than in the PR.

```bash
git fetch origin
git rebase origin/main
```

**If there are conflicts:**

```bash
# Git will pause and show you the conflicting files
# Edit the files to resolve conflicts, then:
git add <resolved-files>
git rebase --continue

# If you want to abandon the rebase entirely:
git rebase --abort
```

> **When to rebase again:** If `main` moves significantly while your PR is open (other people's work has been merged), rebase again before merging. This keeps the diff reviewable and CI results meaningful.

---

### Step 7 — Push Branch

**First push (branch doesn't exist on remote yet):**

```bash
git push -u origin feature/descriptive-name
```

**Subsequent pushes after a rebase:**

```bash
git push --force-with-lease
```

See [Force Push — When and How](#force-push-when-and-how) for the full explanation.

---

### Step 8 — Open a Pull Request

On GitHub, open a PR from your branch into `main`.

A good PR description includes:

```
## What this does
Brief summary of the change.

## Why
Context — link to issue, research task, or experiment this relates to.

## Testing / Verification
How you verified this works.

## Notes for reviewer
Anything that needs explanation or a second opinion.
```

- Link any related issues (`Closes #42`)
- Wait for CI checks to pass before requesting review
- Assign at least one reviewer

---

### Step 9 — Address Review Feedback

When a reviewer requests changes:

```bash
# Make the changes
git add <files>
git commit -m "fix: address review feedback — [brief description]"
git push
```

> **Do not amend commits or force-push during an open review.** Adding new commits keeps the review history intact — reviewers can see exactly what changed in response to their feedback. Amending and force-pushing rewrites that history and makes re-review harder.

The PR updates automatically when you push.

---

### Step 10 — Merge the PR

On GitHub, use **Squash and Merge** (recommended) or **Rebase and Merge**.

| Merge strategy | What it does | When to use |
|---|---|---|
| **Squash and Merge** ✓ | Collapses all branch commits into one on `main` | Default — keeps `main` history clean regardless of branch commit quality |
| **Rebase and Merge** | Replays each branch commit onto `main` individually | When commits are already clean and you want them preserved |
| **Merge commit** ✗ | Creates a merge commit | Avoid — adds noise to `main` history |

When squashing, GitHub will prompt you to write the final commit message. Write it as if it's the only record of this work — it will be.

---

### Step 11 — Clean Up

```bash
git checkout main
git pull --rebase               # get the merged commit locally
git branch -d feature/descriptive-name   # delete local branch
```

The remote branch is auto-deleted if you have that setting enabled in GitHub (recommended: Settings → General → "Automatically delete head branches").

---

## Commit Message Convention

Use this format for every commit:

```
type: short description (max 72 chars)

Optional longer explanation after a blank line.
What changed and why — not how (the diff shows how).
```

### Types

| Type | Use for |
|---|---|
| `feat` | New feature or capability |
| `fix` | Bug fix |
| `analysis` | Research analysis, findings, experiments |
| `data` | Data pipeline changes, schema updates |
| `docs` | Documentation only |
| `refactor` | Code change that doesn't fix a bug or add a feature |
| `test` | Adding or updating tests |
| `chore` | Build process, dependency updates, tooling |
| `wip` | Work in progress (do not merge — squash before PR) |

### Examples

```
feat: add simulation_manifest block to attack trace output

analysis: run MAVLink verification with signing enabled

fix: correct severity count — by_severity now counts scenarios not traces

data: add sha256 to artifact manifest in run_log

docs: update git workflow with rebase force-push guidance
```

> **Rule of thumb:** If you can't describe a commit in one line of this format, it's probably doing too many things. Split it.

---

## Force Push — When and How

### The short version

Once you've pushed a branch and then rebased it locally, your local history and the remote history have diverged. A normal `git push` will be rejected. You need to force-push to overwrite the remote.

**Always use `--force-with-lease`, never `--force`:**

```bash
# Safe — fails if someone else pushed to this branch since your last fetch
git push --force-with-lease

# Unsafe — overwrites regardless of what's on the remote
git push --force   # ← never use this on a shared branch
```

### When force-push is appropriate

| Situation | Force-push? |
|---|---|
| You rebased your own solo feature branch | ✅ Yes — use `--force-with-lease` |
| You amended a commit on your own branch during active development | ✅ Yes — use `--force-with-lease` |
| A PR is open and under review | ⚠️ Avoid — add new commits instead (see Step 9) |
| The branch is shared with another contributor | ❌ No — coordinate first, they will need to reset |
| `main` or any protected branch | ❌ Never — branch protection should prevent this anyway |

> **The rule for this lab:** Force-push is fine on your own feature branch before a PR is open, or after a rebase during conflict resolution. Never force-push during an active review without telling your reviewer.

---

## Branch Naming

```
feature/short-description        # new capability
fix/what-is-broken               # bug fix
analysis/experiment-name         # research experiment or analysis run
data/schema-change-description   # data pipeline or schema work
docs/what-is-being-documented    # documentation only
research/topic-name              # exploratory research branches
```

**Rules:**
- Lowercase and hyphens only — no spaces, no underscores, no uppercase
- Descriptive enough that someone else knows what it is without asking
- Keep it under ~40 characters

---

## The Squash vs Rebase Question

This comes up often and causes confusion. Here is the full picture:

**Squash and Merge** is the right default for this lab because:

1. Research branches often have messy commit history (`wip: trying something`, `fix: typo`, `actually revert that`)
2. `main` should read like a changelog — one entry per feature, clean and understandable
3. Individual commits on a branch still exist until the branch is deleted — you haven't lost them during the PR review period

**Rebase and Merge** is appropriate when:

1. The branch commits are already clean and meaningful individually
2. You want them individually revertable on `main`
3. The branch represents several distinct logical changes that shouldn't be squashed together

**The practical upshot:**

```
Branch commit history:   wip → wip → fix typo → actually fix it → rebase cleanup
                                           ↓ Squash & Merge
main:                    feat: add simulation manifest block to attack trace
```

The rebase step (Step 6) is still worth doing even with Squash & Merge — it ensures your branch is up to date with `main` before the PR is reviewed, so CI runs against the actual merged state and reviewers aren't looking at conflicts.

---

## Research-Specific Rules

These apply specifically to research repositories where reproducibility and auditability matter.

### 1. Never commit generated outputs to source control

Put all generated files in `.gitignore`. If you need to share outputs, link to them (S3, Google Drive, lab server) in the PR description or README.

**Exception:** Small reference outputs that document expected behaviour (e.g. a known-good attack trace for a test) may be committed intentionally — do so explicitly and with a comment explaining why.

### 2. Commit your environment

```bash
# Python
pip freeze > requirements.txt
git add requirements.txt

# Node
# package-lock.json should always be committed
git add package-lock.json
```

If you change dependencies, commit the updated lockfile in the same commit.

### 3. Tag significant research milestones

When a version of the pipeline produces results you're publishing or presenting:

```bash
git tag -a v1.0-milcom2025 -m "Pipeline version used for MILCOM 2025 submission"
git push origin v1.0-milcom2025
```

Tags are permanent anchors — you can always return to exactly this state.

### 4. Link runs to commits

When you run the pipeline and produce results, record the git commit hash in the run log. This is what the `git_commit` field in `run_log.json` is for — it ties every output artifact back to the exact code that produced it.

### 5. Don't commit secrets

API keys, credentials, `.env` files — never. If you accidentally commit a secret:

```bash
# 1. Rotate the secret immediately (assume it's compromised)
# 2. Remove it from history:
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch path/to/secret-file" HEAD
# 3. Force-push all branches
# 4. Tell your lab supervisor
```

---

## Branch Protection Rules

These settings should be enabled on `main` in every lab repository. A maintainer sets these once in GitHub Settings → Branches.

| Rule | Setting |
|---|---|
| Require a pull request before merging | ✅ Enabled |
| Require at least 1 approval | ✅ Enabled |
| Dismiss stale pull request approvals when new commits are pushed | ✅ Enabled |
| Require status checks to pass before merging | ✅ Enabled (if CI exists) |
| Require branches to be up to date before merging | ✅ Enabled |
| Do not allow bypassing the above settings | ✅ Enabled (applies to admins too) |
| Allow force pushes | ❌ Disabled |
| Allow deletions | ❌ Disabled |

> These rules mean that even the lab supervisor cannot push directly to `main` — everyone goes through a PR. This is intentional and protects the integrity of the research record.

---

## Quick Reference Card

Save this or pin it somewhere visible.

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

---

*Maintained by the lab. Open a PR to propose changes to this workflow.*
