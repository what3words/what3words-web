import type { FunctionalComponent } from "@stencil/core";
import type { JSXBase } from "@stencil/core/internal";
import { h } from "@stencil/core";
import { Fragment } from "@stencil/core/internal";

import type {
  AutosuggestOption,
  CustomOption,
} from "../../what3words-autosuggest/domain";
import SuggestionSkeleton from "../assets/suggestion-skeleton.svg";
import { Header } from "./header";
import { W3wSuggestion } from "./w3w-suggestion";

interface SuggestionsProps {
  tag: string;
  style: JSXBase.HTMLAttributes<HTMLDivElement>["style"];
  hoverIndex: number;
  value: string;
  loading: boolean;
  suggestions: AutosuggestOption[];
  onSuggestionSelected(suggestion: AutosuggestOption): () => void;
  onMouseOver(suggestion: AutosuggestOption | CustomOption): () => void;
  onMouseOut(): void;
  onClose(): void;
}

type W3wSuggestionsProps = Pick<
  SuggestionsProps,
  | "tag"
  | "suggestions"
  | "value"
  | "hoverIndex"
  | "onSuggestionSelected"
  | "onMouseOver"
  | "onMouseOut"
>;

const W3wSuggestions: FunctionalComponent<W3wSuggestionsProps> = ({
  tag,
  suggestions,
  value,
  hoverIndex,
  onSuggestionSelected,
  onMouseOver,
  onMouseOut,
}) => {
  return (
    <Fragment>
      {suggestions.map((opt, i) => {
        const onMouseDown = (e: MouseEvent): void => e.preventDefault();
        return (
          <W3wSuggestion
            key={opt.words}
            class={{
              [`${tag}-item`]: !!tag,
              match: value === opt.words,
              active: hoverIndex === i,
            }}
            tag={tag}
            opt={opt}
            onMouseDown={onMouseDown}
            onMouseUp={onSuggestionSelected(opt)}
            onMouseOver={onMouseOver(opt)}
            onMouseOut={onMouseOut}
            data-testid={"suggestion-" + i}
          />
        );
      })}
    </Fragment>
  );
};

const W3wSuggestionsSkeleton: FunctionalComponent<{ tag: string }> = ({
  tag,
}) => (
  <Fragment>
    <li class={{ [`${tag}-suggestion-skeleton`]: !!tag }}>
      <img src={SuggestionSkeleton} alt="suggestion skeleton" />
    </li>
    <li class={{ [`${tag}-suggestion-skeleton`]: !!tag }}>
      <img src={SuggestionSkeleton} alt="suggestion skeleton" />
    </li>
    <li class={{ [`${tag}-suggestion-skeleton`]: !!tag }}>
      <img src={SuggestionSkeleton} alt="suggestion skeleton" />
    </li>
  </Fragment>
);

export const Suggestions: FunctionalComponent<SuggestionsProps> = ({
  tag,
  hoverIndex,
  value,
  loading,
  suggestions,
  onSuggestionSelected,
  onMouseOver,
  onMouseOut,
  onClose,
  ...props
}) => {
  const showSkeleton = loading && value.length > 0 && suggestions.length === 0;
  const showSuggestions = value.length > 0 && suggestions.length > 0;
  const showHeader = loading || showSuggestions;

  return (
    <ul
      data-testid={`${tag}-suggestions`}
      class={{ [`${tag}-suggestions`]: !!tag }}
      // Dynamically settings the width of the suggestions if there is an input. If you change the size of the
      // border in autosuggest.scss you must also change it here accordingly.
      style={props.style}
    >
      {showSkeleton && <W3wSuggestionsSkeleton tag={tag} />}
      {showSuggestions && (
        <W3wSuggestions
          tag={tag}
          suggestions={suggestions}
          value={value}
          hoverIndex={hoverIndex}
          onMouseOver={onMouseOver}
          onMouseOut={onMouseOut}
          onSuggestionSelected={onSuggestionSelected}
        />
      )}
      {showHeader && <Header tag={tag} onClose={onClose} />}
    </ul>
  );
};
