import type { Coordinates } from "@what3words/api";

import {
  ScriptInitParameter,
  ScriptInitParameters,
  SELECTORS,
} from "./constants";

/**
 * Reference: https://www.totaltypescript.com/iterate-over-object-keys-in-typescript#solution-2-type-predicates
 */
export function isKey<T extends object>(x: T, k: PropertyKey): k is keyof T {
  return k in x;
}

/**
 * Converts a string of coordinate pair values into an array of coordinate objects
 * @param coordinatesString A string of coordinate pair values e.g. `67.234,-42.00,24.24,47.42`
 */
export const convertToCoordinates = (
  coordinatesString: string
): Coordinates[] => {
  const coordinatesArr = coordinatesString.split(",");
  const result = [];

  for (let i = 0; i < coordinatesArr.length; i += 2) {
    result.push(
      parseCoordinates(coordinatesArr[i] ?? "", coordinatesArr[i + 1] ?? "")
    );
  }

  return result;
};

/**
 * Parses coordinate string and returns as an object with floating values
 * @param lat A coordinate-like string
 * @param lng A coordinate-like string
 * @returns object
 */
export const parseCoordinates = (lat: string, lng: string): Coordinates => ({
  lat: parseFloat(lat),
  lng: parseFloat(lng),
});

/**
 * Validates if a value or array is empty
 * @param input the value or array to validate if empty
 */
export const isEmpty = (input: null | undefined | string | unknown[]) => {
  return input === null || input === undefined || input.length === 0;
};

/**
 * Retrieves API options that are settable via query parameters in the request of the SDK. This function retrieves and
 * returns an object with all found parameters if any exist
 * @returns object
 */
export function getScriptInitOptions(): Record<string, unknown> {
  const options: Record<string, string | string[]> = {};
  const scriptTag = document.querySelector<HTMLScriptElement>(SELECTORS.script);

  if (scriptTag) {
    const url = new URL(scriptTag.src);
    const params = new URLSearchParams(url.search);
    params.forEach((value, key) => {
      if (ScriptInitParameters.includes(key as ScriptInitParameter)) {
        switch (key as ScriptInitParameter) {
          case ScriptInitParameter.KEY:
          case ScriptInitParameter.BASEURL:
          case ScriptInitParameter.CALLBACK:
            options[key] = value;
            break;
          case ScriptInitParameter.HEADERS:
            if (value.length > 0) options[key] = JSON.parse(value) as string;
        }
      }
    });
  }
  return options;
}
