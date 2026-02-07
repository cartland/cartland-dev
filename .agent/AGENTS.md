# AI Agent Technical Rules

This is the single source of truth for all AI agent instructions in this project.

- **`AGENTS.md` (This file):** Technical rules and project-specific guidelines.
- **`rules.md`:** Entry point that redirects here.

## Code Formatting

All code must be formatted with **Prettier** before committing.

```bash
# Format all files
npm run format

# Check formatting without modifying files
npm run check:format
```

## Validation

Before committing any changes, run the full validation suite:

```bash
npm run check:format
npm test
```

The `npm test` command runs: unit tests (Jest), HTML validation, CSS linting (Stylelint), JS linting (ESLint), and link checking.

## CI / CD

- **Pull Requests**: Firebase Hosting generates a preview deploy.
- **Merge to main**: Automatically deploys to staging and production via Firebase Hosting.
- Always verify your PR's preview deploy works before requesting merge.

## Critical Rules

1. **NEVER Push Directly to `main`**:
   - Always create a feature branch.
   - Always open a Pull Request for changes.

2. **NEVER Deploy Without Permission**:
   - Firebase Hosting deploys automatically on merge to `main`.
   - Do not manually trigger deploys without explicit user approval.

3. **ALWAYS Ask Before Destructive or Irreversible Actions**:
   - Force-pushing, deleting branches on remote, or any action that affects production requires explicit confirmation.

## Git Workflow

```bash
# Start new work
git fetch origin main
git checkout -b your-branch-name origin/main

# Before committing
npm run format
npm test

# Commit and push
git add .
git commit -m "feat: Describe the change"
git push origin your-branch-name

# Create PR
gh pr create --title "feat: Title" --body "Description"
```

## Self-Improvement

Update this file and `.agent/rules.md` when you learn project-specific best practices. Create a PR for the update — don't leave it uncommitted.

## bd Stealth Mode

This project uses bd with `no-git-ops` set to `true`. This means:

- Agents use bd for task tracking (`bd ready`, `bd create`, `bd close`).
- Agents do **NOT** commit `.beads/` files. The user controls when those get committed.
- At session end: run `bd sync` to flush to JSONL, but do NOT run `git add .beads/` or commit.

```bash
# Verify stealth mode is active
bd config get no-git-ops   # Should return true

# Session end protocol
bd sync                    # Flush to JSONL only
# Do NOT: git add .beads/ && git commit
```
