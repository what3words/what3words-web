import { DEFAULTS } from "@javascript-components/lib/constants";
import { newSpecPage } from "@stencil/core/testing";

import { What3wordsAddress } from "../what3words-address";

describe("what3words-address", () => {
  it("renders", async () => {
    const page = await newSpecPage({
      components: [What3wordsAddress],
      html: `<what3words-address></what3words-address>`,
    });
    expect(page.root).toEqualHtml(`
      <what3words-address>
        <span class="notranslate what3words-address" href="https://map.what3words.com/${DEFAULTS.threeWordAddress}" target="_blank" style="font-size: 24px;">
          <div class="what3words-tooltip-container">
            <div class="what3words-tooltip">
              what3words gives every 3m x 3m in the world a unique 3 word address. This one describes the precise entrance of the building.
            </div>
          </div>
          <div class="what3words-address_container">
            <what3words-symbol color="#e11f26" size="30"></what3words-symbol>
            <span class="what3words-address_text" style="color: #0a3049;">
              ${DEFAULTS.threeWordAddress}
            </span>
          </div>
        </span>
      </what3words-address>
    `);
  });
  describe("given words", () => {
    it("should render as text", async () => {
      const words = "example.three.words";
      const page = await newSpecPage({
        components: [What3wordsAddress],
        html: `<what3words-address words=${words}></what3words-address>`,
      });
      expect(page.root).toEqualHtml(`
        <what3words-address words=${words}>
          <span class="notranslate what3words-address" href="https://map.what3words.com/${words}" target="_blank" style="font-size: 24px;">
            <div class="what3words-tooltip-container">
              <div class="what3words-tooltip">
                what3words gives every 3m x 3m in the world a unique 3 word address. This one describes the precise entrance of the building.
              </div>
            </div>
            <div class="what3words-address_container">
              <what3words-symbol color="#e11f26" size="30"></what3words-symbol>
              <span class="what3words-address_text" style="color: #0a3049;">
                ${words}
              </span>
            </div>
          </span>
        </what3words-address>
      `);
    });
  });
});
