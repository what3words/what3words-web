import * as path from "path";
import * as fs from "fs";

/**
 * https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string
 */
const SEMVER_REGEX =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

/** An _incomplete_ representation of package.json. */
interface PackageFile {
  name: string;
  version: string;
  [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

async function readPackageFile(packagePath: string): Promise<PackageFile> {
  return await new Promise((resolve, reject) => {
    const packageFilePath = path.join(packagePath, "package.json");
    try {
      fs.readFile(packageFilePath, (err, data) => {
        if (err) reject(err);
        resolve(JSON.parse(data.toString()));
      });
    } catch (err) {
      reject(err);
    }
  });
}

export { readPackageFile, SEMVER_REGEX };
export type { PackageFile };
