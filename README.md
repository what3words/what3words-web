[![what3words](https://what3words.com/assets/images/w3w_square_red.png)](https://developer.what3words.com)

# what3words Web

A public repository that hosts open-source what3words web libraries and modules. Additionally, examples and demos are provided which are tested against.

**Note:** See individual directories/projects in this repo for technology-specific badges.

[![License](http://img.shields.io/:license-mit-blue.svg?style=flat)](https://opensource.org/licenses/MIT)

## Table of Contents

- [Documentation](#documentation)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Contributing](#contributing)
- [Support + Feedback](#support--feedback)
- [Vulnerability Reporting](#vulnerability-reporting)
- [Thank You](#thank-you)
- [License](#license)

## Documentation

All repo-level documentation can be found in the [docs](./docs/) directory.

- [Tooling](./docs/01-tooling.md)
- [FAQs](./docs/02-faqs.md)

## Installation

Prerequisites:

- [GNU Make](https://www.gnu.org/software/make/): This repo was tested with `GNU Make 3.81`. Your mileage might vary depending on what version is installed on the running system.

To install repo and project level dependencies run the following command in your terminal

```bash
> make
```

Once your dev environment is configured, setup your env variables by running the following commands and populating the listed keys as needed:

```bash
# setup act env variables and secrets
cp services/act/example.vars services/act/.vars
cp services/act/example.secrets services/act/.secrets
```

## Getting Started

- Working with [packages](./packages/):

  - [what3words components](./packages/components/README.md): contains our published component libraries.
  - [shared modules](./packages/shared/README.md): contains private modules that are shared between different projects/workspaces. They are not published to any registry and only serve to abstract common cross-functional logic/assets.

- Working with [apps](./apps/):

  - [examples](./apps/examples/README.md): contains applications that consume our libraries/modules using various web frameworks and their respective testing harnesses.
    - [component examples](./apps/examples/components/README.md): contains quickstarts that serve as a reference for end-users integrating the what3words components libraries into their own applications.
    - [components test harness](./apps/examples/e2e/README.md): contains e2e tests that are run against component example targets. These are run in our CI pipeline and ensure that our component is functional across a range of application contexts.
  - [demos](./apps/demos/README.md): contains applications that exhibit domain-specific use cases e.g. navigation, e-commerce checkouts. These serve as demonstrations for how what3words can be used in different industry contexts.
    - [components playground](./apps/demos/components-playground/README.md): serves as a components development environment for changes to be locally tested with a property configurator UI for enhanced DX.

## Contributing

We appreciate feedback and contribution to this repo! Before you get started, please see the following:

- [This repo's contribution guidelines](./.github/CONTRIBUTING.md)
- [This repo's code of conduct guidelines](./.github/CODE_OF_CONDUCT.md)

## Support + Feedback

- Use [Issues](https://github.com/what3words/what3words-web/issues) for code-level support
- Use [Developer Support](https://developer.what3words.com/support) for usage, questions, specific cases
- Use [General Support](https://support.what3words.com/) for general information, account and guidance support
- Use [Ways to Use](https://what3words.com/ways-to-use) for product information

## Vulnerability Reporting

Please refer to the following guidelines to report vulnerabilities:

- [This repo's security guidelines](./.github/SECURITY.md)

## What is what3words?

what3words is the easy way to describe any precise location. It has divided the world into a grid of 3 metre squares and given each square a unique address made from 3 random words.

what3words can be used via the free mobile app and the online map at [what3words.com](http://what3words.com). There’s also an [API](https://developer.what3words.com/public-api) that developers can use to integrate what3words into their own apps and platforms.

Here are some of the ways people around the world like to use what3words:

- telling friends exactly where to meet, especially in big or busy public places
- entering a precise destination into a vehicle or ride-hailing app
- telling couriers exactly where to drop off deliveries (such as a front door or side entrance)
- telling emergency services exactly where help is needed

Businesses in logistics and e-commerce, automotive, navigation, mobility and travel, as well as some emergency response teams, use what3words to operate more efficiently and provide a better service.

[Why what3words?](https://support.what3words.com/en/articles/1519170)

## Thank You!

A massive vote of thanks to the following inspiring projects

- [open-source-template](https://github.com/auth0/open-source-template/tree/master?tab=readme-ov-file)

... and many more!

## License

This repo is covered under [The MIT License](LICENSE)
