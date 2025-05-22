# FAQs

<br/>
<details>
<summary>Why can't my package/application resolve the right dependency version?</summary>
<hr/>

[Npm workspaces](https://docs.npmjs.com/cli/v8/using-npm/workspaces) dependencies are hoisted to the root `node_modules` by default. This is done to minimize duplications on install if using the nested install strategy, but can potentially lead to conflicts. You can attempt to resolve this by trying out other [install strategies](https://docs.npmjs.com/cli/v9/commands/npm-install#install-strategy).

</details>

<br/>
<details>
<summary>How can I run dependency scripts sequentially?</summary>
<hr/>

To ensure package scripts are executed in topological order, the `workspaces` field in the root `package.json` should have package entries [ordered accordingly](https://github.com/npm/cli/issues/4139#issuecomment-1730186418)

</details>

<br/>
<details>
<summary>Why does my package/app resolve the wrong dependency version?</summary>
<hr/>

There are some necessary workarounds in place to ensure packages/apps link to their respective dependencies. For example, `tsc` exhibits buggy behaviour in npm workspace contexts where it resolves the wrong dependency. To fix this, we must update the relevant `tsconfig.json` to include the right path in its' `compilerOptions.paths` object. For example, the [@whatwords/react-components](../packages/components/react/tsconfig.json) requires a path to the right types dependency to compile as shown below.

```json
  "compilerOptions": {
    "paths": {
      "react": ["./node_modules/@types/react"]
    },
    ...
  },
  ...
```

</details>

<br/>
<details>
<summary>Why is the angular component linked as two separate npm workspaces?</summary>
<hr/>

Npm workspace package hoisting can cause present issues in certain app contexts such as [react native](https://github.com/npm/rfcs/issues/287#issue-741028151) and [angular](https://github.com/npm/rfcs/issues/287#issuecomment-945897074). This combined with the [angular package format](https://angular.dev/tools/libraries/angular-package-format) makes working with angular workspaces non-trivial in larger monorepo projects due to their highly-opinionated caching, optimizations and organization strategies.

To overcome package linking issues, we _ignore_ the `@what3words/angular-components` source directory, but track both the workspace and build directories. This ensures we can appropriately target linking, building and publishing of the angular components. This can be seen in the root [package.json](../package.json) scripts where angular concerns are targetted differently across various npm scripts.

This is an open and present issue when using angular within monorepo contexts, refer to this npm [issue](https://github.com/npm/cli/issues/6614).

</details>

<br/>
<details>
<summary>Why does my CRA generated app break the stencil test runnner?</summary>
<hr/>

The [StencilJS](https://stenciljs.com/) test runner has a known [dependency linking](https://github.com/stenciljs/core/issues/5196) issue in monorepo contexts. Specifically, its jest resolver is prone to picking up the wrong dependency leading to runtime errors when other jest versions are installed. This is the case with [create-react-app](https://create-react-app.dev/docs/getting-started/) which includes jest hence the reason why stencilJS test runs fail. However, as this has been [deprecated](https://react.dev/blog/2025/02/14/sunsetting-create-react-app) we don't intend/expect to provide support for it going forward.

</details>

<br/>
<details>
<summary>Why not use the official Cypress GHA action?</summary>
<hr/>

The need to run the multidimensional strategy matrix against varying examples was hampered by `xvfb` port collisions when using the [cypress action](https://github.com/cypress-io/github-action). Attempts at resolving this by defining dynamically assigned `DISPLAY` shell values were not successful.

More information:

- https://github.com/cypress-io/github-action/issues/1138#issuecomment-1978823896
- https://github.com/bahmutov/cypress-gh-action-split-install/blob/master/.github/workflows/tests.yml (official cypress [recommendation](https://docs.cypress.io/app/continuous-integration/overview#Missing-binary))
- https://github.com/cypress-io/github-action/issues/601#issuecomment-1562442600
- https://docs.cypress.io/app/continuous-integration/overview#Xvfb
- https://medium.com/eqs-tech-blog/cypress-tests-parallelization-with-x-server-in-gitlab-ci-3482dd2e1709
</details>

<br/>
<details>
<summary>GNU Make is a core dependency, why is it not included in the .tool-versions file?</summary>
<hr/>
Ideally, we would use `asdf` to manage all dependecies, but as GNU Make is a system-level package we leave this as opt-in. If you would still like to use asdf to install make, run the following in your terminal:

```bash
> asdf install make latest
```

```bash
gpg: Can't check signature: No public key
asdf-make: Failed to GPG verification:
```

The asdf install command might fail with the above following error, if so run the following command and retry the install command from the first step.

```bash
# https://lists.gnu.org/archive/html/help-make/2016-12/msg00000.html
> gpg --keyserver keys.gnupg.net --recv-key 80CB727A20C79BB2
```

You can then set the make version with `asdf set make latest` and restart your shell for the shims to be applied. Running `make -v` should return the pinned installed version.

</details>
