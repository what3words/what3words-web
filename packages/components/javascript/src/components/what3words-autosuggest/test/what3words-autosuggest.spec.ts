import { newSpecPage } from "@stencil/core/testing";

import { What3wordsAutosuggest } from "../what3words-autosuggest";

describe("<what3words-autosuggest />", () => {
  it("renders", async () => {
    const { root } = await newSpecPage({
      components: [What3wordsAutosuggest],
      html: "<what3words-autosuggest><input></input></what3words-autosuggest>",
    });
    expect(root).toMatchSnapshot();
  });

  describe("when variant is provided", () => {
    it("renders", async () => {
      const value = "inherit";
      const { root } = await newSpecPage({
        components: [What3wordsAutosuggest],
        html: `<what3words-autosuggest variant=${value}><input></what3words-autosuggest>`,
      });
      expect(root).toMatchSnapshot();
    });
  });

  it("renders when wrapped an existing input element", async () => {
    const { root } = await newSpecPage({
      components: [What3wordsAutosuggest],
      html: '<what3words-autosuggest><input type="myinput" /></what3words-autosuggest>',
    });
    expect(root).toMatchSnapshot();
  });

  describe("when localised", () => {
    it("displays placeholder text as italian", async () => {
      const { root } = await newSpecPage({
        components: [What3wordsAutosuggest],
        html: "<what3words-autosuggest><input></what3words-autosuggest>",
        language: "it",
      });
      expect(root).toMatchSnapshot();
    });

    it("displays placeholder text as english if language is invalid", async () => {
      const { root } = await newSpecPage({
        components: [What3wordsAutosuggest],
        html: "<what3words-autosuggest><input></what3words-autosuggest>",
        language: "ww",
      });
      expect(root).toMatchSnapshot();
    });

    it("accepts language in uppercase", async () => {
      const { root } = await newSpecPage({
        components: [What3wordsAutosuggest],
        html: "<what3words-autosuggest><input></what3words-autosuggest>",
        language: "IT",
      });
      expect(root).toMatchSnapshot();
    });
  });
});
