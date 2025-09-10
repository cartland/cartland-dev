# Plan: Refactor to JavaScript Modules

**Status:** `In Progress`

## 1. Goal

Refactor the inline JavaScript in `public/temperature-visualization.html` into a single directory of modern JavaScript modules. This will resolve the underlying cause of the ESLint errors and improve code organization.

---

## 2. Phase 1: File & Directory Setup

- [x] Create a new directory: `public/js/temperature-visualization`.
- [x] Create the following empty files inside the new directory:
    - [x] `api.js` (for data fetching)
    - [x] `colors.js` (for color calculations)
    - [x] `dom.js` (for HTML manipulation)
    - [x] `main.js` (for event listeners and initialization)
    - [x] `state.js` (for shared variables)

---

## 3. Phase 2: Code Extraction and Refactoring

- [x] **Read `temperature-visualization.html`:** Get the full content of the inline scripts.
- [x] **Refactor `colors.js`:**
    - [x] Move all color conversion functions (`hexToRgb`, `rgbToHsl`, `hslToRgb`, `rgbToHex`, `hsvToHsl`) and the `getColorForValue` function into `colors.js`.
    - [x] `export` all functions.
    - [x] `import` necessary state from `./state.js` and helper functions.
- [x] **Refactor `api.js`:**
    - [x] Move `loadTemperatureData` and `parseCSV` into `api.js`.
    - [x] `export` the `loadTemperatureData` function.
    - [x] `import` necessary state from `./state.js`.
- [x] **Refactor `state.js`:**
    - [x] Move all shared state variables (e.g., `monthlyBaselineTemps`, `annualOverallBaselineTempC`, `currentMode`, `lowColor`, color constants, etc.) into `state.js`.
    - [x] `export` all state variables. Use `let` for mutable variables.
- [x] **Refactor `dom.js`:**
    - [x] Move the `renderVisualization` function into `dom.js`.
    - [x] `export` the `renderVisualization` function.
    - [x] `import` all necessary functions and state from the other modules (`./api.js`, `./colors.js`, `./state.js`).
- [x] **Refactor `main.js`:**
    - [x] Move all `DOMContentLoaded` and other event listener setup into `main.js`.
    - [x] `import` `renderVisualization` and other functions needed to orchestrate the application.
- [x] **Update `temperature-visualization.html`:**
    - [x] Remove all inline `<script>` blocks containing application logic.
    - [x] Add a single `<script type="module" src="/js/temperature-visualization/main.js"></script>` at the end of the `<body>`.

---

## 4. Phase 3: Verification

- [x] **Run Linter:** Run `npm run test:js` and verify there are no errors.
- [x] **Run Tests:** Run `npm test` to ensure no existing tests are broken.
- [x] **Manual Check:** Ask the user to manually open `public/temperature-visualization.html` in their browser to confirm full functionality.

---

## 5. Phase 4: Finalization

- [ ] Commit all the new and modified files.
- [ ] Push the `feature/modernize-linting-setup` branch.
- [ ] Notify the user that the refactoring is complete.
