#### What3Words Autosuggest Component

##### Installation

```bash
npm install @what3words/vue-components@<PACKAGE-VERSION>
```

##### Usage

```jsx
<template>
  <What3wordsAutosuggest :="$props">
    <input
      id="search-input"
      type="text"
      placeholder="Find your address"
      autocomplete="off"
    />
  </What3wordsAutosuggest>
</template>

<script lang="ts">
import {
  What3wordsAutosuggest,
} from "@what3words/vue-components";

export default {
  name: "Autosuggest",
  components: {
    What3wordsAutosuggest,
  },
  props: {
    callback: String,
    api_key: String,
    headers: String,
    base_url: String,
    name: String,
    initial_value: String,
    variant: String,
    typeahead_delay: Number,
    allow_invalid: Boolean,
    icon_visible: Boolean,
    icon_size: Number,
    icon_color: String,
    language: String,
    n_focus_results: Number,
    clip_to_country: String,
    clip_to_bounding_box: String,
    clip_to_circle: String,
    clip_to_polygon: String,
    return_coordinates: Boolean,
    onValue_changed: Function,
    onValue_valid: Function,
    onValue_invalid: Function,
    onDeselected_suggestion: Function,
    onSelected_suggestion: Function,
    onSuggestions_changed: Function,
    onCoordinates_changed: Function,
    on__hover: Function,
    on__focus: Function,
    on__blur: Function,
    on__error: Function,
  },
};
</script>

<style>
</style>
```
