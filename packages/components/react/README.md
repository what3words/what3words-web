# <img src="https://what3words.com/assets/images/w3w_square_red.png" width="32" height="32" alt="what3words-logo">&nbsp;What3words React Components

The what3words react components package extends the [JS API](https://github.com/what3words/w3w-node-wrapper) as a framework wrapper for the custom elements found in the `@what3words/javascript-components` package. This is exclusively for use in [ReactJS](https://reactjs.com) applications. Depending on your use-case, you can alternatively utilise our native JS custom elements (`@what3words/javascript-components`) as these should work given the specification's current [browser compatibility](https://developer.mozilla.org/en-US/docs/Web/API/Web_components#browser_compatibility) and [framework support](https://custom-elements-everywhere.com/#react).

This library was generated with [Create React App](https://create-react-app.dev) version 5.0.1.

## Bundler Support

Some bundlers require additional configuration to work with our components.

### Vite

When using [vite](https://vite.dev/), make sure to exclude `@what3words/react-components` from the dependency optimization using the `optimizeDeps.exclude` option in your `vite.config.[js,ts]` file

```js
import { defineConfig } from "vite";

export default defineConfig({
  ...
  optimizeDeps: {
    exclude: ["@what3words/react-components"],
  },
});
```

## Usage

<!-- begin:usage:what3words-autosuggest -->

### What3Words Autosuggest Component

#### Installation

```bash
npm install @what3words/react-components@5.0.2-alpha.0
```

#### Usage

```jsx
import { What3wordsAutosuggest } from "@what3words/react-components";

const W3W_API_KEY = "<W3W-API-KEY>";

export default function Autosuggest() {
  return (
    <What3wordsAutosuggest api_key={API_KEY}>
      <input
        type="text"
        placeholder="Find your address"
        style={{ width: "300px" }}
        autoComplete="off"
      />
    </What3wordsAutosuggest>
  );
}
```

<!-- end:usage:what3words-autosuggest -->
<!-- begin:usage:what3words-map -->

### What3Words Map Component

#### Installation

```bash
npm install @what3words/react-components@5.0.2-alpha.0
```

#### Usage

```jsx
import {
  What3wordsAutosuggest,
  What3wordsMap,
} from "@what3words/react-components";

const W3W_API_KEY = "<W3W-API-KEY>";
const MAP_API_KEY = "<GOOGLE-MAP-API-KEY>";

export default function Map() {
  return (
    <What3wordsMap
      id="w3w-map"
      api_key={API_KEY}
      map_api_key={MAP_API_KEY}
      disable_default_ui={true}
      fullscreen_control={true}
      map_type_control={true}
      zoom_control={true}
      current_location_control_position={9}
      fullscreen_control_position={3}
      search_control_position={2}
      words="filled.count.soap"
    >
      <div slot="map" style={{ width: "100vw", height: "100vh" }} />
      <div slot="search-control" style={{ margin: "10px 0 0 10px" }}>
        <What3wordsAutosuggest>
          <input
            type="text"
            placeholder="Find your address"
            style={{ width: "300px" }}
            autoComplete="off"
          />
        </What3wordsAutosuggest>
      </div>
      <div slot="current-location-control" style={{ margin: "0 10px 10px 0" }}>
        <button>Current Location</button>
      </div>
    </What3wordsMap>
  );
}
```

<!-- end:usage:what3words-map -->
<!-- begin:usage:what3words-notes -->

### What3Words Notes Component

#### Installation

```bash
npm install @what3words/react-components@5.0.2-alpha.0
```

#### Usage

```jsx
import { What3wordsAutosuggest } from "@what3words/react-components";

const W3W_API_KEY = "<W3W-API-KEY>";

export default function Notes() {
  return (
    <What3wordsNotes api-key={API_KEY}>
      <label slot="label" for="delivery-notes">
        Delivery Notes
      </label>
      <textarea
        slot="input"
        name="delivery-notes"
        placeholder="Type delivery instructions with your what3words address"
      ></textarea>
    </What3wordsNotes>
  );
}
```

<!-- end:usage:what3words-notes -->

<!-- begin:meta:build-information -->

##### Last Updated: 22/05/2025

##### Version: 5.0.2-alpha.0

<!-- end:meta:build-information -->
