/* eslint-disable @typescript-eslint/no-explicit-any */
import { Loader } from "@googlemaps/js-api-loader";
import {
  DEFAULTS,
  MAP_SCRIPT_ID,
  MARKER_SRC,
  MIN_GRID_ZOOM_LEVEL,
  RETRIES,
} from "@javascript-components/lib/constants";

import type {
  Bounds,
  Coordinates,
  GridSectionJsonResponse,
  LocationJsonResponse,
} from "@what3words/api";

import type { GoogleMapsLibraries } from "../domain";
import type { EventType, Place, ViewType } from "./abstract";
import { MapProvider } from "./abstract";

const DEFAULT_LIBS: GoogleMapsLibraries = ["places"];

export class GoogleMaps extends MapProvider {
  private loader: Loader | null = DEFAULTS.null;
  private grid: google.maps.Polyline[] = [];
  private autocomplete?: google.maps.places.AutocompleteService;
  private places?: google.maps.places.PlacesService;
  private map: google.maps.Map | null = DEFAULTS.null;
  private marker?: google.maps.Marker;
  private eventListeners: Record<string, google.maps.MapsEventListener> = {};
  private square?: google.maps.Rectangle;

  public init(
    map: HTMLElement,
    opts: {
      version: string;
      api_key: string;
      libraries: GoogleMapsLibraries;
      language: string;
      region: string;
      /**
       * The center value used on initial map load.
       * A required option for google maps SDK.
       * See https://developers.google.com/maps/documentation/javascript/overview#MapOptions
       */
      center: { lat: number; lng: number };
      /**
       * The zoom value used on initial map load.
       * A required option for google maps SDK.
       * See https://developers.google.com/maps/documentation/javascript/overview#MapOptions
       */
      zoom: number;
      tilt?: number;
      disable_default_ui?: boolean;
      zoom_control?: boolean;
      zoom_control_position?: google.maps.ControlPosition;
      map_type_id?: ViewType;
      map_type_control?: boolean;
      map_type_control_position?: google.maps.ControlPosition;
      scale_control?: boolean;
      street_view_control?: boolean;
      street_view_control_position?: google.maps.ControlPosition;
      rotate_control?: boolean;
      rotate_control_position?: google.maps.ControlPosition;
      fullscreen_control?: boolean;
      fullscreen_control_position?: google.maps.ControlPosition;
    },
    onInit?: () => void
  ): void {
    const { libraries = DEFAULT_LIBS } = opts;

    this.loader = new Loader({
      id: MAP_SCRIPT_ID,
      apiKey: opts.api_key,
      version: opts.version,
      libraries: libraries.includes("places")
        ? libraries
        : [...libraries, "places"],
      language: opts.language,
      region: opts.region,
      retries: RETRIES,
    });

    this.loader
      .load()
      .then((google) => {
        this.map = new google.maps.Map(map, {
          center: opts.center,
          tilt: opts.tilt,
          disableDefaultUI: opts.disable_default_ui,
          zoom: opts.zoom,
          zoomControl: opts.zoom_control,
          zoomControlOptions: {
            position: this.isMapControlPosition(opts.zoom_control_position)
              ? opts.zoom_control_position
              : undefined,
          },
          mapTypeId: opts.map_type_id,
          mapTypeControl: opts.map_type_control,
          mapTypeControlOptions: {
            position: this.isMapControlPosition(opts.map_type_control_position)
              ? opts.map_type_control_position
              : undefined,
          },
          scaleControl: opts.scale_control,
          streetViewControl: opts.street_view_control,
          streetViewControlOptions: {
            position: this.isMapControlPosition(
              opts.street_view_control_position
            )
              ? opts.street_view_control_position
              : undefined,
          },
          rotateControl: opts.rotate_control,
          rotateControlOptions: {
            position: this.isMapControlPosition(opts.rotate_control_position)
              ? opts.rotate_control_position
              : undefined,
          },
          fullscreenControl: opts.fullscreen_control,
          fullscreenControlOptions: {
            position: this.isMapControlPosition(
              opts.fullscreen_control_position
            )
              ? opts.fullscreen_control_position
              : undefined,
          },
        });
        this.autocomplete = new google.maps.places.AutocompleteService();
        this.places = new google.maps.places.PlacesService(this.map);
        if (onInit) onInit();
      })
      .catch((_error) => ({}));
  }

  public addEventListener(
    event: EventType,
    listener: (...params: any[]) => void,
    opts?: { once: boolean }
  ) {
    if (!this.map) return;
    this.eventListeners[event]?.remove();

    const isAttachedOnce = opts?.once ?? false;
    const callback =
      event === "click"
        ? (e: google.maps.MapMouseEvent) => listener(e?.latLng?.toJSON())
        : listener;
    let eventListener: google.maps.MapsEventListener;

    if (isAttachedOnce)
      eventListener = google.maps.event.addListenerOnce(
        this.map,
        this.toEvent(event),
        callback
      );
    else
      eventListener = google.maps.event.addListener(this.map, event, callback);

    this.eventListeners[event] = eventListener;
  }

  public removeEventListener(event: EventType) {
    this.eventListeners[event]?.remove();
  }

  public removeAllEventListeners() {
    Object.entries(this.eventListeners).forEach(([, listener]) =>
      listener.remove()
    );
  }

  public destroy(): void {
    this.loader?.deleteScript();
    this.removeAllEventListeners();
  }

  public plotGrid(
    grid: GridSectionJsonResponse,
    onClick?: (coordinates: Coordinates) => void
  ) {
    this.grid = grid.lines.map((line, index) => {
      const map_type_id = this.map?.getMapTypeId();
      const strokeColor = this.getGridStrokeColor(map_type_id);
      const strokeOpacity = this.getGridStrokeOpacity(map_type_id);
      const gridline = new google.maps.Polyline({
        path: [line.start, line.end],
        geodesic: false,
        strokeWeight: 1,
        strokeOpacity,
        strokeColor,
      });
      this.eventListeners[`grid-${index}`] = gridline.addListener(
        "click",
        async (e: google.maps.MapMouseEvent) => {
          const coordinates = e?.latLng?.toJSON();
          const zoom = this.zoom;
          this.panTo(coordinates);
          if (zoom && zoom < MIN_GRID_ZOOM_LEVEL) {
            this.zoom = this.selected_zoom;
          }
          if (onClick && coordinates) onClick(coordinates);
        }
      );
      gridline.setMap(this.map);
      return gridline;
    });
  }

  public clearGrid(): void {
    this.grid.forEach((polyline) => {
      if (!polyline) return;
      polyline.setVisible(false);
      polyline.setMap(null);
    });
    this.grid = [];
  }

  public plotSquare(square: LocationJsonResponse["square"]): void {
    if (this.square) this.square.setMap(null);
    this.square = this.createSquare(square);
    this.square.setMap(this.map);
  }

  public plotMarker(
    address: LocationJsonResponse,
    callback: (coordinates: Coordinates) => void,
    markerIcon: any = MARKER_SRC
  ): void {
    if (this.marker) {
      this.marker.setMap(null);
      this.eventListeners.drag?.remove();
    }
    this.marker = new google.maps.Marker({
      icon: markerIcon,
      map: this.map,
      optimized: true,
      position: address.coordinates,
      title: address.words,
      clickable: true,
      draggable: true,
    });
    this.eventListeners.drag = this.marker.addListener(
      "dragend",
      this.onChangePosition(callback).bind(this)
    );
  }

  public get center(): Coordinates | undefined {
    if (!this.map) return;
    return this.map.getCenter()?.toJSON();
  }

  public set center(coordinate: Coordinates) {
    if (!this.map) return;
    this.map.setCenter(coordinate);
  }

  public get zoom(): number | undefined {
    if (!this.map) return;
    return this.map.getZoom();
  }

  public set zoom(zoom: number) {
    if (!this.map) return;
    this.map.setZoom(zoom);
  }

  /**
   * Retrieves bounds from map instance if present and returns w3w boundingBox object; otherwise returns the set default.
   * @returns Bounds a w3w bounding box object
   */
  public get bounds(): Bounds {
    return this.convertToW3wBounds(this.mapBounds);
  }

  /**
   * Retrieves bounds from map instance if present; otherwise returns the set default.
   * See https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLngBoundsLiteral
   * @returns mapBounds a LatLngBoundsLiteral object
   */
  public get mapBounds(): google.maps.LatLngBoundsLiteral {
    if (!this.map) return DEFAULTS.bounds;
    const mapBounds = JSON.parse(
      JSON.stringify(this.map.getBounds() ?? DEFAULTS.bounds)
    );
    return mapBounds;
  }

  public set viewType(type: ViewType) {
    if (!this.map) return;
    this.map.setMapTypeId(type);
  }

  public set options(options: google.maps.MapOptions) {
    if (!this.map) return;
    this.map.setOptions(options);
  }

  public set mapTypeControlPosition(position: number) {
    if (!this.map || !this.isMapControlPosition(position)) return;
    this.map.setOptions({
      mapTypeControlOptions: {
        position,
      },
    });
  }

  public set zoomControlPosition(position: number) {
    if (!this.map || !this.isMapControlPosition(position)) return;
    this.map.setOptions({
      zoomControlOptions: {
        position,
      },
    });
  }

  public set fullscreenControlPosition(position: number) {
    if (!this.map || !this.isMapControlPosition(position)) return;
    this.map.setOptions({
      fullscreenControlOptions: {
        position,
      },
    });
  }

  public set streetViewControlPosition(position: number) {
    if (!this.map || !this.isMapControlPosition(position)) return;
    this.map.setOptions({
      streetViewControlOptions: {
        position,
      },
    });
  }

  public set rotateControlPosition(position: number) {
    if (!this.map || !this.isMapControlPosition(position)) return;
    this.map.setOptions({
      rotateControlOptions: {
        position,
      },
    });
  }

  public set mapTypeId(id: string) {
    if (!this.map) return;
    this.map.setMapTypeId(id);
  }

  public panTo(coordinate?: Coordinates): void {
    if (!this.map || !coordinate) return;
    this.map.panTo(coordinate);
  }

  public setMapControlPosition(control: Node, position: number): void {
    if (!this.map || !this.isMapControlPosition(position)) return;
    this.map.controls[position] = new google.maps.MVCArray([
      ...this.map.controls[position]!.getArray(),
      control,
    ]) as google.maps.MVCArray<HTMLElement>; // BUG: type coersion shouldn't be necessary
  }

  public getPlacesSuggestions(
    input: string,
    origin?: Coordinates,
    language?: string
  ): Promise<Place[]> {
    return new Promise((res, rej) => {
      const query = {
        input,
        language,
        origin: origin ?? undefined,
      };

      this.autocomplete?.getPlacePredictions(query, (places, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
          rej(status);
        }
        if (!places) return;
        res(
          places.map((place) => ({
            id: place.place_id,
            description: place.description,
            value: place.description,
            distance: { value: place.distance_meters!, units: "m" },
          }))
        );
      });
    });
  }

  public getCoordinatesFromPlace(id: string): Promise<Coordinates | null> {
    return new Promise((res, rej) => {
      this.places?.getDetails({ placeId: id }, (address, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
          rej(status);
        }
        if (!address) res(null);
        res(address!.geometry!.location?.toJSON() ?? null);
      });
    });
  }

  public addControl(control: Node, position: number) {
    if (!this.map || !this.isMapControlPosition(position)) return;
    this.map.controls[position] = new google.maps.MVCArray([
      ...this.map.controls[position]!.getArray(),
      control,
    ]) as google.maps.MVCArray<HTMLElement>; // BUG: type coersion shouldn't be necessary
  }

  protected createSquare(square: Bounds) {
    return new google.maps.Rectangle({
      bounds: new google.maps.LatLngBounds(square.southwest, square.northeast),
      strokeWeight: 1,
      fillColor: "#0A3049",
      strokeColor: "#0A3049",
      strokePosition: google.maps.StrokePosition.INSIDE,
    });
  }

  private getGridStrokeColor(
    map_type_id?: google.maps.MapTypeId | string
  ): string {
    switch (map_type_id) {
      case google.maps.MapTypeId.SATELLITE:
      case google.maps.MapTypeId.HYBRID:
        return "#FFFFFF";
      case google.maps.MapTypeId.ROADMAP:
      case google.maps.MapTypeId.TERRAIN:
      default:
        return "#0A3049";
    }
  }

  private getGridStrokeOpacity(
    map_type_id?: google.maps.MapTypeId | string
  ): number {
    switch (map_type_id) {
      case google.maps.MapTypeId.SATELLITE:
      case google.maps.MapTypeId.HYBRID:
        return 0.3;
      case google.maps.MapTypeId.ROADMAP:
      case google.maps.MapTypeId.TERRAIN:
      default:
        return 0.1;
    }
  }

  private isMapControlPosition(position?: number): boolean {
    if (!position) return false;
    return Object.values(google.maps.ControlPosition).includes(position);
  }

  private onChangePosition(callback?: (coordinates: Coordinates) => void) {
    return async (e: google.maps.MapMouseEvent) => {
      const coordinates = e.latLng?.toJSON();
      const zoom = this.zoom;
      if (zoom && zoom < MIN_GRID_ZOOM_LEVEL) {
        this.panTo(coordinates);
        this.zoom = this.selected_zoom;
      }
      if (callback && coordinates) callback(coordinates);
    };
  }

  private toEvent(event: EventType): string {
    switch (event) {
      case "loaded":
        return "tilesloaded";

      case "maptype_changed":
        return "maptypeid_changed";

      default:
        return event;
    }
  }

  /**
   * @param gmapsBounds a gmaps literal bounds object
   */
  private convertToW3wBounds({
    south,
    west,
    north,
    east,
  }: google.maps.LatLngBoundsLiteral): Bounds {
    return {
      southwest: { lat: south, lng: west },
      northeast: { lat: north, lng: east },
    };
  }

  /**
   * @param w3wBounds a w3w bounding box object
   */
  private convertToBounds({
    southwest,
    northeast,
  }: Bounds): google.maps.LatLngBoundsLiteral {
    const { lat: south, lng: west } = southwest;
    const { lat: north, lng: east } = northeast;

    return { south, west, north, east };
  }
}
