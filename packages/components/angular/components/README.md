# <img src="https://what3words.com/assets/images/w3w_square_red.png" width="32" height="32" alt="what3words-logo">&nbsp;What3words Angular Components

The what3words angular components package extends the [JS API](https://github.com/what3words/w3w-node-wrapper) as a framework wrapper for the custom elements found in the `@what3words/javascript-components` package. This is exclusively for use in [Angular](https://angularjs.com) applications. Depending on your use-case, you can alternatively utilise our native JS custom elements (`@what3words/javascript-components`) as these should work given the specification's current [browser compatibility](https://developer.mozilla.org/en-US/docs/Web/API/Web_components#browser_compatibility) and [framework support](https://custom-elements-everywhere.com/#angular).

## Builder Support

Some Angular builders are unsupported or require additional configuration to work the our components

### Angular >=19

The `@angular-devkit/build-angular:application` is currently unsupported as this is based on vite/esbuild with no mechanism to disable dependency optimizations as would typically be done to resolve this known bundler issue. As such, only the `"@angular-devkit/build-angular:browser` (based on [webpack](https://webpack.js.org/)) builder is supported. To apply this builder, set the `projects.<PROJECT_NAME>.architect.build.builder` option in your `angular.json` config to `@angular-devkit/build-angular:browser` as shown below.

```json
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          ...
          },
        ...
      },
      ...
    },
    ...
  },
}
```

> [!IMPORTANT]
> Your application requirements might conflict with this [downgrade](https://angular.dev/tools/cli/build-system-migration).

Additionally, Angular 19 is configured to use and support standalone component out-of-the-box whereas our libraries are currently built on the older NgModules pattern. They can however still be used in standalone components by using the `@angular/core`-provided `importProvidersFrom` DI [utility method](https://angular.dev/api/core/importProvidersFrom?tab=api) to use it within the bootstrapApplication config and other standalone contexts. In your `main.ts`, update as follows

```typescript
import {
  ApplicationConfig,
  importProvidersFrom,
} from "@angular/core";
import { ComponentsModule } from "@what3words/angular-components";

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(ComponentsModule),
    ....
  ],
};
```

### Angular >=17

The `@angular-devkit/build-angular:application` is currently unsupported as this is based on vite/esbuild with no mechanism to disable dependency optimizations as would typically be done to resolve this known bundler issue. As such, only the `"@angular-devkit/build-angular:browser` (based on [webpack](https://webpack.js.org/)) builder is supported. To apply this builder, set the `projects.<PROJECT_NAME>.architect.build.builder` option in your `angular.json` config to `@angular-devkit/build-angular:browser` as shown below.

```json
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          ...
          },
        ...
      },
      ...
    },
    ...
  },
}
```

> [!IMPORTANT]
> Your application requirements might conflict with this [downgrade](https://angular.dev/tools/cli/build-system-migration).

## Usage

Our angular components are currently only `NgModule` compatible. As such, all examples below follow this component pattern.

<!-- begin:usage:what3words-autosuggest -->

### What3Words Autosuggest Component

#### Installation

```bash
npm install @what3words/angular-components@5.0.2-alpha.0
```

#### Usage

```js
import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

import { What3wordsAutosuggest } from "@what3words/angular-components";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, What3wordsAutosuggest],
  template: `
    <what3words-autosuggest [api_key]="w3w_api_key">
      <input
        id="search-input"
        type="text"
        placeholder="Find your address"
        autocomplete="off"
      />
    </what3words-autosuggest>
    <router-outlet />
  `,
  styles: [``],
})
export class AppComponent {
  w3w_api_key = "<W3W-API-KEY>";
}
```

<!-- end:usage:what3words-autosuggest -->
<!-- begin:usage:what3words-map -->

### What3Words Map Component

#### Installation

```bash
npm install @what3words/angular-components@5.0.2-alpha.0
```

#### Usage

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

<!-- end:usage:what3words-map -->
<!-- begin:usage:what3words-notes -->

### What3Words Notes Component

#### Installation

```bash
npm install @what3words/angular-components@5.0.2-alpha.0
```

#### Usage

```js
import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

import { What3wordsAutosuggest } from "@what3words/angular-components";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, What3wordsAutosuggest],
  template: `
    <what3words-notes [api-key]="w3w_api_key">
      <label slot="label" for="delivery-notes">Delivery Notes</label>
      <textarea
        slot="input"
        name="delivery-notes"
        title="delivery-notes"
      ><textarea/>
    </what3words-notes>
    <router-outlet />
  `,
  styles: [``],
})
export class AppComponent {
  w3w_api_key = "<W3W-API-KEY>";
}
```

<!-- end:usage:what3words-notes -->

<!-- begin:meta:build-information -->

##### Last Updated: 22/05/2025

##### Version: 5.0.2-alpha.0

<!-- end:meta:build-information -->
