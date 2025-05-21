import { newSpecPage } from "@stencil/core/testing";

import { What3wordsSymbol } from "../what3words-symbol";

describe("what3words-symbol", () => {
  it("renders", async () => {
    const page = await newSpecPage({
      components: [What3wordsSymbol],
      html: `<what3words-symbol></what3words-symbol>`,
    });
    expect(page.root).toEqualHtml(`
      <what3words-symbol>
        <svg class="what3words-logo" data-testid="what3words-symbol" viewBox="0 0 32 32" style="color: #e11f26; width: 28px; height: 28px;">
          <path d="M10.7,4h2L4,28H2L10.7,4z M19.7,4h2L13,28h-2L19.7,4z M28.7,4h2L22,28h-2L28.7,4z" fill="currentColor"></path>
        </svg>
      </what3words-symbol>
    `);
  });
});
