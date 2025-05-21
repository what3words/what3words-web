#!/usr/bin/env node

/**
 * Script to convert phrase json files into javascript files
 */
const { readdir, readFileSync, existsSync, writeFileSync } = require("fs");
const { execSync } = require("child_process");
const { extname, join } = require("path");
const { prettierFormat } = require("./prettier");

const PHRASE_CMD = join(
  process.env.npm_package_config_root,
  ".wrappers/phrasew"
);
const PHRASE_CONFIG_PATH = process.argv["2"];
const TRANSLATIONS_PATH = "src/translations";
const SOURCE_TRANSLATIONS_PATH = `${TRANSLATIONS_PATH}/phrase`;
const JSON_FILE_EXT = ".json";
const GENERATED_FILE_COMMENT = `/** GENERATED FILE - DO NOT MODIFY */\n`;

const DEFAULTS = {
  buildEnabled: false,
  syncEnabled: false,
};

const envConfig = {
  buildEnabled: JSON.parse(
    process.env.PHRASE_BUILD_ENABLED || DEFAULTS.buildEnabled
  ),
  syncEnabled: JSON.parse(
    process.env.PHRASE_SYNC_ENABLED || DEFAULTS.syncEnabled
  ),
};

if (envConfig.syncEnabled) {
  // execute phrase cli commands if path to executable wrapper exists
  if (existsSync(PHRASE_CMD)) {
    process.stdout.write(
      `\x1b[1m\x1b[35mPHRASE\x1b[0m\x1b[0m: Pulling translations\n`
    );
    const phraseOutput = execSync(
      `${PHRASE_CMD} pull --config ${PHRASE_CONFIG_PATH}`
    );
    process.stdout.write(
      `\x1b[1m\x1b[35mPHRASE:\x1b[0m\x1b[0m Output:\n-----------------------\n${phraseOutput}\n-----------------------\n`
    );
  } else {
    process.stderr.write(
      `\x1b[1m\x1b[35mPHRASE\x1b[0m\x1b[0m: Error: Phrase CLI not found at ${PHRASE_CMD}\n`
    );
    process.exit(1);
  }
} else {
  process.stdout.write(
    `\x1b[1m\x1b[35mPHRASE\x1b[0m\x1b[0m: Pulling translations (\x1b[1m\x1b[35mskipped\x1b[0m\x1b[0m)\n`
  );
}

if (envConfig.buildEnabled) {
  process.stdout.write(
    `\x1b[1m\x1b[35mPHRASE\x1b[0m\x1b[0m: Building translations target\n`
  );
  readdir(SOURCE_TRANSLATIONS_PATH, async (err, files) => {
    if (err) {
      process.stderr.write(
        `\x1b[1m\x1b[35mPHRASE\x1b[0m\x1b[0m: Error: ${err}\n`
      );
    }

    if (files) {
      process.stdout.write(
        `\x1b[1m\x1b[35mPHRASE\x1b[0m\x1b[0m: Building ${TRANSLATIONS_PATH}/index.ts from ${SOURCE_TRANSLATIONS_PATH}\n`
      );
      const languageCodes = [];
      let languagesContent = `${GENERATED_FILE_COMMENT}`;
      files
        .filter((file) => extname(file) === JSON_FILE_EXT)
        .forEach((file) => {
          const languageCode = file
            .slice(0, -JSON_FILE_EXT.length)
            .toLowerCase();
          languageCodes.push(languageCode);
          // get json file's content
          const translation = readFileSync(
            `${SOURCE_TRANSLATIONS_PATH}/${file}`,
            "utf-8"
          );
          // only generate the ts file if translation exists
          if (translation) {
            const language = languageCode.replaceAll("-", "_");
            const fileContent = `export const ${language} = Object.freeze(${translation});`;
            languagesContent += `${fileContent}\n`;
          }
        });
      if (languagesContent.length > 0) {
        prettierFormat(languagesContent).then((formattedContent) => {
          writeFileSync(`${TRANSLATIONS_PATH}/index.ts`, formattedContent);
          process.stdout.write(
            `\x1b[1m\x1b[35mPHRASE\x1b[0m\x1b[0m: Successfully built translations for \x1b[35m${languageCodes.length}\x1b[0m locales\n`
          );
        });
      }
    }
  });
} else {
  process.stdout.write(
    `\x1b[1m\x1b[35mPHRASE\x1b[0m\x1b[0m: Building translations target (\x1b[1m\x1b[35mskipped\x1b[0m\x1b[0m)\n`
  );
}

if (envConfig.syncEnabled || envConfig.buildEnabled) {
  execSync(`npm run format -- --write`);
}
