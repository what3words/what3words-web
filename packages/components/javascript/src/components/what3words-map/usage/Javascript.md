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
