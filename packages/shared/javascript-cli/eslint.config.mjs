import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";
import globals from "globals";
import { includeIgnoreFile } from "@eslint/compat";
import path from "node:path";

const gitignorePath = path.resolve(
  process.env.npm_package_config_root,
  ".gitignore"
);

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  includeIgnoreFile(gitignorePath),
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parserOptions: {
        projectService: {
          allowDefaultProject: ["*.config.mjs", "bin/*.js"],
          defaultProject: "tsconfig.json",
        },
        tsconfigRootDir: process.cwd(),
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
          varsIgnorePattern: "^_",
          ignoreRestSiblings: false,
        },
      ],
    },
  },
  prettierConfig
);
