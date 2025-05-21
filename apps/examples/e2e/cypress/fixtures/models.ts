export enum Variant {
  DEFAULT = "default",
  INHERIT = "inherit",
}

export enum ComponentProperty {
  callback = "callback",
  apiKey = "apiKey",
  headers = "headers",
  baseUrl = "baseUrl",
  name = "name",
  initialValue = "initialValue",
  variant = "variant",
  typeaheadDelay = "typeaheadDelay",
  invalidAddressErrorMessage = "invalidAddressErrorMessage",
  language = "language",
  autosuggestFocus = "autosuggestFocus",
  nFocusResults = "nFocusResults",
  clipToCountry = "clipToCountry",
  clipToBoundingBox = "clipToBounding_box",
  clipToCircle = "clipToCircle",
  clipToPolygon = "clipToPolygon",
  returnCoordinates = "returnCoordinates",
}

export enum ComponentEvent {
  valueChanged = "onValue_changed",
  valueValid = "onValue_valid",
  valueInvalid = "onValue_invalid",
  deselectedSuggestion = "onDeselected_suggestion",
  selectedSuggestion = "onSelected_suggestion",
  suggestionsChanged = "onSuggestions_changed",
  coordinatesChanged = "onCoordinates_changed",
  hover = "on__hover",
  focus = "on__focus",
  blur = "on__blur",
  error = "on__error",
}

export enum RawComponentEvent {
  valueChanged = "value_changed",
  valueValid = "value_valid",
  valueInvalid = "value_invalid",
  deselectedSuggestion = "deselected_suggestion",
  selectedSuggestion = "selected_suggestion",
  suggestionsChanged = "suggestions_changed",
  coordinatesChanged = "coordinates_changed",
  hover = "__hover",
  focus = "__focus",
  blur = "__blur",
  error = "__error",
}

export enum InputProperty {
  name = "name",
  id = "id",
  placeholder = "placeholder",
  class = "class",
}

export enum ApiRequestParam {
  language = "language",
  autosuggestFocus = "focus",
  nFocusResults = "n-focus-results",
  clipToCountry = "clip-to-country",
  clipToBoundingBox = "clip-to-bounding-box",
  clipToCircle = "clip-to-circle",
  clipToPolygon = "clip-to-polygon",
  returnCoordinates = "return-coordinates",
}
