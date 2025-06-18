# <img src="https://what3words.com/assets/images/w3w_square_red.png" width="32" height="32" alt="what3words-logo">&nbsp;What3words Vue Components

The what3words vue components package extends the [JS API](https://github.com/what3words/w3w-node-wrapper) as a framework wrapper for the custom elements found in the `@what3words/javascript-components` package. This is exclusively for use in [Vue](https://vuejs.com) applications. Depending on your use-case, you can alternatively utilise our native JS custom elements (`@what3words/javascript-components`) as these should work given the specification's current [browser compatibility](https://developer.mozilla.org/en-US/docs/Web/API/Web_components#browser_compatibility) and [framework support](https://custom-elements-everywhere.com/#vue).

This library was generated with [Vue](https://vuejs.org/guide/introduction.html) version 3.

## Bundler Support

Some bundlers require additional configuration to work with our components.

### Vite

When using [vite](https://vite.dev/), make sure to exclude `@what3words/vue-components` from the dependency optimization using the `optimizeDeps.exclude` option in your `vite.config.[js,ts]` file

```js
import { defineConfig } from "vite";

export default defineConfig({
  ...
  optimizeDeps: {
    exclude: ["@what3words/vue-components"],
  },
});
```

## Usage

<!-- begin:usage:what3words-autosuggest -->

### What3Words Autosuggest Component

#### Installation

```bash
npm install @what3words/vue-components@5.0.2
```

#### Usage

```jsx
<template>
  <What3wordsAutosuggest :="$props">
    <input
      id="search-input"
      type="text"
      placeholder="Find your address"
      autocomplete="off"
    />
  </What3wordsAutosuggest>
</template>

<script lang="ts">
import {
  What3wordsAutosuggest,
} from "@what3words/vue-components";

export default {
  name: "Autosuggest",
  components: {
    What3wordsAutosuggest,
  },
  props: {
    callback: String,
    api_key: String,
    headers: String,
    base_url: String,
    name: String,
    initial_value: String,
    variant: String,
    typeahead_delay: Number,
    allow_invalid: Boolean,
    icon_visible: Boolean,
    icon_size: Number,
    icon_color: String,
    language: String,
    n_focus_results: Number,
    clip_to_country: String,
    clip_to_bounding_box: String,
    clip_to_circle: String,
    clip_to_polygon: String,
    return_coordinates: Boolean,
    onValue_changed: Function,
    onValue_valid: Function,
    onValue_invalid: Function,
    onDeselected_suggestion: Function,
    onSelected_suggestion: Function,
    onSuggestions_changed: Function,
    onCoordinates_changed: Function,
    on__hover: Function,
    on__focus: Function,
    on__blur: Function,
    on__error: Function,
  },
};
</script>

<style>
</style>
```

<!-- end:usage:what3words-autosuggest -->
<!-- begin:usage:what3words-map -->

### What3Words Map Component

#### Installation

```bash
npm install @what3words/vue-components@5.0.2
```

#### Usage

```jsx
<template>
  <What3wordsMap :="$props">
    <div slot="map" id="map-container" />
    <div slot="search-control" id="search-container">
      <What3wordsAutosuggest>
        <input
          id="search-input"
          type="text"
          placeholder="Find your address"
          autocomplete="off"
        />
      </What3wordsAutosuggest>
    </div>
    <div slot="current-location-control" id="current-location-container">
      <button>Current Location</button>
    </div>
  </What3wordsMap>
</template>

<script lang="ts">
import {
  What3wordsAutosuggest,
  What3wordsMap,
} from "@what3words/vue-components";

export default {
  name: "Map",
  components: {
    What3wordsAutosuggest,
    What3wordsMap,
  },
  props: {
    id: String,
    api_key: String,
    api_version: String,
    base_url: String,
    current_location: Boolean,
    current_location_control_position: Number,
    disable_default_ui: Boolean,
    fullscreen_control: Boolean,
    fullscreen_control_position: Number,
    headers: String,
    /**
     * See https://developers.google.com/maps/faq#languagesupport
     */
    language: String,
    lat: Number,
    libraries: [String],
    lng: Number,
    map_api_key: String,
    map_type_control: Boolean,
    map_type_control_position: Number,
    map_type_id: String,
    marker_icon: String,
    onCoordinates_changed: Function,
    onSelected_square: Function,
    on__error: Function,
    on__load: Function,
    region: String,
    rotate_control: Boolean,
    rotate_control_position: Number,
    scale_control: Boolean,
    search_control_position: Number,
    selected_zoom: Number,
    street_view_control: Boolean,
    street_view_control_position: Number,
    tilt: Number,
    version: String,
    watch_location: Boolean,
    words: String,
    zoom: Number,
    zoom_control: Boolean,
    zoom_control_position: Number,
  },
};
</script>

<style>
html,
body {
  margin: 0px;
  height: 100%;
}
[slot="map"] {
  width: 100vw;
  height: 100vh;
}
[slot="search-control"] {
  margin: 10px 0 0 10px;
}
#search-input {
  width: 300px;
}
[slot="current-location-control"] {
  margin: 0 10px 10px 0;
}
</style>
```

<!-- end:usage:what3words-map -->
<!-- begin:usage:what3words-notes -->

### What3Words Notes Component

#### Installation

```bash
npm install @what3words/vue-components@5.0.2
```

#### Usage

```jsx
<template>
  <What3wordsNotes :="$props">
    <label slot="label" for="delivery-notes">
      Delivery Notes
    </label>
    <textarea
      slot="input"
      name="delivery-notes"
      placeholder="Type delivery instructions with your what3words address"
    ></textarea>
  </What3wordsNotes>
</template>

<script lang="ts">
import {
  What3wordsNotes,
} from "@what3words/vue-components";

export default {
  name: "Notes",
  components: {
    What3wordsNotes,
  },
  props: {
    addressFormat: String,
    apiKey: String,
    apiVersion: String,
    baseUrl: String,
    callback: String,
    clipToBoundingBox: String,
    clipToCircle: String,
    clipToCountry: String,
    clipToPolygon: String,
    headers: String,
    language: String,
    nFocusResults: Number,
    searchFocus: Number,
    showHintsTooltip: Boolean,
    typeaheadDelay: String,
  },
};
</script>

<style>
</style>
```

<!-- end:usage:what3words-notes -->

<!-- begin:meta:build-information -->

##### Last Updated: 17/06/2025

##### Version: 5.0.2

<!-- end:meta:build-information -->
