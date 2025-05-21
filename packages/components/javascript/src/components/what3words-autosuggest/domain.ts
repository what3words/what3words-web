export interface SDKQueryParams {
  key?: string;
  baseUrl?: string;
  headers?: Record<string, string>;
  callback?: string;
}

export interface AutosuggestOptionsProps {
  open: boolean;
  options?: AutosuggestOption[];
  option?: AutosuggestOption;
}

export interface AutosuggestOption {
  country: string;
  language: string;
  nearestPlace: string;
  rank: number;
  words: string;
  distanceToFocusKm?: number;
}

export interface CustomOption {
  value: string;
  id: string;
  description?: string;
  distance?: {
    value: number;
    units?: string;
  };
}

export interface InputValuePayload {
  value: string;
}

export interface CoordinatesPayload {
  coordinates: { lat: number; lng: number };
}

export interface SuggestionPayload {
  suggestion: AutosuggestOption;
}

export interface SuggestionsPayload {
  suggestions: AutosuggestOption[];
}
