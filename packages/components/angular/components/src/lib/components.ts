/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, NgZone } from '@angular/core';

import { ProxyCmp, proxyOutputs } from './angular-component-lib/utils';

import { Components } from '@what3words/javascript-components';


@ProxyCmp({
  inputs: ['iconColor', 'link', 'showTooltip', 'size', 'target', 'textColor', 'tooltip', 'tooltipLocation', 'words']
})
@Component({
  selector: 'what3words-address',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['iconColor', 'link', 'showTooltip', 'size', 'target', 'textColor', 'tooltip', 'tooltipLocation', 'words'],
})
export class What3wordsAddress {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface What3wordsAddress extends Components.What3wordsAddress {}


@ProxyCmp({
  inputs: ['api_key', 'api_version', 'autosuggest_focus', 'base_url', 'callback', 'clip_to_bounding_box', 'clip_to_circle', 'clip_to_country', 'clip_to_polygon', 'headers', 'initial_value', 'invalid_address_error_message', 'language', 'n_focus_results', 'name', 'options', 'return_coordinates', 'strict', 'typeahead_delay', 'variant']
})
@Component({
  selector: 'what3words-autosuggest',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['api_key', 'api_version', 'autosuggest_focus', 'base_url', 'callback', 'clip_to_bounding_box', 'clip_to_circle', 'clip_to_country', 'clip_to_polygon', 'headers', 'initial_value', 'invalid_address_error_message', 'language', 'n_focus_results', 'name', 'options', 'return_coordinates', 'strict', 'typeahead_delay', 'variant'],
})
export class What3wordsAutosuggest {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['value_changed', 'value_valid', 'value_invalid', 'selected_suggestion', 'suggestions_changed', 'suggestions_not_found', 'coordinates_changed', 'selected_custom_option', 'deselected_suggestion', '__hover', '__focus', '__blur', '__error']);
  }
}


import type { InputValuePayload as IWhat3wordsAutosuggestInputValuePayload } from '@what3words/javascript-components';
import type { SuggestionPayload as IWhat3wordsAutosuggestSuggestionPayload } from '@what3words/javascript-components';
import type { SuggestionsPayload as IWhat3wordsAutosuggestSuggestionsPayload } from '@what3words/javascript-components';
import type { CoordinatesPayload as IWhat3wordsAutosuggestCoordinatesPayload } from '@what3words/javascript-components';
import type { CustomOption as IWhat3wordsAutosuggestCustomOption } from '@what3words/javascript-components';

export declare interface What3wordsAutosuggest extends Components.What3wordsAutosuggest {

  value_changed: EventEmitter<CustomEvent<IWhat3wordsAutosuggestInputValuePayload>>;

  value_valid: EventEmitter<CustomEvent<IWhat3wordsAutosuggestInputValuePayload>>;

  value_invalid: EventEmitter<CustomEvent<IWhat3wordsAutosuggestInputValuePayload>>;

  selected_suggestion: EventEmitter<CustomEvent<IWhat3wordsAutosuggestSuggestionPayload>>;

  suggestions_changed: EventEmitter<CustomEvent<IWhat3wordsAutosuggestSuggestionsPayload>>;

  suggestions_not_found: EventEmitter<CustomEvent<void>>;

  coordinates_changed: EventEmitter<CustomEvent<IWhat3wordsAutosuggestCoordinatesPayload>>;

  selected_custom_option: EventEmitter<CustomEvent<IWhat3wordsAutosuggestCustomOption>>;

  deselected_suggestion: EventEmitter<CustomEvent<IWhat3wordsAutosuggestSuggestionPayload>>;

  __hover: EventEmitter<CustomEvent<IWhat3wordsAutosuggestSuggestionPayload>>;

  __focus: EventEmitter<CustomEvent<void>>;

  __blur: EventEmitter<CustomEvent<void>>;

  __error: EventEmitter<CustomEvent<{ error: Error }>>;
}


@ProxyCmp({
  inputs: ['api_key', 'api_version', 'base_url', 'current_location', 'current_location_control_position', 'disable_default_ui', 'fullscreen_control', 'fullscreen_control_position', 'headers', 'language', 'lat', 'libraries', 'lng', 'map_api_key', 'map_provider', 'map_type_control', 'map_type_control_position', 'map_type_id', 'marker_icon', 'region', 'reset_zoom_on_select', 'rotate_control', 'rotate_control_position', 'scale_control', 'search_control_position', 'selected_zoom', 'street_view_control', 'street_view_control_position', 'tilt', 'version', 'watch_location', 'words', 'zoom', 'zoom_control', 'zoom_control_position'],
  methods: ['setApiKey', 'setBaseUrl', 'setHeaders', 'setApiVersion', 'setWords', 'clearGrid', 'getLat', 'setCoordinates', 'getLng', 'setZoom', 'getZoom', 'getBounds', 'panTo', 'setMapTypeId']
})
@Component({
  selector: 'what3words-map',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['api_key', 'api_version', 'base_url', 'current_location', 'current_location_control_position', 'disable_default_ui', 'fullscreen_control', 'fullscreen_control_position', 'headers', 'language', 'lat', 'libraries', 'lng', 'map_api_key', 'map_provider', 'map_type_control', 'map_type_control_position', 'map_type_id', 'marker_icon', 'region', 'reset_zoom_on_select', 'rotate_control', 'rotate_control_position', 'scale_control', 'search_control_position', 'selected_zoom', 'street_view_control', 'street_view_control_position', 'tilt', 'version', 'watch_location', 'words', 'zoom', 'zoom_control', 'zoom_control_position'],
})
export class What3wordsMap {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['selected_square', 'coordinates_changed', '__load', '__error']);
  }
}


import type { ThreeWordAddress as IWhat3wordsMapThreeWordAddress } from '@what3words/javascript-components';
import type { Coordinates as IWhat3wordsMapCoordinates } from '@what3words/javascript-components';

export declare interface What3wordsMap extends Components.What3wordsMap {

  selected_square: EventEmitter<CustomEvent<IWhat3wordsMapThreeWordAddress>>;

  coordinates_changed: EventEmitter<CustomEvent<IWhat3wordsMapCoordinates>>;

  __load: EventEmitter<CustomEvent<void>>;

  __error: EventEmitter<CustomEvent<{ error: ErrorEvent }>>;
}


@ProxyCmp({
  inputs: ['addressFormat', 'apiKey', 'apiVersion', 'baseUrl', 'callback', 'clipToBoundingBox', 'clipToCircle', 'clipToCountry', 'clipToPolygon', 'headers', 'language', 'nFocusResults', 'searchFocus', 'showHintsTooltip', 'typeaheadDelay']
})
@Component({
  selector: 'what3words-notes',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['addressFormat', 'apiKey', 'apiVersion', 'baseUrl', 'callback', 'clipToBoundingBox', 'clipToCircle', 'clipToCountry', 'clipToPolygon', 'headers', 'language', 'nFocusResults', 'searchFocus', 'showHintsTooltip', 'typeaheadDelay'],
})
export class What3wordsNotes {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['valueChanged', 'valueValid', 'valueInvalid', 'suggestionSelected', 'suggestionsChanged', 'suggestionHover', 'apiError']);
  }
}


import type { InputValuePayload as IWhat3wordsNotesInputValuePayload } from '@what3words/javascript-components';
import type { SuggestionPayload as IWhat3wordsNotesSuggestionPayload } from '@what3words/javascript-components';
import type { SuggestionsPayload as IWhat3wordsNotesSuggestionsPayload } from '@what3words/javascript-components';

export declare interface What3wordsNotes extends Components.What3wordsNotes {
  /**
   * Emitted when the input value changes @example { value: "filled.count.s" }
   */
  valueChanged: EventEmitter<CustomEvent<IWhat3wordsNotesInputValuePayload>>;
  /**
   * Emitted when the input value is a valid what3words address @example { value: "filled.count.soap" }
   */
  valueValid: EventEmitter<CustomEvent<IWhat3wordsNotesInputValuePayload>>;
  /**
   * Emitted when the input value is not a valid what3words address @example { value: "filled,count,s" }
   */
  valueInvalid: EventEmitter<CustomEvent<IWhat3wordsNotesInputValuePayload>>;
  /**
   * Emitted when a suggestion is selected @example { suggestion: { words: "filled.count.soap", [...] } }
   */
  suggestionSelected: EventEmitter<CustomEvent<IWhat3wordsNotesSuggestionPayload>>;
  /**
   * Emitted when the suggestions change
   */
  suggestionsChanged: EventEmitter<CustomEvent<IWhat3wordsNotesSuggestionsPayload>>;
  /**
   * Emitted when a suggestion is hovered over
   */
  suggestionHover: EventEmitter<CustomEvent<IWhat3wordsNotesSuggestionPayload>>;
  /**
   * Emitted when a what3words API error occurs
   */
  apiError: EventEmitter<CustomEvent<{ error: Error | null }>>;
}


@ProxyCmp({
  inputs: ['color', 'size']
})
@Component({
  selector: 'what3words-symbol',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['color', 'size'],
})
export class What3wordsSymbol {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface What3wordsSymbol extends Components.What3wordsSymbol {}


