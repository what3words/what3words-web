import { newE2EPage } from "@stencil/core/testing";

describe("what3words-address", () => {
  it("renders", async () => {
    const page = await newE2EPage();
    await page.setContent("<what3words-address></what3words-address>");

    const element = await page.find("what3words-address");
    expect(element).not.toBeNull();
  });
});
