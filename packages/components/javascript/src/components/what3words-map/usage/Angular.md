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
