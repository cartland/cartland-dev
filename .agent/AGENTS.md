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

HTML validation and link checking run against build output, so build first:

```bash
npm run build     # builds v2 (VitePress → public/v2) and v3 (Astro → public/v3)
npm test
npx playwright test   # e2e for v2 (VitePress preview) and v3 (http-server)
```

## Site Versions

- `public/` root: v1, the live hand-written site. Do not restyle v1 pages.
- `site/`: v2 source (VitePress), builds to `public/v2/` (gitignored).
- `v3/`: v3 source (Astro), builds to `public/v3/` (gitignored). Shared
  assets (`/i/`, `/global-temperatures/`, favicon, manifest) live once at the
  hosting root and are referenced with root-absolute paths — do not copy them
  into `v3/`. Content images go through the build-time optimizer: resolve
  them with `sharedImage()` from `v3/src/lib/images.ts` and render with
  `astro:assets` (`<Image>`), which emits resized WebP under `/v3/_astro/`.
  `public/i/MaraudersMap.gif` is kept for reference only — pages serve
  `MaraudersMap.mp4` / `MaraudersMapPoster.jpg` instead; do not reference
  the GIF from any page. Canonical URLs for v3 pages intentionally point at the root
  paths until cutover (see `v3/src/lib/site.js`).

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
