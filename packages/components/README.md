# what3words Components

A collection of open-source what3words web components with compatibility for various frameworks. These are all built using [stencilJS](https://stenciljs.com/) and internally extend the [JS API](https://github.com/what3words/w3w-node-wrapper).

[![Continuous Integration](https://github.com/what3words/what3words-web/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/what3words/what3words-web/actions/workflows/ci.yml)

## Table of Contents

- [Documentation](#documentation)
- [Getting Started](#getting-started)
- [Changelog](#changelog)
- [Thank You](#thank-you)

## Documentation

We use [stencilJS](https://stenciljs.com/) to compile and generate our web components. These are made available as distributable packages and support the following:

1. [@what3words/angular-components](./angular/components/README.md) - StencilJS wraps the JS build output into a angular compatible component [more](https://stenciljs.com/docs/angular)
2. [@what3words/javascript-components](./javascript/README.md) - The stencil project compiles into a native JS web components, more info [here](https://stenciljs.com/docs/javascript).
3. [@what3words/react-components](./react/README.md) - StencilJS wraps the JS build output into a react compatible component [more](https://stenciljs.com/docs/react)
4. [@what3words/vue-components](./vue/README.md) - StencilJS wraps the JS build output into a vue compatible component [more](https://stenciljs.com/docs/vue)

The `ReactJS`, `VueJS`, `Angular` and `Javascript` components all ship with lazy-loading, bundling optimization and custom element registration out-of-the-box. This allows you to import a small bootstrap script that registers all components and load individual component scripts lazily.

## Getting Started

Before working with our components, run the following command in the root workspace to build all workspace dependencies in topological order:

```bash
> npm run build:components
```

The following command will create a stencil component named `what3words-sample-component` in the [javascript src directory](./javascript/src/components)

```bash
> npm --workspace @what3words/javascript-components run generate --component what3words-sample-component
```

When naming a component, make sure to prefix any component name with `what3words` (e.g. `<what3words-datepicker>`) to follow our library naming standards. The following command will serve the stencil web app at the configured [port](https://stenciljs.com/docs/dev-server#port)

```bash
> npm --workspace @what3words/javascript-components run dev
```

You can view, edit and interact with the components loaded in the static entrypoint [here](./javascript/src/index.html). To build the stencil components for production, run the following command

```bash
> npm run build:components
```

Alternatively, you can run the following sequence of commands for more granular control of the build steps:

```bash
# build the stencil components
npm --workspace @what3words/javascript-components run build
```

```bash
# build framework wrappers based off the stencil-compiled web components
npm --workspace @what3words/react-components --workspace @what3words/vue-components --workspace angular-workspace run build
```

> :bulb: **NOTE**: the angular component is a project within an angular workspace, hence the difference in naming/filtering

This will create the `dist/`, `loader/`, `hydrate/` and `www/` directories.

- `www/`: can for the most part, be ignored, unless you are running the local dev server.
- `hydrate/`: stores a module that can be used on a NodeJS server to hydrate HTML and implement Server Side Rendering (SSR) (read [more](https://stenciljs.com/docs/hydrate-app#how-to-use-the-hydrate-app)).
- `loader/`: contains ESM modules with [initialization functions](https://stenciljs.com/docs/distribution#loader) such as the `defineCustomElements` function. This can be imported in an application to register all what3words components with the `CustomElementsRegistry` for lazy loading.
- `dist/`: the public distribution directory and serves as the build target for stencil-compiled web components.

Once built, all component package readmes are updated by [stencilJS](https://stenciljs.com/docs/docs-readme) and [our documentation generation tooling](./javascript/scripts/docs.ts). The latter plugs into stencil's documentation process to create the various framework READMEs with any changes in [component usage](https://stenciljs.com/docs/docs-json#usage). Additionally, prettier is run against all components package workspaces.

Wherever possible, make sure to add tests to ensure changes are stable and work to specification.

### Translations

The translations are installed as a pre-build [@what3words/javascript-components](./javascript/package.json) npm script step. This is performed using the [Phrase CLI](https://github.com/phrase/phrase-cli) tool which we wrap using a [shell wrapper](../../.wrappers/phrasew) to download and execute the binary and pull [translations](./javascript/src/translations/phrase/) updates from Phrase.

To pull phrase translations and generate the translations [resource entrypoint](./javascript/src/translations/index.ts), the following env values must be appropriately set in the root [.env](../../example.env)file:

- `PHRASE_ACCESS_TOKEN`: set value to the stored credential on 1Password under `Phrase Access Token - What3Words-Frontend`.
- `PHRASE_BUILD_ENABLED`: set value to `true` to build the [translations entrypoint](./javascript/src/translations/index.ts) using the downloaded phrase files. Defaults to false.
- `PHRASE_SYNC_ENABLED`: set to `true` to pull the translations from phrase. This downloads translation files to the [translations source](./javascript/src/translations/phrase) directory. Defaults to false.

> :warning: **WARN**: Translations should only be updated locally, not as part of CI/CD. This would only increase build times and make them inconsistent.

#### Translate an existing key

Use the translate [function](./javascript/src/lib/translation.ts#L92) to translate text that's rendered in the components e.g. `t('invalid_address_message')` will render the translation key's associated translation value in the browser's detected/configured language.

#### Create a new translation key

Translate keys must exist before they can be referenced as shown above. To create one, access the phrase project and add a key by filling out the configuration details onscreen. Make sure to only add translations for languages we support/are required as there are charges associated with this.

#### Update the translations

Perform a repo sync on the phrase.com project `languages` tab. This will create a branch with the updated translations and push a PR against the github repository. Once reviewed, you can merge the PR into main. If still in development, merge the PR into your local branch and perform testing/development as needed.

## Changelog

All changes can be tracked in the [changelog file](./CHANGELOG.md).

## Thank You!

A massive vote of thanks to the following dependencies, projects and resources without which we would not be able to create our components:

- [stenciljs.com](https://stenciljs.com): All our components are built using StencilJS. Stencil is a compiler for building fast web apps using Web Components and combines the best concepts of the most popular frontend frameworks into a compile-time rather than runtime tool. Stencil takes TypeScript, JSX, a tiny virtual DOM layer, efficient one-way data binding, an asynchronous rendering pipeline (similar to React Fiber), and lazy-loading out of the box, and generates 100% standards-based Web Components that run in any browser supporting the Custom Elements v1 spec. Stencil components are just Web Components, so they work in any major framework or with no framework at all.
- [phrase.com](https://phrase.com/): We use phrase to perform language translations.
- [shoelace](https://github.com/shoelace-style/shoelace)
- [ionic framework](https://github.com/ionic-team/ionic-framework)
- [custom-elements-everywhere](https://custom-elements-everywhere.com/)
- [webcomponents.org](https://www.webcomponents.org/)
- [open web components](https://open-wc.org/)
- [VanillaWC](https://github.com/vanillawc)
- ['Web Components Will Outlive Your JavaScript Framework' by Jake Lazaroff](https://jakelazaroff.com/words/web-components-will-outlive-your-javascript-framework/)
- ['How We Use Web Components at Github' by Kristján Oddsson](https://github.blog/engineering/how-we-use-web-components-at-github/)
- ['Why I don't use web components' by Rich Harris](https://dev.to/richharris/why-i-don-t-use-web-components-2cia)
- ['Why I use web components' by Andrea Giammarchi](https://gist.github.com/WebReflection/71aed0c811e2e88e3cd3c647213f0e6c)
- ['Building components' by web.dev](https://web.dev/articles/web-components)
- [5 Years of Building React Table – Tanner Linsley, React Summit 2022](https://www.youtube.com/watch?v=O4IWJcafX8c)
