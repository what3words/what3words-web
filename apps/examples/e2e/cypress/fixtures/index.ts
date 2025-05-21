import { Chance } from "chance";

import { version as packageVersion } from "../../package.json";

import {
  ApiRequestParam,
  ComponentEvent,
  ComponentProperty,
  InputProperty,
  RawComponentEvent,
  Variant,
} from "./models";

export interface AutosuggestOption {
  country: string;
  language: string;
  nearestPlace: string;
  rank: number;
  words: string;
  distanceToFocusKm?: number;
}

const CHANCE = new Chance();

export {
  ApiRequestParam,
  InputProperty,
  ComponentEvent,
  ComponentProperty,
  RawComponentEvent,
  Variant,
};

export const AS_HEADER_REGEX = new RegExp(
  `^what3words-Autosuggest-JS/${packageVersion} (.*)$`,
  "g"
);

export const NOTES_HEADER_REGEX = new RegExp(
  `^what3words-Notes-JS/${packageVersion} (.*)$`,
  "g"
);

export const MAP_HEADER_REGEX = new RegExp(
  `^what3words-Map-JS/${packageVersion} (.*)$`,
  "g"
);

const SUPPORTED_LANGUAGES = [
  "ar",
  "de",
  "es",
  "fr",
  "it",
  "ja",
  "kk",
  "nl",
  "oo",
  "pt",
  "ru",
  "zh",
  "zu",
];

export const W3W_REGEX =
  /* eslint-disable-next-line no-useless-escape */
  /(?:\/\/\/|(?:http(?:s)?:\/\/)?(?:www\.)?(?:what3words|w3w)?\.\D+\/)?(\/{0,}[^0-9`~!@#$%^&*()+\-_=[{\]}\\|'<,.>?\/";:£§º©®\s]{1,}[・.。][^0-9`~!@#$%^&*()+\-_=[{\]}\\|'<,.>?\/";:£§º©®\s]{1,}[・.。][^0-9`~!@#$%^&*()+\-_=[{\]}\\|'<,.>?\/";:£§º©®\s]{1,})/i;
export const placeSuggestionsURL =
  "https://maps.googleapis.com/maps/api/place/js/AutocompletionService.GetPredictionsJson";
export const autosuggestURL = "https://api.what3words.com/v3/autosuggest";
export const utilisationUrl =
  "https://utilisation-api.what3words.com/autosuggest-session";
export const autosuggestSelectionURL =
  "https://api.what3words.com/v3/autosuggest-selection";
export const convertToCoordinatesURL =
  "https://api.what3words.com/v3/convert-to-coordinates";
export const convertTo3waURL = "https://api.what3words.com/v3/convert-to-3wa";
export const gridSectionURL = "https://api.what3words.com/v3/grid-section";

export const getWords = (value: string) => W3W_REGEX.exec(value);

export function generateAutosuggestOptions({
  includeSea = false,
  language,
}: {
  includeSea?: boolean;
  language?: string;
}): AutosuggestOption[] {
  const options = [];
  let total = 3;
  while (total > 0) {
    options.push({
      country: !includeSea ? CHANCE.country() : "zz",
      language: language || CHANCE.locale(),
      nearestPlace: !includeSea ? CHANCE.street() : "",
      rank: total,
      words: CHANCE.word() + "." + CHANCE.word() + "." + CHANCE.word(),
    });
    total--;
  }
  return options;
}

export function generateCoordinateFromWords(words: string) {
  return {
    coordinates: { lat: CHANCE.latitude(), lng: CHANCE.longitude() },
    country: CHANCE.country(),
    language: CHANCE.locale(),
    map: CHANCE.domain() + "/" + words,
    nearestPlace: CHANCE.city(),
    square: {
      northeast: { lat: CHANCE.latitude(), lng: CHANCE.longitude() },
      southwest: { lat: CHANCE.latitude(), lng: CHANCE.longitude() },
    },
    words,
  };
}

export function hexToRgb(hex: string) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => {
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
        result[3],
        16
      )})`
    : hex.indexOf("rgb") === 0
      ? hex.split(",").join(", ")
      : hex;
}

export function generateRandomCoordinates() {
  const coordinates = CHANCE.coordinates();
  const [lat, lng] = coordinates.split(", ");
  return { lat: parseFloat(lat), lng: parseFloat(lng) };
}

export function generatePolygon(points = 3): string[] {
  const [lat, lng] = CHANCE.coordinates().split(", ");
  const polygon = [lat, lng];
  if (points < 3) points = 3;
  for (let count = 0; count < points; count++) {
    const [lat, lng] = CHANCE.coordinates().split(", ");
    polygon.push(lat);
    polygon.push(lng);
  }
  polygon.push(lat);
  polygon.push(lng);
  return polygon;
}

export const TestScenarios = {
  valid3wa: [CHANCE.letter(), CHANCE.letter(), CHANCE.letter()].join("."),
  validVietnamese3wa: "vịt kho.men sứ.tủ sách",
  invalid3wa: [
    CHANCE.string(),
    CHANCE.integer(),
    CHANCE.bool(),
    CHANCE.floating(),
    CHANCE.longitude(),
    CHANCE.latitude(),
    CHANCE.altitude(),
    CHANCE.address(),
    CHANCE.domain(),
    CHANCE.url(),
  ],
  iconVisible: [true, false],
  typeaheadDelay: CHANCE.natural({ max: 300 }),
  variant: ["default", "inherit"],
  required: [true, false],
  allowInvalid3wa: [true, false],
  placeholder: CHANCE.word({ length: 6 }),
  initialValue: CHANCE.word({ length: 6 }),
  name: CHANCE.word({ length: 6 }),
  iconSize: [
    CHANCE.natural({ max: 100 }),
    CHANCE.natural({ max: 100 }),
    CHANCE.natural({ max: 100 }),
  ],
  iconColor: [
    CHANCE.color({ format: "hex" }),
    CHANCE.color({ format: "rgb" }),
    CHANCE.color({ format: "shorthex" }),
  ],
  language: CHANCE.pickone(SUPPORTED_LANGUAGES),
  autosuggestFocus: CHANCE.coordinates(),
  nFocusResults: CHANCE.natural({ min: 0, max: 3 }),
  clipToCountry: CHANCE.country(),
  clipToBoundingBox: "51.521,-0.343,52.6,2.3324", // hard-coded due to API constraints on lat/lng combinations: https://developer.what3words.com/public-api/docs#autosuggest
  clipToCircle:
    CHANCE.coordinates() + ", " + CHANCE.natural({ min: 10, max: 100 }),
  clipToPolygon: generatePolygon(CHANCE.natural({ min: 3, max: 10 })).join(","),
  invalidClipToPolygonNaN: "NaN,-1.8262100,51.178889,-1.8264680",
  invalidClipToPolygonMissing: "-1.8262100,51.178889,-1.8264680",
  invalidClipToPolygonUnclosed: "51.179024,-1.8262100,51.178889,-1.8264680",
  returnCoordinates: [true, false],
  invalidAddressErrorMessage: CHANCE.sentence(),
};

export const DEFAULTS = {
  emptyString: "",
  null: null,
  true: true,
  false: false,
  name: "what3words_3wa",
  placeholder: "e.g. ///lock.spout.radar",
  prefix: "///",
  required: false,
  variant: Variant.DEFAULT,
  typeaheadDelay: 300, // number of milliseconds to wait after user has finished typing
  iconVisible: true,
  iconSize: 17,
  iconColor: "#e11f26",
  textColor: "#0a3049",
  addressSize: 24,
  symbolSize: 28,

  errorMessage: "No valid what3words address found",
  fatalErrorMessage: "An error occurred. Please try again later",
  c2cErrorMessage: "Convert to coordinates limit reached",

  // API Configuration
  headers: "{}",

  // Autosuggest result filters / clippings
  language: "en",
  nResults: 3,
  coordinates: false,

  // Internal component state
  apiRequest: null,
  options: [],
  showOptions: false,
  option: null,
  loading: false,
  loaded: false,
  selected: false,

  target: "_blank",
  tooltipLocation: "entrance of the building",
};

// Ref packages/javascript/src/lib/constants.ts#L80
export const twaData = {
  coordinates: {
    filledCountSoap: {
      longitude: -0.195521,
      latitude: 51.520847,
    },
    prettyNeededChill: {
      longitude: -1.24623,
      latitude: 51.751172,
    },
  },
  address: "65 Alfred Rd",
  words: "pretty.needed.chill",
};

export const apiKeys = {
  valid: "VALID-API-KEY",
  invalid: "INVALID-API-KEY",
};

export function mockGetAutosuggest(
  suggestions: AutosuggestOption[] = generateAutosuggestOptions({}),
  statusCode = 200
) {
  return cy.intercept("GET", `${autosuggestURL}?*`, {
    statusCode,
    body: {
      suggestions,
    },
  });
}

export function mockGetAutosuggestSelection() {
  return cy.intercept("GET", `${autosuggestSelectionURL}?*`, {
    statusCode: 200,
  });
}

export function mockConvertToCoordinates(
  words = "",
  coordinates?: ReturnType<typeof generateCoordinateFromWords>,
  routeMatcherOpts?: Record<string, any>
) {
  const url = `${convertToCoordinatesURL}?*`;
  cy.intercept({ ...routeMatcherOpts, method: "options", url }, (req: any) =>
    req.reply(200, {})
  );

  return cy.intercept({ ...routeMatcherOpts, url }, (req: any) => {
    const searchParams = new URLSearchParams(req.url.split) as any;
    req.reply(
      200,
      coordinates ||
        generateCoordinateFromWords(words || searchParams.get("words"))
    );
  });
}

export const pasteIntoInput = (text: string) => {
  return cy
    .get("what3words-autosuggest")
    .find("input")
    .trigger("click", "right")
    .trigger("paste", "topRight", { clipboardData: { getData: () => text } });
};
