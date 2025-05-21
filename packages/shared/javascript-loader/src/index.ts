// DEFAULTS

const DEFAULT_LOADER_OPTIONS: Required<LoaderOptions> = {
  lazy: false,
  script: {
    url: "https://cdn.dev.what3words.com/javascript-components",
    version: "latest",
  },
};
const DEFAULT_SCRIPT_ID = "__what3wordsLoaderScriptId";

// CONSTANTS

const COMPONENT_SELECTORS = {
  autosuggest:
    ':not(div[data-testid="w3w-map-search-slot"]) > what3words-autosuggest', // NOTE: Ensure loader doesn't override map-controlled autosuggest components
  map: `what3words-map`,
  notes: `what3words-notes`,
};
const COMPONENTS_SCRIPT_SELECTOR = 'script[src*="what3words/what3words"]';
const LOADER_SCRIPT_SELECTOR = `script[id*="${DEFAULT_SCRIPT_ID}"]`;
const STATE_KEYS = ["autosuggest", "map", "sdk", "notes"] as const;

// TYPES

export type State = {
  [K in StateKey]: Record<string, string>;
};
type StateKey = (typeof STATE_KEYS)[number];
type LoaderOptions = {
  lazy?: boolean;
  script?: {
    url: string;
    version: string;
  };
};
type EncodedState = string | null;

// HELPER METHODS

function camelCaseToKebabCase(str: string) {
  // convert camelCase/PascalCase to kebab-case: https://stackoverflow.com/a/70226943
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

function camelCaseToSnakeCase(str: string) {
  // convert camelCase/PascalCase to snake_case: https://stackoverflow.com/a/70226943
  return str.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
}

function configureComponents(stateAttributes: Omit<State, "sdk">) {
  console.log("[what3words:loader:configure] started", {
    stateAttributes,
  });

  Object.keys(stateAttributes).forEach((sk) => {
    const elementAttributes = stateAttributes[<Exclude<StateKey, "sdk">>sk];

    const element = document.querySelector(
      COMPONENT_SELECTORS[<Exclude<StateKey, "sdk">>sk]
    );

    if (!element) {
      console.warn(
        `[what3words:loader:configure] ${sk} - element node not found`
      );
      return;
    }

    if (Object.keys(elementAttributes).length) {
      console.log(
        `[what3words:loader:configure] ${sk} - setting element attributes\n`,
        { elementAttributes }
      );
      Object.keys(elementAttributes).forEach((attr) => {
        const value = elementAttributes[attr];

        if (!value.length) {
          return;
        }

        element.setAttribute(attr, value);
      });
    }
  });

  console.log("[what3words:loader:configure] completed");
}

function decodeState(encodedState: EncodedState): State {
  if (!encodedState) {
    throw new Error("TypeError: state string cannot be null/undefined");
  }
  // https://base64.guru/developers/javascript/examples/unicode-strings
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/escape
  return JSON.parse(decodeURIComponent(atob(encodedState)));
}

function encodeState(state: Partial<State>): EncodedState {
  if (!state) {
    console.error("TypeError: state object is missing");
    return null;
  }

  const configIsValid =
    Object.keys(state).reduce(
      (prev, curr) => prev && STATE_KEYS.indexOf(<StateKey>curr) !== -1,
      true
    ) && Object.keys(state).length > 0;

  if (!configIsValid) {
    console.error(
      "TypeError: state contains invalid keys",
      JSON.stringify(state)
    );
    return null;
  }

  // https://base64.guru/developers/javascript/examples/unicode-strings
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/unescape
  const encodedState = btoa(encodeURIComponent(JSON.stringify(state)));

  return encodedState;
}

/**
 * Check DOM for what3words component registrations
 */
function _loaded() {
  const componentRegistrations = Object.keys(STATE_KEYS).reduce(
    (acc, sk) =>
      sk === "sdk"
        ? acc
        : Object.assign(acc, {
            [sk]: customElements.get(`what3words-${sk}`),
          }),
    {} as Record<Exclude<StateKey, "sdk">, CustomElementConstructor | undefined>
  );

  console.log(
    "[what3words:loader:loaded] complete",
    `${JSON.stringify(componentRegistrations)}`
  );

  return componentRegistrations;
}

/**
 * @example
 * // returns {"autosuggest": {"api_key": "TEST-API-KEY", "language": "es", "clip_to_circle": "47.324,335"}
 * parseAttributes({
    autosuggest: {
        apiKey: 'TEST-API-KEY',
        language: 'es',
        clipToCircle: '47.324,335'
      }
    });
  }
 */
function parseAttributes(state: Omit<State, "sdk">) {
  console.log("[what3words:loader:parseAttributes] started", {
    state,
  });

  const parsedAttributes = Object.keys(state).reduce(
    (components, sk) =>
      Object.assign(components, {
        [sk]: Object.keys(state[<Exclude<StateKey, "sdk">>sk]).reduce(
          (attributes, prop) =>
            Object.assign(attributes, {
              // Our legacy (autosuggest, map) and modern (notes) what3words components use different variable casing
              // https://stenciljs.com/docs/properties#variable-casing
              [sk === "notes"
                ? camelCaseToKebabCase(prop)
                : camelCaseToSnakeCase(prop)]:
                state[<Exclude<StateKey, "sdk">>sk][prop],
            }),
          {}
        ),
      }),
    {} as Omit<State, "sdk">
  );

  console.log("[what3words:loader:parseAttributes] complete", {
    parsedAttributes,
  });
  return parsedAttributes;
}

function setupScripts({
  scriptOptions,
  scriptParams,
}: {
  scriptOptions: Record<"url" | "version", string>;
  scriptParams: Record<"key" | "baseUrl" | "callback" | "headers", string>;
}) {
  // if @what3words/javascript-components script exists, early return
  const scriptTags = document.querySelectorAll<HTMLScriptElement>(
    COMPONENTS_SCRIPT_SELECTOR
  );

  if (scriptTags.length) {
    console.warn(
      "[what3words:loader:setup] skipping\n",
      `@what3words/javascript-components script already loaded - ${Array.from(
        scriptTags
      ).map((s) => s.src)}`
    );
    return;
  }

  // if script `url` and `version` are invalid, early return
  const { url, version } = scriptOptions;

  if (!url || !version) {
    console.warn(
      "[what3words:loader:setup] skipping",
      `Missing values - ${JSON.stringify({ scriptOptions, scriptParams })}`
    );
    return;
  }

  console.log(
    "[what3words:loader:setup] started",
    JSON.stringify({ scriptOptions, scriptParams })
  );

  const params = new URLSearchParams(scriptParams);

  const moduleScriptTag = document.createElement("script");
  const noModuleScriptTag = document.createElement("script");

  moduleScriptTag.type = "module";
  moduleScriptTag.id = `${DEFAULT_SCRIPT_ID}_module`;
  moduleScriptTag.async = true;
  moduleScriptTag.src = `${url}@${version}/dist/what3words/what3words.esm.js?${params}`;

  noModuleScriptTag.noModule = true;
  noModuleScriptTag.id = `${DEFAULT_SCRIPT_ID}_nomodule`;
  noModuleScriptTag.async = true;
  noModuleScriptTag.src = `${url}@${version}/dist/what3words/what3words.js?${params}`;

  document.head.appendChild(moduleScriptTag);
  document.head.appendChild(noModuleScriptTag);

  console.log("[what3words:loader:setup] complete");
}

function validateLoaderOptions(loaderOptions: LoaderOptions) {
  const { lazy, script } = loaderOptions;

  const invalidLazy = typeof lazy !== "boolean";
  const invalidScriptElements =
    typeof script === "undefined" ||
    typeof script !== "object" ||
    (typeof script === "object" &&
      !Object.keys(script ?? {}).filter((k) => k === "url" || k === "version"));

  if (invalidLazy) {
    throw new Error("TypeError: lazy must be a boolean");
  }
  if (invalidScriptElements) {
    throw new Error(
      "TypeError: script must be an object containing 'url' and 'version'"
    );
  }

  return { lazy, script };
}

// EXPOSED METHODS

export function createState(newState: Partial<State>) {
  return encodeState(newState);
}

export function getState(): State {
  const params = new URLSearchParams(window.location.search);

  console.log("[what3words:loader:getState] started", {
    params: params.toString(),
  });

  const encodedState = params.get("config") ?? "";
  let state: State = { autosuggest: {}, map: {}, notes: {}, sdk: {} };

  try {
    state = decodeState(encodedState);
    console.log("[what3words:loader:getState] state decoding successful", {
      state,
    });
  } catch (err) {
    console.warn("[what3words:loader:getState] state decoding unsuccessful", {
      encodedState,
      err,
    });
    return state;
  }

  console.log("[what3words:loader:getState] complete", { state });
  return state;
}

export function load(loaderOptions: LoaderOptions) {
  const { lazy, script } = {
    ...DEFAULT_LOADER_OPTIONS,
    ...loaderOptions,
  };

  console.log(
    "[what3words:loader:load] started",
    JSON.stringify(loaderOptions)
  );

  const { sdk: sdkProps, ...stateProps } = getState();
  const stateAttributes = parseAttributes(stateProps);

  // if lazy mode enabled, skip setup and configuration
  if (!lazy) {
    setupScripts({ scriptParams: sdkProps, scriptOptions: script });
    configureComponents(stateAttributes);
  } else {
    console.log("[what3words:loader:load] setup and configuration skipped");
  }

  console.log("[what3words:loader:load] complete");

  return stateAttributes;
}

function entrypoint() {
  // search for @what3words/javascript-loader script tag
  const scriptTags = document.querySelectorAll<HTMLScriptElement>(
    LOADER_SCRIPT_SELECTOR
  );

  // merge all script tag parameters
  const params = Array.from(scriptTags)
    .map((s) => s.src.split("?")[1])
    .join("&");

  // if no script tag present, exit iife-based loading
  if (!scriptTags.length || !!params.length) {
    console.warn(
      "[what3words:loader:entrypoint] @what3words/javascript-loader loading skipped"
    );
    return;
  }

  // override loader options with scriptTag params
  const loaderOptions = [...new URLSearchParams(params)].reduce<
    Required<LoaderOptions>
  >((acc, [key, value]) => Object.assign(acc, { [key]: value }), {
    ...DEFAULT_LOADER_OPTIONS,
  } as Required<LoaderOptions>);

  // initialize validation, setup and configuration
  const { lazy, script } = validateLoaderOptions(loaderOptions);

  console.log("[what3words:loader:entrypoint] started", {
    lazy,
    script,
  });

  const state = getState();
  setupScripts({ scriptParams: state.sdk, scriptOptions: script });

  // if lazy mode enabled, skip configuration
  if (!lazy) {
    const attributes = parseAttributes(state);
    configureComponents(attributes);
  } else {
    console.log("[what3words:loader:entrypoint] configuration skipped");
  }

  console.log("[what3words:loader:entrypoint] completed");
}

window.what3words = Object.assign(window.what3words ?? {}, {
  loader: { load },
});

entrypoint();

declare global {
  interface Window {
    what3words: Record<string, unknown>;
  }
}
