import type { FunctionalComponent } from "@stencil/core";
import type { JSXBase } from "@stencil/core/internal";
import { DEFAULTS } from "@javascript-components/lib/constants";
import { t } from "@javascript-components/lib/translation";
import { h } from "@stencil/core";

import type { AutosuggestOption } from "../../what3words-autosuggest/domain";

const c = "what3words-autosuggest";

type W3wSuggestionProps = JSXBase.HTMLAttributes<HTMLDivElement> & {
  opt: AutosuggestOption;
};

export const W3wSuggestion: FunctionalComponent<W3wSuggestionProps> = ({
  opt,
  ...props
}) => {
  const {
    country,
    distanceToFocusKm,
    nearestPlace = "",
    words,
    language,
  } = opt;

  return (
    <div {...props}>
      <div class={`${c}-address`} data-testid="address">
        <what3words-symbol
          size={DEFAULTS.iconSize}
          color={DEFAULTS.iconColor}
        />
        <div class={`${c}-words`} data-testid="words">
          {words}
        </div>
      </div>
      <div class={`${c}-nearest-place`} data-testid="nearest-place">
        {country.toLowerCase() === "zz" ? (
          <div
            class={`${c}-flag ${c}-flag-${country.toLowerCase()}`}
            data-testid="flag"
          />
        ) : null}
        <div class={`${c}-nearest-place-text`} data-testid="nearest-place-text">
          {nearestPlace && (
            <div>
              {t("nearest_place", {
                param: nearestPlace,
                language,
                strict: false,
              })}
            </div>
          )}
          {distanceToFocusKm ? (
            <div
              class={`${c}-nearest-place-distance`}
              data-testid="nearest-place-distance"
            >
              {distanceToFocusKm} km
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
