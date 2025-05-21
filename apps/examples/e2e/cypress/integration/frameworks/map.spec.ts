/**
 * NOTE: Testing the map component is prone to flaky behaviour. Additionally, it's worth avoiding user-interaction assertions
 * as these counterintuitively end up testing underlying map library logic.
 * i.e: https://stackoverflow.com/q/71660561/2165149
 */

import {
  AS_HEADER_REGEX,
  MAP_HEADER_REGEX,
  autosuggestURL,
  convertToCoordinatesURL,
  convertTo3waURL,
  gridSectionURL,
  generateAutosuggestOptions,
  twaData,
  apiKeys,
} from "@cypress/fixtures";

const SUGGESTIONS = generateAutosuggestOptions({});

describe("Map", () => {
  beforeEach(() => {
    cy.setup({
      url: "/",
      props: {
        map: { apiKey: apiKeys.valid },
      },
    })
      .mockAutosuggestionResults(SUGGESTIONS)
      .mockCoordinateResults();
    cy.document().then((doc) => {
      doc
        .querySelector("what3words-map")
        ?.addEventListener("__load", cy.stub().as("mapLoaded"));
    });

    cy.get("what3words-map.hydrated").as("Map");
    cy.get("what3words-autosuggest.hydrated").get("input").as("SearchInput");
    cy.get("button.dismissButton").click(); // close the google maps page load warning dialog
    cy.contains("This page can't load Google Maps correctly.").should(
      "not.exist"
    );
  });

  describe("headers", () => {
    beforeEach(() => {
      cy.intercept("GET", `${autosuggestURL}?*`).as("GetAutosuggest");
      cy.intercept("GET", `${convertToCoordinatesURL}?*`).as("GetCoordinates");
      cy.intercept("GET", `${convertTo3waURL}?*`).as("Get3Wa");
      cy.intercept("GET", `${gridSectionURL}?*`).as("GetGridSection");
      // cy.get("@mapLoaded").should("have.been.called"); // commented out because this is a very brittle assertion
    });

    describe("X-W3W-AS-Component", () => {
      it('should be set to "what3words-Map-JS"', () => {
        // Act
        cy.get("@Map").click();
        // Assert
        cy.wait("@GetGridSection")
          .its("request.headers")
          .then((headers) => {
            expect(headers).to.have.property("x-w3w-as-component");
            expect(headers["x-w3w-as-component"]).to.match(MAP_HEADER_REGEX);
          });
      });

      it('should be set to "what3words-Autosuggest-JS" when interacting with Autosuggest component', () => {
        // Act
        cy.get("@SearchInput").clear();
        cy.get("@SearchInput").type(twaData.words);
        // Assert
        cy.get("[data-testid*=suggestion-]").should("have.length", 3);
        cy.wait("@GetAutosuggest")
          .its("request.headers")
          .then((headers) => {
            expect(headers).to.have.property("x-w3w-as-component");
            expect(headers["x-w3w-as-component"]).to.match(AS_HEADER_REGEX);
          });
      });
    });
  });
});
