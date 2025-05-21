#### What3Words Notes Component

##### Installation

```bash
npm install @what3words/vue-components@<PACKAGE-VERSION>
```

##### Usage

```jsx
<template>
  <What3wordsNotes :="$props">
    <label slot="label" for="delivery-notes">
      Delivery Notes
    </label>
    <textarea
      slot="input"
      name="delivery-notes"
      placeholder="Type delivery instructions with your what3words address"
    ></textarea>
  </What3wordsNotes>
</template>

<script lang="ts">
import {
  What3wordsNotes,
} from "@what3words/vue-components";

export default {
  name: "Notes",
  components: {
    What3wordsNotes,
  },
  props: {
    addressFormat: String,
    apiKey: String,
    apiVersion: String,
    baseUrl: String,
    callback: String,
    clipToBoundingBox: String,
    clipToCircle: String,
    clipToCountry: String,
    clipToPolygon: String,
    headers: String,
    language: String,
    nFocusResults: Number,
    searchFocus: Number,
    showHintsTooltip: Boolean,
    typeaheadDelay: String,
  },
};
</script>

<style>
</style>
```
