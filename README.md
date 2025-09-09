# Personal Website

A minimalist, responsive personal website built with HTML, CSS, and vanilla JavaScript, deployed on Firebase Hosting.

**Live site:** [chriscart.land](https://chriscart.land)

## Features

- Responsive design that works on all devices
- Accessible navigation with keyboard support
- Progressive Web App (PWA) support
- Fast loading with optimized images
- Clean URLs using Firebase Hosting rewrites

## Project Structure

    .
    ├── public/                # Static files served by Firebase
    │   ├── index.html        # Home page
    │   ├── projects.html     # Projects page
    │   ├── 404.html          # Custom 404 page
    │   ├── manifest.json     # PWA manifest
    │   ├── i/                # Image assets
    │   └── favicon.ico       # Site favicon
    ├── .github/               # GitHub Actions workflows
    │   └── workflows/        # Deployment configurations
    ├── firebase.json          # Firebase configuration
    └── .firebaserc            # Firebase project settings

## Development

1. Install dependencies:
```bash
npm install
```

2. Start local development server:
```bash
firebase serve
```

The site will be available at `http://localhost:5000`

## Testing

This project uses linting to enforce code quality and catch errors. The following checks are run:

- `npm run test:html`: Validates HTML files using `html-validate`.
- `npm run test:css`: Lints CSS files using `stylelint`.
- `npm run test:js`: Lints JavaScript files using `eslint`.

To run all tests, use:
```bash
npm test
```

The tests are automatically run on every pull request and before deployment.

## Deployment

The site automatically deploys to Firebase Hosting through GitHub Actions:

- Pull requests trigger preview deployments
- Merges to main branch trigger production deployments

Manual deployment can be done with:
```bash
firebase deploy
```

## GitHub Actions

A workflow is configured for automated deployments:

**Merge Workflow** (.github/workflows/firebase-hosting-merge.yml)
   - Triggers on merges to main branch
   - Deploys to production
   - Updates the live site at chriscart.land

Workflows require the following GitHub Actions secrets:
- `FIREBASE_SERVICE_ACCOUNT_CARTLAND_DEV`
- `GITHUB_TOKEN`

## Firebase Configuration

The site uses Firebase Hosting with clean URLs and custom rewrites for a better user experience. Configuration can be found in `firebase.json`.

## License

ISC License

## Author

Christopher Cartland
