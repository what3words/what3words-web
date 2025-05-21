import * as esbuild from "esbuild";

async function build() {
  const ctx = await esbuild.context({
    entryPoints: ["src/index.js"],
    outfile: "public/index.js",
    bundle: true,
    minify: false, // pretty-print in dev
    sourcemap: "linked", // generate a linked source map in a .map file
    logLevel: "debug",
    loader: { ".html": "text" },
    format: "iife", // support older/legacy browsers
  });

  await ctx.watch().catch((err) => {
    console.error("x An error occurred:\n", err.message);
    process.exit(1);
  });

  await ctx
    .serve({
      servedir: "public",
      port: 3001,
    })
    .catch((err) => {
      console.error("x An error occurred:\n", err.message);
      process.exit(1);
    });
}

build();
