async function prettierFormat(content = "") {
  process.stdout.write(
    `\x1b[1m\x1b[35mPRETTIER\x1b[0m\x1b[0m: Formatting content\n`
  );
  let prettier;

  try {
    prettier = require("prettier");
  } catch {
    process.stderr.write(
      `\x1b[1m\x1b[35mPRETTIER\x1b[0m\x1b[0m: Module not found\n`
    );
  }

  if (prettier) {
    const parserConfig = await prettier.resolveConfig("./");
    const options = {
      ...parserConfig,
      parser: "babel",
    };
    const output = await prettier.format(content, options);
    process.stdout.write(
      `\x1b[1m\x1b[35mPRETTIER\x1b[0m\x1b[0m: Formatting content (\x1b[1m\x1b[35mcompleted\x1b[0m\x1b[0m)\n`
    );
    return output;
  } else {
    process.stdout.write(
      `\x1b[1m\x1b[35mPRETTIER\x1b[0m\x1b[0m: Formatting content (\x1b[1m\x1b[35mskipped\x1b[0m\x1b[0m)\n`
    );
    return content;
  }
}

module.exports = { prettierFormat };
