/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

import { createState, State } from "@what3words/javascript-loader";

import {
  AutosuggestOption,
  autosuggestSelectionURL,
  autosuggestURL,
  convertToCoordinatesURL,
  DEFAULTS,
  generateAutosuggestOptions,
  generateCoordinateFromWords,
  utilisationUrl,
} from "../fixtures";

const baseUrl = Cypress.config("baseUrl") ?? "http://localhost:8080";

const HEADERS = (req: any) => ({
  ...req.headers,
  "Access-Control-Allow-Origin": window.location.origin,
  "Access-Control-Allow-Headers": "*",
});

interface SetupProps {
  url: string;
  props?: Partial<State>;
  opts?: Partial<Omit<Cypress.VisitOptions, "url" | "onBeforeLoad">>;
  callback?: () => void;
  localisation?: {
    navigatorLanguage?: string;
    navigatorLanguages?: string[];
    htmlLang?: string;
  };
}

interface HasLoadedElementsProps {
  ignoreInput?: boolean;
  ignoreState?: boolean;
  ignoreOptions?: boolean;
}

Cypress.Commands.add(
  "setup",
  ({ url, props = {}, callback, localisation, opts = {} }: SetupProps) => {
    // Intercept all calls to utilisation-api
    cy.intercept("POST", `${utilisationUrl}?*`, (req) => req.reply(200));
    cy.intercept("PATCH", `${utilisationUrl}?*`, (req) => req.reply(200));

    const state = createState(props);

    cy.visit({
      ...opts,
      qs: {
        config: state?.length ? state : "",
      },
      url,
      onBeforeLoad(win: Cypress.AUTWindow) {
        if (props.sdk?.callback && props.sdk.callback.length > 0 && callback) {
          (win as { [key: string]: any })[props.sdk.callback] = callback;
        }
        if (localisation) {
          const { navigatorLanguage, navigatorLanguages, htmlLang } =
            localisation;
          if (navigatorLanguage) {
            Object.defineProperty(win.navigator, "language", {
              value: navigatorLanguage,
            });
          }
          if (navigatorLanguages) {
            Object.defineProperty(win.navigator, "languages", {
              value: navigatorLanguages,
            });
            Object.defineProperty(win.navigator, "accept_languages", {
              value: navigatorLanguages,
            });
          }
          if (htmlLang) {
            win.document.documentElement.lang = htmlLang;
          }
        }
        cy.stub(win.console, "log").as("consoleLog");
        cy.stub(win.console, "error").as("consoleError");
        cy.stub(win.console, "warn").as("consoleWarn");
      },
    });

    cy.window().should("not.have.prop", "willReload"); // If flag is gone then demo page has reloaded
  }
);

Cypress.Commands.add(
  "hasLoadedElements",
  (ignores: HasLoadedElementsProps = {}) => {
    const {
      ignoreInput = false,
      ignoreState = false,
      ignoreOptions = false,
    } = ignores;

    if (!ignoreInput)
      cy.get("what3words-autosuggest")
        .find("[data-testid=input-wrapper]")
        .should("exist");

    if (!ignoreState)
      cy.get("what3words-autosuggest")
        .find("[data-testid=input-wrapper]")
        .find("[data-testid=state]")
        .should("exist");

    if (!ignoreOptions)
      cy.get("what3words-autosuggest")
        .find("[data-testid=suggestions-wrapper]")
        .should("exist");
  }
);

Cypress.Commands.add("mockAutosuggestionError", (code = 500, message = "") => {
  cy.intercept("OPTIONS", `${autosuggestURL}?*`, (req) => req.reply(code));
  cy.intercept(`${autosuggestURL}?*`, (req) =>
    req.reply(code, message, HEADERS(req))
  ).as("mockAutosuggestionError");
});

Cypress.Commands.add(
  "mockAutosuggestionResults",
  (mocks?: AutosuggestOption[]) => {
    const pathname = new URL(autosuggestURL).pathname;
    const key = "VALID-API-KEY";

    cy.intercept(
      {
        method: "OPTIONS",
        pathname: new URL(autosuggestURL).pathname,
        query: {
          key,
        },
      },
      (req) => req.reply(200, {}, HEADERS(req))
    );
    cy.intercept(
      {
        method: "GET",
        pathname,
        query: {
          key,
        },
      },
      (req) => {
        req.reply(
          200,
          { suggestions: mocks || generateAutosuggestOptions({}) },
          HEADERS(req)
        );
      }
    ).as("mockAutosuggestionResults");
  }
);

Cypress.Commands.add(
  "mockCoordinateResults",
  (opts: { words?: string; capped?: boolean } = { capped: false }) => {
    const { words, capped } = opts;
    cy.intercept(
      {
        method: "OPTIONS",
        pathname: new URL(convertToCoordinatesURL).pathname,
        query: {
          key: "VALID-API-KEY",
        },
      },
      (res) => res.reply(200, {}, HEADERS(res))
    );
    cy.intercept(
      {
        method: "GET",
        pathname: new URL(convertToCoordinatesURL).pathname,
        query: {
          key: "VALID-API-KEY",
        },
      },
      (req) => {
        const query = new URLSearchParams(req.url) as any;
        req.reply(
          capped ? 402 : 200,
          capped
            ? { error: { message: DEFAULTS.c2cErrorMessage } }
            : generateCoordinateFromWords(words ?? query.get("words")),
          HEADERS(req)
        );
      }
    ).as("mockCoordinateResults");
  }
);

Cypress.Commands.add(
  "mockFormSubmit",
  (callback: (body: any, req: any) => void = () => null) => {
    cy.intercept("post", baseUrl, (req) =>
      callback(Object.fromEntries(new URLSearchParams(req.body)), req)
    ).as("mockFormSubmit");
  }
);

Cypress.Commands.add("mockAutosuggestSelection", (status = 200) => {
  cy.intercept("options", `${autosuggestSelectionURL}?*`, (res) =>
    res.reply(status, {}, HEADERS(res))
  );
  cy.intercept(`${autosuggestSelectionURL}?*`, (res) =>
    res.reply(status, {}, HEADERS(res))
  ).as("mockAutosuggestSelection");
});

Cypress.Commands.add("assertNumberOfVisibleSuggestions", (total: number) => {
  cy.get("what3words-autosuggest")
    .find("[data-testid=suggestions-wrapper]")
    .should("exist");

  if (total > 0) {
    cy.get("what3words-autosuggest")
      .find("[data-testid=suggestions-wrapper]")
      .children()
      .children()
      .should("have.length", total);
    cy.get("what3words-autosuggest")
      .find("[data-testid=suggestions-wrapper]")
      .children()
      .children()
      .find("[data-testid=what3words-symbol]")
      .should("exist");
  }
});

Cypress.Commands.add("typeIntoInput", (text: string) => {
  cy.getInput().focus();
  cy.getInput().type(text, { delay: 100 }); // adding a delay as a workaround fix for this cypress bug: https://github.com/cypress-io/cypress/issues/5480#issuecomment-574619665
  cy.getInput().focus();
});

Cypress.Commands.add("blurInput", () => {
  cy.getInput().click();
  cy.getInput().blur();
});

Cypress.Commands.add("pasteIntoInput", (text: string) => {
  cy.getInput().trigger("click", "right");
  cy.getInput().trigger("paste", "topRight", {
    clipboardData: { getData: () => text },
  });
});

Cypress.Commands.add("getInput", () => {
  cy.get("what3words-autosuggest").find("input");
});

Cypress.Commands.add("getSvg", (callback: () => void = () => {}) => {
  cy.get("what3words-autosuggest")
    .find("what3words-symbol")
    .find("svg")
    .then(callback);
});

Cypress.Commands.add(
  "triggerAutosuggestOption",
  (action: string, index = 0) => {
    if (index > 2) index = 2;
    cy.get("what3words-autosuggest")
      .find("[data-testid=suggestions-wrapper]")
      .find(`[data-testid^=suggestion-${index}]`)
      .trigger(action);
  }
);

Cypress.Commands.add("selectAutosuggestOption", (index = 0) => {
  cy.get("what3words-autosuggest")
    .find("[data-testid=suggestions-wrapper]")
    .find(`[data-testid^=suggestion-${index}]`)
    .click();
});

Cypress.Commands.add("getAutosuggestOptions", () => {
  cy.get("what3words-autosuggest")
    .find("[data-testid=suggestions-wrapper]")
    .find("[data-testid^=suggestion-]");
});

Cypress.Commands.add("getAutosuggestNearestPlaces", () => {
  cy.get("what3words-autosuggest")
    .find("[data-testid=suggestions-wrapper]")
    .find("[data-testid^=nearest-place-text]");
});

Cypress.Commands.add("assertErrorMessage", (message?: string) => {
  cy.get("[data-testid=error-wrapper]");

  if (message) cy.get("[data-testid=error]").contains(message);
});

Cypress.Commands.add("assertNoErrorMessage", () => {
  cy.get("[data-testid=error-wrapper]", { timeout: 5000 }).should("not.exist");
});

// An open issue exists with passing `prevSubject` to custom commands in TS
// https://github.com/cypress-io/add-cypress-custom-command-in-typescript/issues/4
// TODO: Not currently used in tests - verify if this works in future cypress release (fails with v12.8.1)
// Cypress.Commands.add(
//   'dragAndDropTo',
//   { prevSubject: 'element' },
//   ({
//     subject,
//     targetEl,
//     dt = {
//       types: [],
//     },
//   }: dragAndDropToProps) => {
//     // subject may be defined or undefined: https://docs.cypress.io/api/cypress-api/custom-commands#Custom-Dual-Command
//     if (subject) {
//       cy.wrap(subject).trigger('dragstart', { dataTransfer: dt });
//       cy.get(targetEl).trigger('drop');
//       cy.get(targetEl).trigger('dragend');
//     }
//   }
// );

declare global {
  namespace Cypress {
    interface Chainable {
      setup({ url, props, opts, callback }: SetupProps): Chainable<void>;
      hasLoadedElements(ignores?: HasLoadedElementsProps): Chainable<void>;
      mockAutosuggestionError(code: number, message?: string): Chainable<void>;
      mockAutosuggestionResults(mocks?: AutosuggestOption[]): Chainable<void>;
      mockCoordinateResults(opts?: {
        words?: string;
        capped?: boolean;
      }): Chainable<void>;
      mockFormSubmit(callback: (body: any, req: any) => void): Chainable<void>;
      mockAutosuggestSelection(status?: number): Chainable<void>;
      assertNumberOfVisibleSuggestions(total: number): Chainable<void>;
      typeIntoInput(text: string): Chainable<void>;
      blurInput(): Chainable<void>;
      pasteIntoInput(text: string): Chainable<void>;
      getInput(): Chainable<void>;
      getSvg(callback: () => void): Chainable<void>;
      triggerAutosuggestOption(action: string, index: number): Chainable<void>;
      selectAutosuggestOption(index: number): Chainable<void>;
      getAutosuggestNearestPlaces(): Chainable<void>;
      getAutosuggestOptions(): Chainable<void>;
      assertErrorMessage(message: string): Chainable<void>;
      assertNoErrorMessage(): Chainable<void>;
      //   dragAndDropTo({
      //     subject,
      //     targetEl,
      //     dt,
      //   }: dragAndDropToProps): Chainable<void>;
    }
  }
}
