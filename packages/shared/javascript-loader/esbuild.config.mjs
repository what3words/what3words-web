import * as esbuild from "esbuild";

const sharedConfig = {
  entryPoints: ["src/index.ts"],
  bundle: true,
  sourcemap: true,
  minify: true,
  metafile: true,
};

await esbuild
  .build({
    ...sharedConfig,
    platform: "neutral", // for ESM
    outfile: "dist/index.esm.js",
  })
  .then(async (result) => {
    console.log(
      await esbuild.analyzeMetafile(result.metafile, {
        verbose: false,
      })
    );
  })
  .catch(() => process.exit(1));

await esbuild
  .build({
    ...sharedConfig,
    platform: "browser", // for IIFE (legacy browsers)
    outfile: "dist/index.js",
  })
  .then(async (result) => {
    console.log(
      await esbuild.analyzeMetafile(result.metafile, {
        verbose: false,
      })
    );
  })
  .catch(() => process.exit(1));
