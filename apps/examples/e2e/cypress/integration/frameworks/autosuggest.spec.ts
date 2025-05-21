import {
  apiKeys,
  AS_HEADER_REGEX,
  autosuggestURL,
  DEFAULTS,
  generateAutosuggestOptions,
  TestScenarios,
  twaData,
} from "@cypress/fixtures";

const SUGGESTIONS = generateAutosuggestOptions({});

describe("Autosuggest Component", () => {
  describe("When autosuggest component is added to a JS-enabled web document", () => {
    beforeEach(() => {
      cy.setup({
        url: "/",
        props: { autosuggest: { apiKey: apiKeys.valid } },
      });
      cy.mockAutosuggestionResults(SUGGESTIONS);
    });
    it("Then autosuggest component is loaded with default values", () => {
      cy.hasLoadedElements();
    });
    it("Then autosuggestions are returned when a user enters a valid 3wa string", () => {
      cy.typeIntoInput(TestScenarios.valid3wa);
      cy.wait("@mockAutosuggestionResults");
      cy.assertNumberOfVisibleSuggestions(3);
      cy.getAutosuggestOptions().each((opt) =>
        cy.wrap(opt).should("have.attr", "class", "what3words-autosuggest-item")
      );
      cy.blurInput();
      cy.assertErrorMessage(DEFAULTS.errorMessage);
    });

    TestScenarios.invalid3wa.forEach((invalid3wa) => {
      it(`Then no autosuggestions are returned when a user enters an invalid 3wa string - ${invalid3wa}`, () => {
        cy.typeIntoInput(`${invalid3wa}`);
        cy.assertNumberOfVisibleSuggestions(0);
        cy.blurInput();
        cy.assertErrorMessage(DEFAULTS.errorMessage);
      });
    });

    describe("And no autosuggestions are returned", () => {
      it("Then an error should be displayed", () => {
        cy.setup({
          url: "/",
          props: { autosuggest: { apiKey: apiKeys.valid } },
        }).mockAutosuggestionResults([]);
        cy.typeIntoInput(TestScenarios.valid3wa);
        cy.wait("@mockAutosuggestionResults");
        cy.assertNumberOfVisibleSuggestions(0);
        cy.assertErrorMessage(DEFAULTS.errorMessage);
      });
    });

    describe("And a valid 3wa is typed into the autosuggest component", () => {
      it("Then the input should toggle through options with ArrowDown x1", () => {
        cy.typeIntoInput(TestScenarios.valid3wa);
        cy.assertNumberOfVisibleSuggestions(3);
        cy.getInput().focus();
        cy.getInput().type("{downarrow}");
        cy.getInput().assertNoErrorMessage();
      });
      it("Then the input should toggle through options with ArrowDown x2", () => {
        cy.typeIntoInput(TestScenarios.valid3wa);
        cy.assertNumberOfVisibleSuggestions(3);
        cy.typeIntoInput("{downarrow}{downarrow}");
        cy.assertNoErrorMessage();
      });
      it("Then the input should toggle through options with ArrowDown x3", () => {
        cy.typeIntoInput(TestScenarios.valid3wa);
        cy.assertNumberOfVisibleSuggestions(3);
        cy.typeIntoInput("{downarrow}{downarrow}{downarrow}");
        cy.assertNoErrorMessage();
      });
      it("Then the input should toggle through options with ArrowDown x4", () => {
        cy.typeIntoInput(TestScenarios.valid3wa);
        cy.assertNumberOfVisibleSuggestions(3);
        cy.typeIntoInput("{downarrow}{downarrow}{downarrow}{downarrow}");
        cy.assertNoErrorMessage();
      });
      it("Then the input should toggle through options with ArrowUp x1", () => {
        cy.typeIntoInput(TestScenarios.valid3wa);
        cy.assertNumberOfVisibleSuggestions(3);
        cy.typeIntoInput("{uparrow}");
        cy.assertNoErrorMessage();
      });
      it("Then the input should toggle through options with ArrowUp x2", () => {
        cy.typeIntoInput(TestScenarios.valid3wa);
        cy.assertNumberOfVisibleSuggestions(3);
        cy.typeIntoInput("{uparrow}{uparrow}");
        cy.assertNoErrorMessage();
      });
      it("Then the input should toggle through options with ArrowUp x3", () => {
        cy.typeIntoInput(TestScenarios.valid3wa);
        cy.assertNumberOfVisibleSuggestions(3);
        cy.typeIntoInput("{uparrow}{uparrow}{uparrow}");
      });
      it("Then the input should toggle through options with ArrowUp x4", () => {
        cy.typeIntoInput(TestScenarios.valid3wa);
        cy.assertNumberOfVisibleSuggestions(3);
        cy.typeIntoInput("{uparrow}{uparrow}{uparrow}{uparrow}");
        cy.assertNoErrorMessage();
      });
      it("Then it should close the options when the Escape is pressed", () => {
        cy.typeIntoInput(TestScenarios.valid3wa);
        cy.assertNumberOfVisibleSuggestions(3);
        cy.typeIntoInput("{esc}");
        cy.assertNumberOfVisibleSuggestions(0);
        cy.assertErrorMessage(DEFAULTS.errorMessage);
      });
      it("Then an autosuggest option is selected when the user presses Enter", () => {
        cy.get("form")
          .then((jq) => {
            const [form]: [HTMLFormElement] = jq as any;
            form.addEventListener("submit", (e) => e.preventDefault());
          })
          .mockAutosuggestSelection()
          .typeIntoInput(TestScenarios.valid3wa);
        cy.assertNumberOfVisibleSuggestions(3);
        cy.typeIntoInput("{downarrow}{downarrow}{enter}");
        cy.wait("@mockAutosuggestSelection");
        cy.getInput().should(
          "have.value",
          DEFAULTS.prefix + SUGGESTIONS[1].words
        );
        cy.assertNoErrorMessage();
        cy.get("what3words-autosuggest")
          .find("[data-testid=input-wrapper]")
          .find("[data-testid=state]")
          .should("exist")
          .should("have.attr", "class", "what3words-autosuggest-state valid");
      });
    });

    describe("And the document language is set to italian", () => {
      it("Then the placeholder should be displayed in italian (navigator language is ignored)", () => {
        cy.setup({
          url: "/",
          localisation: { navigatorLanguage: "de-DE", htmlLang: "it-IT" },
          props: { autosuggest: { apiKey: apiKeys.valid } },
        }).mockAutosuggestionResults(SUGGESTIONS);
        cy.hasLoadedElements();
      });

      it("Then the component should accept uppercase or lowercase language codes", () => {
        const expectedLanguage = "DE";
        cy.setup({
          url: "/",
          localisation: { htmlLang: "IT-IT" },
          props: {
            autosuggest: {
              language: expectedLanguage,
              apiKey: apiKeys.valid,
            },
          },
        });
        cy.mockAutosuggestionResults(SUGGESTIONS);
        cy.hasLoadedElements();
        cy.typeIntoInput(
          TestScenarios.valid3wa
        ).assertNumberOfVisibleSuggestions(3);
        cy.wait("@mockAutosuggestionResults").then((interception) => {
          expect(interception.request.query.language).equal(
            expectedLanguage.toLowerCase()
          );
        });
      });

      it("Then the autosuggestion results should be set to the language (de) set in the component", () => {
        const expectedLanguage = "de";
        cy.setup({
          url: "/",
          props: {
            autosuggest: {
              language: expectedLanguage,
              apiKey: apiKeys.valid,
            },
          },
          localisation: { htmlLang: "it-IT" },
        }).mockAutosuggestionResults(SUGGESTIONS);
        cy.typeIntoInput(
          TestScenarios.valid3wa
        ).assertNumberOfVisibleSuggestions(3);
        cy.hasLoadedElements();
        cy.wait("@mockAutosuggestionResults").then((interception) => {
          expect(interception.request.query.language).equal(expectedLanguage);
        });
      });

      describe("And no autosuggestions are returned", () => {
        it("Then an error should be displayed in italian", () => {
          cy.setup({
            url: "/",
            localisation: { htmlLang: "it" },
            props: { autosuggest: { apiKey: apiKeys.valid } },
          }).mockAutosuggestionResults([]);
          cy.typeIntoInput(TestScenarios.valid3wa);
          cy.wait("@mockAutosuggestionResults");
          cy.assertNumberOfVisibleSuggestions(0);
          cy.assertErrorMessage("Non è stato trovato nessun indirizzo valido");
        });
      });
    });
  });

  describe("When an invalid key is provided", () => {
    beforeEach(() => {
      cy.setup({
        url: "/",
        props: {
          autosuggest: { apiKey: apiKeys.invalid },
        },
      }).mockAutosuggestionError(401);
    });
    it("Then autosuggestions are not returned when a user enters a valid 3wa string", () => {
      cy.getInput().should("exist");
      cy.getInput().type(TestScenarios.valid3wa);
      cy.assertErrorMessage(
        DEFAULTS.fatalErrorMessage
      ).assertNumberOfVisibleSuggestions(0);
    });
    TestScenarios.invalid3wa.forEach((invalid3wa) => {
      it("Then no autosuggestions are returned when a user enters an invalid 3wa string", () => {
        cy.getInput().should("exist");
        cy.getInput().type(`${invalid3wa}`);
        cy.assertNumberOfVisibleSuggestions(0).assertNoErrorMessage();
      });
    });
  });

  describe("When autosuggest component is added to a form", () => {
    describe("When a user submits the form with a what3words address selected", () => {
      beforeEach(() => {
        cy.setup({
          url: "/",
          props: { autosuggest: { apiKey: apiKeys.valid } },
        });
        cy.mockAutosuggestionResults(SUGGESTIONS);
        cy.mockAutosuggestSelection();
      });
      it("Then the form submission includes the selected what3words address", () => {
        const onsubmit = (body: any) => {
          expect(body).to.have.property(DEFAULTS.name);
        };
        cy.mockFormSubmit(onsubmit);
        cy.typeIntoInput(TestScenarios.valid3wa);
        cy.selectAutosuggestOption(0);
        cy.wait("@mockAutosuggestSelection");
        cy.getInput().should(
          "have.value",
          DEFAULTS.prefix + SUGGESTIONS[0].words
        );
        cy.assertNoErrorMessage();
        cy.get("[data-testid=submit]").click();
      });
    });
    describe("When a user submits the form with a what3words address selected", () => {
      describe("And the component is set to return coordinates", () => {
        beforeEach(() => {
          cy.setup({
            url: "/",
            props: {
              autosuggest: {
                apiKey: apiKeys.valid,
                returnCoordinates: "true",
              },
            },
          });
          cy.mockAutosuggestionResults(SUGGESTIONS);
          cy.mockAutosuggestSelection();
          cy.mockCoordinateResults();
        });
        it("Then the form submission includes the selected what3words address and coordinates", () => {
          const onsubmit = (body: any) => {
            expect(body).to.have.property(DEFAULTS.name);
            expect(body).to.have.property(DEFAULTS.name + "_lat");
            expect(body).to.have.property(DEFAULTS.name + "_lng");
          };
          cy.mockFormSubmit(onsubmit);
          cy.typeIntoInput(TestScenarios.valid3wa);
          cy.selectAutosuggestOption(0);
          cy.wait("@mockAutosuggestSelection");
          cy.getInput();
          cy.should("have.value", DEFAULTS.prefix + SUGGESTIONS[0].words);
          cy.assertNoErrorMessage();
          cy.get("[data-testid=submit]").click();
        });

        it.skip("Then show a console message if the user is capped", () => {
          // TODO: The frontend and javascript-sdk components have drifted, re-include this once implementation parity is achieved
          cy.mockCoordinateResults({
            capped: true,
          });
          cy.typeIntoInput(TestScenarios.valid3wa);
          cy.selectAutosuggestOption(0);
          cy.wait("@mockAutosuggestSelection");
          cy.getInput();
          cy.should("have.value", DEFAULTS.prefix + SUGGESTIONS[0].words);
          cy.assertNoErrorMessage();
          cy.get("[data-testid=submit]").click();
          cy.get("@consoleError").should(
            "be.calledWith",
            DEFAULTS.c2cErrorMessage
          );
        });
      });
    });
  });

  describe("Given a User is pasting a valid3wa into the autosuggest component", () => {
    describe("And the initial input is empty", () => {
      it("Then the input value matches the clipboard data", () => {
        const { valid3wa } = TestScenarios;
        cy.setup({ url: "/" });
        cy.pasteIntoInput(valid3wa);
        cy.should("have.value", DEFAULTS.prefix + valid3wa);
      });
    });
    describe("And the initial input already contains a value", () => {
      it("Then the clipboard data value is appended", () => {
        const { initialValue, valid3wa } = TestScenarios;
        cy.setup({
          url: "/",
          props: {
            autosuggest: { initialValue: initialValue },
          },
        });
        cy.pasteIntoInput(valid3wa);
        cy.should("have.value", DEFAULTS.prefix + valid3wa);
      });
    });
    describe("And the clipboard data is pasted twice", () => {
      it("Then the clipboard data value is appended to the first", () => {
        const { valid3wa } = TestScenarios;
        cy.setup({ url: "/" });
        cy.pasteIntoInput(valid3wa as any);
        cy.pasteIntoInput(valid3wa as any);
        cy.getInput();
        cy.should("have.value", DEFAULTS.prefix + valid3wa);
      });
    });
    describe("And an initial value has already been typed", () => {
      it("Then the clipboard data value is appended to the first", () => {
        const { initialValue, valid3wa } = TestScenarios;
        cy.setup({ url: "/" });
        cy.typeIntoInput(initialValue);
        cy.pasteIntoInput(valid3wa);
        cy.should("have.value", DEFAULTS.prefix + valid3wa);
      });
    });
    describe("When a valid key is provided", () => {
      beforeEach(() => {
        cy.setup({
          url: "/",
          props: {
            autosuggest: { apiKey: apiKeys.valid },
          },
        });
        cy.mockAutosuggestionResults();
        cy.hasLoadedElements();
      });
      describe("And the clipboard data is a valid 3wa", () => {
        it("Then returns the expected number of autosuggestions", () => {
          const { valid3wa } = TestScenarios;
          cy.pasteIntoInput(valid3wa).assertNumberOfVisibleSuggestions(3);
        });
      });
      describe("And the clipboard data is a valid 3wa with a trailing whitespace character", () => {
        it("Then returns autosuggestions", () => {
          const { valid3wa } = TestScenarios;
          const valid3waWithTrailingWhitespace = valid3wa + " ";
          cy.pasteIntoInput(
            valid3waWithTrailingWhitespace
          ).assertNumberOfVisibleSuggestions(3);
        });
      });
      describe("And the clipboard data is a valid 3wa with a leading whitespace character", () => {
        it("Then returns autosuggestions", () => {
          const { valid3wa } = TestScenarios;
          const valid3waWithLeadingWhitespace = " " + valid3wa;
          cy.pasteIntoInput(
            valid3waWithLeadingWhitespace
          ).assertNumberOfVisibleSuggestions(3);
        });
      });
    });
  });

  describe("Headers", () => {
    describe("X-W3W-AS-Component", () => {
      it('should be set to "what3words-Autosuggest-JS"', () => {
        // Arrange
        cy.setup({
          url: "/",
          props: {
            autosuggest: { apiKey: apiKeys.valid },
          },
        }).mockAutosuggestionResults(SUGGESTIONS);
        cy.intercept("GET", `${autosuggestURL}?*`).as("GetAutosuggest");
        cy.get('input[type="text"]').as("SearchInput");
        // Act
        cy.get("@SearchInput").clear();
        cy.get("@SearchInput").type(twaData.words);
        // Assert
        cy.get("[data-testid*=suggestion-]").should(
          "have.length.greaterThan",
          0
        );
        cy.wait("@GetAutosuggest")
          .its("request.headers")
          .then((headers) => {
            expect(headers).to.have.property("x-w3w-as-component");
            expect(headers["x-w3w-as-component"]).to.match(AS_HEADER_REGEX);
          });
      });
    });
  });

  describe("Localisation", () => {
    describe("When document language is set to italian", () => {
      it("Then accepts uppercase or lowercase language codes on the component", () => {
        const expectedLanguage = "DE";
        cy.setup({
          url: "/",
          localisation: { htmlLang: "IT-IT" },
          props: {
            autosuggest: {
              apiKey: apiKeys.valid,
              language: expectedLanguage,
            },
          },
        }).mockAutosuggestionResults(SUGGESTIONS);
        cy.hasLoadedElements();

        cy.intercept("get", /\?/i).as("autosuggestRequest");
        cy.typeIntoInput(
          TestScenarios.valid3wa
        ).assertNumberOfVisibleSuggestions(3);
        cy.wait("@autosuggestRequest").then((interception) => {
          expect(interception.request.query.language).equal(
            expectedLanguage.toLowerCase()
          );
        });
      });

      it("Then it returns the autosuggestion using the language (de) set in the component", () => {
        const expectedLanguage = "de";
        cy.setup({
          url: "/",
          props: {
            autosuggest: {
              apiKey: apiKeys.valid,
              language: expectedLanguage,
            },
          },
          localisation: { htmlLang: "it-IT" },
        }).mockAutosuggestionResults(SUGGESTIONS);
        cy.intercept("get", /\?/i).as("autosuggestRequest");
        cy.typeIntoInput(
          TestScenarios.valid3wa
        ).assertNumberOfVisibleSuggestions(3);
        cy.hasLoadedElements();
        cy.wait("@autosuggestRequest").then((interception) => {
          expect(interception.request.query.language).equal(expectedLanguage);
        });
      });
    });
    describe.skip("When autouggestions are rendered", () => {
      // Setting browser locale and languages isn't guaranteed to work in cypress https://github.com/cypress-io/cypress/issues/7890

      it('Then include "near" prefix when detected language is english', () => {
        cy.setup({
          url: "/",
          props: { autosuggest: { apiKey: apiKeys.valid, language: "de" } },
          localisation: { htmlLang: "en-US" },
        }).mockAutosuggestionResults(SUGGESTIONS);
        cy.intercept("get", /\?/i).as("autosuggestRequest");
        cy.typeIntoInput(
          TestScenarios.valid3wa
        ).assertNumberOfVisibleSuggestions(3);
        cy.hasLoadedElements();
        cy.getAutosuggestOptions().each((opt) =>
          cy.wrap(opt).should("contain", "near")
        );
      });

      it("Then include empty prefix when detected language is not english", () => {
        cy.setup({
          url: "/",
          props: { autosuggest: { apiKey: apiKeys.valid, language: "de" } },
          localisation: {
            htmlLang: "de",
            navigatorLanguage: "de",
          },
        }).mockAutosuggestionResults(SUGGESTIONS);
        cy.intercept("get", /\?/i).as("autosuggestRequest");
        cy.typeIntoInput(
          TestScenarios.valid3wa
        ).assertNumberOfVisibleSuggestions(3);
        cy.hasLoadedElements();
        cy.getAutosuggestOptions().each((opt) =>
          cy.wrap(opt).should("not.contain", "near")
        );
      });
    });
  });

  describe("Props", () => {
    describe("language", () => {
      it('if not passed, should render "near" prefix when detected language is english', () => {
        // Arrange
        const validInput = "f.f.f";
        const enSuggestions = generateAutosuggestOptions({
          language: "en",
        });
        cy.setup({
          url: "/",
          props: { autosuggest: { apiKey: apiKeys.valid } },
          localisation: {
            htmlLang: "en",
            navigatorLanguage: "en",
            navigatorLanguages: ["en", "en-GB"],
          },
          opts: {
            headers: {
              "Accept-Language": "en",
            },
          },
        }).mockAutosuggestionResults(enSuggestions);
        // Act
        cy.typeIntoInput(validInput);
        cy.wait("@mockAutosuggestionResults");
        // Assert
        cy.assertNumberOfVisibleSuggestions(3);
        cy.getAutosuggestNearestPlaces().each((opt) =>
          cy.wrap(opt).should("contain", "near")
        );
      });

      it("if not passed, should render empty prefix when detected language is not english", async () => {
        // Arrange
        const validInput = "f.f.f";
        const frSuggestions = generateAutosuggestOptions({
          language: "fr",
        });
        cy.setup({
          url: "/",
          props: { autosuggest: { apiKey: apiKeys.valid } },
          localisation: {
            htmlLang: "fr-FR",
            navigatorLanguage: "fr-FR",
            navigatorLanguages: ["fr", "fr-FR"],
          },
          opts: {
            headers: {
              "Accept-Language": "fr",
            },
          },
        }).mockAutosuggestionResults(frSuggestions);
        // Act
        cy.typeIntoInput(validInput);
        cy.wait("@mockAutosuggestionResults");
        // Assert
        cy.assertNumberOfVisibleSuggestions(3);
        cy.getAutosuggestNearestPlaces().each((opt) =>
          cy.wrap(opt).should("not.contain", "near")
        );
      });
    });

    it('if passed and is english, should override detected language if not english and render "near" prefix', async () => {
      // Arrange
      const language = "en";
      const validInput = "f.f.f";
      const suggestions = generateAutosuggestOptions({
        language,
      });
      cy.setup({
        url: "/",
        props: { autosuggest: { apiKey: apiKeys.valid, language } },
        localisation: {
          htmlLang: "fr-FR",
          navigatorLanguage: "fr-FR",
          navigatorLanguages: ["fr", "fr-FR"],
        },
        opts: {
          headers: {
            "Accept-Language": language,
          },
        },
      }).mockAutosuggestionResults(suggestions);
      // Act
      cy.typeIntoInput(validInput);
      cy.wait("@mockAutosuggestionResults");
      // Assert
      cy.assertNumberOfVisibleSuggestions(3);
      cy.getAutosuggestNearestPlaces().each((opt) =>
        cy.wrap(opt).should("contain", "near")
      );
    });

    it("if passed and not english, should override detected language if english and render empty prefix", async () => {
      // Arrange
      const language = "fr";
      const validInput = "f.f.f";
      const suggestions = generateAutosuggestOptions({
        language,
      });
      cy.setup({
        url: "/",
        props: { autosuggest: { apiKey: apiKeys.valid, language } },
        localisation: {
          htmlLang: "en-GB",
          navigatorLanguage: "en-GB",
          navigatorLanguages: ["en", "en-GB"],
        },
        opts: {
          headers: {
            "Accept-Language": language,
          },
        },
      }).mockAutosuggestionResults(suggestions);
      // Act
      cy.typeIntoInput(validInput);
      cy.wait("@mockAutosuggestionResults");
      // Assert
      cy.assertNumberOfVisibleSuggestions(3);
      cy.getAutosuggestNearestPlaces().each((opt) =>
        cy.wrap(opt).should("not.contain", "near")
      );
    });
  });
});
