import type { ClientRequest, Transport } from "@what3words/api";
import { fetchTransport } from "@what3words/api";

import { isKey } from "./utils";

const UTILISATION_ENABLED_HOSTS = [".*\\.w3w\\.io", ".*\\.what3words\\.com"];

export interface UtilisationSessionData {
  return_coordinates: boolean;
  typeahead_delay: number;
  variant: string;
  component_version: string;
}

export interface UtilisationSessionHeader {
  Origin: string;
  "User-Agent": string;
  "X-W3W-Wrapper": string;
  "X-W3W-AS-Component": string;
  "X-Correlation-ID": string;
  "X-W3W-Plugin"?: string;
  "X-API-Key"?: string;
}

export enum SessionType {
  Started = "POST",
  Updated = "PATCH",
}

interface UtilisationSession {
  key: string;
  baseUrl: string;
  type: SessionType;
  headers: UtilisationSessionHeader;
  data?: UtilisationSessionData;
  transport?: Transport;
}

const isUtilisationEnabledHost = (host: string): boolean =>
  new RegExp(UTILISATION_ENABLED_HOSTS.join("|")).test(host);

class Utilisation {
  private apiKey?: string;
  private host = "https://utilisation-api.what3words.com";
  /**
   * Sets the API Key
   * @param apiKey W3W API key
   */
  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }
  /**
   * Allows overriding of utilisation api host (i.e: preprod, dev etc)
   * @param host utilisation api host
   */
  setHost(host: string) {
    this.host = host;
  }

  async send(session: UtilisationSession): Promise<boolean> {
    const {
      key,
      baseUrl,
      headers,
      data,
      transport = fetchTransport(),
      type,
    } = session;
    const apiKey = key || this.apiKey;
    if (!apiKey || !isUtilisationEnabledHost(baseUrl)) {
      return false;
    }
    const request = {
      method: type as unknown as ClientRequest["method"],
      host: `${this.host.replace(/\/$/, "")}`,
      url: "/autosuggest-session",
      query: { key: apiKey },
      headers: {
        "Content-Type": "application/json",
        ...[
          "Origin",
          "User-Agent",
          "X-W3W-Wrapper",
          "X-W3W-AS-Component",
          "X-Correlation-ID",
          "X-W3W-Plugin",
          "X-API-Key",
        ]
          .filter((key: string) => isKey(headers, key))
          .reduce((acc: Record<string, string>, key) => {
            if (headers[key]) {
              acc[key] = headers[key];
            }
            return acc;
          }, {}),
      },
      body: data,
    };
    return transport(request)
      .then((response) => response.status >= 200 && response.status < 300)
      .catch((_err) => false);
  }
}

export default new Utilisation();
