#!/usr/bin/env node
import * as core from "@actions/core";
import { validateVersion } from "../dist/validate-version.js";

const packagePaths = (process.env.npm_config_package_path ?? "")
  .split("\n\n")
  .map((packagePath) => packagePath.split(","))
  .flat();
const isNewVersionArray = [];

try {
  core.debug(`Verifying package versions: ${packagePaths}`);

  const results = await Promise.allSettled(
    packagePaths.map(
      (packagePath) =>
        validateVersion({ packagePath: packagePath.replace(/"/g, "").trim() }) // strip any illegal path characters })
    )
  );

  const checkedPackageVersions = results.reduce((acc, result) => {
    if (result.status === "fulfilled") {
      const { name, ...restResult } = result.value;

      acc[name] = restResult;
      isNewVersionArray.push(restResult.isNewVersion);

      return acc;
    } else if (result.status === "rejected") {
      throw new Error(`An unexpected error occurred: ${result.reason}`);
    }
  }, {});

  core.setOutput(
    "checked-package-versions",
    JSON.stringify(checkedPackageVersions)
  );
  core.setOutput(
    "can-publish",
    JSON.stringify(
      isNewVersionArray.every((isNewVersion) => isNewVersion === "true")
    )
  );
} catch (error) {
  core.setFailed(error.message);
}
