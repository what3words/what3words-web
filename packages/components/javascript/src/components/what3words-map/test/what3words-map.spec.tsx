import {
  MAP_SCRIPT_ID,
  MAP_SELECTOR,
  SEARCH_CONTROL_SELECTOR,
} from "@javascript-components/lib/constants";
import { newSpecPage } from "@stencil/core/testing";

import { What3wordsAutosuggest } from "../../what3words-autosuggest/what3words-autosuggest";
import { What3wordsMap } from "../what3words-map";

describe("<what3words-map />", () => {
  describe("renders", () => {
    it.skip("should render and attach gmaps scripts", async () => {
      // skipping test to avoid testing third-party vendor logic
      const page = await newSpecPage({
        components: [What3wordsMap],
        html: "<what3words-map></what3words-map>",
      });
      expect(page.doc.querySelector(`script#${MAP_SCRIPT_ID}`)).not.toBeNull();
      expect(page.root).toMatchSnapshot();
    });
    it("should render with map div", async () => {
      const page = await newSpecPage({
        components: [What3wordsMap],
        html: '<what3words-map><div slot="map"></div></what3words-map>',
      });
      const mapDiv = page.root?.querySelector(MAP_SELECTOR);
      expect(mapDiv).not.toBeNull();
      expect(page.root).toMatchSnapshot();
    });
    it("should render map div and controls", async () => {
      const page = await newSpecPage({
        components: [What3wordsMap, What3wordsAutosuggest],
        html: `<what3words-map>
          <div slot="map"></div>
          <div slot="search-control">
            <what3words-autosuggest><input type="text"></input></what3words-autosuggest>
          </div>
        </what3words-map>`,
      });
      const mapDiv = page.root?.querySelector(MAP_SELECTOR);
      const controlsDiv = page.root?.querySelector(SEARCH_CONTROL_SELECTOR);
      expect(mapDiv).not.toBeNull();
      expect(controlsDiv).not.toBeNull();
      expect(page.root).toMatchSnapshot();
    });
  });
});
