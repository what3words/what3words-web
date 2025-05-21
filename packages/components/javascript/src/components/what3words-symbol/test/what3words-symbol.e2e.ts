import { newE2EPage } from "@stencil/core/testing";

describe("what3words-symbol", () => {
  it("renders", async () => {
    const page = await newE2EPage();
    await page.setContent("<what3words-symbol></what3words-symbol>");

    const element = await page.find("what3words-symbol");
    expect(element).not.toBeNull();
  });
});
