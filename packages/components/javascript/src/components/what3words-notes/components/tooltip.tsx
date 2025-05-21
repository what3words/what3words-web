import type { FunctionalComponent } from "@stencil/core";
import { h } from "@stencil/core";

import { Header } from "./header";

interface TooltipProps {
  style?: Record<string, string>;
  tag: string;
  onClose: () => void;
}

export const Tooltip: FunctionalComponent<TooltipProps> = ({
  tag,
  style,
  onClose,
}) => {
  return (
    <section class={{ [`${tag}-tooltip`]: !!tag }} style={style}>
      <Header
        tag={tag}
        onClose={onClose}
        style={{
          backgroundColor: "white",
          borderRadius: "0.5rem",
          margin: "-8px -8px 0 -8px",
        }}
      />
      <slot name="tooltip">
        <h3 class={{ [`${tag}-tooltip-title`]: !!tag }}>Did you know?</h3>
        <p class={{ [`${tag}-tooltip-description`]: !!tag }}>
          You can add a{" "}
          <a
            href="https://delivery.w3w.co"
            target="_blank"
            rel="noopener noreferrer"
          >
            what3words
          </a>{" "}
          address to help our delivery partners find you first time
          <br />
          e.g. ///limit.boom.field
        </p>
      </slot>
    </section>
  );
};
