# Components Test Harness

A cypress suite of `E2E` tests that runs against all our component examples. When writing tests, please try to ensure:

1. Tests do not assert for third-party library logic. This is especially true for the map component.
2. Avoid test scenario overlap when testing different components. e.g. there is little value in testing that the autosuggest component works to spec in a map context and only creates unnecessary duplication.

## Table of Contents

- [Documentation](#documentation)
- [Getting Started](#getting-started)
- [Thank You](#thank-you)
- [FAQs](#faqs)

## Documentation

For more guidance on writing robust tests, please refer to the `Cypress` [best practices](https://docs.cypress.io/guides/references/best-practices) doc. If you're facing any reliability/test-flake issues, the `Cypress` [troubleshooting](https://docs.cypress.io/guides/references/troubleshooting) reference guide is equally helpful.

## Getting Started

Before running the cypress tests, run the following command in the root workspace to build all workspace dependencies:

```bash session
> npm run build:components
```

You can run the tests to target the varying framework example applications by running the following command in the root workspace

```bash
> npm run --workspace examples-e2e run cy:test-app:open --application=<APP_NAME> --spec=<SPEC_NAME>
```

Where,

- `APP_NAME` this is the example project name suffix e.g. `components-autosuggest-react-vite` becomes `react-vite`.
- `SPEC_NAME`: this is filename of the `spec` file in the integration frameworks [directory](./cypress/integration/frameworks) without filename extensions e.g. `autosuggest.spec.ts` becomes `autosuggest`.

## Thank You!

Our thanks go out to the following projects for providing insipiration for this project:

- [Custom Elements Interoperability Tests](https://github.com/webcomponents/custom-elements-everywhere)

## FAQs

<br/>
<details>
<summary>Why are my intercepts returning the wrong mocks?</summary>
<hr/>

Intercepted requests can leak across tests and make tests [flaky](https://github.com/cypress-io/cypress/issues/20397). Use unique alias names for intercepts (e.g. `getAutosuggestions1`).

</details>

<br/>
<details>
<summary>Why am I seeing Google maps SDK errors in the console?</summary>
<hr/>

The google maps loader package [js-api-loader](https://www.npmjs.com/package/@googlemaps/js-api-loader) uses a singleton pattern and will not create multiple library instances (will not load the library more than once - enables robust billing). This makes it impossible to load the map component more than once with varying properties as would be the case when Component testing. An example error is shown below:

```shell
Error: Loader must not be called again with different options. {"version":"weekly","apiKey":<API_KEY>,"id":"gmaps-api","libraries":["places"],"language":"en","region":"GB","url":"https://maps.googleapis.com/maps/api/js"} !== {"version":"weekly","apiKey":<API_KEY>,"id":"gmaps-api","libraries":["places"],"language":"it","region":"GB","url":"https://maps.googleapis.com/maps/api/js"}

# The above error is emitted due to the different `language` values.
```

The only known workarounds are to:

    1. run each test-case on its' own by creating a file for each case.
    2. ensure that the following props are held constant in every test scenario:
        - language
        - libraries
        - language
        - region

While `Cypress` should handle all component clean-up, it is still possible to force a component [unmount](https://www.cypress.io/blog/2022/11/04/upcoming-changes-to-component-testing/#reactunmount-removed). However this hack fails due to the `Loader` storing it's created instance as `Loader.instance`. Attempting to [destroy/clear](https://github.com/googlemaps/js-api-loader/issues/100#issuecomment-1146595319) this does not produce the intended effect either and as such remains an open issue:

- https://github.com/googlemaps/js-api-loader/issues/100
- https://github.com/googlemaps/js-api-loader/issues/5

Please refer to the relevant google map provider docs for more information:

- [Google maps SDK](https://developers.google.com/maps/documentation/javascript). Please note this usage documentation may deviate from the reference documentation [here](https://developers.google.com/maps/documentation/javascript/reference), please cross-check for any inconsistencies.

</details>
