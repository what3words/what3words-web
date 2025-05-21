import { h } from "@stencil/core";
import { newSpecPage } from "@stencil/core/testing";

import type { AutosuggestOption } from "../domain";
import { W3wSuggestion } from "./w3w-suggestion";

const defaultOption: AutosuggestOption = {
  country: "GB",
  distanceToFocusKm: 1,
  nearestPlace: "London",
  words: "apple.banana.cherry",
  language: "en",
  rank: 1,
};

describe("Render w3w-suggestion", () => {
  it("render correct suggestion", async () => {
    const page = await newSpecPage({
      components: [],
      template: () => <W3wSuggestion opt={defaultOption}></W3wSuggestion>,
    });

    expect(page.root).toMatchSnapshot();
  });

  it("should not now show nearest place when not provided", async () => {
    const option: AutosuggestOption = {
      ...defaultOption,
      nearestPlace: "",
    };

    const page = await newSpecPage({
      components: [],
      template: () => <W3wSuggestion opt={option}></W3wSuggestion>,
    });

    expect(page.root).toMatchSnapshot();
  });

  it("should show sea flag when country is ZZ", async () => {
    const option: AutosuggestOption = {
      ...defaultOption,
      country: "ZZ",
    };

    const page = await newSpecPage({
      components: [],
      template: () => <W3wSuggestion opt={option}></W3wSuggestion>,
    });

    expect(page.root).toMatchSnapshot();
  });

  it("should not show distance when not provided", async () => {
    const option: AutosuggestOption = {
      ...defaultOption,
      distanceToFocusKm: undefined,
    };

    const page = await newSpecPage({
      components: [],
      template: () => <W3wSuggestion opt={option}></W3wSuggestion>,
    });

    expect(page.root).toMatchSnapshot();
  });
});
