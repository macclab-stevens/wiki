# MACC Lab Documentation

This repository contains the source files for the MACC Lab technical documentation site.

The site is built with MkDocs Material and deployed with GitHub Pages.

## Local setup

```bash
python -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
```

On Windows PowerShell:

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

## Preview locally

```bash
mkdocs serve
```

Open:

```text
http://127.0.0.1:8000/
```

## Build locally

```bash
mkdocs build --strict
```

## Editing docs

All documentation pages are Markdown files in the `docs/` directory.

Create a branch, edit files, and open a pull request.

## Safety note

Do not commit passwords, tokens, private keys, controlled data, export-controlled data, private hostnames, sensitive project details, or anything that should not be public.
