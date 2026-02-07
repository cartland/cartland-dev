# Claude Code Instructions

This file provides the initial instructions for Claude Code.

**First Action:** Immediately read the main contribution guidelines located at `.agent/AGENTS.md`. This file contains the required workflow and rules for all AI agents in this project. Do not proceed with any other actions until you have read and understood it.

For additional context on your role, also read the prompt in `.claude/PROMPT.md`.

## Self-Improvement

**You MUST update this file and `.agent/AGENTS.md` when you learn project-specific best practices.**

When you discover something that would help future sessions:

1. Add it to the appropriate section below
2. Create a PR for the update (don't leave it uncommitted)
3. Be specific and actionable

This ensures continuous learning across sessions.

## Task Tracker

Use `bd` (Beads) for task management.

### Quick Start

```bash
bd init              # Initialize in a git repo
bd create "task"     # Create a task
bd list              # List tasks
bd update <id> --status in_progress  # Start working on a task
bd close <id>        # Mark task complete
bd show <id>         # Show task details
bd help              # See all commands
```

## bd Stealth Mode (Quick Reference)

This project runs bd with `no-git-ops = true`. Key rules:

- Use bd normally for tracking work (`bd ready`, `bd create`, `bd close`)
- **NEVER commit `.beads/` files** — the user controls when those get committed
- At session end: `bd sync` only (flush to JSONL), no git add/commit of `.beads/`

## Validation (Quick Reference)

```bash
npm run format        # Format with Prettier
npm run check:format  # Check formatting
npm test              # Run all tests
```
