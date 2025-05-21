import type { FunctionalComponent } from "@stencil/core";
import { Fragment, h } from "@stencil/core";

const c = "what3words-autosuggest";

interface ErrorMessageProps {
  error: Error | null;
  offsetWidth: number | null;
}

export const ErrorMessage: FunctionalComponent<ErrorMessageProps> = (props) => {
  if (!props.error) return <Fragment></Fragment>;

  const width = props.offsetWidth
    ? String(props.offsetWidth) + "px"
    : undefined;

  return (
    <div
      class={`${c}-error-wrapper`}
      style={{ width }}
      data-testid="error-wrapper"
    >
      <div class={`${c}-error`} data-testid="error">
        <div class={`${c}-message`}>{props.error.message}</div>
      </div>
    </div>
  );
};
