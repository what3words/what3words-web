import type { VNode } from "@stencil/core";
import type { FunctionalUtilities } from "@stencil/core/internal";

// BUG: StencilJS types conflict with base JSX, this declaration serves as a hacky fix - https://github.com/ionic-team/stencil/issues/5306#issuecomment-1924152084
declare module "@stencil/core" {
  export namespace h.JSX {
    type Element = VNode;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface FunctionalComponent<T = {}> {
    (props: T, children: VNode[], utils: FunctionalUtilities): VNode;
  }
}
