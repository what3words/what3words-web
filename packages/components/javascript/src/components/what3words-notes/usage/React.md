#### What3Words Notes Component

##### Installation

```bash
npm install @what3words/react-components@<PACKAGE-VERSION>
```

##### Usage

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
