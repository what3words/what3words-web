<script setup lang="ts">
import { load } from "@what3words/javascript-loader";
const attributes = load({
  lazy: true,
});
let populatedAttributes: Record<string, string> = {};
Object.keys(attributes.map).forEach((key) => {
  if (attributes.map[key].length) {
    populatedAttributes[key] = attributes.map[key];
  }
});
</script>

<template>
  <what3words-map
    map_type_id="satellite"
    words="filled.count.soap"
    :="populatedAttributes"
    id="w3w-map"
    data-testid="w3w-map-component"
  >
    <div slot="map" id="map" data-testid="w3w-map-container-slot"></div>
    <div slot="search-control" data-testid="w3w-map-search-slot">
      <what3words-autosuggest data-testid="w3w-map-autosuggest-component">
        <input
          type="text"
          placeholder="e.g. ///filled.count.soap"
          autocomplete="off"
        />
      </what3words-autosuggest>
    </div>
    <div
      slot="current-location-control"
      data-testid="w3w-map-current-location-slot"
    >
      <button type="button" data-testid="current-location-button">
        Current Location
      </button>
    </div>
  </what3words-map>
</template>

<style></style>
