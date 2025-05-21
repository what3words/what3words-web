#### What3Words Notes Component

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
