<script setup lang="ts">
import { load } from "@what3words/javascript-loader";
const attributes = load({
  lazy: true,
});
let populatedAttributes: Record<string, string> = {};
Object.keys(attributes.autosuggest).forEach((key) => {
  if (attributes.autosuggest[key].length) {
    populatedAttributes[key] = attributes.autosuggest[key];
  }
});
</script>

<template>
  <div className="form-field">
    <label htmlFor="w3w-as-input">what3words address (optional):</label>
    <what3words-autosuggest
      :="populatedAttributes"
      data-testid="w3w-as-component"
    >
      <input
        type="text"
        autocomplete="off"
        id="w3w-as-input"
        name="w3w-as-input"
        placeholder="Search for your business"
      />
    </what3words-autosuggest>
  </div>
</template>
