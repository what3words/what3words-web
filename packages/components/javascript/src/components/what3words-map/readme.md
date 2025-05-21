# what3words-map

<!-- Auto Generated Below -->


## Usage

### Angular

#### What3Words Map Component

##### Installation

```bash
npm install @what3words/angular-components@<PACKAGE-VERSION>
```

##### Usage

```js
import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

import { What3wordsMap } from "@what3words/angular-components";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, What3wordsMap],
  template: `
    <what3words-map
      id="w3w-map"
      [api_key]="w3w_api_key"
      [map_api_key]="google_api_key"
      disable_default_ui="true"
      fullscreen_control="true"
      map_type_control="true"
      zoom_control="true"
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
    <router-outlet />
  `,
  styles: [
    `
      html,
      body {
        margin: 0px;
        height: 100%;
      }
      [slot="map"] {
        width: 100vw;
        height: 100vh;
      }
      #search-container {
        margin: 10px 0 0 10px;
      }
      #search-input {
        width: 300px;
      }
      [slot="current-location-container"] {
        margin: 0 10px 10px 0;
      }
    `,
  ],
})
export class AppComponent {
  w3w_api_key = "<W3W-API-KEY>";
  google_api_key = "<GOOGLE-API-KEY>";
}
```


### Javascript

#### What3Words Map Component

##### Installation

###### CDN

```html
<head>
  <script
    type="module"
    defer
    src="https://cdn.what3words.com/javascript-components@<PACKAGE-VERSION>/dist/what3words/what3words.esm.js"
  ></script>
  <script
    nomodule
    defer
    src="https://cdn.what3words.com/javascript-components@<PACKAGE-VERSION>/dist/what3words/what3words.js"
  ></script>
  ...
</head>
...
```

###### NPM

```bash
npm install @what3words/javascript-components@<PACKAGE-VERSION>
```

##### Usage

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


### React

#### What3Words Map Component

##### Installation

```bash
npm install @what3words/react-components@<PACKAGE-VERSION>
```

##### Usage

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


### Vue

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



## Properties

| Property                            | Attribute                           | Description                                                                                                                                                                                                                                                                                                                                                                                                                         | Type                                                                | Default                                                            |
| ----------------------------------- | ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `api_key`                           | `api_key`                           |                                                                                                                                                                                                                                                                                                                                                                                                                                     | `string`                                                            | `DEFAULTS.emptyString`                                             |
| `api_version`                       | `api_version`                       |                                                                                                                                                                                                                                                                                                                                                                                                                                     | `ApiVersion.Version1 \| ApiVersion.Version2 \| ApiVersion.Version3` | `ApiVersion.Version3`                                              |
| `base_url`                          | `base_url`                          |                                                                                                                                                                                                                                                                                                                                                                                                                                     | `string`                                                            | `sdk.api.clients.gridSection["_config"].host ?? DEFAULTS.base_url` |
| `current_location`                  | `current_location`                  |                                                                                                                                                                                                                                                                                                                                                                                                                                     | `boolean \| undefined`                                              | `undefined`                                                        |
| `current_location_control_position` | `current_location_control_position` |                                                                                                                                                                                                                                                                                                                                                                                                                                     | `number`                                                            | `0`                                                                |
| `disable_default_ui`                | `disable_default_ui`                |                                                                                                                                                                                                                                                                                                                                                                                                                                     | `boolean \| undefined`                                              | `undefined`                                                        |
| `fullscreen_control`                | `fullscreen_control`                |                                                                                                                                                                                                                                                                                                                                                                                                                                     | `boolean \| undefined`                                              | `undefined`                                                        |
| `fullscreen_control_position`       | `fullscreen_control_position`       |                                                                                                                                                                                                                                                                                                                                                                                                                                     | `number`                                                            | `0`                                                                |
| `headers`                           | `headers`                           |                                                                                                                                                                                                                                                                                                                                                                                                                                     | `string`                                                            | `DEFAULTS.headers`                                                 |
| `language`                          | `language`                          | Passed to the maps provider sdk. Also used as the default w3w language. Cross-compatible language support is not guaranteed between the map provider and w3w sdks. w3w language default behavior can be overridden by setting the what3words-autosuggest language prop to a supported language. See https://developers.google.com/maps/faq#languagesupport See https://developer.what3words.com/public-api/docs#available-languages | `string`                                                            | `"en"`                                                             |
| `lat`                               | `lat`                               | Latitude value used on initial map render. Defaults to What3Words HQ latitude.                                                                                                                                                                                                                                                                                                                                                      | `number`                                                            | `DEFAULTS.center.lat`                                              |
| `libraries`                         | `libraries`                         |                                                                                                                                                                                                                                                                                                                                                                                                                                     | `("drawing" \| "geometry" \| "places" \| "visualization")[]`        | `[]`                                                               |
| `lng`                               | `lng`                               | Longitude value used on initial map render. Defaults to What3Words HQ longitude.                                                                                                                                                                                                                                                                                                                                                    | `number`                                                            | `DEFAULTS.center.lng`                                              |
| `map_api_key`                       | `map_api_key`                       |                                                                                                                                                                                                                                                                                                                                                                                                                                     | `string`                                                            | `DEFAULTS.emptyString`                                             |
| `map_provider`                      | `map_provider`                      |                                                                                                                                                                                                                                                                                                                                                                                                                                     | `"google"`                                                          | `"google"`                                                         |
| `map_type_control`                  | `map_type_control`                  |                                                                                                                                                                                                                                                                                                                                                                                                                                     | `boolean \| undefined`                                              | `undefined`                                                        |
| `map_type_control_position`         | `map_type_control_position`         |                                                                                                                                                                                                                                                                                                                                                                                                                                     | `number`                                                            | `0`                                                                |
| `map_type_id`                       | `map_type_id`                       |                                                                                                                                                                                                                                                                                                                                                                                                                                     | `"hybrid" \| "road" \| "satellite" \| "terrain" \| undefined`       | `undefined`                                                        |
| `marker_icon`                       | `marker_icon`                       |                                                                                                                                                                                                                                                                                                                                                                                                                                     | `string`                                                            | `MARKER_SRC`                                                       |
| `region`                            | `region`                            |                                                                                                                                                                                                                                                                                                                                                                                                                                     | `string`                                                            | `"GB"`                                                             |
| `reset_zoom_on_select`              | `reset_zoom_on_select`              | Reset map level zoom to selected_zoom after panning to user-selected autosuggest suggestion                                                                                                                                                                                                                                                                                                                                         | `boolean \| undefined`                                              | `undefined`                                                        |
| `rotate_control`                    | `rotate_control`                    |                                                                                                                                                                                                                                                                                                                                                                                                                                     | `boolean \| undefined`                                              | `undefined`                                                        |
| `rotate_control_position`           | `rotate_control_position`           |                                                                                                                                                                                                                                                                                                                                                                                                                                     | `number`                                                            | `0`                                                                |
| `scale_control`                     | `scale_control`                     |                                                                                                                                                                                                                                                                                                                                                                                                                                     | `boolean \| undefined`                                              | `undefined`                                                        |
| `search_control_position`           | `search_control_position`           |                                                                                                                                                                                                                                                                                                                                                                                                                                     | `number`                                                            | `TOP_LEFT`                                                         |
| `selected_zoom`                     | `selected_zoom`                     |                                                                                                                                                                                                                                                                                                                                                                                                                                     | `number`                                                            | `SELECTED_ZOOM_LEVEL`                                              |
| `street_view_control`               | `street_view_control`               |                                                                                                                                                                                                                                                                                                                                                                                                                                     | `boolean \| undefined`                                              | `undefined`                                                        |
| `street_view_control_position`      | `street_view_control_position`      |                                                                                                                                                                                                                                                                                                                                                                                                                                     | `number`                                                            | `0`                                                                |
| `tilt`                              | `tilt`                              |                                                                                                                                                                                                                                                                                                                                                                                                                                     | `number`                                                            | `0`                                                                |
| `version`                           | `version`                           |                                                                                                                                                                                                                                                                                                                                                                                                                                     | `string`                                                            | `"weekly"`                                                         |
| `watch_location`                    | `watch_location`                    |                                                                                                                                                                                                                                                                                                                                                                                                                                     | `boolean \| undefined`                                              | `undefined`                                                        |
| `words`                             | `words`                             | The three word address to load after initial map render. If empty, map will remain at the provided/default lat, lng values                                                                                                                                                                                                                                                                                                          | `string`                                                            | `DEFAULTS.emptyString`                                             |
| `zoom`                              | `zoom`                              |                                                                                                                                                                                                                                                                                                                                                                                                                                     | `number`                                                            | `8`                                                                |
| `zoom_control`                      | `zoom_control`                      |                                                                                                                                                                                                                                                                                                                                                                                                                                     | `boolean \| undefined`                                              | `undefined`                                                        |
| `zoom_control_position`             | `zoom_control_position`             |                                                                                                                                                                                                                                                                                                                                                                                                                                     | `number`                                                            | `0`                                                                |


## Events

| Event                 | Description | Type                                  |
| --------------------- | ----------- | ------------------------------------- |
| `__error`             |             | `CustomEvent<{ error: ErrorEvent; }>` |
| `__load`              |             | `CustomEvent<void>`                   |
| `coordinates_changed` |             | `CustomEvent<Coordinates>`            |
| `selected_square`     |             | `CustomEvent<ThreeWordAddress>`       |


## Methods

### `clearGrid() => Promise<void>`



#### Returns

Type: `Promise<void>`



### `getBounds() => Promise<google.maps.LatLngBoundsLiteral>`



#### Returns

Type: `Promise<LatLngBoundsLiteral>`



### `getLat() => Promise<number | undefined>`



#### Returns

Type: `Promise<number | undefined>`



### `getLng() => Promise<number | undefined>`



#### Returns

Type: `Promise<number | undefined>`



### `getZoom() => Promise<number | undefined>`



#### Returns

Type: `Promise<number | undefined>`



### `panTo(coordinates: Coordinates) => Promise<void>`



#### Parameters

| Name          | Type          | Description |
| ------------- | ------------- | ----------- |
| `coordinates` | `Coordinates` |             |

#### Returns

Type: `Promise<void>`



### `setApiKey(key: string) => Promise<void>`



#### Parameters

| Name  | Type     | Description |
| ----- | -------- | ----------- |
| `key` | `string` |             |

#### Returns

Type: `Promise<void>`



### `setApiVersion(api_version: ApiVersion) => Promise<void>`



#### Parameters

| Name          | Type         | Description |
| ------------- | ------------ | ----------- |
| `api_version` | `ApiVersion` |             |

#### Returns

Type: `Promise<void>`



### `setBaseUrl(host: string) => Promise<void>`



#### Parameters

| Name   | Type     | Description |
| ------ | -------- | ----------- |
| `host` | `string` |             |

#### Returns

Type: `Promise<void>`



### `setCoordinates(newCoordinateValue: number, _oldCoordinateValue: number, propName: string) => Promise<void>`



#### Parameters

| Name                  | Type     | Description |
| --------------------- | -------- | ----------- |
| `newCoordinateValue`  | `number` |             |
| `_oldCoordinateValue` | `number` |             |
| `propName`            | `string` |             |

#### Returns

Type: `Promise<void>`



### `setHeaders(value: string) => Promise<void>`



#### Parameters

| Name    | Type     | Description |
| ------- | -------- | ----------- |
| `value` | `string` |             |

#### Returns

Type: `Promise<void>`



### `setMapTypeId(map_type_id: ViewType) => Promise<void>`



#### Parameters

| Name          | Type                                             | Description |
| ------------- | ------------------------------------------------ | ----------- |
| `map_type_id` | `"road" \| "hybrid" \| "satellite" \| "terrain"` |             |

#### Returns

Type: `Promise<void>`



### `setWords(words: string) => Promise<void>`



#### Parameters

| Name    | Type     | Description |
| ------- | -------- | ----------- |
| `words` | `string` |             |

#### Returns

Type: `Promise<void>`



### `setZoom(zoom: number) => Promise<void>`



#### Parameters

| Name   | Type     | Description |
| ------ | -------- | ----------- |
| `zoom` | `number` |             |

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
