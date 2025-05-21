import { createState } from "@what3words/javascript-loader";

const EMBED_CONFIG_MAP = {
  codesandbox: {
    // https://codesandbox.io/docs/learn/legacy-sandboxes/embedding#embed-options
    paramKey: "initialpath",
  },
};

let embeddedUrl;

const iframe = document.querySelector(
  'iframe[title="component-playground-embed"]'
);

const configuratorForm = document.querySelector("#configurator-form");
const embedderForm = document.querySelector("#embedded-application-form");

embedderForm.addEventListener("submit", (e) => {
  e.preventDefault();
  e.stopPropagation();

  const formData = new FormData(e.target);
  const jsonData = Object.fromEntries(formData.entries());
  console.log(
    "what3words:playground:embedder:submittedForm",
    JSON.stringify(jsonData)
  );

  embeddedUrl = jsonData.embedUrl;

  iframe.src = embeddedUrl;
  iframe.removeAttribute("srcdoc");
});

configuratorForm.addEventListener("submit", (e) => {
  e.preventDefault();
  e.stopPropagation();

  const formData = new FormData(e.target);
  const jsonData = Object.fromEntries(formData.entries());
  console.log(
    "what3words:playground:configurator:submittedForm",
    JSON.stringify(jsonData)
  );

  let parsedParams = {};
  Object.entries(jsonData).forEach(([k, v]) => {
    const [configRoot, rootParam] = k.split(".");
    parsedParams[configRoot] = parsedParams[configRoot] ?? {};
    parsedParams[configRoot][rootParam] = v;
  });

  console.log(
    "what3ords:playground:configurator:parsedParams",
    JSON.stringify(parsedParams)
  );

  const state = createState(parsedParams);

  let params = `?config=${state}`;
  Object.keys(EMBED_CONFIG_MAP).forEach((embedHost) => {
    if (embeddedUrl.includes(embedHost)) {
      params = `?${EMBED_CONFIG_MAP[embedHost].paramKey}=${params}`;
    }
  });

  iframe.src = `${embeddedUrl}${params}`;
});
