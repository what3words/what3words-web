import { readFileSync, writeFileSync } from "fs";
import type { JsonDocs, JsonDocsComponent } from "@stencil/core/internal";

const config = {
  angular: {
    srcPath: "../angular/components",
  },
  javascript: {
    srcPath: ".",
  },
  react: {
    srcPath: "../react",
  },
  vue: {
    srcPath: "../vue",
  },
};

const TAGS = {
  "build-information": "meta:build-information",
  "what3words-autosuggest": "usage:what3words-autosuggest",
  "what3words-map": "usage:what3words-map",
  "what3words-notes": "usage:what3words-notes",
};

const PLACEHOLDERS: Record<string, { regex: RegExp; value: string }> = {
  packageVersion: {
    regex: /<PACKAGE-VERSION>/g,
    value: process.env.npm_package_version || "latest",
  },
};

const getDirectiveRegexFromTag = (tag: string) =>
  new RegExp(`(<!-- begin:${tag} -->)([\\s\\S]*)(<!-- end:${tag} -->)`, "g");

type FRAMEWORK = keyof typeof config;
type TAG = keyof typeof TAGS;
type DOCS = Partial<Record<FRAMEWORK, Record<"path" | "content", string>>>;

export function readmeGenerator(docs: JsonDocs) {
  process.stdout.write(
    `\x1b[1m\x1b[35mDOCS\x1b[0m\x1b[0m: Updating component package documentation\n`
  );
  const updatedDocs: DOCS = {};

  docs.components.forEach((component: JsonDocsComponent) => {
    Object.keys(component.usage).forEach((framework) => {
      let sourceUsageContent = `${component.usage[framework]}`;
      const f = framework.toLowerCase();
      const targetReadmePath = `${config[f as FRAMEWORK].srcPath}/README.md`;
      const targetReadmeContent =
        updatedDocs[f as FRAMEWORK]?.content ??
        readFileSync(targetReadmePath, "utf-8"); // aggregate every component usage example

      process.stdout.write(
        `\x1b[1m\x1b[35mDOCS\x1b[0m\x1b[0m: Updating \x1b[35m${f}\x1b[0m usage documentation\n`
      );
      const targetDirective = TAGS[component.tag as TAG];
      const directiveRegex = getDirectiveRegexFromTag(targetDirective);

      process.stdout.write(
        `\x1b[1m\x1b[35mDOCS\x1b[0m\x1b[0m: Loading \x1b[35m${f}\x1b[0m readme at \x1b[35m${targetReadmePath}\x1b[0m\n`
      );

      process.stdout.write(
        `\x1b[1m\x1b[35mDOCS\x1b[0m\x1b[0m: Locating \x1b[35m${f}\x1b[0m directive: ${targetDirective}\n`
      );

      const matches = [...targetReadmeContent.matchAll(directiveRegex)];
      const match = matches[0]; // we assume there will only ever be a single match in a document

      if (!match) return;

      process.stdout.write(
        `\x1b[1m\x1b[35mDOCS\x1b[0m\x1b[0m: Found \x1b[35m${f}\x1b[0m directive: ${targetDirective}:${match.index}\n`
      );

      sourceUsageContent = sourceUsageContent.replace(/# /g, " "); // downrank headings by one
      // replace placeholders with respective values
      Object.keys(PLACEHOLDERS).forEach((k) => {
        sourceUsageContent = sourceUsageContent.replace(
          PLACEHOLDERS[k].regex,
          PLACEHOLDERS[k].value
        );
      });

      const [matchedString, startTag = "", , endTag = ""] = match;

      if (!matchedString) return;

      const newContent = targetReadmeContent.replace(
        directiveRegex,
        `${startTag.trim() + "\n" + sourceUsageContent.trim() + "\n" + endTag.trim()}`
      );

      updatedDocs[f as FRAMEWORK] = {
        path: targetReadmePath,
        content: newContent,
      };
    });
  });

  const targetDirective = TAGS["build-information"];
  const buildInformationDirectiveRegex =
    getDirectiveRegexFromTag(targetDirective);
  const docsTmestamp = new Date(docs.timestamp);
  const sourceBuildInformationContent = `\n\n##### Last Updated: ${docsTmestamp.toLocaleDateString("en-GB")}\n##### Version: ${PLACEHOLDERS.packageVersion.value}`;

  Object.entries<Required<DOCS>[FRAMEWORK]>(updatedDocs).forEach(
    ([framework, updatedReadme]) => {
      process.stdout.write(
        `\x1b[1m\x1b[35mDOCS\x1b[0m\x1b[0m: Locating \x1b[35m${framework}\x1b[0m directive: \x1b[35m${targetDirective}\x1b[0m \n`
      );

      const matches = [
        ...updatedReadme.content.matchAll(buildInformationDirectiveRegex),
      ];
      const match = matches[0]; // we assume there will only ever be a single match in a document

      if (!match) return;

      process.stdout.write(
        `\x1b[1m\x1b[35mDOCS\x1b[0m\x1b[0m: Found \x1b[35m${framework}\x1b[0m directive: ${targetDirective}:${match.index}\n`
      );

      const [matchedString, startTag = "", , endTag = ""] = match;

      if (!matchedString) return;

      updatedReadme.content = updatedReadme.content.replace(
        buildInformationDirectiveRegex,
        `${startTag.trim() + "\n" + sourceBuildInformationContent.trim() + "\n" + endTag.trim()}`
      );

      process.stdout.write(
        `\x1b[1m\x1b[35mDOCS\x1b[0m\x1b[0m: Saving \x1b[35m${framework}\x1b[0m documentation\n`
      );

      writeFileSync(updatedReadme.path, updatedReadme.content);
    }
  );

  process.stdout.write(
    `\x1b[1m\x1b[35mDOCS\x1b[0m\x1b[0m: Updating component package documentation (\x1b[35mcompleted\x1b[0m)\n`
  );
}
