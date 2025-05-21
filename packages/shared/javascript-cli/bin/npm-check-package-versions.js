#!/usr/bin/env node
import { validateVersion } from "../dist/validate-version.js";

const packagePaths = (process.env.npm_config_package_path ?? "")
  .split("\n\n")
  .map((packagePath) => packagePath.split(","))
  .flat();

const results = await Promise.allSettled(
  packagePaths.map(
    (packagePath) =>
      validateVersion({ packagePath: packagePath.replace(/"/g, "").trim() }) // strip any illegal path characters
  )
);

results.forEach((result) => {
  if (result.status === "fulfilled") {
    if (result.value.isNewVersion === false.toString()) {
      throw new Error(
        `Cannot publish due to version conflict in ${result.value.packageName}`
      );
    }
  } else if (result.status === "rejected") {
    throw new Error(`An unexpected error occurred: ${result.reason}`);
  }
});
