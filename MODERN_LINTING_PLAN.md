# Modern Linting & Formatting Plan

**Status:** `In Progress`

## 1. Goal

Overhaul the project's linting and formatting to use a modern, standard stack: ESLint v9 for code quality and Prettier for code formatting. This will replace the legacy `eslint-config-standard` setup.

**Instructions for Gemini:**

- **Maintain this Plan:** You MUST update this file after every step.
- **Track Progress:** Mark checkboxes (`[x]`) as tasks are completed.
- **Update Status:** Change the `Status` field at the top of this file as you move through the phases.
- **Verify:** After any installation or configuration change, run the appropriate verification command.

---

## 2. Phase 1: Cleanup & Preparation

- [x] Delete the old `NPM_MAJOR_UPDATE_PLAN.md` file.
- [x] Rename the current git branch to `feature/modernize-linting-setup`.
- [x] Uninstall legacy packages: `eslint-config-standard` and `eslint-plugin-html`.
- [x] Delete the auto-generated `eslint.config.mjs` file.
- [x] Delete the old `.eslintrc.json` file.

---

## 3. Phase 2: Install Modern Tooling

- [x] Install `prettier`.
- [x] Install `eslint-config-prettier`.
- [x] Verify `eslint` and `@eslint/js` are installed from the previous migration attempt.

---

## 4. Phase 3: Configuration

- [x] Create a new `eslint.config.js` file configured to use `eslint:recommended` and `eslint-config-prettier`.
- [x] Create a `.prettierrc.json` file to define a consistent code style.
- [x] Create a `.prettierignore` file to exclude irrelevant files from formatting.
- [x] Update the `package.json` scripts to include a `format` and `check:format` command.

---

## 5. Phase 4: Execution & Verification

- [ ] Run Prettier to format the entire project.
- [ ] Run the linter (`npm run test:js`) to check for any remaining code-quality issues.
- [ ] Run the full test suite (`npm test`) to ensure no regressions have been introduced.

---

## 6. Phase 5: Finalization

- [ ] Commit all the new configuration files and the reformatted code.
- [ ] Push the `feature/modernize-linting-setup` branch to the remote repository.
- [ ] Notify the user that the plan is complete and the branch is ready for a pull request.
