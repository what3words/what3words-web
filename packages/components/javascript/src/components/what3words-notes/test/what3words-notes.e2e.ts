import { newE2EPage } from "@stencil/core/testing";

describe("what3words-notes", () => {
  it("renders", async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <what3words-notes api-key="FAKE-API-KEY">
        <textarea
          slot="input"
          class="w-80 p-3 border border-gray-300 rounded-md"
          name="delivery-instructions"
          placeholder="Type delivery instructions with your what3words address"
          autocomplete="off">
        </textarea>
      </what3words-notes>
    `);

    const element = await page.find("what3words-notes");
    expect(element).not.toBeNull();
  });
});
