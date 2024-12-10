# Personal Website

A minimalist, responsive personal website built with HTML, CSS, and vanilla JavaScript, deployed on Firebase Hosting.

## Features

- Responsive design that works on all devices
- Accessible navigation with keyboard support
- Dark theme optimized for readability
- Progressive Web App (PWA) support
- Fast loading with optimized images
- Clean URLs using Firebase Hosting rewrites

## Project Structure

    .
    ├── public/               # Static files served by Firebase
    │   ├── index.html       # Home page
    │   ├── projects.html    # Projects page
    │   ├── 404.html        # Custom 404 page
    │   ├── manifest.json    # PWA manifest
    │   └── images/         # Image assets
    ├── .github/             # GitHub Actions workflows
    ├── firebase.json        # Firebase configuration
    └── .firebaserc         # Firebase project settings

## Development

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Start local development server:
```bash
firebase serve
```

The site will be available at `http://localhost:5000`

## Deployment

The site automatically deploys to Firebase Hosting through GitHub Actions:

- Pull requests trigger preview deployments
- Merges to main branch trigger production deployments

Manual deployment can be done with:
```bash
firebase deploy
```

## GitHub Actions

Two workflows are configured for automated deployments:

1. **Pull Request Workflow** (.github/workflows/firebase-hosting-pull-request.yml)
   - Triggers on pull requests
   - Creates preview deployments
   - Adds preview URL to pull request comments

2. **Merge Workflow** (.github/workflows/firebase-hosting-merge.yml)
   - Triggers on merges to main branch
   - Deploys to production
   - Updates the live site at chriscart.land

Both workflows require the following secrets:
- `FIREBASE_SERVICE_ACCOUNT_CARTLAND_DEV`
- `GITHUB_TOKEN`

## Firebase Configuration

The site uses Firebase Hosting with clean URLs and custom rewrites for a better user experience. Configuration can be found in `firebase.json`.

## License

ISC License

## Author

Christopher Cartland