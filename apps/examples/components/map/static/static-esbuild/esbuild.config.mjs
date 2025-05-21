import * as esbuild from "esbuild";
import { copy } from "esbuild-plugin-copy";
import path from "path";

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
    plugins: [
      copy({
        // this is equal to process.cwd(), which means we use cwd path as base path to resolve `to` path
        // if not specified, this plugin uses ESBuild.build outdir/outfile options as base path.
        resolveFrom: "cwd",
        assets: [
          {
            from: [
              path.join(
                process.env.npm_package_config_root,
                "node_modules/@what3words/javascript-loader/dist/**/*"
              ),
            ],
            to: ["./public/dist/javascript-loader"],
          },
          {
            from: [
              path.join(
                process.env.npm_package_config_root,
                "node_modules/@what3words/javascript-components/dist/**/*"
              ),
            ],
            to: [
              `./public/dist/javascript-components@${process.env.npm_package_version}/dist`,
            ],
          },
        ],
        watch: true,
      }),
    ],
    define: {
      "process.env.VERSION": JSON.stringify(process.env.npm_package_version),
    },
  });

  await ctx.watch().catch((err) => {
    console.error("x An error occurred:\n", err.message);
    process.exit(1);
  });

  await ctx
    .serve({
      servedir: "public",
      port: 3000,
    })
    .catch((err) => {
      console.error("x An error occurred:\n", err.message);
      process.exit(1);
    });
}

build();
