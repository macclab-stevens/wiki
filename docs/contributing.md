# Contributing

Thank you for contributing to the MACC Lab documentation.

## How to contribute

1. Fork or clone the repository
2. Create a branch with a descriptive name:
   ```text
   docs/<short-description>
   ```
3. Edit or add Markdown files in the `docs/` directory
4. Preview your changes locally:
   ```bash
   mkdocs serve
   ```
5. Commit and push your branch
6. Open a pull request

## Local setup

See the [README](https://github.com/macclab-stevens/wiki#local-setup) for local setup instructions.

## Writing guidelines

- Use plain, clear language
- Use second person ("you") for instructions
- Use numbered lists for sequential steps
- Use bullet lists for non-sequential items
- Use code blocks for all commands and file content
- Use admonitions for warnings and notes:

  ```markdown
  !!! warning
      Important safety note here.

  !!! note
      Informational aside here.
  ```

## Safety rules

Do not add any of the following to documentation:

- Passwords, tokens, or credentials
- SSH private keys or API keys
- Real internal hostnames or IP addresses (unless approved)
- Controlled Unclassified Information
- Export-controlled technical data
- Student personal information
- Sponsor-marked sensitive material

Use placeholders instead:

```text
<cluster-hostname>
<username>
<project-storage-path>
```

## File naming

- Use lowercase with hyphens: `my-new-page.md`
- Add new pages to the `nav:` section in `mkdocs.yml`

## Questions

Open a GitHub issue or contact the lab administrator.
