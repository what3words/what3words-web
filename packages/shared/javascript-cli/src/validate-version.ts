import { readPackageFile, SEMVER_REGEX } from "./utils.js";
import packageJson from "package-json";

/**
 * Adapted from https://github.com/PostHog/check-package-version/blob/v2/src/main.ts
 */
async function validateVersion(args: { packagePath: string }) {
  console.log(
    "[@what3words/javascript-cli:validate-version] Started"
    // args
  );
  const { packagePath } = args;

  const packageFile = await readPackageFile(packagePath);

  console.log(
    `[@what3words/javascript-cli:validate-version] Fetching package ${packageFile.name} information from npm`
  );
  const packageNpm = await packageJson(packageFile.name, {
    allVersions: true,
  });
  const isNewVersion = !Object.keys(packageNpm.versions).includes(
    packageFile.version
  );

  const semverRegex = new RegExp(SEMVER_REGEX);
  const [version, _major, _minor, _patch, prerelease] =
    semverRegex.exec(packageFile.version) || [];

  const result = {
    committedVersion: version,
    isNewVersion: isNewVersion.toString(),
    name: packageFile.name,
    path: packagePath,
    publishedVersion: packageNpm["dist-tags"].latest,
    isPrerelease: (!!prerelease).toString(),
  };

  console.log(
    "[@what3words/javascript-cli:validate-version] Completed"
    // result
  );

  return result;
}

export { validateVersion };
