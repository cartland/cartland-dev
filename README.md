# Personal Website

This repository contains the source code for my personal website, [chriscart.land](https://chriscart.land). It's a minimalist, responsive site built with vanilla HTML, CSS, and JavaScript, and deployed on Firebase Hosting.

## Overview

The primary goal of this project is to serve as a clean, accessible, and fast-loading portfolio. It showcases various professional and personal projects, ranging from large-scale Google initiatives to personal explorations in sustainable technology and interactive art.

## Key Features

- **Modern Tooling**: Uses ESLint for code quality and Prettier for consistent formatting.
- **Responsive Design**: Adapts to all screen sizes, from mobile to desktop.
- **Accessible**: Designed with keyboard navigation and screen reader support in mind.
- **Performant**: Optimized for fast loading with minimal dependencies.
- **Automated**: CI/CD is handled by GitHub Actions for automated testing and deployment.

## Code Structure

The project is organized into a few key directories:

```
.
├── public/                # All static files served by Firebase
│   ├── js/                # JavaScript modules
│   │   └── temperature-visualization/ # Refactored JS for the temp viz
│   ├── index.html        # Home page
│   ├── projects.html     # Projects page
│   └── ...               # Other HTML, images, and assets
├── .github/               # GitHub Actions workflows
│   └── workflows/
│       └── ci.yml        # Continuous Integration checks
│       └── firebase-hosting-merge.yml # Production deployment
├── eslint.config.js       # ESLint v9 flat configuration
├── .prettierrc.json       # Prettier formatting rules
└── firebase.json          # Firebase Hosting configuration
```

A significant part of this project was refactoring the `temperature-visualization.html` page from inline scripts into modern, modular JavaScript files located in `public/js/temperature-visualization/`. This makes the code more maintainable, testable, and easier for static analysis tools to understand.

## Development Setup

To get started with local development, follow these steps:

1.  **Install Dependencies:**
    This project uses Node.js for its development tooling.

    ```bash
    npm install
    ```

2.  **Start the Local Server:**
    The site can be served locally using the Firebase emulator.

    ```bash
    firebase serve
    ```

    The site will be available at `http://localhost:5000`.

## Testing and Quality

This project uses several tools to maintain code quality and correctness.

- **`npm run check:format`**: Checks for code formatting issues using Prettier.
- **`npm run test:html`**: Validates HTML files using `html-validate`.
- **`npm run test:css`**: Lints CSS using `stylelint`.
- **`npm run test:js`**: Lints JavaScript using ESLint.
- **`npm run test:links`**: Checks for broken links on the site.

To run all checks at once, use the primary test command:

```bash
npm test
```

These checks are automatically run by the CI workflow on every pull request.

## Deployment

The site is automatically deployed to Firebase Hosting via GitHub Actions.

- **Pull Requests**: Trigger a preview deployment to a temporary URL.
- **Merges to `main`**: Trigger a production deployment to the live site.

Manual deployments can be performed with the Firebase CLI:

```bash
firebase deploy
```

## License

ISC License

## Author

Christopher Cartland
