# Component Examples

A collection of applications that consume our [public web components](../../../packages/components/README.md) for myriad technology stacks. The [Components Test Harness](../e2e/README.md) then runs against all these applications to ensure that our components work to specification.

## Table of Contents

- [Getting Started](#getting-started)
- [Contributing](#contributing)

## Getting Started

Before working with our examples, run the following command in the root workspace to build all dependencies:

```bash session
> npm run build:components
```

To start an example (e.g. `components-autosuggest-react-vite`), run the following command in the root workspace

```bash session
> npm --workspace components-autosuggest-react-vite run dev
```

## Contributing

To create a new example, we recommend using the [npm create](https://docs.npmjs.com/cli/v10/commands/npm-init) command. The only naming requirement is to provide an appropriate example package name prefix from the list below:

- `components-autosuggest-`
- `components-map-`
- `components-notes-`

For example, to create the `components-map-react-vite` app, the following commands were used

```bash session
> npm create vite@latest react-vite -w apps/examples/components/map/react -- --template react-ts
> npm pkg set 'name'='components-map-react-vite'
```

This approach allows alternative builder sources to be used, such as [rsbuild](https://rsbuild.dev/guide/start/quick-start). Scaffolding tools like [yeoman](https://yeoman.io/) may work, but have not been tested. To have the tests run against your example, you must use the `@what3words/javascript-loader` package to ensure cypress can propagate component props through url queries. Once done, add the example to the [ci](../../../.github/workflows/ci.yml) strategy matrix as needed.

To share your contribution, please refer to the [contribution](../../../README.md#contributing) document section.
