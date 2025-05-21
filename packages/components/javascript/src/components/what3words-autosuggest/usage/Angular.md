#### What3Words Autosuggest Component

##### Installation

```bash
npm install @what3words/angular-components@<PACKAGE-VERSION>
```

##### Usage

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
