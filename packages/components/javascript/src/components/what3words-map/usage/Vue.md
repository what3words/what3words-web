#### What3Words Map Component

##### Installation

```bash
npm install @what3words/vue-components@<PACKAGE-VERSION>
```

##### Usage

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
