/* eslint-disable @typescript-eslint/no-explicit-any */
import { Chance } from "chance";

import type { ClientRequest, TransportResponse } from "@what3words/api";

import type {
  UtilisationSessionData,
  UtilisationSessionHeader,
} from "./utilisation";
import { DEFAULTS } from "./constants";
import utilisation, { SessionType } from "./utilisation";

const CHANCE = new Chance();
const mockResponse = jest.fn();
function customTransport<T>(
  _request: ClientRequest
): Promise<TransportResponse<T>> {
  return new Promise(mockResponse);
}

describe("utilisation", () => {
  let data: UtilisationSessionData;
  let headers: UtilisationSessionHeader;
  let key: string;

  beforeEach(() => mockResponse.mockClear());
  describe.each(
    Object.keys(SessionType).map((type) => {
      return (SessionType as any)[type];
    })
  )("when session type is %s", (type: SessionType) => {
    beforeEach(() => {
      utilisation.setHost(CHANCE.url({ path: CHANCE.word() }));
      key = CHANCE.string({ alpha: true, length: 8 });
      data = {
        return_coordinates: CHANCE.bool(),
        typeahead_delay: CHANCE.integer({ min: 1, max: 100 }),
        variant: CHANCE.word(),
        component_version: `${CHANCE.integer({
          min: 0,
          max: 9,
        })}.${CHANCE.integer({ min: 0, max: 9 })}.${CHANCE.integer({
          min: 0,
          max: 9,
        })}`,
      };
      headers = {
        Origin: "vitest",
        "User-Agent": "vitest",
        "X-W3W-Wrapper": CHANCE.string({ alpha: false, length: 12 }),
        "X-W3W-AS-Component": CHANCE.string({
          alpha: false,
          length: 12,
        }),
        "X-Correlation-ID": CHANCE.guid(),
      };
    });
    it(`should not ${type} to utilisation if w3wApiHost doesn't match *.w3w.io or *.what3words.com domain`, async () => {
      const success = await utilisation.send({
        key,
        baseUrl: CHANCE.url({ path: CHANCE.word() }),
        type,
        headers,
        data,
        transport: customTransport,
      });
      expect(success).toBeFalsy();
    });

    it(`should not ${type} to utilisation if api_key is not provided`, async () => {
      const success = await utilisation.send({
        key: "",
        baseUrl: DEFAULTS.base_url,
        type,
        headers,
        data,
      });
      expect(success).toBeFalsy();
    });
    it(`should send utilisation to api as ${type}`, async () => {
      mockResponse.mockImplementation((resolve, _reject) => {
        resolve({
          ok: true,
          status: 200,
          statusText: "Success",
        });
      });
      const success = await utilisation.send({
        key,
        baseUrl: DEFAULTS.base_url,
        type,
        headers,
        data,
        transport: customTransport,
      });
      expect(success).toBeTruthy();
    });
    it(`should return falsy when http request failed to ${type} to utilisation-api`, async () => {
      mockResponse.mockImplementation((_resolve, reject) => {
        reject({
          status: 400,
          statusText: "Something went wrong",
        });
      });
      const success = await utilisation.send({
        key,
        baseUrl: DEFAULTS.base_url,
        type,
        headers,
        data,
      });
      expect(success).toBeFalsy();
    });
  });
});
