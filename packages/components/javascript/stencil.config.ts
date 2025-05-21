import type { Config } from "@stencil/core";
import { angularOutputTarget } from "@stencil/angular-output-target";
import { reactOutputTarget } from "@stencil/react-output-target";
import { sass } from "@stencil/sass";
import { vueOutputTarget } from "@stencil/vue-output-target";
import nodePolyfills from "rollup-plugin-node-polyfills";

import { readmeGenerator } from "./scripts/docs";

const componentCorePackage = "@what3words/javascript-components";

export const config: Config = {
  sourceMap: false,
  buildEs5: "prod", // BUG: If enabled, results in `Constructor for "what3words-xxx#undefined" was not found` errors. NOTE: legacy support has been deprecated (https://github.com/ionic-team/stencil/issues/5780)
  devServer: {
    port: 8080,
  },
  extras: {
    enableImportInjection: true, // resolve isProxied undefined reference error: https://stenciljs.com/docs/vue#typeerror-cannot-read-properties-of-undefined-reading-isproxied
  },
  globalScript: "src/global/index.ts",
  namespace: "what3words",
  outputTargets: [
    // By default, the generated proxy components will
    // leverage the output from the `dist` target, so we
    // need to explicitly define that output alongside the
    // Angular, React and Vue targets
    {
      type: "dist",
      esmLoaderPath: "../loader",
      isPrimaryPackageOutputTarget: true,
    },
    {
      type: "dist-custom-elements",
      dir: "dist/components",
      customElementsExportBehavior: "auto-define-custom-elements",
    },
    {
      type: "docs-readme",
      // strict: true,
    },
    {
      type: "docs-custom",
      generator: readmeGenerator,
    },
    {
      type: "www",
      serviceWorker: null, // disable service workers
    },
    {
      type: "dist-hydrate-script",
    },
    angularOutputTarget({
      componentCorePackage,
      outputType: "component",
      directivesProxyFile: "../angular/components/src/lib/components.ts",
      directivesArrayFile: "../angular/components/src/lib/index.ts",
    }),
    reactOutputTarget({
      componentCorePackage,
      proxiesFile: "../react/lib/components.ts",
    }),
    vueOutputTarget({
      componentCorePackage,
      proxiesFile: "../vue/lib/components.ts",
    }),
  ],
  // https://stenciljs.com/docs/output-targets#primary-package-output-target-validation
  validatePrimaryPackageOutputTarget: true,
  rollupPlugins: {
    after: [nodePolyfills()],
  },
  plugins: [sass()],
  testing: {
    verbose: true,
    setupFilesAfterEnv: ["<rootDir>/setup-jest.js"],
  },
  preamble: "Copyright (c) what3words http://what3words.com",
};
