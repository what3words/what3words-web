# @what3words/javascript-cli

This package is used to perform various build-related tasks across the repository. Currently, the following cli commands are made available once installed:

## Commands

### publint-lint-package

Runs standard-practice checks against a workspace's `package.json` manifest to ensure it's valid (add to `prepublishOnly` npm lifecycle script). This is only relevant for packages that are published to a package registry.

```bash
> npx publint-lint-package
```
