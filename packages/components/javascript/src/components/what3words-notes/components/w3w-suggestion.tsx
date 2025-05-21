import type { FunctionalComponent } from "@stencil/core";
import type { JSXBase } from "@stencil/core/internal";
import { DEFAULTS } from "@javascript-components/lib/constants";
import { h } from "@stencil/core";

import type { AutosuggestOption } from "../../what3words-autosuggest/domain";
import SeaIcon from "../assets/sea.svg";

type W3wSuggestionProps = JSXBase.HTMLAttributes<HTMLLIElement> & {
  tag: string;
  opt: AutosuggestOption;
};

export const W3wSuggestion: FunctionalComponent<W3wSuggestionProps> = ({
  tag,
  opt,
  ...props
}) => {
  return (
    <li {...props}>
      <div class={`${tag}-address`} data-testid="address">
        <what3words-symbol size={14} color={DEFAULTS.iconColor} />
        <div class={`${tag}-words`} data-testid="words">
          {opt.words}
        </div>
      </div>
      <div class={`${tag}-nearest-place`} data-testid="nearest-place">
        <div
          class={`${tag}-nearest-place-text`}
          data-testid="nearest-place-text"
        >
          {opt.nearestPlace ? (
            opt.nearestPlace
          ) : (
            <img class={`${tag}-sea-icon`} src={SeaIcon} alt="Ocean" />
          )}
        </div>
        {opt.distanceToFocusKm && !isNaN(opt.distanceToFocusKm) && (
          <div
            class={`${tag}-nearest-place-distance`}
            data-testid="nearest-place-distance"
          >
            {opt.distanceToFocusKm}km
          </div>
        )}
      </div>
    </li>
  );
};
