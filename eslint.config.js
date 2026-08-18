// eslint.config.js
import globals from 'globals'
import js from '@eslint/js'
import html from 'eslint-plugin-html'
import prettierConfig from 'eslint-config-prettier'

export default [
  // 1. Global ignores
  {
    ignores: [
      'node_modules/',
      'dist/',
      'build/',
      'public/v2/',
      'public/v3/',
      'v3/.astro/',
      'site/',
      'apps/**/build/',
      'test-results/',
      'playwright-report/',
      'tests/e2e/',
    ],
  },

  // 2. Base ESLint recommended rules
  js.configs.recommended,

  // 3. Configuration for Node.js files
  {
    files: ['check-links.js', 'babel.config.js', 'jest.config.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  // 3b. Configuration for test files
  {
    files: ['tests/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },

  // 4. Configuration for Browser JS files (Modules)
  {
    files: ['public/js/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
        html2canvas: 'readonly', // From external script
      },
    },
  },

  // 4b. Configuration for v3 (Astro) browser modules
  {
    files: ['v3/src/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },

  // 4c. Configuration for the v3 Astro config (Node)
  {
    files: ['v3/astro.config.mjs'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  // 5. Configuration for HTML files
  {
    files: ['**/*.html'],
    plugins: {
      html: html,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        overlay: 'readonly', // Custom global in some HTML files
        Chart: 'readonly', // From external script
      },
    },
  },

  // 6. Prettier integration (MUST BE LAST)
  prettierConfig,
]
