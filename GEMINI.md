# Gemini Development Guidelines

This document contains a set of best practices and conventions to follow when working on this project with the Gemini assistant.

## Code Formatting

To ensure code consistency and prevent CI failures, it is crucial to run the Prettier formatting script at the appropriate times.

**Command:**

```bash
npm run format
```

### When to Run `npm run format`

Run this command at the following times to keep the codebase clean:

1.  **After finishing a feature:** Once you've completed a logical chunk of work (like a feature or a bug fix).
2.  **Before creating a commit:** This is the most important time. Running it before you stage files ensures that only correctly formatted code is included in your commits.

Following these guidelines will help maintain a high standard of code quality and ensure a smooth CI/CD process.
