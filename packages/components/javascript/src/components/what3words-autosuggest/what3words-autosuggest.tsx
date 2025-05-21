import type { Variant } from "@javascript-components/lib/constants";
import type { UtilisationSessionHeader } from "@javascript-components/lib/utilisation";
import type { EventEmitter, JSX } from "@stencil/core";
import {
  DEFAULTS,
  SELECTORS,
  W3W_REGEX,
} from "@javascript-components/lib/constants";
import { sdk, what3wordsClients } from "@javascript-components/lib/sdk";
import { resolveLanguageCode, t } from "@javascript-components/lib/translation";
import utilisation, {
  SessionType,
} from "@javascript-components/lib/utilisation";
import {
  convertToCoordinates,
  isEmpty,
  parseCoordinates,
} from "@javascript-components/lib/utils";
import {
  Component,
  Element,
  Event,
  h,
  Host,
  Listen,
  Prop,
  State,
  Watch,
} from "@stencil/core";

import type {
  AutosuggestOptions,
  AutosuggestResponse,
  AutosuggestSuggestion,
  Coordinates,
  What3wordsService,
} from "@what3words/api";
import { ApiVersion, fetchTransport } from "@what3words/api";

import type {
  AutosuggestOption,
  CoordinatesPayload,
  CustomOption,
  InputValuePayload,
  SuggestionPayload,
  SuggestionsPayload,
} from "./domain";
import { version } from "../../../package.json";
import { ErrorMessage } from "./components/error-message";
import { Status } from "./components/status";
import { Suggestions } from "./components/suggestions";

/**
 * @slot { HTMLInputElement } - Optional input to override the default slot content
 */
@Component({
  tag: "what3words-autosuggest",
  styleUrl: "what3words-autosuggest.scss",
})
export class What3wordsAutosuggest {
  @Element() private el!: HTMLWhat3wordsAutosuggestElement;
  // API configuration
  @Prop() public callback: string = DEFAULTS.emptyString;
  @Prop() public api_key: string = DEFAULTS.emptyString;
  @Prop() public headers: string = DEFAULTS.headers;
  @Prop() public base_url: string =
    // TODO: _config is a protected property, new access method should be created to reflect this value reference
    sdk.api.clients.autosuggest["_config"].host ?? DEFAULTS.base_url;
  @Prop() public api_version: ApiVersion = ApiVersion.Version3;

  // Input properties
  @Prop() public name: string = DEFAULTS.name;
  @Prop({ mutable: true }) public initial_value: string = DEFAULTS.emptyString;
  @Prop() public variant: Variant = DEFAULTS.variant;
  @Prop() public typeahead_delay: number = DEFAULTS.typeaheadDelay;
  @Prop({ mutable: true }) public invalid_address_error_message: string | null =
    DEFAULTS.null;
  @Prop() public strict: boolean = DEFAULTS.true;

  // Autosuggest result filters / clippings
  @Prop() public language?: string;
  @Prop() public autosuggest_focus: string = DEFAULTS.emptyString;
  @Prop() public n_focus_results?: number;
  @Prop() public clip_to_country: string = DEFAULTS.emptyString;
  @Prop() public clip_to_bounding_box = DEFAULTS.emptyString;
  @Prop() public clip_to_circle = DEFAULTS.emptyString;
  @Prop() public clip_to_polygon = DEFAULTS.emptyString;
  @Prop() public return_coordinates = DEFAULTS.returnCoordinates;
  @Prop() public options: CustomOption[] = [];

  // Internal component state
  @State() private rawValue: string = this.initial_value;
  @State() private value: string = this.initial_value;
  @State() private input: HTMLInputElement | null = DEFAULTS.null;
  @State() private latInput: HTMLInputElement | null = DEFAULTS.null;
  @State() private lngInput: HTMLInputElement | null = DEFAULTS.null;
  @State() private suggestions: AutosuggestOption[] = DEFAULTS.options;
  @State() private selectedSuggestion: AutosuggestOption | null = DEFAULTS.null;
  @State() private showSuggestions: boolean = DEFAULTS.false;
  @State() private hasFocus: boolean = DEFAULTS.false;
  @State() private latitude: number | null = DEFAULTS.null;
  @State() private longitude: number | null = DEFAULTS.null;
  @State() private apiRequestTimeout?: NodeJS.Timeout;
  @State() private loading: boolean = DEFAULTS.false;
  @State() private hoverIndex = -1;
  @State() private error: Error | null = DEFAULTS.null;
  @State() private errorTimeout?: NodeJS.Timeout;
  @State() private clients!: Pick<
    What3wordsService["clients"],
    "autosuggest" | "convertToCoordinates"
  >;
  // Events / callbacks
  @Event() private value_changed!: EventEmitter<InputValuePayload>;
  @Event() private value_valid!: EventEmitter<InputValuePayload>;
  @Event() private value_invalid!: EventEmitter<InputValuePayload>;
  @Event() private selected_suggestion!: EventEmitter<SuggestionPayload>;
  @Event() private suggestions_changed!: EventEmitter<SuggestionsPayload>;
  @Event() private suggestions_not_found!: EventEmitter<void>;
  @Event() private coordinates_changed!: EventEmitter<CoordinatesPayload>;
  @Event() private selected_custom_option!: EventEmitter<CustomOption>;
  @Event() private deselected_suggestion!: EventEmitter<SuggestionPayload>;

  // Events useful for programmatic hooks into user interaction with the component
  @Event() private __hover!: EventEmitter<SuggestionPayload>;
  @Event() private __focus!: EventEmitter<void>;
  @Event() private __blur!: EventEmitter<void>;
  @Event() private __error!: EventEmitter<{ error: Error }>;

  /**
   * Watches for changes to the api_key property
   * @param key The api key
   */
  @Watch("api_key")
  public setApiKey(key: string) {
    Object.values(this.clients).forEach((client) => client.apiKey(key));
  }

  /**
   * Watches for changes to the base_url property
   * @param base_url The base url
   */
  @Watch("base_url")
  public setBaseUrl(host: string) {
    Object.values(this.clients).forEach((client) => client.config({ host }));
  }

  /**
   * Watches for changes to the api_version property
   * @param apiVersion The version
   */
  @Watch("api_version")
  public setApiVersion(api_version: ApiVersion) {
    Object.values(this.clients).forEach((client) =>
      client.config({ apiVersion: api_version })
    );
  }

  /**
   * Watches for changes to the headers property
   * @param value The headers value
   */
  @Watch("headers")
  public setHeaders(value: string) {
    const componentHeaders = this.getComponentHeaders();
    const injectedHeaders = (
      typeof value === "string" ? JSON.parse(value) : value
    ) as Record<string, unknown>;
    Object.values(this.clients).forEach((client) =>
      client.config({
        headers: { ...injectedHeaders, ...componentHeaders },
      })
    );
  }

  @Watch("options")
  public setCustomOptions(options: { value: string; id: string }[]) {
    this.setShowSuggestions(options.length > 0);
  }

  private getComponentHeaders() {
    const { return_coordinates, typeahead_delay, variant } = this;
    const component_session_id = window.what3words_session_id;
    const meta = JSON.stringify({
      return_coordinates,
      typeahead_delay,
      variant,
      component_session_id,
      origin: window.location.origin,
    });
    return {
      "X-Correlation-ID": component_session_id,
      "X-W3W-AS-Component": `what3words-Autosuggest-JS/${version} (${meta})`,
    };
  }

  private getRequestOptions(input: string): AutosuggestOptions {
    const {
      autosuggest_focus,
      n_focus_results,
      clip_to_country,
      clip_to_bounding_box,
      clip_to_circle,
      clip_to_polygon,
      language,
    } = this;
    const options: AutosuggestOptions = { input, language };

    // validates the language
    options.language = resolveLanguageCode(language);

    if (!isEmpty(autosuggest_focus)) {
      const [lat, lng] = autosuggest_focus.split(",");
      if (lat && lng) options.focus = parseCoordinates(lat, lng);
    }
    if (!isEmpty(n_focus_results?.toString()))
      options.nFocusResults = n_focus_results;
    if (!isEmpty(clip_to_country))
      options.clipToCountry = clip_to_country.split(",");
    if (!isEmpty(clip_to_bounding_box)) {
      const [southLat, westLng, northLat, eastLng] =
        clip_to_bounding_box.split(",");

      if (northLat && eastLng && southLat && westLng)
        options.clipToBoundingBox = {
          northeast: parseCoordinates(northLat, eastLng),
          southwest: parseCoordinates(southLat, westLng),
        };
    }
    if (!isEmpty(clip_to_circle)) {
      const [lat, lng, radius] = clip_to_circle.split(",");
      if (lat && lng && radius)
        options.clipToCircle = {
          center: parseCoordinates(lat, lng),
          radius: parseFloat(radius),
        };
    }
    if (!isEmpty(clip_to_polygon)) {
      options.clipToPolygon = convertToCoordinates(clip_to_polygon);
    }

    return options;
  }

  /**
   * Gets/sets the input element
   * @param { HTMLInputElement } input
   */
  private setInputElement(input: HTMLInputElement) {
    this.input = input;
  }

  /** @returns { HTMLInputElement | null } */
  private getInputElement(): HTMLInputElement | null {
    return this.input;
  }

  /**
   * Sets the input value
   * @param { string } value
   */
  private setInputValue(value: string) {
    const input = this.getInputElement();
    if (input) input.value = value;
  }

  /**
   * Gets/sets the value state for the input element
   * @param { string } value The value to set
   */
  private setValue(value: string) {
    this.value = value;
  }

  /** @returns { string } */
  public getValue(): string {
    return this.value;
  }

  /**
   * Gets/sets the raw input search value
   * @param { string } rawValue The value to set
   */
  private setRawValue(rawValue: string) {
    this.rawValue = rawValue;
  }

  /**
   * @returns { string }
   */
  public getRawValue(): string {
    return this.rawValue;
  }

  /**
   * Get/set the autosuggestions state value
   * @param { AutosuggestOption[] } suggestions The suggestions to set
   */
  private setSuggestions(suggestions: AutosuggestOption[] = []) {
    this.suggestions = suggestions;
  }

  /** @return { AutosuggestOption[] } */
  public getSuggestions(): AutosuggestOption[] {
    return this.suggestions;
  }

  /**
   * Get/set the selected suggestion state value
   * @param { AutosuggestOption | null } selectedSuggestion The suggestions to set
   */
  private setSelectedSuggestion(
    selectedSuggestion: AutosuggestOption | null = null
  ) {
    this.selectedSuggestion = selectedSuggestion;
  }

  /** @return { AutosuggestOption | null } */
  public getSelectedSuggestion(): AutosuggestOption | null {
    return this.selectedSuggestion;
  }

  /**
   * Gets/sets the loading state value
   * @param { boolean } loading The state to set
   */
  private setLoading(loading: boolean) {
    if (this.loading && !loading)
      setTimeout(() => (this.loading = loading), 200);
    else this.loading = loading;
  }

  /** @return { boolean } */
  public getLoading(): boolean {
    return this.loading;
  }

  /**
   * Gets/sets the hasFocus state value
   * @param { boolean } hasFocus The state to set
   */
  private setHasFocus(hasFocus: boolean) {
    this.hasFocus = hasFocus;
  }

  /** @return { boolean } */
  public getHasFocus(): boolean {
    return this.hasFocus;
  }

  /**
   * Gets/sets the showSuggestions state value
   * @param { boolean } showSuggestions The state to set
   */
  private setShowSuggestions(showSuggestions: boolean) {
    this.showSuggestions = showSuggestions;
  }

  /** @return { boolean } */
  public getShowSuggestions(): boolean {
    return this.showSuggestions;
  }

  /**
   * Gets/sets the latitude state value
   * @param { number | null } lat The latitude value to set
   */
  private setLat(lat: number | null) {
    this.latitude = lat;
  }

  /** @returns { number | null } */
  public getLat(): number | null {
    return this.latitude;
  }

  /**
   * Gets/sets the longitude value
   * @param { number | null } lng The longitude value to set
   */
  private setLng(lng: number | null) {
    this.longitude = lng;
  }

  /** @returns { number | null } */
  public getLng(): number | null {
    return this.longitude;
  }

  /**
   * Gets/sets the latitude input state value
   * @param { HTMLInputElement } lat The latitude input value to set
   */
  private setLatInput(lat: HTMLInputElement) {
    this.latInput = lat;
  }

  /** @returns { HTMLInputElement | null } */
  public getLatInput(): HTMLInputElement | null {
    return this.latInput;
  }

  /**
   * Gets/sets the longitude input state value
   * @param { HTMLInputElement } lng The longitude input value to set
   */
  private setLngInput(lng: HTMLInputElement) {
    this.lngInput = lng;
  }

  /** @returns { HTMLInputElement | null } */
  public getLngInput(): HTMLInputElement | null {
    return this.lngInput;
  }

  /**
   * Gets/sets the hover index value
   * @param { number } hoverIndex The hover index value to set
   */
  private setHoverIndex(hoverIndex: number) {
    this.hoverIndex = hoverIndex;
  }

  /** @returns { number } */
  public getHoverIndex(): number {
    return this.hoverIndex;
  }

  /**
   * Gets/sets the hover index value
   * @param { Error | null } error The hover index value to set
   */
  private setError(error: Error | null) {
    this.error = error;
  }

  /** @returns { Error | null } */
  public getError(): Error | null {
    return this.error;
  }

  /**
   * Gets/sets the hover index value
   * @param { NodeJS.Timeout } errorTimeout The hover index value to set
   */
  private setErrorTimeout(errorTimeout: NodeJS.Timeout) {
    this.errorTimeout = errorTimeout;
  }
  /** @returns { NodeJS.Timeout | undefined } */
  public getErrorTimeout(): NodeJS.Timeout | undefined {
    return this.errorTimeout;
  }

  /**
   * Emit an error and pass
   * @param {Error} error
   */
  private emitError(error: Error) {
    this.__error.emit({ error });
  }

  /**
   * Emits the no suggestions found error
   */
  private emitNoSuggestionsFoundError() {
    /**
     * NOTE: Ideally this should be using `no_suggestions_found` key from Phrase Strings
     * however, given that it'll cost us to have any new key translated to all the available languages,
     * we'll settle with a generic `invalid_address_message` for now.
     */
    const localisedErrorMessage = t("invalid_address_message");
    this.__error.emit({ error: new Error(localisedErrorMessage) });
  }

  /**
   * Emits the invalid three word address error
   */
  private emitInvalidAddressError() {
    const localisedInvalidAddressErrorMessage =
      this.invalid_address_error_message ?? t("invalid_address_message");
    this.__error.emit({
      error: new Error(localisedInvalidAddressErrorMessage),
    });
  }

  /**
   * Emits the could not retrieve co-ordinates error
   */
  private emitFatalError() {
    const localisedErrorMessage = t("error_message");
    this.__error.emit({
      error: new Error(localisedErrorMessage),
    });
  }

  private clearErrorMessage() {
    const errorTimeout = this.getErrorTimeout();
    clearTimeout(errorTimeout);
    this.setError(null);
  }

  /**
   * Asynchronously retrieves autosuggestion results for a given search string and sets the results against the
   * component state. This method is idempotent and has a timeout delay to throttle requests, waiting for the user to
   * stop typing.
   * @param value The search string to retrieve autosuggestions for.
   */
  private async getAutosuggestions(
    value: string
  ): Promise<AutosuggestResponse> {
    clearTimeout(this.apiRequestTimeout);
    const options = this.getRequestOptions(value);

    return this.clients.autosuggest.run(options).finally(() => {
      const componentHeaders = this.getComponentHeaders() as Pick<
        UtilisationSessionHeader,
        "X-Correlation-ID" | "X-W3W-AS-Component"
      >;
      const {
        return_coordinates,
        typeahead_delay,
        variant,
        headers,
        base_url,
        api_key,
      } = this;
      utilisation
        .send({
          key: api_key,
          baseUrl: base_url,
          type: SessionType.Updated,
          headers: {
            ...componentHeaders,
            ...((typeof this.headers === "string"
              ? JSON.parse(this.headers)
              : this.headers) as UtilisationSessionHeader),
          },
          data: {
            return_coordinates,
            typeahead_delay,
            variant,
            component_version: version,
          },
        })
        .catch(() => {
          // TODO: Should log utilisation request failures
        });
    });
  }

  @Listen("value_changed", { capture: true, passive: true })
  private onValueChanged({ detail: { value } }: { detail: { value: string } }) {
    if (this.selectedSuggestion)
      this.deselected_suggestion.emit({
        suggestion: this.selectedSuggestion,
      });
    this.setSelectedSuggestion(DEFAULTS.null);
    this.setRawValue(value);
    const valid = W3W_REGEX.test(value);
    if (valid) {
      const [, words] = W3W_REGEX.exec(value) ?? ["", ""];
      this.setValue(words);
      this.value_valid.emit({
        value: DEFAULTS.prefix + words,
      });
    } else {
      this.setValue(value);
      this.value_invalid.emit({ value });
    }
  }

  @Listen("value_valid", { capture: true, passive: true })
  private onValueValid({ detail: { value } }: { detail: { value: string } }) {
    clearTimeout(this.apiRequestTimeout);
    this.clearErrorMessage();
    this.setLoading(true);

    this.apiRequestTimeout = setTimeout(() => {
      this.getAutosuggestions(value)
        .then(({ suggestions }) => {
          this.setLoading(false);
          this.setHasFocus(true);
          this.suggestions_changed.emit({ suggestions });
        })
        .catch(() => {
          this.setLoading(false);
          this.setSuggestions();
          this.emitFatalError();
        });
    }, this.typeahead_delay);
  }

  @Listen("value_invalid")
  private onValueInvalid() {
    clearTimeout(this.apiRequestTimeout);
    this.setLoading(false);
    this.setSuggestions();
    this.setSelectedSuggestion(null);
    this.setShowSuggestions(false);
    this.setLat(null);
    this.setLng(null);
  }

  @Listen("suggestions_changed", { capture: true, passive: true })
  private onSuggestionsChanged({
    detail: { suggestions },
  }: {
    detail: { suggestions: AutosuggestOption[] };
  }) {
    this.setHoverIndex(-1);
    if (suggestions.length === 0) {
      this.suggestions_not_found.emit();
      return;
    }
    this.setSuggestions(suggestions);
    this.setShowSuggestions(true);
  }

  @Listen("suggestions_not_found", { capture: true, passive: true })
  private onSuggestionsNotFound() {
    this.setSuggestions([]);
    this.setShowSuggestions(false);
    this.emitNoSuggestionsFoundError();
  }

  @Listen("selected_suggestion", { capture: true, passive: true })
  private onSelectedSuggestion({
    detail: { suggestion },
  }: {
    detail: { suggestion: AutosuggestSuggestion };
  }) {
    if (this.getInputElement()) {
      this.setInputValue(DEFAULTS.prefix + suggestion.words);
    }
    this.setSelectedSuggestion(suggestion);
    this.setValue(suggestion.words);
    this.setShowSuggestions(false);
    this.setHoverIndex(-1);
    this.clearErrorMessage();

    const componentHeaders = this.getComponentHeaders() as Pick<
      UtilisationSessionHeader,
      "X-Correlation-ID" | "X-W3W-AS-Component"
    >;

    this.clients.autosuggest
      .onSelected(suggestion)
      .catch((error: Error) => this.emitError(error))
      .finally(() => {
        const {
          return_coordinates,
          typeahead_delay,
          variant,
          headers,
          base_url,
          api_key,
        } = this;
        utilisation
          .send({
            key: api_key,
            baseUrl: base_url,
            type: SessionType.Updated,
            headers: {
              ...componentHeaders,
              ...((typeof this.headers === "string"
                ? JSON.parse(this.headers)
                : this.headers) as UtilisationSessionHeader),
            },
            data: {
              return_coordinates,
              typeahead_delay,
              variant,
              component_version: version,
            },
          })
          .catch(() => {
            // TODO: Emit utilisation send error
          });
      });

    if (this.return_coordinates) {
      clearTimeout(this.apiRequestTimeout);
      this.apiRequestTimeout = setTimeout(() => {
        this.clients.convertToCoordinates
          .run({
            words: suggestion.words,
          })
          .then(({ coordinates }) => {
            return this.coordinates_changed.emit({ coordinates });
          })
          .catch(
            (
              error: Error &
                Record<"status", number> &
                Record<"details", Record<"message", string>>
            ) => {
              if (error.status === 402) {
                const { details } = error;
                // TT-9494 - Display error on the console log
                console.error(details.message || error.message);
                return;
              }
              return this.emitError(error);
            }
          );
      }, 0);
    } else {
      this.setLat(null);
      this.setLng(null);
    }
  }

  @Listen("selected_custom_option", { capture: true, passive: true })
  private _onSelectedCustomOption({
    detail: { value },
  }: {
    detail: { value: string };
  }) {
    if (this.getInputElement()) {
      this.setInputValue(value);
    }
    this.options = [];
    this.setValue(value);
    this.setShowSuggestions(false);
    this.setHoverIndex(-1);
    this.clearErrorMessage();
  }

  @Listen("coordinates_changed", { capture: true, passive: true })
  private _onCoordinatesChanged({
    detail: { coordinates },
  }: {
    detail: { coordinates: Coordinates };
  }) {
    this.setLat(coordinates.lat);
    this.setLng(coordinates.lng);

    const latInput = this.getLatInput();
    const lngInput = this.getLngInput();

    if (latInput) {
      latInput.value = `${this.getLat()}`;
    }
    if (lngInput) {
      lngInput.value = `${this.getLng()}`;
    }
  }

  @Listen("__hover", { capture: true, passive: true })
  private _onHover({
    detail: { suggestion },
  }: {
    detail: { suggestion: AutosuggestOption & CustomOption };
  }) {
    const suggestionsHoverIndex = this.getSuggestions().findIndex(
      (s) => s.words === suggestion.words
    );
    const optionsHoverIndex = this.options.findIndex(
      (s) => s.value === suggestion.value
    );
    if (suggestionsHoverIndex > -1) {
      this.setHoverIndex(suggestionsHoverIndex);
    } else if (optionsHoverIndex > -1) {
      this.setHoverIndex(optionsHoverIndex);
    }
  }

  @Listen("__focus", { capture: true, passive: true })
  private _onFocus() {
    this.setHasFocus(true);
    this.setShowSuggestions(
      (this.suggestions.length > 0 || this.options.length > 0) &&
        this.selectedSuggestion === null
    );
  }

  @Listen("__blur", { capture: true, passive: true })
  private _onBlur() {
    const inputElement = this.getInputElement();

    if (!inputElement) {
      const error = new Error("Input element not found");
      this.emitError(error);
      return;
    }

    const isInputChanged = inputElement.value !== this.initial_value;
    if (isInputChanged && !this.getSelectedSuggestion() && this.strict) {
      this.setInputValue(DEFAULTS.emptyString);
      this.setValue(DEFAULTS.emptyString);
      this.emitInvalidAddressError();
    } else if (!this.strict && inputElement.value === DEFAULTS.prefix) {
      this.setInputValue(DEFAULTS.emptyString);
      this.setValue(DEFAULTS.emptyString);
    }
    this.setHasFocus(false);
    this.setShowSuggestions(false);
    this.setSuggestions([]);
  }

  @Listen("__error", { capture: true, passive: true })
  private _onError({ detail: { error } }: { detail: { error: Error } }) {
    const errTimeout = this.getErrorTimeout();
    clearTimeout(errTimeout);
    this.setError(error);
    this.setErrorTimeout(setTimeout(() => this.setError(null), 5000));
  }

  // Event listeners
  @Listen("input", { capture: true, passive: true })
  private onInput(e: InputEvent & { target: HTMLInputElement }) {
    const value = e.target.value;
    this.value_changed.emit({ value });
  }

  @Listen("paste", { capture: true, passive: false })
  private onPaste(
    event: ClipboardEvent & {
      target: {
        selectionStart: number;
        selectionEnd: number;
        value: string;
      };
    }
  ) {
    event.preventDefault();
    const pastedText = event.clipboardData?.getData("text") ?? "";
    const isValid3wa = W3W_REGEX.test(pastedText);
    let value: string;

    if (isValid3wa) {
      const [, words] = W3W_REGEX.exec(pastedText) ?? ["", ""];
      value = DEFAULTS.prefix + words;
    } else {
      const startingPoint = 0;
      const {
        target: { selectionStart, selectionEnd, value: v },
      } = event;
      value =
        v.replace(/$\/*/, "").substring(startingPoint, selectionStart) +
        pastedText +
        v.substring(selectionEnd);
    }

    event.target.value = value;
    this.value_changed.emit({ value });
  }

  @Listen("blur", { capture: true, passive: true })
  private onBlur() {
    this.__blur.emit();
  }

  @Listen("focus", { capture: true, passive: true })
  private onFocus(e: InputEvent) {
    const inputElement = this.getInputElement();
    const target = e.target as HTMLInputElement;

    if (!inputElement) {
      const error = new Error("Input element not found");
      this.emitError(error);
      return;
    }

    if (target.value === "" || target.value === DEFAULTS.prefix) {
      target.value = DEFAULTS.prefix;
    }
    setTimeout(
      () =>
        (inputElement.selectionStart = inputElement.selectionEnd =
          target.value.length),
      0
    );
    this.__focus.emit();
  }

  @Listen("keyup", { capture: true, passive: false })
  private onKeyUp(e: KeyboardEvent) {
    const { key } = e;
    const keys = ["Escape", "ArrowDown", "ArrowUp", "Enter"];

    if (!keys.includes(key)) return;

    const suggestions = this.getSuggestions();
    const value = this.getValue();
    const suggestion = suggestions.find(
      (s) => s.words === value.replace(/$\/*/, "")
    );
    const option = this.options.find(
      (s) => s.value === value.replace(/$\/*/, "")
    );

    switch (key) {
      case "Escape":
        this.__blur.emit();
        this.setHoverIndex(-1);
        break;
      case "ArrowUp":
        if (this.options.length > 0) {
          e.preventDefault();
          this.setShowSuggestions(true);
          if (this.options[this.hoverIndex - 1]) {
            this.setHoverIndex(this.hoverIndex - 1);
          } else this.setHoverIndex(this.options.length - 1);
        } else if (this.getSuggestions().length > 0) {
          e.preventDefault();
          this.setShowSuggestions(true);
          if (suggestions[this.hoverIndex - 1]) {
            this.setHoverIndex(this.hoverIndex - 1);
          } else this.setHoverIndex(suggestions.length - 1);
        }
        break;
      case "ArrowDown":
        if (this.options.length > 0) {
          e.preventDefault();
          this.setShowSuggestions(true);
          if (this.options[this.hoverIndex + 1]) {
            this.setHoverIndex(this.hoverIndex + 1);
          } else this.setHoverIndex(0);
        } else if (this.getSuggestions().length > 0) {
          e.preventDefault();
          this.setShowSuggestions(true);
          if (suggestions[this.hoverIndex + 1]) {
            this.setHoverIndex(this.hoverIndex + 1);
          } else this.setHoverIndex(0);
        }
        break;
      case "Enter": {
        const currentOption = this.options[this.hoverIndex] ?? option;
        const currentSuggestion = suggestions[this.hoverIndex] ?? suggestion;

        if (currentOption) {
          this.selected_custom_option.emit({
            id: currentOption.id,
            value: currentOption.value,
          });
        } else if (currentSuggestion) {
          this.selected_suggestion.emit({
            suggestion: currentSuggestion,
          });
        }
        this.setHoverIndex(-1);
        break;
      }
    }
  }

  private onClick = (suggestion: AutosuggestOption) => () => {
    this.selected_suggestion.emit({ suggestion });
  };

  private onCustomClick = (opt: { value: string; id: string }) => {
    const inputElement = this.getInputElement();

    if (!inputElement) {
      const error = new Error("Input element not found");
      this.emitError(error);
      return;
    }

    inputElement.value = opt.value;
    this.selected_custom_option.emit(opt);
  };

  private onMouseOver = (suggestion: AutosuggestOption) => () => {
    const previousSuggestion = this.getSuggestions()[this.hoverIndex] ?? null;
    if (!previousSuggestion || previousSuggestion.words !== suggestion.words) {
      this.__hover.emit({ suggestion });
    }
  };

  private onMouseOut = () => {
    this.setHoverIndex(-1);
  };

  connectedCallback() {
    // Setup form and input
    const {
      el,
      name,
      return_coordinates,
      typeahead_delay,
      variant,
      api_key,
      base_url,
      api_version,
    } = this;
    const form = el.closest<HTMLFormElement>("form");
    const inputElement = el.querySelector<HTMLInputElement>(SELECTORS.input);

    if (!inputElement) {
      const error = new Error("Input element not found");
      this.emitError(error);
      return;
    }

    this.setInputElement(inputElement);

    if (!this.initial_value) {
      this.initial_value = inputElement.value || inputElement.defaultValue;
    }

    if (this.initial_value) {
      this.setValue(this.initial_value);
    }

    if (form) {
      if (return_coordinates) {
        if (!form.querySelector(`#${name}_lat`)) {
          const lat = window.document.createElement("input");
          lat.type = "hidden";
          lat.id = name + "_lat";
          lat.name = name + "_lat";
          lat.setAttribute("data-testid", "autosuggest-input-lat");
          this.setLatInput(lat);
          form.append(lat);
        }
        if (!form.querySelector(`#${name}_lng`)) {
          const lng = window.document.createElement("input");
          lng.type = "hidden";
          lng.id = name + "_lng";
          lng.name = name + "_lng";
          lng.setAttribute("data-testid", "autosuggest-input-lng");
          this.setLngInput(lng);
          form.append(lng);
        }
      }
      form.addEventListener(
        "reset",
        () => {
          this.value_changed.emit({ value: "" });
        },
        { capture: true, passive: true }
      );
    }

    // Configure service clients
    const componentHeaders = this.getComponentHeaders() as Pick<
      UtilisationSessionHeader,
      "X-Correlation-ID" | "X-W3W-AS-Component"
    >;
    const headers = {
      ...componentHeaders,
      ...((typeof this.headers === "string"
        ? JSON.parse(this.headers)
        : this.headers) as UtilisationSessionHeader),
    };
    const config = {
      apiVersion: api_version,
      headers,
      host: base_url,
    };
    const transport = fetchTransport();

    this.clients = {
      autosuggest: what3wordsClients.autosuggest(
        this.api_key,
        config,
        transport
      ),
      convertToCoordinates: what3wordsClients.convertToCoordinates(
        this.api_key,
        config,
        transport
      ),
    };

    utilisation
      .send({
        key: api_key,
        baseUrl: base_url,
        type: SessionType.Started,
        headers,
        data: {
          return_coordinates,
          typeahead_delay,
          variant,
          component_version: version,
        },
      })
      .catch(() => {
        // TODO: Emit utilisation send error
      });
  }

  disconnectedCallback() {
    clearTimeout(this.apiRequestTimeout);
    clearTimeout(this.errorTimeout);
  }

  async componentWillLoad() {
    const { initial_value, callback, name } = this;
    const inputElement = this.getInputElement();
    const callbackFn = window[callback];

    if (typeof callbackFn === "function") {
      callbackFn();
    }

    if (W3W_REGEX.test(initial_value)) {
      const { suggestions } = await this.getAutosuggestions(initial_value);
      return this.suggestions_changed.emit({ suggestions });
    }

    if (!inputElement) return;
    if (!inputElement.placeholder) {
      inputElement.placeholder = t("input_hint");
    }
    if (
      !inputElement.value ||
      (inputElement.value.length === 0 && initial_value)
    ) {
      inputElement.value = initial_value;
    }
    if (!inputElement.name) {
      inputElement.name = name;
    }
  }

  render() {
    const {
      input,
      variant,
      options,
      onClick,
      onCustomClick,
      onMouseOver,
      onMouseOut,
    } = this;
    const c = "what3words-autosuggest";
    const loading = this.getLoading();
    const selectedSuggestion = this.getSelectedSuggestion();
    const suggestions = this.getSuggestions();
    const error = this.getError();

    const state = [
      `${c}-state`,
      loading ? "loading" : "",
      selectedSuggestion ? "valid" : "",
    ].join(" ");

    const showSuggestions = this.getHasFocus() && this.getShowSuggestions();

    const visible = [
      `${c}-suggestions`,
      showSuggestions ? "visible" : "hidden",
    ].join(" ");

    return (
      <Host class={variant}>
        <div class={c + " " + variant}>
          <div class={`${c}-input-wrapper`} data-testid="input-wrapper">
            <slot />
            <Status class={state} offsetHeight={input?.offsetHeight ?? null} />
          </div>
          <Suggestions
            class={visible}
            value={this.getValue()}
            hoverIndex={this.getHoverIndex()}
            suggestions={suggestions}
            options={options}
            offsetWidth={input?.offsetWidth ?? null}
            onW3wSuggestionSelected={onClick.bind(this)}
            onCustomOptionSelected={onCustomClick.bind(this)}
            onMouseOver={onMouseOver.bind(this)}
            onMouseOut={onMouseOut.bind(this)}
          />
          <ErrorMessage
            error={error}
            offsetWidth={input?.offsetWidth ?? null}
          />
        </div>
      </Host>
    ) as JSX.Element;
  }
}
