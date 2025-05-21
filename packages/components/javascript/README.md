# <img src="https://what3words.com/assets/images/w3w_square_red.png" width="32" height="32" alt="what3words-logo">&nbsp;What3words Javascript Components

The what3words javascript components package extends the [JS API](https://github.com/what3words/w3w-node-wrapper) and builds custom web components for use in static HTML documents, [Angular](https://angularjs.com), [ReactJS](https://reactjs.com), and [Vue](https://vuejs.com).

## Bundler Support

Some bundlers require additional configuration to work with our components.

### Vite

When using [vite](https://vite.dev/), make sure to exclude `@what3words/javascript-components` from the dependency optimization using the `optimizeDeps.exclude` option in your `vite.config.[js,ts]` file

```js
import { defineConfig } from "vite";

export default defineConfig({
  ...
  optimizeDeps: {
    exclude: ["@what3words/javascript-components"],
  },
});
```

## Usage

<!-- begin:usage:what3words-autosuggest -->

### What3Words Autosuggest Component

#### Configuration

##### Script Parameters

When using the CDN to load this package, you can provide query string parameters to the `<script>` tag to pass the following query string parameters to the script loader once it is running:

- `key=<API_KEY>` This will provide the API Key to the SDK in the `<script>`
- `callback=<NAME>` This will provide a callback name for the SDK to call once the script loads. You should attach this function to the global window for this to actually call your script.
- `baseUrl=<URL>` The base url to pass to the SDK to call autosuggest endpoint at. (Useful for mocking in tests or pointing to a different environment.)
- `headers=<STRINGIFIED_JSON>` You can set headers that the SDK will pass to the backend autosuggest API when making requests against the API. (This is useful for tracking purposes or providing specialised agents, for example)

> Navigating to http://localhost:8080?key=API_KEY&callback=NAME&baseUrl=URL&headers={"custom-header":"foo"} will set the above script tag parameters.

###### Component Attributes

Component attributes can also be passed using script parameters. To pass attributes key/value pairs to the autosuggest component you can pass the attribute name prefixed with the component attribute prefix. The prefix defaults to `comp_` so if, for example you wanted to add the `initial-value` attribute to the component, you would provide the query paramter `comp_initial-value=<INITIAL_VALUE>`. You can change the prefix using the query parameter:

- `componentPrefix=<PREFX>` (default is `comp_`) This will change the prefix for any component attributes.
- `comp_<ATTRIBUTE>=<VALUE>` This will set the attribute `<ATTRIBUTE>` on the autosuggest component with value `<VALUE>`. (This assumes that the prefix has not been changed otherwise you should change `comp_` for the `<PREFIX>` you set it to.)

###### Custom HTML Input

If you want to have a custom HTML input being wrapped around by the `<what3words-autosuggest />` custom component tag, you must first enable this behaviour using the query parameter:

- `customInput=true`

You can also provide attributes to the input similarly to the autosuggest component attributes above by providing the attribute with the `inputPrefix` prefixing the attribute key/value pair. For example to set the `id` and `name` attributes on the custom input you would do provide the query parameters `input_id=my-id&input_name=my-form-elem`. You can also change the prefix if you wish by providing the following query paramter:

- `inputPrefix=<PREFIX>` (default is `input_`) This will change the prefix for any input attributes.
- `input_<ATTRIBUTE>=<VALUE>` This will set the attribute `<ATTRIBUTE>` on the input element with value `<VALUE>`. (This assumes that the prefix has not been changed otherwise you should change `input_` for the `<PREFIX>` you set it to.)

> :warning: **WARN**: The custom input only works if you have not disabled the autosuggest component

###### Disable Autosuggest Component

If you want to disable the Autosuggest component tag, so that the page does not add it at all and just adds the SDK which is accessible via `window.what3words` then you can provide the following query paramter to disable to the component:

- `disableAutosuggest=true`

#### Installation

##### CDN

```html
<head>
  <script
    type="module"
    defer
    src="https://cdn.what3words.com/javascript-components@5.0.1/dist/what3words/what3words.esm.js"
  ></script>
  <script
    nomodule
    defer
    src="https://cdn.what3words.com/javascript-components@5.0.1/dist/what3words/what3words.js"
  ></script>
  ...
</head>
...
```

##### NPM

```bash
npm install @what3words/javascript-components@5.0.1
```

#### Usage

```html
<body>
  <what3words-autosuggest api_key="<W3W-API-KEY>">
    <input
      id="search-input"
      type="text"
      placeholder="Find your address"
      autocomplete="off"
    />
  </what3words-autosuggest>
</body>
```

<!-- end:usage:what3words-autosuggest -->
<!-- begin:usage:what3words-map -->

### What3Words Map Component

#### Installation

##### CDN

```html
<head>
  <script
    type="module"
    defer
    src="https://cdn.what3words.com/javascript-components@5.0.1/dist/what3words/what3words.esm.js"
  ></script>
  <script
    nomodule
    defer
    src="https://cdn.what3words.com/javascript-components@5.0.1/dist/what3words/what3words.js"
  ></script>
  ...
</head>
...
```

##### NPM

```bash
npm install @what3words/javascript-components@5.0.1
```

#### Usage

```html
<head>
  ...
  <style>
    html,
    body {
      margin: 0px;
      height: 100%;
    }
    /* container MUST have defined height and width to visually render the map canvas */
    #map-container {
      width: 100vw;
      height: 100vh;
    }
    #search-container {
      margin: 10px 0 0 10px;
    }
    #search-input {
      width: 300px;
    }
    #current-location-container {
      margin: 0 10px 10px 0;
    }
  </style>
</head>
<body>
  <what3words-map
    id="w3w-map"
    api_key="<W3W-API-KEY>"
    map_api_key="<GOOGLE-MAP-API-KEY>"
    disable_default_ui
    fullscreen_control
    map_type_control
    zoom_control
    current_location_control_position="9"
    fullscreen_control_position="3"
    search_control_position="2"
    words="filled.count.soap"
  >
    <div slot="map" id="map-container"></div>
    <div slot="search-control" id="search-container">
      <what3words-autosuggest>
        <input
          id="search-input"
          type="text"
          placeholder="Find your address"
          autocomplete="off"
        />
      </what3words-autosuggest>
    </div>
    <div slot="current-location-control" id="current-location-container">
      <button>Current Location</button>
    </div>
  </what3words-map>
</body>
```

<!-- end:usage:what3words-map -->
<!-- begin:usage:what3words-notes -->

### What3Words Notes Component

#### Installation

##### CDN

```html
<head>
  <script
    type="module"
    defer
    src="https://cdn.what3words.com/javascript-components@5.0.1/dist/what3words/what3words.esm.js"
  ></script>
  <script
    nomodule
    defer
    src="https://cdn.what3words.com/javascript-components@5.0.1/dist/what3words/what3words.js"
  ></script>
  ...
</head>
...
```

##### NPM

```bash
npm install @what3words/javascript-components@5.0.1
```

#### Usage

##### Input Slot - Text Area Element

```html
<body>
  <what3words-notes api-key="<W3W-API-KEY>">
    <label slot="label" for="delivery-notes">Delivery Notes</label>
    <textarea
      slot="input"
      name="delivery-notes"
      placeholder="Type delivery instructions with your what3words address"
    ></textarea>
  </what3words-notes>
</body>
```

##### Input Slot - Input Element

```html
<what3words-notes api-key="<YOUR-API-KEY>">
  <label slot="label" for="delivery-notes">Delivery Notes</label>
  <input
    slot="input"
    type="text"
    name="delivery-notes"
    placeholder="Type delivery instructions with your what3words address"
    autocomplete="off"
  />
</what3words-notes>
```

##### Tooltip Slot

```html
<body>
  <what3words-notes api-key="<W3W-API-KEY>">
    <label slot="label" for="delivery-notes">Delivery Notes</label>
    <textarea
      slot="input"
      name="delivery-notes"
      placeholder="Type delivery instructions with your what3words address"
      autocomplete="off"
    ></textarea>
    <div slot="tooltip">
      <h3>Did you know?</h3>
      <p>
        You can add a
        <a
          href="https://delivery.w3w.co"
          target="_blank"
          rel="noopener noreferrer"
        >
          what3words
        </a>
        address to help our delivery partners find you first time
        <br />
        e.g. ///limit.boom.field
      </p>
    </div>
  </what3words-notes>
</body>
```

<!-- end:usage:what3words-notes -->

<!-- begin:meta:build-information -->

##### Last Updated: 20/05/2025

##### Version: 5.0.1

<!-- end:meta:build-information -->
