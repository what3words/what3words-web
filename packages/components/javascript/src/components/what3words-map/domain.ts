import type { Coordinates } from "@what3words/api";

// TODO: Manually tracking external resource types is untenable; should delete

export interface ThreeWordAddress {
  coordinates: Coordinates;
  country: string;
  language: string;
  map: string;
  nearestPlace: string;
  square: {
    northeast: Coordinates;
    southwest: Coordinates;
  };
  words: string;
}

export type GoogleMapsLibraries = (
  | "drawing"
  | "geometry"
  | "places"
  | "visualization"
)[];

export type MapProviderName = "google";
