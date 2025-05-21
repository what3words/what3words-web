import type { FunctionalComponent } from "@stencil/core";
import type { JSXBase } from "@stencil/core/internal";
import { h } from "@stencil/core";

const c = "what3words-autosuggest";

type CustomSuggestionProps = JSXBase.HTMLAttributes<HTMLDivElement> & {
  distance: number;
  units: string;
  description: string;
  value: string;
};

export const CustomSuggestion: FunctionalComponent<CustomSuggestionProps> = ({
  distance,
  units,
  description,
  value,
  ...props
}) => {
  return (
    <div {...props}>
      <div class={`${c}-address`}>
        <div
          class={`${c}-words`}
          data-testid="words-"
          style={{ marginLeft: "16px" }}
        >
          {value}
        </div>
      </div>
      <div class={`${c}-nearest-place`} data-testid="nearest-place">
        <div class={`${c}-nearest-place-text`} data-testid="nearest-place-text">
          <div>{description ? description.trim() : ""}</div>
          {distance ? (
            <div
              class={`${c}-nearest-place-distance`}
              data-testid="nearest-place-distance"
            >
              {distance}
              {units}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
