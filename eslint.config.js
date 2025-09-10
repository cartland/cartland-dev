// eslint.config.js
import globals from "globals";
import js from "@eslint/js";
import html from "eslint-plugin-html";
import prettierConfig from "eslint-config-prettier";

export default [
  // 1. Global ignores
  {
    ignores: ["node_modules/", "dist/", "build/"],
  },

  // 2. Base ESLint recommended rules
  js.configs.recommended,

  // 3. Configuration for Node.js files
  {
    files: ["check-links.js"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  // 4. Configuration for Browser JS files (Modules)
  {
    files: ["public/js/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.browser,
        "html2canvas": "readonly", // From external script
      },
    },
  },

  // 5. Configuration for HTML files
  {
    files: ["**/*.html"],
    plugins: {
      html: html,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        "overlay": "readonly", // Custom global in some HTML files
        "Chart": "readonly",   // From external script
      },
    },
  },

  // 6. Prettier integration (MUST BE LAST)
  prettierConfig,
];