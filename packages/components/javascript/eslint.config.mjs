import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";
import globals from "globals";
import path from "node:path";
import { includeIgnoreFile } from "@eslint/compat";

const gitignorePath = path.resolve(
  process.env.npm_package_config_root,
  ".gitignore"
);

const scriptsConfig = {
  files: ["scripts/*.js"],
  languageOptions: {
    globals: {
      ...globals.browser,
      ...globals.node,
    },
  },
  rules: {
    "@typescript-eslint/no-require-imports": "off",
  },
};

/**
 * Eslint rules specific to StencilJS.
 * TODO: Replace with [@stencil/eslint-plugin](https://github.com/stenciljs/eslint-plugin)/[@stencil-community/eslint-plugin](https://github.com/stencil-community/stencil-eslint) once module import issue is resolved and typescript-eslint ^8 is [supported](https://github.com/stenciljs/eslint-plugin/issues/104)
 */
const stencilConfig = {
  languageOptions: {
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
  rules: {
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        args: "all",
        argsIgnorePattern: "^_",
        caughtErrors: "all",
        caughtErrorsIgnorePattern: "^_",
        destructuredArrayIgnorePattern: "^_",
        varsIgnorePattern: "^(_|h)",
        ignoreRestSiblings: false,
      },
    ],
  },
};

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  includeIgnoreFile(gitignorePath),
  stencilConfig,
  scriptsConfig,
  prettierConfig
);
