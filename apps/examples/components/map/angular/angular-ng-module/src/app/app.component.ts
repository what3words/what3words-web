import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Renderer2,
} from "@angular/core";
import { load } from "@what3words/javascript-loader";

@Component({
  selector: "app-root",
  template: `
    <h2>{{ title }}</h2>
    <what3words-map
      ngModel
      #map
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
        <button type="button" data-testid="current-location-button">
          Current Location
        </button>
      </div>
    </what3words-map>
    <router-outlet />
  `,
  styles: [
    `
      [slot="map"] {
        height: 60vh;
        width: 60vw;
      }
      #search-container {
        margin: 10px 0 0 10px;
      }
      #search-input {
        width: 14rem;
        margin: 10px;
      }
      [slot="current-location-container"] {
        margin: 0 10px 10px 0;
      }
    `,
  ],
})
export class AppComponent implements AfterViewInit {
  /**
   * Use reference variable to access our autosuggest element in template
   * https://stackoverflow.com/a/45921878
   * https://ultimatecourses.com/blog/element-refs-in-angular-templates
   */
  @ViewChild("map", { static: false, read: ElementRef })
  map!: ElementRef<HTMLElement>;
  title = "what3words Map Component - Angular NgModule";
  attributes = load({
    lazy: true,
  });
  w3w_api_key = "";
  google_api_key = "";

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit() {
    // Attach our attributes to the autosuggest component
    // (spread operations for component attributes are not supported in [Angular](https://github.com/angular/angular/issues/14545))
    Object.keys(this.attributes.map).forEach((key) => {
      const value = this.attributes.map[key];
      if (value.length) {
        this.renderer.setAttribute(this.map.nativeElement, key, value);
      }
    });
  }
}
