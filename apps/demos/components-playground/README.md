# Components Playground

This application serves as a tool for quick prototyping and debugging of our public components. It provides users with a way to visually inspect, configure and debug their own applications using the playground.
This is done by embedding their publically available application with the playground using an iframe. When applied, SDK/Component configuration is encoded and passed along to the iframe using dynamically generated configuration parameter values.
The embedded application must then consume the provided URL query params and pass them along to the sdk/components as needed.

## Table of Contents

- [Getting Started](#getting-started)
- [FAQs](#faqs)

## Getting Started

Currently, this playground has only been tested with the `components-autosuggest-static` example. Run the following command to spin up the playground and the "components-autosuggest-static" example application.

```sh
> npm --workspace components-playground run dev:components-autosuggest-static
```

Once both are running, you can configure the component as needed using the form fields in the playground.

### Compatibility

The following table shows the current status of playground compatibility

| Application                              | Status             |
| ---------------------------------------- | ------------------ |
| components-autosuggest-static            | :white_check_mark: |
| components-autosuggest-angular-ng-module | :x:                |
| components-autosuggest-react-vite        | :x:                |
| components-autosuggest-vue-create-vue    | :x:                |
| components-map-static                    | :x:                |
| components-map-angular-ng-module         | :x:                |
| components-map-react-vite                | :x:                |
| components-map-vue-create-vue            | :x:                |
| [codesandbox](https://codesandbox.io/)   | :construction:     |
| [plunker](https://plnkr.co)              | :x:                |
| [jsfiddle](https://jsfiddle.net)         | :x:                |

## FAQs

<br/>
<details>
<summary>Why won't my application load in the playground?</summary>
<hr/>
[CSP options](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/frame-src) must be set correctly in the embedding application for the playground to correctly load it
</details>

<br/>
<details>
<summary>Why won't my codesandbox load in the playground?</summary>
<hr/>
Codesandboxes should work, but require usage of the [legacy sandbox iframe](https://codesandbox.io/docs/learn/legacy-sandboxes/embedding). These urls take the following form: `https://codesandbox.io/embed/XXX-PROJECT-ID`
</details>
