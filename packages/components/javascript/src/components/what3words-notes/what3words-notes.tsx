/* eslint-disable @typescript-eslint/no-explicit-any */
import type { UtilisationSessionHeader } from "@javascript-components/lib/utilisation";
import type { EventEmitter, JSX } from "@stencil/core";
import {
  DEFAULTS,
  W3W_REGEX,
  W3W_TEXTAREA_PROPERTIES,
  W3W_TEXTAREA_REGEX,
} from "@javascript-components/lib/constants";
import { sdk, what3wordsClients } from "@javascript-components/lib/sdk";
import { resolveLanguageCode, t } from "@javascript-components/lib/translation";
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
  ApiVersion,
  AutosuggestOptions,
  AutosuggestSuggestion,
  What3wordsService,
} from "@what3words/api";
import { fetchTransport } from "@what3words/api";

import type {
  AutosuggestOption,
  InputValuePayload,
  SuggestionPayload,
  SuggestionsPayload,
} from "../what3words-autosuggest/domain";
import type { EventDetail, InputSlot, W3wAddressFormat } from "./domain";
import { version } from "../../../package.json";
import { Status } from "./components/status";
import { Suggestions } from "./components/suggestions";
import { Tooltip } from "./components/tooltip";

const tag = "what3words-notes";

/**
 * @slot input - The textarea or input element to get suggestions from when typing
 * ```
 * <what3words-notes api-key="YOUR_API_KEY">
 *  <textarea slot="input"></textarea>
 *  <!-- OR -->
 *  <input slot="input" type="text" />
 * </what3words-notes>
 * ```
 * @slot label - The label element for the input slot element
 * ```
 * <what3words-notes api-key="YOUR_API_KEY">
 *  <label slot="label" for="delivery-notes">Delivery Notes/label>
 *  <textarea slot="input" name="delivery-notes"></textarea>
 * </what3words-notes>
 * ```
 * @slot tooltip - The tooltip content to display when the status icon is clicked
 * ```
 * <what3words-notes api-key="YOUR_API_KEY">
 *  <textarea slot="input"></textarea>
 *  <div slot="tooltip">
 *    <h1>Custom title</h1>
 *    <p>custom content</p>
 *  </div>
 * </what3words-notes>
 * ```
 */
@Component({
  tag: "what3words-notes",
  styleUrl: "what3words-notes.scss",
})
export class What3wordsNotes {
  @Element() private el!: HTMLWhat3wordsNotesElement;
  /**
   * The format to display the what3words address in
   * - `slashes` - e.g. `///filled.count.soap` (default)
   * - `url` - e.g. `https://w3w.co/filled.count.soap`
   * @default slashes
   */
  @Prop() public addressFormat: W3wAddressFormat = "slashes";
  /**
   * Show the what3words hints tooltip when clicking on the what3words status icon
   * @default true
   */
  @Prop() public showHintsTooltip = true;
  /**
   * The callback function to execute when the component is loaded
   */
  @Prop() public callback = "";
  /**
   * The what3words API key to use for the what3words API requests
   */
  @Prop() public apiKey = "";
  /**
   * The headers to include in the what3words API requests
   */
  @Prop() public headers = "{}";
  /**
   * The base URL for the what3words API requests
   */
  @Prop() public baseUrl: string =
    // TODO: _config is a protected property, new access method should be created to reflect this value reference

    sdk.api.clients.autosuggest["_config"].host ?? DEFAULTS.base_url;
  /**
   * The API version to use for the what3words API requests
   * @default "v3"
   */
  @Prop() public apiVersion: ApiVersion = "v3" as ApiVersion;
  /**
   * The delay in milliseconds to wait after the user has finished typing before making an autosuggest request
   * @default 300
   */
  @Prop() public typeaheadDelay = 300;
  /**
   * The language to return the results in
   * @example "en"
   */
  @Prop() public language = "";
  /**
   * The focus point to prioritize results around. If not provided, the user's current location is used.
   * @example "51.5412,-0.2477"
   */
  @Prop() public searchFocus?: `${number},${number}`;
  /**
   * The number of results to return
   * @default 3
   */
  @Prop() public nFocusResults = 3;
  /**
   * Clip the results to a specific country
   * @example "GB"
   */
  @Prop() public clipToCountry = "";
  /**
   * Clip the results to a specific bounding box
   * @example "51.521,-0.205,51.576,-0.105"
   */
  @Prop() public clipToBoundingBox = "";
  /**
   * Clip the results to a specific circle
   * @example "51.521,-0.205,1000"
   */
  @Prop() public clipToCircle = "";
  /**
   * Clip the results to a specific polygon
   * @example "51.521,-0.205,51.576,-0.105,51.576,-0.205"
   */
  @Prop() public clipToPolygon = "";
  /**
   * Emitted when the input value changes
   * @example { value: "filled.count.s" }
   */
  @Event() private valueChanged!: EventEmitter<InputValuePayload>;
  /**
   * Emitted when the input value is a valid what3words address
   * @example { value: "filled.count.soap" }
   */
  @Event() private valueValid!: EventEmitter<InputValuePayload>;
  /**
   * Emitted when the input value is not a valid what3words address
   * @example { value: "filled,count,s" }
   */
  @Event() private valueInvalid!: EventEmitter<InputValuePayload>;
  /**
   * Emitted when a suggestion is selected
   * @example { suggestion: { words: "filled.count.soap", [...] } }
   */
  @Event() private suggestionSelected!: EventEmitter<SuggestionPayload>;
  /**
   * Emitted when the suggestions change
   */
  @Event() private suggestionsChanged!: EventEmitter<SuggestionsPayload>;
  /**
   * Emitted when a suggestion is hovered over
   */
  @Event() private suggestionHover!: EventEmitter<SuggestionPayload>;
  /**
   * Emitted when a what3words API error occurs
   */
  @Event() private apiError!: EventEmitter<{ error: Error | null }>;

  // Internal component state
  @State() private value = "";
  @State() private suggestions: AutosuggestOption[] = [];
  @State() private selectedSuggestions: string[] = [];
  @State() private updatingSelectedSuggestions = false;
  @State() private apiRequestTimeout?: NodeJS.Timeout;
  @State() private loading = false;
  @State() private hoverIndex = -1;
  @State() private clients!: Pick<
    What3wordsService["clients"],
    "autosuggest" | "convertToCoordinates"
  >;
  @State() private tooltipOpen = false;

  /**
   * Watches for changes to the apiKey property
   * @param key The api key
   */
  @Watch("apiKey")
  public setApiKey(key: string) {
    Object.values(this.clients).forEach((client) => client.apiKey(key));
  }

  /**
   * Watches for changes to the baseUrl property
   * @param base_url The base url
   */
  @Watch("baseUrl")
  public setBaseUrl(host: string) {
    Object.values(this.clients).forEach((client) => client.config({ host }));
  }

  /**
   * Watches for changes to the apiVersion property
   * @param apiVersion The version
   */
  @Watch("apiVersion")
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

  /**
   * Watches for changes to the loading state
   */
  @Watch("loading")
  private async handleLoadingChange(loading: boolean) {
    if (loading && !this.suggestions.length) {
      await this.showSuggestions();
    }
  }

  /**
   * Watches for changes to the suggestions state
   */
  @Watch("suggestions")
  private async handleSuggestionsChange(
    newSuggestions: AutosuggestOption[],
    suggestions: AutosuggestOption[]
  ) {
    if (
      newSuggestions.length !== suggestions.length &&
      newSuggestions.length === 0
    ) {
      await this.hideSuggestions();
    }
  }

  private getComponentHeaders() {
    const meta = JSON.stringify({
      typeahead_delay: this.typeaheadDelay,
      component_session_id: window.what3words_session_id,
      slot: this.getInputSlotElement().tagName.toLowerCase(),
      origin: window.location.origin,
    });
    return {
      "X-W3W-AS-Component": `what3words-Notes-JS/${version} (${meta})`,
    };
  }

  private getRequestOptions(input: string): AutosuggestOptions {
    const options: AutosuggestOptions = {
      input,
      language: this.language,
    };

    // validates the language
    options.language = resolveLanguageCode(this.language);

    if (this.searchFocus) {
      const [lat, lng] = this.searchFocus.split(",");
      if (lat && lng) options.focus = parseCoordinates(lat, lng);
    }
    if (!isEmpty(this.nFocusResults.toString())) {
      options.nFocusResults = this.nFocusResults;
    }
    if (!isEmpty(this.clipToCountry)) {
      options.clipToCountry = this.clipToCountry.split(",");
    }
    if (!isEmpty(this.clipToBoundingBox)) {
      const [southLat, westLng, northLat, eastLng] =
        this.clipToBoundingBox.split(",");
      if (northLat && eastLng && southLat && westLng)
        options.clipToBoundingBox = {
          northeast: parseCoordinates(northLat, eastLng),
          southwest: parseCoordinates(southLat, westLng),
        };
    }
    if (!isEmpty(this.clipToCircle)) {
      const [lat, lng, radius] = this.clipToCircle.split(",");
      if (lat && lng && radius)
        options.clipToCircle = {
          center: parseCoordinates(lat, lng),
          radius: parseFloat(radius),
        };
    }
    if (!isEmpty(this.clipToPolygon)) {
      options.clipToPolygon = convertToCoordinates(this.clipToPolygon);
    }

    return options;
  }

  /**
   * @returns { HTMLTextAreaElement | HTMLInputElement }
   */
  private getInputSlotElement(): InputSlot {
    const inputSlot = this.el.querySelector<InputSlot>("[slot=input]");
    const isTextArea = inputSlot instanceof HTMLTextAreaElement;
    const isInput = inputSlot instanceof HTMLInputElement;

    if (!isTextArea && !isInput) {
      throw new Error(
        "[slot=input] must be an instance of HTMLTextAreaElement or HTMLInputElement"
      );
    }

    return inputSlot;
  }

  /**
   * Formats a what3words address based on the specified format.
   *
   * @param value - The what3words address to format.
   * @param format - The format to use for the address. Possible values are 'url' and 'slashes'.
   * @returns The formatted what3words address.
   */
  private formatW3wAddress(value: string, format: W3wAddressFormat): string {
    if (format === "url") {
      return `https://w3w.co/${value.replace("///", "")}`;
    }
    return value;
  }

  /**
   * Look for a what3words address at the current cursor position in the input element and replace it with the selected suggestion
   *
   * @param { string } value The value to set
   */
  private setInputValue(value: string) {
    const inputSlot = this.getInputSlotElement();
    const { w3w, start, end } = this.findW3wAtCursorPosition(inputSlot);
    if (w3w) {
      const formattedW3w = this.formatW3wAddress(value, this.addressFormat);
      const inputValue = inputSlot.value;
      const textBeforeW3w = inputValue.substring(0, start);
      const textAfterW3w = inputValue.substring(end, inputValue.length);
      const newVal = textBeforeW3w + formattedW3w + textAfterW3w;
      const newPos = (textBeforeW3w + formattedW3w).length;
      inputSlot.value = newVal;
      inputSlot.focus();
      inputSlot.selectionEnd = newPos;

      // remove from the suggestions list if text to replace exists
      const textToReplaceIndex = this.selectedSuggestions.indexOf(w3w);
      if (textToReplaceIndex !== -1)
        this.selectedSuggestions.splice(textToReplaceIndex, 1);

      const newSuggestions = [...this.selectedSuggestions, value];
      this.setSelectedSuggestions(newSuggestions, newSuggestions.length > 2);
    }
  }

  /**
   * Gets/sets the value state for the input element
   * @param { string } value The value to set
   */
  private setValue(value: string) {
    this.value = value;
  }

  /**
   * Get/set the autosuggestions state value
   * @param { AutosuggestOption[] } suggestions The suggestions to set
   */
  private setSuggestions(suggestions: AutosuggestOption[]) {
    this.suggestions = suggestions;
  }

  /**
   * Sets selected w3w addresses
   * @param suggestions new list of selected w3w address
   * @param delayedUpdate simulates loading effect
   * @returns
   */
  private setSelectedSuggestions(suggestions: string[], delayedUpdate = false) {
    if (!delayedUpdate) {
      this.selectedSuggestions = suggestions;
      return;
    }
    this.updatingSelectedSuggestions = true;
    setTimeout(() => {
      this.selectedSuggestions = suggestions;
      this.updatingSelectedSuggestions = false;
    }, 500);
  }

  /**
   * Sets the loading state value
   * @param { boolean } loading The state to set
   */
  private setLoading(loading: boolean) {
    this.loading = loading;
  }

  /**
   * Animation to show the suggestions list based on the the available space above the input
   */
  private async showSuggestions() {
    const suggestions = this.el.querySelector(`.${tag}-suggestions`);
    if (!suggestions) return;
    const suggestionsHeight = suggestions.getBoundingClientRect().height;
    const hostBoundingRectTop = this.el.getBoundingClientRect().top;
    const fromTransform =
      hostBoundingRectTop > suggestionsHeight
        ? "translateY(10px)"
        : "translateY(-10px)";
    const keyframes = [
      { zIndex: -1, opacity: 0, transform: fromTransform },
      { zIndex: 100, opacity: 1, transform: "translateY(0)" },
    ];
    const options = {
      duration: 150,
      easing: "ease-in-out",
      fill: "forwards",
    } as KeyframeAnimationOptions;
    return suggestions.animate(keyframes, options).finished;
  }

  /**
   * Animation to hide the suggestions list based on the the available space above the input
   */
  private async hideSuggestions() {
    const suggestions = this.el.querySelector(`.${tag}-suggestions`);
    if (!suggestions) return;
    const suggestionsHeight = suggestions.getBoundingClientRect().height;
    const hostBoundingRectTop = this.el.getBoundingClientRect().top;
    const toTransform =
      hostBoundingRectTop > suggestionsHeight
        ? "translateY(10px)"
        : "translateY(-10px)";
    const keyframes = [{ zIndex: -1, opacity: 0, transform: toTransform }];
    const options = {
      duration: 150,
      easing: "ease-in-out",
      fill: "forwards",
    } as KeyframeAnimationOptions;
    return suggestions.animate(keyframes, options).finished;
  }

  /**
   * Animation to show the tooltip based on the the available space above the input
   */
  private async openTooltip() {
    const tooltip = this.el.querySelector(`.${tag}-tooltip`);
    if (!tooltip) return;
    const tooltipHeight = tooltip.getBoundingClientRect().height;
    const hostBoundingRectTop = this.el.getBoundingClientRect().top;
    const fromTransform =
      hostBoundingRectTop > tooltipHeight
        ? "translateY(10px)"
        : "translateY(-10px)";
    const top = hostBoundingRectTop > tooltipHeight ? "unset" : "2rem";
    const bottom =
      hostBoundingRectTop > tooltipHeight ? "calc(100% + 0.5rem)" : "unset";

    await tooltip.animate(
      [
        {
          transform: fromTransform,
          opacity: 0,
          zIndex: -1,
          top,
          bottom,
        },
        {
          transform: "translateY(0)",
          opacity: 1,
          zIndex: 100,
          top,
          bottom,
        },
      ],
      {
        duration: 150,
        easing: "ease-in-out",
        fill: "forwards",
      }
    ).finished;

    this.tooltipOpen = true;
  }

  /**
   * Animation to hide the tooltip based on the the available space above the input
   */
  private async closeTooltip() {
    const tooltip = this.el.querySelector(`.${tag}-tooltip`);
    if (!tooltip) return;
    const tooltipHeight = tooltip.getBoundingClientRect().height;
    const hostBoundingRectTop = this.el.getBoundingClientRect().top;
    const toTransform =
      hostBoundingRectTop > tooltipHeight
        ? "translateY(10px)"
        : "translateY(-10px)";

    await tooltip.animate(
      [
        {
          zIndex: -1,
          opacity: 0,
          transform: toTransform,
        },
      ],
      {
        duration: 150,
        easing: "ease-in-out",
        fill: "forwards",
      }
    ).finished;

    this.tooltipOpen = false;
  }

  /**
   * Gets/sets the hover index value
   * @param { number } hoverIndex The hover index value to set
   */
  private setHoverIndex(hoverIndex: number) {
    this.hoverIndex = hoverIndex;
  }

  /**
   * Emits the could not retrieve co-ordinates error
   */
  private emitFatalError() {
    this.apiError.emit({
      error: new Error(t("error_message")),
    });
  }

  private clearApiError() {
    this.apiError.emit({ error: null });
  }

  /**
   * Asynchronously retrieves autosuggestion results for a given search string and sets the results against the
   * component state. This method is idempotent and has a timeout delay to throttle requests, waiting for the user to
   * stop typing.
   * @param value The search string to retrieve autosuggestions for.
   */
  private getAutosuggestions(value: string) {
    clearTimeout(this.apiRequestTimeout);
    const autosuggestClient = this.clients.autosuggest;
    const options = this.getRequestOptions(value);
    return autosuggestClient.run(options);
  }

  private isValid3wa(value = ""): boolean {
    return W3W_REGEX.test(value);
  }

  private extract3wa(value = ""): string {
    const [, words] = W3W_REGEX.exec(value) ?? ["", ""];
    return words;
  }

  /**
   * Ensures that the what3words found on the input slot
   * Matches against the selectedSuggestions state
   */
  private matchSelected3waFromInputSlot() {
    const inputSlot = this.getInputSlotElement();
    const w3wFromInput =
      inputSlot.value.trim().length === 0
        ? []
        : (inputSlot.value.match(W3W_TEXTAREA_REGEX) ?? []);
    const fromCurrentSuggestions = (suggestion: string, index: number) =>
      suggestion === this.selectedSuggestions[index] ||
      this.selectedSuggestions.includes(suggestion);
    const selectedSuggestionsHasChanged =
      w3wFromInput.filter(fromCurrentSuggestions).length !==
      this.selectedSuggestions.length;
    if (selectedSuggestionsHasChanged) {
      const newSelected3wa = w3wFromInput.filter(fromCurrentSuggestions);
      this.setSelectedSuggestions(newSelected3wa);
    }
  }

  @Listen("valueChanged", { capture: true, passive: true })
  private handleValueChanged({ detail: { value = "" } }: EventDetail<string>) {
    const valid = this.isValid3wa(value);
    this.matchSelected3waFromInputSlot();
    if (valid) {
      const words = this.extract3wa(value);
      this.setValue(words);
      this.valueValid.emit({
        value: DEFAULTS.prefix + words,
      });
    } else {
      if (this.apiRequestTimeout) clearTimeout(this.apiRequestTimeout);
      this.setValue(value);
      this.valueInvalid.emit({ value: value });
    }
  }

  @Listen("valueValid", { capture: true, passive: true })
  private handleValueValid({ detail: { value = "" } }: EventDetail<string>) {
    clearTimeout(this.apiRequestTimeout);
    this.clearApiError();
    this.setLoading(true);
    this.apiRequestTimeout = setTimeout(() => {
      this.getAutosuggestions(value)
        .then(({ suggestions }) => {
          this.suggestionsChanged.emit({ suggestions });
        })
        .catch(() => {
          this.setSuggestions([]);
          this.emitFatalError();
        })
        .finally(() => {
          this.setLoading(false);
        });
    }, this.typeaheadDelay);
  }

  @Listen("valueInvalid")
  private handleValueInvalid() {
    clearTimeout(this.apiRequestTimeout);
    this.setLoading(false);
    this.setSuggestions([]);
  }

  @Listen("suggestionsChanged", { capture: true, passive: true })
  private handleSuggestionsChanged({
    detail: { suggestions = [] },
  }: EventDetail<AutosuggestOption[]>) {
    this.setSuggestions(suggestions);
    this.setHoverIndex(-1);
  }

  @Listen("suggestionSelected", { capture: true, passive: true })
  private async handleSuggestionSelected({
    detail: { suggestion },
  }: EventDetail<AutosuggestSuggestion>) {
    if (!suggestion) return;

    await this.hideSuggestions();
    this.setInputValue(DEFAULTS.prefix + suggestion.words);
    this.setValue(suggestion.words);
    this.setSuggestions([]);
    this.setHoverIndex(-1);
    this.clearApiError();

    await this.clients.autosuggest
      .onSelected(suggestion)
      .catch((error: Error) => this.apiError.emit({ error }));
  }

  @Listen("suggestionHover", { capture: true, passive: true })
  private handleSuggestionHover({
    detail: { suggestion },
  }: EventDetail<AutosuggestSuggestion>) {
    if (!suggestion) return;

    const suggestionsHoverIndex = this.suggestions.findIndex(
      (s) => s.words === suggestion.words
    );

    if (suggestionsHoverIndex > -1) {
      this.setHoverIndex(suggestionsHoverIndex);
    }
  }

  @Listen("blur", { capture: true, passive: true })
  private async handleBlur() {
    await Promise.all([this.closeTooltip(), this.hideSuggestions()]);
    this.setSuggestions([]);
  }

  // Event listeners
  @Listen("input", { capture: true, passive: true })
  private handleInput(e: InputEvent) {
    const isNotLineBreak = !["insertLineBreak", "insertParagraph"].includes(
      e.inputType
    );
    const isTextArea = e.target instanceof HTMLTextAreaElement;
    const isInput = e.target instanceof HTMLInputElement;
    if (isNotLineBreak && (isTextArea || isInput)) {
      const { w3w } = this.findW3wAtCursorPosition(e.target);
      this.valueChanged.emit({
        value: w3w,
      });
    }
  }

  @Listen("keydown", { capture: true, passive: false })
  private handleKeyDown(e: KeyboardEvent) {
    const keys = [
      "Escape",
      "ArrowLeft",
      "ArrowRight",
      "ArrowDown",
      "ArrowUp",
      "Enter",
    ];

    if (!keys.includes(e.key)) return;

    const {
      suggestions,
      loading,
      value = "",
      hoverIndex,
      suggestionSelected,
    } = this;
    const suggestion = suggestions.find(
      (s) => s.words === value.replace(/$\/*/, "")
    );
    const currentSuggestion = suggestions[hoverIndex] ?? suggestion;

    switch (e.key) {
      case "Escape":
        this.getInputSlotElement().blur();
        this.setHoverIndex(-1);
        break;
      case "ArrowUp":
        if (suggestions.length > 0) {
          e.preventDefault();
          if (suggestions[hoverIndex - 1]) {
            this.setHoverIndex(hoverIndex - 1);
          } else this.setHoverIndex(suggestions.length - 1);
        }
        break;
      case "ArrowDown":
        if (suggestions.length > 0) {
          e.preventDefault();
          if (suggestions[hoverIndex + 1]) {
            this.setHoverIndex(hoverIndex + 1);
          } else this.setHoverIndex(0);
        }
        break;
      case "ArrowRight":
      case "ArrowLeft":
        // Disable arrow right and arrow left when suggestions are shown
        // Since the the calculation for the suggestions list style is dependent
        // on where the cursor position is located
        if (loading || suggestions.length > 0) {
          e.preventDefault();
        }
        break;
      case "Enter":
        // Prevent line breaks in textarea and form submission when selecting a suggestion
        if (suggestions.length > 0) {
          e.preventDefault();
        }
        if (currentSuggestion) {
          suggestionSelected.emit({
            suggestion: currentSuggestion,
          });
        }
        this.setHoverIndex(-1);
        break;
    }
  }

  @Listen("contextmenu", { target: "window", capture: true, passive: true })
  private handleContextMenu(e: MouseEvent) {
    // Dismiss suggestions if context menu is triggered
    if (e.target !== this.el.querySelector(`.${tag}-suggestions`)) {
      this.hideSuggestions()
        .then(() => this.setSuggestions([]))
        .catch(() => {
          // TODO: Emit error if action fails
        });
    }
  }

  @Listen("click", { target: "window", capture: true, passive: true })
  private handleWindowClick(e: MouseEvent) {
    if (
      !this.el.contains(e.target as Node) ||
      e.target === this.getInputSlotElement()
    ) {
      this.closeTooltip().catch(() => {
        // TODO: Emit error if action fails
      });
    }
    // Dismiss suggestions if the target is outside of the suggestions popup
    if (e.target !== this.el.querySelector(`.${tag}-suggestions`)) {
      this.hideSuggestions()
        .then(() => this.setSuggestions([]))
        .catch(() => {
          // TODO: Emit error if action fails
        });
    }
  }

  @Listen("scroll", { capture: true, passive: true })
  private async handleScroll() {
    if (!this.loading && this.suggestions.length > 0) {
      await Promise.all([this.closeTooltip(), this.hideSuggestions()]);
      this.setSuggestions([]);
    }
  }

  private getSuggestionsStyle(
    inputSlot: InputSlot | null,
    labelContainer: Element | null
  ): Record<string, string | undefined> {
    if (!inputSlot || !labelContainer) return {};

    const { top: inputRectTop } = inputSlot.getBoundingClientRect();
    const hasSpaceAboveInputForSuggestions = inputRectTop > 145;
    const labelHeight = labelContainer.getBoundingClientRect().height;
    const {
      left: cursorLeft,
      right: cursorRight,
      top: cursorTop,
      bottom: cursorBottom,
    } = this.getCursorPosition(inputSlot);
    const bottom = hasSpaceAboveInputForSuggestions
      ? `calc(100% - ${cursorTop}px - ${labelHeight}px + 4px)`
      : undefined;
    const top = hasSpaceAboveInputForSuggestions
      ? undefined
      : `calc(${cursorBottom + labelHeight}px + 4px)`;
    const left = cursorLeft ? `${cursorLeft}px` : undefined;
    const right = cursorRight ? `${cursorRight}px` : undefined;
    return {
      bottom,
      top,
      right,
      left,
    };
  }

  /**
   * Finds the what3words address at the current cursor position in the textarea element.
   */
  private findW3wAtCursorPosition(inputSlot: InputSlot) {
    const cursorPos = inputSlot.selectionStart ?? 0;
    const inputValue = inputSlot.value;
    const w3wFromInput = inputValue.match(W3W_TEXTAREA_REGEX);
    if (!w3wFromInput) return { w3w: "", start: cursorPos, end: cursorPos };
    const w3w =
      w3wFromInput.find((m) => {
        const start = cursorPos - m.length;
        const end = start + m.length;
        const value = inputValue.substring(start, end);
        return value === m;
      }) ?? "";
    const start = cursorPos - w3w.length;
    const end = start + w3w.length;
    return { start, end, w3w };
  }

  private onSuggestionSelected = (suggestion: AutosuggestOption) => () => {
    this.suggestionSelected.emit({ suggestion });
  };

  private onMouseOver = (suggestion: AutosuggestOption) => () => {
    const previousSuggestion = this.suggestions[this.hoverIndex] ?? null;
    if (!previousSuggestion || previousSuggestion.words !== suggestion.words) {
      this.suggestionHover.emit({ suggestion });
    }
  };

  private onMouseOut = () => {
    this.setHoverIndex(-1);
  };

  connectedCallback() {
    // Configure service clients
    const componentHeaders = this.getComponentHeaders() as Pick<
      UtilisationSessionHeader,
      "X-Correlation-ID" | "X-W3W-AS-Component"
    >;
    const headers = {
      ...componentHeaders,
      ...(JSON.parse(this.headers) as UtilisationSessionHeader),
    };
    const config = {
      apiVersion: this.apiVersion,
      headers,
      host: this.baseUrl,
    };
    const transport = fetchTransport();

    if (!this.apiKey) {
      throw new Error(
        "a What3words API key is required, you can get one at https://accounts.what3words.com/select-plan"
      );
    }

    this.clients = {
      autosuggest: what3wordsClients.autosuggest(
        this.apiKey,
        config,
        transport
      ),
      convertToCoordinates: what3wordsClients.convertToCoordinates(
        this.apiKey,
        config,
        transport
      ),
    };
  }

  disconnectedCallback() {
    clearTimeout(this.apiRequestTimeout);
  }

  async componentWillLoad() {
    const { value: initial_value, callback } = this;
    const callbackFn = (window as any)[callback] as () => void | undefined;

    if (typeof callbackFn === "function") {
      callbackFn();
    }

    if (W3W_REGEX.test(initial_value)) {
      const { suggestions } = await this.getAutosuggestions(initial_value);
      return this.suggestionsChanged.emit({ suggestions });
    }
  }

  /**
   * Calculates the cursor position by creating a mirror (div) element which copies all common properties from InputSlot.
   * The InputSlot's string content will be the div's textContent and an HTMLSpanElement will be appended at the end of the text.
   * The span element is what's used to determine where the cursor position is.
   * @param inputSlot
   * @returns
   */
  private getCursorPosition(inputSlot: InputSlot) {
    const inputSlotMirror = document.createElement("div");
    const inputSlotStyle = getComputedStyle(inputSlot);

    // Copy the input slot style to the mirror element
    // This provides accuracy of the measurement get from the mirror element
    W3W_TEXTAREA_PROPERTIES.forEach((prop: any) => {
      (inputSlotMirror.style as any)[prop] = inputSlotStyle[prop];
    });

    inputSlotMirror.style.position = "absolute";
    inputSlotMirror.style.whiteSpace = "pre-wrap";
    inputSlotMirror.style.wordBreak = "break-word";
    inputSlotMirror.style.visibility = "hidden";

    const position = inputSlot.selectionStart ?? 0;
    const normalizedText = inputSlot.value.normalize().substring(0, position);

    inputSlotMirror.textContent = normalizedText;

    document.body.appendChild(inputSlotMirror);

    const cursorSpan = document.createElement("span");
    inputSlotMirror.appendChild(cursorSpan);

    const { offsetTop, offsetLeft } = cursorSpan;

    document.body.removeChild(inputSlotMirror);

    const inputWidth = parseFloat(inputSlotStyle.width);
    const lineHeight = this.getLineHeight(inputSlot);

    const left = offsetLeft - inputSlot.scrollLeft;
    const right = inputWidth - offsetLeft - inputSlot.scrollLeft;

    const bottom = offsetTop + lineHeight - inputSlot.scrollTop;
    const top = bottom - lineHeight;
    const isRtl = inputSlotStyle.direction === "rtl";
    const result = {
      left: isRtl ? undefined : left,
      right: isRtl ? right : undefined,
      top,
      bottom,
    };
    return result;
  }

  private getLineHeight(element: HTMLElement): number {
    const elementStyle = getComputedStyle(element);
    const lineHeight = elementStyle.lineHeight;

    if (["normal", "initial"].includes(lineHeight)) {
      return parseFloat(elementStyle.fontSize) * 1.2;
    }

    if (lineHeight === "inherit") {
      const parent = element.parentElement;
      if (parent) {
        return this.getLineHeight(parent);
      }
    }

    return parseFloat(lineHeight);
  }

  render() {
    const { onSuggestionSelected, onMouseOver, onMouseOut } = this;
    const value = this.value;
    const isLoading = this.loading;
    const inputSlot = this.getInputSlotElement();
    const selected3waCount = this.selectedSuggestions.length;
    const isLoadingSelected3waCount = this.updatingSelectedSuggestions;
    const hasSelectedSuggestions = this.selectedSuggestions.length > 0;
    const labelContainer = this.el.querySelector<Element>(`.${tag}-label`);
    const suggestionsStyle = this.getSuggestionsStyle(
      inputSlot,
      labelContainer
    );

    return (
      <Host
        class={{
          [tag]: !!tag,
          loading: isLoading,
          valid: hasSelectedSuggestions,
        }}
      >
        <fieldset
          class={{ [`${tag}-input-wrapper`]: !!tag }}
          data-testid="input-wrapper"
        >
          <div class={{ [`${tag}-label`]: !!tag }}>
            <slot name="label" />
            <Status
              tag={tag}
              isLoadingSelected3waCount={isLoadingSelected3waCount}
              selected3waCount={selected3waCount}
              showHintsTooltip={this.showHintsTooltip}
              toggleTooltip={() =>
                this.tooltipOpen ? this.closeTooltip() : this.openTooltip()
              }
            />
          </div>
          <slot name="input" />
          <Tooltip tag={tag} onClose={() => this.closeTooltip()} />
        </fieldset>
        <Suggestions
          style={suggestionsStyle}
          tag={tag}
          value={value}
          hoverIndex={this.hoverIndex}
          loading={isLoading}
          suggestions={this.suggestions}
          onSuggestionSelected={onSuggestionSelected.bind(this)}
          onMouseOver={onMouseOver.bind(this)}
          onMouseOut={onMouseOut.bind(this)}
          onClose={() => this.hideSuggestions()}
        />
      </Host>
    ) as JSX.Element;
  }
}
