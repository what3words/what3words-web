# Shared Modules

A collection of utils shared across our various apps and packages. These are all internal i.e. unpublished and only used to provide some `DRY` abstractions.

## Table of Contents

- [Documentation](#documentation)
- [Getting Started](#getting-started)
- [Contributing](#contributing)

## Documentation

1. [@what3words/javascript-cli](./javascript-cli/README.md)
2. [@what3words/javascript-loader](./javascript-loader/README.md)

## Getting Started

To work with our shared modules, run the following command in the root workspace:

```bash
> npm --workspace packages/shared/* build
```

## Contributing

You can use any tool to create/add a shared module. We do however provide some guidelines and tooling requirements as described in the [tooling](../../docs/01-tooling.md) document. To share your contribution, please refer to the [contribution](../../README.md#contributing) document section.
