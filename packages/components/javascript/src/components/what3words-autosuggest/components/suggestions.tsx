import type { FunctionalComponent } from "@stencil/core";
import type { JSXBase } from "@stencil/core/internal";
import { Fragment, h } from "@stencil/core";

import type { AutosuggestOption, CustomOption } from "../domain";
import { CustomSuggestion } from "./custom-suggestion";
import { W3wSuggestion } from "./w3w-suggestion";

const c = "what3words-autosuggest";

interface SuggestionsProps {
  class: JSXBase.HTMLAttributes<HTMLDivElement>["class"];
  hoverIndex: number;
  value: string;
  suggestions: AutosuggestOption[];
  options: CustomOption[];
  offsetWidth: number | null;
  onW3wSuggestionSelected(suggestion: AutosuggestOption): () => void;
  onCustomOptionSelected(suggestion: CustomOption): void;
  onMouseOver(suggestion: AutosuggestOption | CustomOption): () => void;
  onMouseOut(): void;
}

export const Suggestions: FunctionalComponent<SuggestionsProps> = ({
  hoverIndex,
  value,
  suggestions,
  options,
  offsetWidth,
  onW3wSuggestionSelected,
  onCustomOptionSelected,
  onMouseOver,
  onMouseOut,
  ...rest
}) => {
  const CustomOptions: FunctionalComponent = () => {
    return (
      <Fragment>
        {options.map((opt, i) => {
          const { description, distance: distanceOpt } = opt;

          const { value: distance, units } = {
            units: "km",
            ...distanceOpt,
          };

          const classes = [`${c}-item`];
          if (value.toLocaleLowerCase() === opt.value.toLocaleLowerCase()) {
            classes.push("match");
          }
          if (hoverIndex === i) classes.push("active");
          const onMouseDown = (e: MouseEvent): void => e.preventDefault();
          const onMouseUp = () =>
            onCustomOptionSelected({
              id: opt.id,
              value: opt.value,
            });
          const onHover = () =>
            onMouseOver({
              id: opt.id,
              value: opt.value,
            });
          return (
            <CustomSuggestion
              distance={distance!}
              units={units}
              description={description!}
              value={opt.value}
              class={classes.join(" ")}
              onMouseDown={onMouseDown}
              onMouseUp={onMouseUp}
              onMouseOver={onHover}
              data-testid={"suggestion-" + i}
            />
          );
        })}
      </Fragment>
    );
  };

  const W3wSuggestions: FunctionalComponent = () => (
    <Fragment>
      {suggestions.map((opt, i) => {
        const classes = [`${c}-item`];
        if (value === opt.words) classes.push("match");
        if (hoverIndex === i) classes.push("active");
        const onMouseDown = (e: MouseEvent): void => e.preventDefault();
        return (
          <W3wSuggestion
            opt={opt}
            class={classes.join(" ")}
            onMouseDown={onMouseDown}
            onMouseUp={onW3wSuggestionSelected(opt)}
            onMouseOver={onMouseOver(opt)}
            onMouseOut={onMouseOut}
            data-testid={"suggestion-" + i}
          />
        );
      })}
    </Fragment>
  );

  const width = offsetWidth ? String(offsetWidth) + "px" : undefined;

  return (
    <div class={rest.class} data-testid="suggestions-wrapper">
      <div
        class={`${c}-items`}
        // Dynamically settings the width of the suggestions if there is an input. If you change the size of the
        // border in autosuggest.scss you must also change it here accordingly.
        style={{ width }}
      >
        {suggestions.length ? <W3wSuggestions /> : null}
        {options.length ? <CustomOptions /> : null}
      </div>
    </div>
  );
};
