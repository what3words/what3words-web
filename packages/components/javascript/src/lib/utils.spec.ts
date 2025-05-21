/* eslint-disable @typescript-eslint/no-explicit-any */
import { Chance } from "chance";

import { isEmpty, parseCoordinates } from "./utils";

const CHANCE = new Chance();

describe("parseCoordinates", () => {
  describe("given parsable values", () => {
    const scenarios = [
      [`${CHANCE.latitude()}`, `${CHANCE.longitude()}`],
      [`${CHANCE.floating()}`, `${CHANCE.floating()}`],
      [`${CHANCE.integer()}`, `${CHANCE.integer()}`],
    ];
    it("returns parsed coordinates", () => {
      scenarios.forEach(([lat, lng]: any[]) =>
        expect(parseCoordinates(lat, lng)).toEqual({
          lat: parseFloat(lat),
          lng: parseFloat(lng),
        })
      );
    });
  });
  describe("given unparsable values", () => {
    const scenarios = [
      [CHANCE.bool(), CHANCE.bool()],
      [CHANCE.word(), CHANCE.paragraph()],
      [new Date(), new Date()],
    ];
    it("returns parsed coordinates", () => {
      scenarios.forEach(([lat, lng]) => {
        expect(parseCoordinates(lat as string, lng as string)).toEqual({
          lat: NaN,
          lng: NaN,
        });
      });
    });
  });
});

describe("isEmpty", () => {
  describe("given a non-empty value", () => {
    it("return false", () => {
      const scenarios = [
        CHANCE.word(),
        CHANCE.bool(),
        CHANCE.natural(),
        CHANCE.integer(),
        CHANCE.floating(),
        [CHANCE.guid()],
      ];
      scenarios.forEach((value) => expect(isEmpty(value as any)).toBeFalsy());
    });
  });
  describe("given an empty value", () => {
    it("return true", () => {
      const scenarios = [undefined, null, "", []];
      scenarios.forEach((value) => expect(isEmpty(value)).toBeTruthy());
    });
  });
});
