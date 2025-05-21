/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  Bounds,
  Coordinates,
  GridSectionJsonResponse,
  LocationJsonResponse,
} from "@what3words/api";

export type ViewType = "road" | "hybrid" | "satellite" | "terrain";
export type EventType =
  | "loaded"
  | "maptype_changed"
  | "zoom_changed"
  | "bounds_changed"
  | "click";
export type MapProviderName = "google";
export interface Place {
  value: string;
  id: string;
  description: string;
  distance: {
    value: number;
    units: string;
  };
}

export abstract class MapProvider {
  public selected_zoom!: number;

  public abstract get center(): Coordinates | undefined;
  public abstract set center(coordinate: Coordinates);
  public abstract get zoom(): number | undefined;
  public abstract set zoom(zoom: number);
  public abstract get bounds(): Bounds;
  public abstract get mapBounds(): {
    south: number;
    east: number;
    north: number;
    west: number;
  };
  public abstract get viewType(): ViewType;
  public abstract set viewType(type: ViewType);
  public abstract set options(options: any);
  public abstract set mapTypeControlPosition(position: number);
  public abstract set zoomControlPosition(position: number);
  public abstract set fullscreenControlPosition(position: number);
  public abstract set streetViewControlPosition(position: number);
  public abstract set rotateControlPosition(position: number);
  public abstract set mapTypeId(id: string);

  public abstract init(
    map: HTMLElement,
    opts: {
      version: string;
      api_key: string;
      libraries: string[];
      language: string;
      region: string;
      center?: { lat: number; lng: number };
      tilt?: number;
      disable_default_ui?: boolean;
      zoom?: number;
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
  ): void;
  public abstract addEventListener(
    event: EventType,
    listener: (...params: any[]) => void,
    opts?: { once: boolean }
  ): void;
  public abstract removeEventListener(event: EventType): void;
  public abstract removeAllEventListeners(): void;
  public abstract destroy(): void;
  public abstract plotGrid(
    grid: GridSectionJsonResponse,
    onClick?: (coordinates: Coordinates) => void
  ): void;
  public abstract clearGrid(): void;
  public abstract plotSquare(square: LocationJsonResponse["square"]): void;
  public abstract plotMarker(
    address: LocationJsonResponse,
    callback?: (coordinates: Coordinates) => void,
    markerIcon?: string
  ): void;
  public abstract panTo(coordinate: Coordinates): void;
  public abstract setMapControlPosition(control: Node, position: number): void;
  public abstract addControl(control: Node | null, position: number): void;
  public abstract getPlacesSuggestions(
    input: string,
    origin?: Coordinates,
    language?: string
  ): Promise<Place[]>;
  public abstract getCoordinatesFromPlace(
    id: string
  ): Promise<Coordinates | null>;

  protected abstract createSquare(square: Bounds): any;
}
