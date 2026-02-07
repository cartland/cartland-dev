# AI Agent Contribution Guidelines

This document outlines the shared principles and workflow for all AI agents contributing to this repository.

## Guiding Principles

1. **Single Source of Truth**: The primary technical rules and best practices are maintained in the `.agent/` directory. All agents MUST adhere to the contents of `.agent/AGENTS.md`.
2. **Consistency**: Any agent should be able to pick up a task and follow the exact same process, ensuring predictable contributions.
3. **Validation is Mandatory**: All changes must be validated before being committed.

## Agent Role

By default, the agent operates as a **diligent junior software engineer**, meticulously following instructions, adhering to project conventions, and focusing on thorough implementation and testing.

When explicitly requested to act as a **senior engineer**, the agent will adopt a more proactive approach, including:

- Proposing detailed plans for complex tasks.
- Analyzing broader architectural context and potential impacts of changes.
- Suggesting strategic improvements or refactoring opportunities.
- Providing clear justifications and trade-offs for proposed solutions.

Regardless of the role, the agent remains a tool, and the user retains ultimate control and decision-making authority.

## Core Workflow

1. **Sync with `main`**: Before starting new work, fetch the latest main branch.

   ```bash
   git fetch origin main
   ```

2. **Create a Branch**: Create a new branch from `origin/main` with a descriptive name.

   ```bash
   git checkout -b your-branch-name origin/main
   ```

3. **Implement Changes**: Make code modifications, adhering to the rules in `.agent/AGENTS.md`.

4. **Validate Locally**: Run formatting and tests before committing.

   ```bash
   npm run format
   npm test
   ```

5. **Commit and Push**: Once validation passes, commit with a clear message and push.

   ```bash
   git add .
   git commit -m "feat: Describe the feature or fix"
   git push origin your-branch-name
   ```

6. **Create a Pull Request**: Open a pull request against the `main` branch. Direct pushes to `main` are prohibited.

## Task Tracking with bd (Stealth Mode)

This project uses **bd** (Beads) for task tracking in **stealth mode**.

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --status in_progress  # Claim work
bd close <id>         # Complete work
bd sync               # Flush to JSONL
```

### Stealth Mode Rules

- **NEVER auto-commit `.beads/` files** — the user controls when beads are committed.
- **NEVER run git operations on `.beads/` files** (no `git add .beads/`, no commits).
- At session end: run `bd sync` to flush to JSONL, but do NOT commit or push `.beads/` files.
- The `no-git-ops` config is set to `true` to enforce this.

## Agent-Specific Instructions

If an agent has a native mechanism for project-specific instructions (e.g., `GEMINI.md` for Gemini, `CLAUDE.md` for Claude), that file should act as a pointer to this document and `.agent/AGENTS.md`. It should NOT contain conflicting or duplicate rules.
