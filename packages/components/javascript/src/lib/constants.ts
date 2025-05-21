export const SELECTORS = {
  input: "input",
  suggestions: "[data-testid=autosuggest-suggestions-wrapper]",
  script: 'script[src*="/what3words.js?"],script[src*="/what3words.esm.js?"]',
};

export enum ScriptInitParameter {
  KEY = "key",
  BASEURL = "baseUrl",
  VERSION = "version",
  CALLBACK = "callback",
  HEADERS = "headers",
}

export const ScriptInitParameters = [
  ScriptInitParameter.KEY,
  ScriptInitParameter.BASEURL,
  ScriptInitParameter.CALLBACK,
  ScriptInitParameter.HEADERS,
];

export enum Variant {
  DEFAULT = "default",
  INHERIT = "inherit",
}

export const DEFAULTS = {
  emptyString: "",
  null: null,
  true: true,
  false: false,
  name: "what3words_3wa",
  prefix: "///",
  threeWordAddress: "lock.spout.radar",
  required: false,
  variant: Variant.DEFAULT,
  typeaheadDelay: 300, // number of milliseconds to wait after user has finished typing
  iconVisible: true,
  iconSize: 17,
  iconColor: "#e11f26",
  textColor: "#0a3049",
  addressSize: 24,
  symbolSize: 28,
  get placeholder() {
    return `e.g. ${this.prefix}${this.threeWordAddress}`;
  },

  errorMessage: "No valid 3 word address found.",
  fatalErrorMessage: "An error occurred. Please try again later.",
  serviceErrorMessage:
    "An error occurred while contacting external servers. Please try again.",

  // API Configuration
  headers: "{}",
  base_url: "https://api.what3words.com",

  // Autosuggest result filters / clippings
  language: "en",
  nResults: 3,
  returnCoordinates: false,

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

  // Map provider configuration
  bounds: {
    south: 0,
    west: 0,
    north: 0,
    east: 0,
  },
  center: {
    // default set to w3w HQ - https://www.google.com/maps?q=51.520847,-0.195521
    lat: 51.520847,
    lng: -0.195521,
  },
};

export const W3W_REGEX =
  /(?:\/\/\/|(?:http(?:s)?:\/\/).?(?:www\.)?(?:what3words|w3w)?\.\D+\/)?(\/{0,}(?:[^0-9`~!@#$%^&*()+\-_=[{\]}\\|'<,.>?/";:£§º©®\s]+[.｡。･・︒។։။۔።।][^0-9`~!@#$%^&*()+\-_=[{\]}\\|'<,.>?/";:£§º©®\s]+[.｡。･・︒។։။۔።।][^0-9`~!@#$%^&*()+\-_=[{\]}\\|'<,.>?/";:£§º©®\s]+|[^0-9`~!@#$%^&*()+\-_=[{\]}\\|'<,.>?/";:£§º©®\s]+([\u0020\u00A0][^0-9`~!@#$%^&*()+\-_=[{\]}\\|'<,.>?/";:£§º©®\s]+){1,3}[.｡。･・︒។։။۔።।][^0-9`~!@#$%^&*()+\-_=[{\]}\\|'<,.>?/";:£§º©®\s]+([\u0020\u00A0][^0-9`~!@#$%^&*()+\-_=[{\]}\\|'<,.>?/";:£§º©®\s]+){1,3}[.｡。･・︒។։။۔።।][^0-9`~!@#$%^&*()+\-_=[{\]}\\|'<,.>?/";:£§º©®\s]+([\u0020\u00A0][^0-9`~!@#$%^&*()+\-_=[{\]}\\|'<,.>?/";:£§º©®\s]+){1,3}))/i;

export const W3W_TEXTAREA_REGEX =
  /(?:\/\/\/|(?:http(?:s)?:\/\/).?(?:www\.)?(?:what3words|w3w)?\.\D+\/)?(\/{0,}(?:[^0-9`~!@#$%^&*()+\-_=[{\]}\\|'<,.>?/";:£§º©®\s]+[.｡。･・︒។։။۔።।][^0-9`~!@#$%^&*()+\-_=[{\]}\\|'<,.>?/";:£§º©®\s]+[.｡。･・︒។։။۔።।][^0-9`~!@#$%^&*()+\-_=[{\]}\\|'<,.>?/";:£§º©®\s]+|[^0-9`~!@#$%^&*()+\-_=[{\]}\\|'<,.>?/";:£§º©®\s]+([\u0020\u00A0][^0-9`~!@#$%^&*()+\-_=[{\]}\\|'<,.>?/";:£§º©®\s]+){1,3}[.｡。･・︒។։။۔።।][^0-9`~!@#$%^&*()+\-_=[{\]}\\|'<,.>?/";:£§º©®\s]+([\u0020\u00A0][^0-9`~!@#$%^&*()+\-_=[{\]}\\|'<,.>?/";:£§º©®\s]+){1,3}[.｡。･・︒។։။۔።।][^0-9`~!@#$%^&*()+\-_=[{\]}\\|'<,.>?/";:£§º©®\s]+([\u0020\u00A0][^0-9`~!@#$%^&*()+\-_=[{\]}\\|'<,.>?/";:£§º©®\s]+){1,3}))/gi;

export const SESSION_ID_KEY = "component-session";
export const MAP_SCRIPT_ID = "gmaps-api";
export const RETRIES = 3;
export const MAP_SELECTOR = "div[slot=map]";
export const SEARCH_CONTROL_SELECTOR = "[slot=search-control]";
export const MAP_TYPE_CONTROL_SELECTOR = "[slot=map-type-control]";
export const ZOOM_CONTROL_SELECTOR = "[slot=zoom-control]";
export const CURRENT_LOCATION_CONTROL_SELECTOR =
  "[slot=current-location-control]";
export const AUTOSUGGEST_SELECTOR = "what3words-autosuggest";
export const TOP_LEFT = 1;
export const SELECTED_ZOOM_LEVEL = 19;
export const MIN_GRID_ZOOM_LEVEL = 18;
export const MARKER_SRC = "https://what3words.com/map/marker.png";
export const PHRASE_PARAMETER_PLACEHOLDER = "${PARAM}";
export const W3W_TEXTAREA_PROPERTIES = [
  "boxSizing",
  "width",
  "height",
  "overflowX",
  "overflowY",
  "borderWidth",
  "borderStyle",
  "borderColor",
  "padding",
  "margin",
  "fontFamily",
  "fontStyle",
  "fontVariant",
  "fontWeight",
  "fontStretch",
  "fontSize",
  "fontSizeAdjust",
  "lineHeight",
  "textAlign",
  "textTransform",
  "textIndent",
  "textDecoration",
  "letterSpacing",
  "wordSpacing",
  "direction",
];
