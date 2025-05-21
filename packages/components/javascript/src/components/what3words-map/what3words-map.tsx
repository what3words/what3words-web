import type { UtilisationSessionHeader } from "@javascript-components/lib/utilisation";
import type { EventEmitter, JSX } from "@stencil/core";
import {
  AUTOSUGGEST_SELECTOR,
  CURRENT_LOCATION_CONTROL_SELECTOR,
  DEFAULTS,
  MAP_SELECTOR,
  MAP_TYPE_CONTROL_SELECTOR,
  MARKER_SRC,
  MIN_GRID_ZOOM_LEVEL,
  SEARCH_CONTROL_SELECTOR,
  SELECTED_ZOOM_LEVEL,
  SELECTORS,
  TOP_LEFT,
  W3W_REGEX,
  ZOOM_CONTROL_SELECTOR,
} from "@javascript-components/lib/constants";
import { sdk, what3wordsClients } from "@javascript-components/lib/sdk";
import {
  Component,
  Element,
  Event,
  h,
  Host,
  Listen,
  Method,
  Prop,
  State,
  Watch,
} from "@stencil/core";

import type {
  Coordinates,
  LocationJsonResponse,
  What3wordsService,
} from "@what3words/api";
import { ApiVersion, fetchTransport } from "@what3words/api";

import type {
  GoogleMapsLibraries,
  MapProviderName,
  ThreeWordAddress,
} from "./domain";
import type { MapProvider, Place, ViewType } from "./providers/abstract";
import { version } from "../../../package.json";
import { GoogleMaps } from "./providers/google";

@Component({
  tag: "what3words-map",
  styleUrl: "what3words-map.scss",
})
export class What3wordsMap {
  @Element() public el!: HTMLWhat3wordsMapElement;
  @Prop() public api_key: string = DEFAULTS.emptyString;
  @Prop() public headers: string = DEFAULTS.headers;
  @Prop() public base_url: string =
    sdk.api.clients.gridSection["_config"].host ?? DEFAULTS.base_url;
  @Prop() public api_version: ApiVersion = ApiVersion.Version3;
  /**
   * The three word address to load after initial map render. If empty, map will remain at the provided/default lat, lng values
   */
  @Prop() public words: string = DEFAULTS.emptyString;
  @Prop() public map_provider: MapProviderName = "google";
  @Prop() public map_api_key: string = DEFAULTS.emptyString;
  @Prop() public version = "weekly";
  @Prop() public libraries: GoogleMapsLibraries = [];
  /**
   * Passed to the maps provider sdk. Also used as the default w3w language.
   * Cross-compatible language support is not guaranteed between the map provider and w3w sdks.
   * w3w language default behavior can be overridden by setting the what3words-autosuggest language prop to a supported language.
   * See https://developers.google.com/maps/faq#languagesupport
   * See https://developer.what3words.com/public-api/docs#available-languages
   */
  @Prop() public language = "en";
  @Prop() public region = "GB";
  /**
   * Latitude value used on initial map render. Defaults to What3Words HQ latitude.
   */
  @Prop({ mutable: true }) public lat = DEFAULTS.center.lat;
  /**
   * Longitude value used on initial map render. Defaults to What3Words HQ longitude.
   */
  @Prop({ mutable: true }) public lng = DEFAULTS.center.lng;
  @Prop() public tilt = 0;
  @Prop() public disable_default_ui?: boolean;
  @Prop() public zoom = 8;
  @Prop() public zoom_control?: boolean;
  @Prop() public zoom_control_position = 0;
  @Prop() public map_type_id?: ViewType;
  @Prop() public map_type_control?: boolean;
  @Prop() public map_type_control_position = 0;
  @Prop() public scale_control?: boolean;
  @Prop() public street_view_control?: boolean;
  @Prop() public street_view_control_position = 0;
  @Prop() public rotate_control?: boolean;
  @Prop() public rotate_control_position = 0;
  @Prop() public fullscreen_control?: boolean;
  @Prop() public fullscreen_control_position = 0;
  @Prop() public search_control_position: number = TOP_LEFT;
  @Prop() public current_location_control_position = 0;
  @Prop() public selected_zoom: number = SELECTED_ZOOM_LEVEL;
  @Prop() public current_location?: boolean;
  @Prop() public watch_location?: boolean;
  @Prop() public marker_icon: string = MARKER_SRC;
  /** Reset map level zoom to selected_zoom after panning to user-selected autosuggest suggestion */
  @Prop() public reset_zoom_on_select?: boolean;

  @Event() private selected_square!: EventEmitter<ThreeWordAddress>;
  @Event() private coordinates_changed!: EventEmitter<Coordinates>;
  @Event() private __load!: EventEmitter<void>;
  @Event() private __error!: EventEmitter<{ error: ErrorEvent }>;

  @State() private searchControlSlot: HTMLElement | null = DEFAULTS.null;
  @State() private currentLocationControlSlot: HTMLElement | null =
    DEFAULTS.null;
  @State() private zoomControlSlot: HTMLElement | null = DEFAULTS.null;
  @State() private mapTypeControlSlot: HTMLElement | null = DEFAULTS.null;
  @State() private mapLoaded = false;
  @State() private input: HTMLInputElement | null = DEFAULTS.null;
  @State() private autosuggest: HTMLWhat3wordsAutosuggestElement | null =
    DEFAULTS.null;
  @State() private placesSuggestions: Place[] = [];
  @State() private apiRequestTimeout: NodeJS.Timeout | null = DEFAULTS.null;
  @State() private watch_id: number | null = DEFAULTS.null;
  @State() private provider: MapProvider | null = DEFAULTS.null;
  @State() private current_location_coordinates: Coordinates | null =
    DEFAULTS.null;
  @State() private w3wLanguage: string = this.language;
  @State() private clients: Partial<What3wordsService["clients"]> = {};

  @Method()
  @Watch("api_key")
  async setApiKey(key: string): Promise<void> {
    Object.values(this.clients).forEach((client) => client.apiKey(key));
  }

  @Method()
  @Watch("base_url")
  async setBaseUrl(host: string): Promise<void> {
    Object.values(this.clients).forEach((client) => client.config({ host }));
  }

  @Method()
  @Watch("headers")
  async setHeaders(value: string): Promise<void> {
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

  @Method()
  @Watch("api_version")
  async setApiVersion(api_version: ApiVersion): Promise<void> {
    Object.values(this.clients).forEach((client) =>
      client.config({ apiVersion: api_version })
    );
  }

  @Method()
  @Watch("words")
  async setWords(words: string) {
    if (!W3W_REGEX.test(words) || !this.provider) return;

    this.clients.convertToCoordinates
      ?.run({ words })
      .then((response: LocationJsonResponse) => {
        if (!this.provider) return;

        const { square, coordinates } = response;
        this.provider.plotSquare(square);
        this.provider.plotMarker(
          response,
          (coordinates) => this.coordinates_changed.emit(coordinates),
          this.marker_icon
        );
        this.provider.panTo(coordinates);
        const { zoom } = this.provider;
        if (zoom && zoom < this.selected_zoom)
          this.provider.zoom = this.selected_zoom;
        this.setInputValue(words);
      })
      .catch((error) => {
        // TODO: Clean up error type checking
        if (Object.prototype.hasOwnProperty.call(error, "message")) {
          this.__error.emit(error as ErrorEvent);
          console.error((error as ErrorEvent).message);
        } else if (Object.prototype.hasOwnProperty.call(error, "details")) {
          // manual type coercion based off @what3words/api/dist/lib/transport/error.d.ts
          const transportError = error as Record<
            "details",
            Record<"message", string>
          >;
          this.__error.emit(new ErrorEvent(transportError.details.message));
          console.error(transportError.details.message);
        }
      });
  }

  @Method()
  async clearGrid(): Promise<void> {
    if (!this.provider) return;
    this.provider.clearGrid();
  }

  @Method()
  async getLat(): Promise<number | undefined> {
    if (!this.provider) return 0;
    return this.provider.center?.lat;
  }

  @Method()
  @Watch("lng")
  @Watch("lat")
  async setCoordinates(
    newCoordinateValue: number,
    _oldCoordinateValue: number,
    propName: string
  ) {
    if (!this.provider) return;
    const newCoordinates = {
      lat: this.lat,
      lng: this.lng,
      [propName]: newCoordinateValue,
    };
    const validatedCoordinates = this.validateCoordinates(newCoordinates);
    this.lng = validatedCoordinates.lng;
    this.lat = validatedCoordinates.lat;
    this.provider.center = validatedCoordinates;
  }

  @Method()
  async getLng(): Promise<number | undefined> {
    if (!this.provider) return 0;
    return this.provider.center?.lng;
  }

  @Method()
  @Watch("zoom")
  async setZoom(zoom: number): Promise<void> {
    if (!this.provider) return;
    this.provider.zoom = zoom;
  }

  @Method()
  async getZoom(): Promise<number | undefined> {
    if (!this.provider) return 0;
    return this.provider.zoom;
  }

  @Method()
  async getBounds(): Promise<google.maps.LatLngBoundsLiteral> {
    if (!this.provider) return DEFAULTS.bounds;
    return this.provider.mapBounds;
  }

  @Method()
  async panTo(coordinates: Coordinates): Promise<void> {
    if (!this.provider) return;
    this.provider.panTo(coordinates);
  }

  @Method()
  @Watch("map_type_id")
  async setMapTypeId(map_type_id: ViewType): Promise<void> {
    if (!this.provider) return;
    this.provider.mapTypeId = map_type_id;
  }

  private setMapControlPosition(control: Node, position: number) {
    if (!this.provider) return;
    this.provider.setMapControlPosition(control, position);
  }

  @Watch("search_control_position")
  private setSearchControlPosition(position: number) {
    this.searchControlSlot = this.el.querySelector<HTMLElement>(
      SEARCH_CONTROL_SELECTOR
    );
    if (this.searchControlSlot) {
      this.setMapControlPosition(this.searchControlSlot, position);
    }
  }

  @Watch("current_location_control_position")
  private setCurrentLocationControlPosition(position: number) {
    this.currentLocationControlSlot = this.el.querySelector<HTMLElement>(
      CURRENT_LOCATION_CONTROL_SELECTOR
    );
    if (this.currentLocationControlSlot) {
      this.setMapControlPosition(this.currentLocationControlSlot, position);
    }
  }

  @Watch("map_type_control_position")
  private setMapTypeControlPosition(position: number) {
    if (!this.provider) return;
    this.provider.mapTypeControlPosition = position;
    this.mapTypeControlSlot = this.el.querySelector<HTMLElement>(
      MAP_TYPE_CONTROL_SELECTOR
    );
    if (this.mapTypeControlSlot) {
      this.setMapControlPosition(this.mapTypeControlSlot, position);
    }
  }

  @Watch("zoom_control_position")
  private setZoomControlPosition(position: number) {
    if (!this.provider) return;
    this.provider.zoomControlPosition = position;
    this.zoomControlSlot = this.el.querySelector<HTMLElement>(
      ZOOM_CONTROL_SELECTOR
    );
    if (this.zoomControlSlot) {
      this.setMapControlPosition(this.zoomControlSlot, position);
    }
  }

  @Watch("fullscreen_control_position")
  private setFullscreenControlPosition(position: number) {
    if (!this.provider) return;
    this.provider.fullscreenControlPosition = position;
  }

  @Watch("street_view_control_position")
  private setStreetViewControlPosition(position: number) {
    if (!this.provider) return;
    this.provider.streetViewControlPosition = position;
  }

  @Watch("rotate_control_position")
  private setRotateControlPosition(position: number) {
    if (!this.provider) return;
    this.provider.rotateControlPosition = position;
  }

  @Watch("placesSuggestions")
  private handlePlacesSuggestions(
    suggestions: {
      id: string;
      value: string;
      description: string;
      distance: { value: number; units: string };
    }[]
  ) {
    if (this.autosuggest) this.autosuggest.options = suggestions;
  }

  private validateCoordinates(coordinates: Coordinates): Coordinates {
    // NOTE: the Google Maps SDK will clamp lat/lng values
    // See https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLng
    if (
      isNaN(coordinates.lat) ||
      isNaN(coordinates.lng) ||
      coordinates.lng === 0 ||
      coordinates.lat === 0
    ) {
      return {
        ...coordinates,
        lat: DEFAULTS.center.lat,
        lng: DEFAULTS.center.lng,
      };
    }
    return coordinates;
  }

  @Listen("__load")
  private async onLoad() {
    const { words } = this;
    const isBrowser = typeof window !== "undefined";
    const searchControl = this.el.querySelector(SEARCH_CONTROL_SELECTOR);

    if (isBrowser && this.watch_location) {
      await this.watchPosition();
    } else if (isBrowser && this.current_location) {
      this.getCurrentPosition();
    }
    if (words) {
      await this.setWords(words);
    }
    if (searchControl && this.provider) {
      this.provider.addControl(searchControl, this.search_control_position);
    }
  }

  @Listen("coordinates_changed", { capture: true, passive: true })
  private async onSelectedCoordinates({
    detail: { lat, lng },
  }: {
    detail: { lat: number; lng: number };
  }) {
    return this.clients.convertTo3wa
      ?.run({
        coordinates: { lat, lng },
        language: this.w3wLanguage,
      })
      .then((response: LocationJsonResponse) => {
        if (!this.provider) return;

        const { square, words } = response;

        this.setInputValue(words);

        // revert w3w language to map language (default) to maintain user language setting
        // e.g. sets to response.language during input change (`onSelectedSuggestion`)
        if (
          ![this.autosuggest?.language, this.language].includes(
            this.w3wLanguage
          )
        ) {
          this.w3wLanguage = this.autosuggest?.language ?? this.language;
        }

        this.provider.plotSquare(square);
        this.provider.plotMarker(
          response,
          (coordinates) => this.coordinates_changed.emit(coordinates),
          this.marker_icon
        );
        this.selected_square.emit(response);
      })
      .catch((error) => {
        // TODO: Clean up error type checking
        if (Object.prototype.hasOwnProperty.call(error, "message")) {
          this.__error.emit(error as ErrorEvent);
          console.error((error as ErrorEvent).message);
        } else if (Object.prototype.hasOwnProperty.call(error, "details")) {
          // manual type coercion based off @what3words/api/dist/lib/transport/error.d.ts
          const transportError = error as Record<
            "details",
            Record<"message", string>
          >;
          this.__error.emit(new ErrorEvent(transportError.details.message));
          console.error(transportError.details.message);
        }
      });
  }

  private initProvider(opts = {}) {
    if (!this.provider) return;
    const _opts = {
      version: this.version,
      api_key: this.map_api_key,
      libraries: this.libraries,
      language: this.language,
      region: this.region,
      center: { lat: this.lat, lng: this.lng },
      tilt: this.tilt,
      disable_default_ui: this.disable_default_ui,
      zoom: this.zoom,
      zoom_control: this.zoom_control,
      zoom_control_position: this.zoom_control_position,
      map_type_id: this.map_type_id,
      map_type_control: this.map_type_control,
      map_type_control_position: this.map_type_control_position,
      scale_control: this.scale_control,
      street_view_control: this.street_view_control,
      street_view_control_position: this.street_view_control_position,
      rotate_control: this.rotate_control,
      rotate_control_position: this.rotate_control_position,
      fullscreen_control: this.fullscreen_control,
      fullscreen_control_position: this.fullscreen_control_position,
      ...opts,
    };
    const mapDiv = this.el.querySelector(MAP_SELECTOR);

    if (!mapDiv) {
      // TODO: Add error logging
      return;
    }

    this.provider.init(mapDiv as HTMLElement, _opts);
  }

  @Watch("version")
  private watchMapVersion(version: string) {
    this.initProvider({ version });
  }

  @Watch("map_api_key")
  private watchMapApiKey(api_key: string) {
    this.initProvider({ api_key });
  }

  @Watch("libraries")
  private watchMapLibraries(libraries: string[]) {
    this.initProvider({ libraries });
  }

  @Watch("language")
  private watchMapLanguage(language: string) {
    this.initProvider({ language });
  }

  @Watch("region")
  private watchMapRegion(region: string) {
    this.initProvider({ region });
  }

  private setMapLoaded(loaded: boolean) {
    this.mapLoaded = loaded;
  }

  private async onCurrentPositionSuccess(position: GeolocationPosition) {
    const {
      coords: { latitude: lat, longitude: lng },
    } = position;
    if (!this.provider) return;

    const center = this.provider.center;
    const hasLocationChanged = center?.lat !== lat || center.lng !== lng;
    if (hasLocationChanged) {
      this.provider.panTo({ lat, lng });
      this.provider.zoom = this.selected_zoom;
      this.coordinates_changed.emit({ lat, lng });
      this.current_location_coordinates = { lat, lng };
    }
  }

  private onCurrentPositionFailure(error: GeolocationPositionError) {
    this.__error.emit(new ErrorEvent(error.message));
  }

  private async watchPosition() {
    this.watch_id = window.navigator.geolocation.watchPosition(
      (position) => {
        this.onCurrentPositionSuccess(position).catch((_error) => {
          // TODO: Add error logging
        });
      },
      (error) => {
        this.onCurrentPositionFailure(error);
      }
    );
  }

  private clearWatchPosition() {
    if (this.watch_id) {
      window.navigator.geolocation.clearWatch(this.watch_id);
    }
  }

  private getCurrentPosition() {
    window.navigator.geolocation.getCurrentPosition(
      (position) => {
        this.onCurrentPositionSuccess(position).catch((_error) => {
          // TODO: Add error logging
        });
      },
      (error) => {
        this.onCurrentPositionFailure(error);
      }
    );
  }

  private addMapEventListeners() {
    if (!this.provider) return;

    this.provider.addEventListener("maptype_changed", this.plotGrid.bind(this));
    this.provider.addEventListener("zoom_changed", this.plotGrid.bind(this));
    this.provider.addEventListener("bounds_changed", this.plotGrid.bind(this));
    this.provider.addEventListener("click", this.onChangePosition.bind(this));
  }

  private setupAutosuggest() {
    if (!this.autosuggest) return;

    // Set w3wLanguage to autosuggest language or default both to map language
    if (this.autosuggest.hasAttribute("language")) {
      this.w3wLanguage =
        this.autosuggest.getAttribute("language") ?? this.w3wLanguage; // coalescing operator used to coerce string type
    } else {
      this.w3wLanguage = this.language;
      this.autosuggest.setAttribute("language", this.language);
    }

    // Setup autosuggest api_key if not set
    if (!this.autosuggest.hasAttribute("api_key")) {
      this.autosuggest.setAttribute("api_key", this.api_key);
    }

    this.autosuggest.strict = false;
  }

  private addAutosuggestEventListeners() {
    if (!this.autosuggest) return;

    this.autosuggest.addEventListener(
      "__focus",
      this.onControlFocus.bind(this)
    );
    this.autosuggest.addEventListener(
      "value_valid",
      this.onValueValid.bind(this)
    );
    this.autosuggest.addEventListener(
      "value_invalid",
      this.onValueInvalid.bind(this)
    );
    this.autosuggest.addEventListener(
      "selected_suggestion",
      this.onSelectedSuggestion.bind(this)
    );
    this.autosuggest.addEventListener(
      "selected_custom_option",
      this.onCustomSelect.bind(this)
    );
  }

  private removeAutosuggestEventListeners() {
    if (!this.autosuggest) return;

    this.autosuggest.removeEventListener(
      "__focus",
      this.onControlFocus.bind(this)
    );
    this.autosuggest.removeEventListener(
      "value_valid",
      this.onValueValid.bind(this)
    );
    this.autosuggest.removeEventListener(
      "value_invalid",
      this.onValueInvalid.bind(this)
    );
    this.autosuggest.removeEventListener(
      "selected_suggestion",
      this.onSelectedSuggestion.bind(this)
    );
    this.autosuggest.removeEventListener(
      "selected_custom_option",
      this.onCustomSelect.bind(this)
    );
  }

  private removeMapEventListeners() {
    if (!this.provider) return;
    this.provider.removeAllEventListeners();
  }

  private addCurrentLocationEventListeners() {
    if (!this.currentLocationControlSlot) return;
    this.currentLocationControlSlot.addEventListener("click", () => {
      this.getCurrentPosition();
    });
  }

  private removeCurrentLocationEventListeners() {
    this.currentLocationControlSlot = this.el.querySelector<HTMLElement>(
      CURRENT_LOCATION_CONTROL_SELECTOR
    );
    if (!this.currentLocationControlSlot) return;
    this.currentLocationControlSlot.removeEventListener("click", () => {
      this.getCurrentPosition();
    });
  }

  private plotGrid() {
    if (!this.provider) return;

    const zoom = this.provider.zoom;

    const boundingBox = this.provider.bounds;
    const gridSectionOpt = {
      boundingBox,
    };

    if (this.apiRequestTimeout) clearTimeout(this.apiRequestTimeout);

    if (zoom && zoom < MIN_GRID_ZOOM_LEVEL) {
      this.clearGrid().catch(() => {
        // TODO: Add error logging
      });
    }

    this.apiRequestTimeout = setTimeout(() => {
      this.clients.gridSection
        ?.run(gridSectionOpt)
        .then((grid) => {
          if (!this.provider) return;
          this.provider.clearGrid();
          this.provider.plotGrid(grid, (coordinates) => {
            this.coordinates_changed.emit(coordinates);
          });
        })
        .catch((_error) => {
          // TODO: Add error logging
        });
    }, 100);
  }

  private onChangePosition(coordinates: Coordinates) {
    if (!this.provider) return;

    const zoom = this.provider.zoom;
    if (zoom && zoom < MIN_GRID_ZOOM_LEVEL) {
      this.provider.zoom = this.selected_zoom;
    }
    this.provider.panTo(coordinates);
    this.coordinates_changed.emit(coordinates);
  }

  private onSelectedSuggestion(
    event: CustomEvent<Record<"suggestion", Record<"words", string>>>
  ) {
    const {
      detail: {
        suggestion: { words },
      },
    } = event;
    // convert coordinates to 3wa
    this.clients.convertToCoordinates
      ?.run({
        words,
      })
      .then(async (response: LocationJsonResponse) => {
        // pan to the selected coordinates and zoom to selected zoom if changed
        await this.panTo(response.coordinates);
        const zoom = await this.getZoom();
        if (this.reset_zoom_on_select && zoom !== this.selected_zoom) {
          // check and reset zoom level to default (selected_zoom)
          // NOTE: larger zoom value = higher resolution / zoom in
          await this.setZoom(this.selected_zoom);
        }
        // store detected language if changed
        if (response.language !== this.w3wLanguage) {
          this.w3wLanguage = response.language;
        }
        this.coordinates_changed.emit(response.coordinates);
      })
      .catch((error) => {
        // TODO: Clean up error type checking
        if (Object.prototype.hasOwnProperty.call(error, "message")) {
          this.__error.emit(error as ErrorEvent);
          console.error((error as ErrorEvent).message);
        } else if (Object.prototype.hasOwnProperty.call(error, "details")) {
          // manual type coercion based off @what3words/api/dist/lib/transport/error.d.ts
          const transportError = error as Record<
            "details",
            Record<"message", string>
          >;
          this.__error.emit(new ErrorEvent(transportError.details.message));
          console.error(transportError.details.message);
        }
      });
  }

  private onCustomSelect(event: CustomEvent<Record<"id", string>>) {
    if (!this.provider) return;

    const { id }: { id: string } = event.detail;

    this.provider
      .getCoordinatesFromPlace(id)
      .then((coordinates) => {
        if (!coordinates) return;
        if (!this.provider) return;

        const zoom = this.provider.zoom;
        if (zoom !== this.selected_zoom) this.zoom = this.selected_zoom;
        this.provider.panTo(coordinates);
        this.coordinates_changed.emit(coordinates);
      })
      .catch((error: ErrorEvent) => {
        this.__error.emit(
          new ErrorEvent("ServiceError", {
            message: DEFAULTS.serviceErrorMessage,
            error,
          })
        );
        return;
      });
  }

  private onControlFocus() {
    if (this.input && /^(\/\/\/)?$/i.test(this.input.value)) {
      this.input.value = "";
    }
  }

  private onValueValid() {
    if (this.apiRequestTimeout) clearTimeout(this.apiRequestTimeout);
    this.placesSuggestions = [];
  }

  private onValueInvalid(e: CustomEvent<Record<"value", string>>) {
    const {
      detail: { value },
    }: {
      detail: { value: string };
    } = e;
    if (this.apiRequestTimeout) clearTimeout(this.apiRequestTimeout);
    if (value.length > 3) {
      this.apiRequestTimeout = setTimeout(() => {
        if (!this.provider) return;

        this.provider
          .getPlacesSuggestions(
            value,
            this.current_location_coordinates ?? undefined,
            this.language
          )
          .then((placesSuggestions) => {
            this.placesSuggestions = placesSuggestions;
          })
          .catch((error: Error) => {
            this.__error.emit(
              new ErrorEvent("ServiceError", {
                error,
                message: DEFAULTS.serviceErrorMessage,
              })
            );
          });
      }, this.autosuggest?.typeahead_delay);
    }
  }

  private setInputValue(words: string) {
    if (this.input) {
      this.input.value = "///" + words;
    }
  }

  private createProvider(): MapProvider {
    const { map_provider } = this;

    switch (map_provider) {
      case "google":
      default:
        return new GoogleMaps();
    }
  }

  private onProviderInit() {
    if (!this.provider) return;

    const { el } = this;
    this.searchControlSlot = el.querySelector<HTMLElement>(
      SEARCH_CONTROL_SELECTOR
    );
    this.currentLocationControlSlot = el.querySelector<HTMLElement>(
      CURRENT_LOCATION_CONTROL_SELECTOR
    );
    this.mapTypeControlSlot = el.querySelector<HTMLElement>(
      MAP_TYPE_CONTROL_SELECTOR
    );
    this.zoomControlSlot = el.querySelector<HTMLElement>(ZOOM_CONTROL_SELECTOR);
    this.autosuggest = this.searchControlSlot
      ? this.searchControlSlot.querySelector(AUTOSUGGEST_SELECTOR)
      : null;
    this.input = this.autosuggest
      ? this.autosuggest.querySelector<HTMLInputElement>(SELECTORS.input)
      : null;

    this.setMapLoaded(true);
    this.addMapEventListeners();
    this.addCurrentLocationEventListeners();
    this.provider.addControl(
      this.searchControlSlot,
      this.search_control_position
    );
    this.provider.addControl(
      this.currentLocationControlSlot,
      this.current_location_control_position
    );
    this.provider.addControl(
      this.mapTypeControlSlot,
      this.map_type_control_position
    );
    this.provider.addControl(this.zoomControlSlot, this.zoom_control_position);
    this.setupAutosuggest();
    this.addAutosuggestEventListeners();
    this.provider.addEventListener("loaded", this.__load.emit.bind(this), {
      once: true,
    });
  }

  private getComponentHeaders() {
    const {
      current_location,
      disable_default_ui,
      map_type_control,
      map_type_id,
      street_view_control,
      watch_location,
    } = this;
    const component_session_id = (window as Window).what3words_session_id;
    const meta = JSON.stringify({
      current_location,
      component_session_id,
      disable_default_ui,
      map_type_control,
      map_type_id,
      origin: window.location.origin,
      street_view_control,
      watch_location,
    });
    return {
      "X-W3W-AS-Component": `what3words-Map-JS/${version} (${meta})`,
    };
  }

  connectedCallback() {
    const { el, lat, lng } = this;
    // Prop validations
    const coordinates = this.validateCoordinates({ lat, lng });
    this.lat = coordinates.lat;
    this.lng = coordinates.lng;

    // Initialise provider
    const mapDiv = el.querySelector(MAP_SELECTOR);
    this.searchControlSlot = el.querySelector<HTMLElement>(
      SEARCH_CONTROL_SELECTOR
    );
    this.provider = this.createProvider();

    if (this.mapLoaded) this.provider.destroy(); // Do not re-initialise if map already loaded, just re-attach listeners, controls etc.

    if (!mapDiv) return;

    this.provider.init(
      mapDiv as HTMLElement,
      {
        version: this.version,
        api_key: this.map_api_key,
        libraries: this.libraries,
        language: this.language,
        region: this.region,
        center: { lat: this.lat, lng: this.lng },
        tilt: this.tilt,
        disable_default_ui: this.disable_default_ui,
        zoom: this.zoom,
        zoom_control: this.zoom_control,
        zoom_control_position: this.zoom_control_position,
        map_type_id: this.map_type_id,
        map_type_control: this.map_type_control,
        map_type_control_position: this.map_type_control_position,
        scale_control: this.scale_control,
        street_view_control: this.street_view_control,
        street_view_control_position: this.street_view_control_position,
        rotate_control: this.rotate_control,
        rotate_control_position: this.rotate_control_position,
        fullscreen_control: this.fullscreen_control,
        fullscreen_control_position: this.fullscreen_control_position,
      },
      this.onProviderInit.bind(this)
    );

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
      apiVersion: this.api_version,
      headers,
      host: this.base_url,
    };
    const transport = fetchTransport();

    this.clients = {
      convertToCoordinates: what3wordsClients.convertToCoordinates(
        this.api_key,
        config,
        transport
      ),
      convertTo3wa: what3wordsClients.convertTo3wa(
        this.api_key,
        config,
        transport
      ),
      gridSection: what3wordsClients.gridSection(
        this.api_key,
        config,
        transport
      ),
    };
  }

  disconnectedCallback() {
    this.removeAutosuggestEventListeners();
    this.removeMapEventListeners();
    this.removeCurrentLocationEventListeners();
    this.clearWatchPosition();
    this.provider?.destroy();
  }

  render() {
    const controlsWrapperStyle = {
      visibility: this.mapLoaded ? "visible" : "hidden",
    };
    const controlsWrapperAttributes = {
      "aria-hidden": this.mapLoaded ? "false" : "true",
      style: controlsWrapperStyle,
    };

    return (
      <Host>
        <slot name="map"></slot>
        <div
          id="controls-wrapper"
          data-testid="controls-wrapper"
          {...controlsWrapperAttributes}
        >
          <slot name="search-control"></slot>
          <slot name="map-type-control"></slot>
          <slot name="zoom-control"></slot>
          <slot name="current-location-control"></slot>
        </div>
      </Host>
    ) as JSX.Element;
  }
}
