/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SDK } from "@javascript-components/lib/sdk";
import {
  ScriptInitParameter,
  SESSION_ID_KEY,
} from "@javascript-components/lib/constants";
import { sdk } from "@javascript-components/lib/sdk";
import utilisation from "@javascript-components/lib/utilisation";
import { getScriptInitOptions } from "@javascript-components/lib/utils";

import type { ApiVersion } from "@what3words/api";

declare global {
  interface Window {
    [callback: string]: ((sdk?: SDK) => void) | undefined;
    what3words: SDK;
    what3words_session_id: string;
    w3w?: {
      callback?: string;
      key?: string;
      host?: string;
      version?: `${ApiVersion}`;
      headers?: Record<string, string>;
    };
  }
}

/**
 * This is the initialization function that gets called when the SDK is first loaded. This is actually the entrypoint
 * to the SDK. This is always called when the script is loaded on first load, and only once on first load.
 *
 * 1. The SDK when loaded first pulls any of the parameters provided when it was loaded and sets the options for them
 *    for API requests using the SDK.
 * 2. The SDK is also attached to the window DOM if it is available. (It currently does not rety in the case of failure
 *    or if the DOM is not yet accessible.)
 * 3. The callback if provided and available is called at the end of the pre-load script.
 *
 * TODO:
 * - Add a retry for attaching SDK to window with some backoff
 * - Could add some monitoring here to inform us of SDK usage. (Added what3words_session_id to the window - more needed)
 * - Any other async pre-load behaviour should occur here. See https://stenciljs.com/docs/config#globalscript
 */
export default async function () {
  const win = window;

  const { w3w = {} } = win;
  const { callback, key, host, version, headers } = w3w;
  const options = getScriptInitOptions();
  const apiKey = key ?? (options[ScriptInitParameter.KEY] as string);
  if (apiKey) {
    sdk.api.setApiKey(apiKey);
    utilisation.setApiKey(apiKey);
  }
  if (host || options[ScriptInitParameter.BASEURL]) {
    sdk.api.setConfig({
      host: host ?? (options[ScriptInitParameter.BASEURL] as string),
    });
  }
  if (version || options[ScriptInitParameter.VERSION]) {
    sdk.api.setConfig({
      apiVersion: version ?? (options[ScriptInitParameter.VERSION] as any),
    });
  }
  if (headers) {
    sdk.api.setConfig({ headers });
  }

  /**
   * The next few lines attach to the global window the JS api wrapper and the script session ID. This should be
   * attached to all subsequent API requests even if used only via the raw JS wrapper, which currently it won't be.
   * If we decide to do this the header should be renamed to something less component related and we should also bear
   * in mind that we would lose the context of the component in this header so it should live separately to the
   * component header. For now, as this library is most likely only ever to be used for the autosuggest component it
   * makes little use in looking at this now, but as the components grow and adoption there may be greater need for
   * tracking at a script/request level as well as at the component level.
   */
  // Attach SDK to the window and unique session ID for the script
  win.what3words = sdk;

  /**
   * Using `sessionStorage` API in order for the session id to persist whilst a given session is active.
   */
  if (!win.sessionStorage.getItem(SESSION_ID_KEY)) {
    const { v4 } = await import("uuid");
    win.sessionStorage.setItem(
      SESSION_ID_KEY,
      v4({
        rng: () => {
          const bytes = [];
          for (let i = 0; i < 16; i++) {
            bytes.push(Math.round(Math.random() * 255));
          }
          return bytes;
        },
      })
    );
  }

  win.what3words_session_id = win.sessionStorage.getItem(
    SESSION_ID_KEY
  ) as string;

  // If a callback has been specified and exists then call it here.
  if (callback && typeof win[callback] === "function") {
    win[callback](sdk);
  }
  if (
    options[ScriptInitParameter.CALLBACK] &&
    typeof win[options[ScriptInitParameter.CALLBACK] as string] === "function"
  ) {
    win[options[ScriptInitParameter.CALLBACK] as string]?.();
  }
}
