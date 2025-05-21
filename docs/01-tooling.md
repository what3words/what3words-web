# Tooling

## Monorepo

We use [npm workspaces](https://docs.npmjs.com/cli/v8/using-npm/workspaces) to manage this repository. Alternatives like [pnpm](https://pnpm.io/workspaces) were explored, but through trial and error it was found that npm allowed for the most flexibility which was necessary to resolve a number of issues. For example, angular projects are difficult to host within a larger monorepo context due to its highly opinionated directory structure and build pipeline.

> [!IMPORTANT] We implement this targeting by using the largely undocumented npm `prefix` config, which is not ideal as it's not [recommended](https://github.com/npm/cli/issues/1368), but still better than using the alternative `cd <path to project> && npm <npm command>` script command.

> [!NOTE] This requirement to dynamically configure workspaces effectively rules out pnpm as a monorepo solution as it does not provide the same flexibility. Additionally, as pnpm uses custom protocol definitions (e.g. `workspace:*`), we would need a postbuild step to rebuild the package manifests (using the `createExportableManifest` @pnpm/exportable-manifest function) prior to publishing the packages.

We use [del-cli](https://www.npmjs.com/package/del-cli) over [rimraf](https://www.npmjs.com/package/rimraf) to perform cross-platform file and directory filesystem deletion due to it's support for glob exception deletion as shown in the [angular component wrapper](../../packages/components/angular/package.json#L6). rimraf has limited support for [this](https://github.com/isaacs/rimraf/issues/113), and only through its sdk api.

We use [lefthook](https://lefthook.dev) as a git hooks manager. Compared to alternatives like [husky](https://typicode.github.io/husky/), lefthook was found to be more performant (due to parallelization and it is written in Go), language-agnostic (does not have runtime requirements besides the ability to install husky) and versatile (commands can be run against filtered files e.g. staged files).

### Command/Task runner

We currently use [GNU Make](https://www.gnu.org/software/make/) to run repo-level actions. It's generally available and widely used, though caveats like no argument passing mean that we also need to use [scripts](../scripts/) to dynamically execute tasks.

## Bundling

Various bundlers were examined and evaluated [[1](https://eisenbergeffect.medium.com/an-esbuild-setup-for-typescript-3b24852479fe), [2](https://github.com/VulcanJS/npm-the-right-way/tree/main), [3](https://janessagarrow.com/blog/typescript-and-esbuild/)], with the following criteria marked as crucial:

- simplicity
- extensibility
- performance

[esbuild](https://esbuild.github.io/) was found to meet all three, especially since it underpins many/most of the popular alternative bundlers like `vite`. One significant caveat of esbuild is that it doesn't [support generating types](https://esbuild.github.io/content-types/#no-type-system). This was resolved by falling back to tsc to output types - though this has it's own limitations (typically slower builds and out-of-sync typechecking), but is generally the [go-to approach](https://github.com/evanw/esbuild/issues/95).

Of note, UMD packages [are not currently](https://github.com/evanw/esbuild/issues/507) possible with esbuild, instead we provide both CJS and ESM builds for both legacy and evergreen browser environments. This may be revisited in the future, perhaps migrating to [rollup](https://rollupjs.org/) that does support UMD build outputs or [rslib](https://lib.rsbuild.dev/guide/start/).

## Transpilation

Given our basic typescript setup, there was no pronounced need to explore exotic tooling like [swc](https://swc.rs/). [tsc](https://github.com/microsoft/TypeScript) works well for our purposes which we use to generate types with configs based of [@tsconfig/recommended](https://github.com/tsconfig/bases?tab=readme-ov-file#recommended-tsconfigjson) and perform type-checking. Of note, there is no known/official tsconfig base to [support esm builds](https://github.com/tsconfig/bases?tab=readme-ov-file#what-about-tsconfigesm), though a recommendation to set the `module/moduleResolution` was adopted.

## CI/CD

### [Github Actions](https://github.com/features/actions)

We use Github Actions to run our CI/CD pipeline. Our CI runs our [examples test harness](../apps/examples/e2e/) against all listed [component examples](../apps/examples/components/). Additionally, it runs our javascript components tests (unit and e2e) tests using the [StencilJS test runner](https://stenciljs.com/docs/testing/stencil-testrunner/overview).

Examples can be added to the examples directory (`samples/examples/components`) and added to the CI/CD testing matrix in the `.github/workflows/ci.yml` file. This will ensure that the component/framework example under-test works to specification before it can be formally listed as a working example.

### [act](https://github.com/nektos/act)

To help with ease-of-integration, we use [nektos/act](https://github.com/nektos/act) to run CI/CD jobs locally during development. This should be setup as described in the [installation instructions](../README.md#installation).

Once a prospective component example is added to the [examples](../apps/examples/components/) directory and the `ci.yml` strategy matrix, you can run target GHA jobs with the following command

```bash
> ./scripts/act-run.sh --job cypress-e2e
```

To speed up testing workflows, you can target specific example configurations using the matrix (`--matrix`) flag:

```bash
> ./scripts/act-run.sh --job cypress-e2e --matrix spec:autosuggest --matrix application:static
```

Depending on your available/allocated docker RAM, this can take a 3-10 minutes to complete. Once run, any failed tests will be available in the `./tmp/artifacts/1/cypress-screenshots/e2e` directory nested by example name. You can use these to better debug and iterate on failing tests before pushing your changes up.

### [jq](https://jqlang.org/)

We use `jq` extensively to perform json querying to dynamically configure our pipelines.

## Containerization

### [Docker](https://www.docker.com/)

As act uses the docker runtime to execute GHA jobs, there is an implicit dependency on docker. However, as there are alternative interoperable containerization tools we do not explicitly require this in the `.tool-versions` file. For example, [podman](https://podman.io/) has been tested to work just as well (requires that you create a shell alias for the docker command to podman).

All dockerfiles are enumerated and described below:

#### [cypress.Dockerfile](../dockerfiles/cypress.Dockerfile)

This is the base image used by `act` to run our CI/CD workflows and jobs. This image is necessary as the GHA [runner images](https://github.com/actions/runner-images) are rather bloated (multiple GBs) and the [official](https://github.com/nektos/act/blob/master/IMAGES.md) act images lacked required tooling (e.g. `xvfb`). Instead, this dockerfile (based of [Cypress.io image](https://github.com/cypress-io/cypress-docker-images)) sets up the runner as needed. However, it should be noted that this may lead to inconsistencies between local act and github job runs.

# Resources

- ['TypeScript and NPM package.json exports the 2024 way' by Maciej Kravchyk](https://www.kravchyk.com/typescript-npm-package-json-exports/)
- [JS Module Systems](https://hacks.mozilla.org/2015/08/es6-in-depth-modules/)
- [TSConfig Cheatsheet](https://www.totaltypescript.com/tsconfig-cheat-sheet)
- [Makefile Tutorial](https://makefiletutorial.com)
- [jqlang Manual](https://jqlang.org/manual/)
- [lefthook](https://lefthook.dev/intro.html)
