import type {
  ApiClientConfiguration,
  Transport,
  What3wordsService,
} from "@what3words/api";
import what3words, {
  ApiVersion,
  AutosuggestClient,
  AvailableLanguagesClient,
  ConvertTo3waClient,
  ConvertToCoordinatesClient,
  fetchTransport,
  GridSectionClient,
} from "@what3words/api";

import { W3W_REGEX } from "./constants";

export interface SDK {
  api: What3wordsService;
  utils: {
    validAddress: (value: string) => boolean;
  };
}

const api = what3words(
  "",
  { apiVersion: ApiVersion.Version3 },
  { transport: fetchTransport() }
);

const utils = {
  validAddress: (v: string) => W3W_REGEX.test(v),
};

/**
 * A what3words client factory that returns a client constructor with sensible defaults
 * @param clientName
 * @param client
 * @returns (apiKey, config, transport) => new client(apiKey, config, transport)
 **/
const initClient = <T>(
  clientName: keyof What3wordsService["clients"],
  client: new (
    apiKey?: string,
    config?: ApiClientConfiguration,
    transport?: Transport
  ) => T
): ((
  apiKey?: string,
  config?: ApiClientConfiguration,
  transport?: Transport
) => T) => {
  // Reference: https://vitaneri.com/posts/introduction-to-generics-in-typescript#creating-a-new-object-within-generics
  return (
    apiKey?: string,
    config?: ApiClientConfiguration,
    transport?: Transport
  ) => {
    if (!apiKey) {
      console.warn(
        "Use of sdk script credentials is deprecated! Please pass the `api_key` attribute to components. https://developer.what3words.com/tutorial/javascript-autosuggest-component-v4"
      );
      const client = api.clients[clientName];

      const possibleClientApiKey = client.apiKey();
      // check if apiKey is set by verifying return type is a string
      if (typeof possibleClientApiKey === "string") {
        // reassignment should be fine, though it modifies `arguments` object
        apiKey = possibleClientApiKey;
      }
    }
    return new client(apiKey, config, transport);
  };
};

export const what3wordsClients = {
  autosuggest: initClient("autosuggest", AutosuggestClient),
  availableLanguages: initClient(
    "availableLanguages",
    AvailableLanguagesClient
  ),
  convertTo3wa: initClient("convertTo3wa", ConvertTo3waClient),
  convertToCoordinates: initClient(
    "convertToCoordinates",
    ConvertToCoordinatesClient
  ),
  gridSection: initClient("gridSection", GridSectionClient),
};

export const sdk: Readonly<SDK> = {
  api,
  utils,
};
