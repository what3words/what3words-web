import type { FunctionalComponent } from "@stencil/core";
import { h } from "@stencil/core";

interface StatusProps {
  class: string;
  offsetHeight: number | null;
}

export const Status: FunctionalComponent<StatusProps> = (props) => {
  const top = props.offsetHeight
    ? Math.round((props.offsetHeight - 20) / 2) + "px"
    : undefined;

  return (
    <span
      class={props.class}
      data-testid="state"
      // Fix to ensure loading spinner/success are vertically aligned correctly in IE11
      style={{ top }}
    />
  );
};
