#!/usr/bin/env node
import { lintPackage } from "../dist/publint-lint-package.js";

const packagePath = process.env.npm_config_package_path;
const strict =
  (process.env.npm_config_strict ?? "").toLowerCase() === true.toString();

lintPackage({ packagePath, strict }).catch(console.error);
