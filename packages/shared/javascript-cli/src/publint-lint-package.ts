import { publint } from "publint";
import { formatMessage } from "publint/utils";
import { readPackageFile } from "./utils.js";

export const lintPackage = async (args: {
  packagePath: string;
  strict?: boolean;
}) => {
  console.log(
    "[@what3words/javascript-cli:publint-lint-package] Started"
    // args
  );
  const { packagePath, strict = true } = args;

  const packageFile = await readPackageFile(packagePath);

  const { messages } = await publint({ pkgDir: packagePath, pack: "npm" });

  for (const message of messages) {
    console.error(
      "[@what3words/javascript-cli:publint-lint-package] Publint Result",
      formatMessage(message, packageFile)
    );
  }

  if (messages.length) {
    console.error("[@what3words/javascript-cli:publint-lint-package] Failed");
    if (strict) {
      process.exit(1);
    }
  } else {
    console.error(
      "[@what3words/javascript-cli:publint-lint-package] Successful"
    );
  }

  console.log("[@what3words/javascript-cli:publint-lint-package] Completed");
};
