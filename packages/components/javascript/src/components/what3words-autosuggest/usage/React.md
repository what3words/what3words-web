#### What3Words Autosuggest Component

##### Installation

```bash
npm install @what3words/react-components@<PACKAGE-VERSION>
```

##### Usage

```jsx
import { What3wordsAutosuggest } from "@what3words/react-components";

const W3W_API_KEY = "<W3W-API-KEY>";

export default function Autosuggest() {
  return (
    <What3wordsAutosuggest api_key={API_KEY}>
      <input
        type="text"
        placeholder="Find your address"
        style={{ width: "300px" }}
        autoComplete="off"
      />
    </What3wordsAutosuggest>
  );
}
```
