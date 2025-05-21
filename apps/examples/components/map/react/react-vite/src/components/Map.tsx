/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  What3wordsAutosuggest,
  What3wordsMap,
} from "@what3words/react-components";
import { useEffect, useState } from "react";
import { load } from "@what3words/javascript-loader";

export default function Map(props: any) {
  const [attributes, setAttributes] = useState({ ...props });

  useEffect(() => {
    const attributes = load({
      lazy: true,
    });
    const populatedAttributes = {} as Record<string, any>;
    Object.keys(attributes.map).forEach((key) => {
      if (attributes.map[key].length) {
        populatedAttributes[key] = attributes.map[key];
      }
    });
    setAttributes(populatedAttributes);
  }, []);

  return (
    <What3wordsMap
      map_type_id="satellite"
      words="filled.count.soap"
      {...attributes}
      id="w3w-map"
      data-testid="w3w-map-component"
    >
      <div slot="map" id="map" data-testid="w3w-map-container-slot"></div>
      <div slot="search-control" data-testid="w3w-map-search-slot">
        <What3wordsAutosuggest data-testid="w3w-map-autosuggest-component">
          <input
            type="text"
            placeholder="e.g. ///filled.count.soap"
            autoComplete="off"
          />
        </What3wordsAutosuggest>
      </div>
      <div slot="current-location-control" id="current-location-container">
        <button type="button" data-testid="current-location-button">
          Current Location
        </button>
      </div>
    </What3wordsMap>
  );
}
