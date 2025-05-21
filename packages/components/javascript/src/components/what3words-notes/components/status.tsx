import type { FunctionalComponent } from "@stencil/core";
import { h } from "@stencil/core";

import Checkmark from "../assets/checkmark.svg";
import What3wordsLogo from "../assets/what3words-logo.svg";

interface StatusProps {
  tag: string;
  isLoadingSelected3waCount: boolean;
  selected3waCount: number;
  showHintsTooltip: boolean;
  toggleTooltip: () => void;
}

export const Status: FunctionalComponent<StatusProps> = ({
  tag,
  isLoadingSelected3waCount,
  selected3waCount,
  showHintsTooltip,
  toggleTooltip,
}) => {
  return (
    <button
      type="button"
      class={{
        [`${tag}-status`]: !!tag,
        showHintsTooltip,
      }}
      onClick={toggleTooltip}
      data-testid="status"
    >
      <img
        class={{ [`${tag}-status-logo`]: !!tag }}
        src={What3wordsLogo}
        alt="what3words logo"
      />
      <div
        class={{
          [`${tag}-status-indicator`]: !!tag,
        }}
      >
        <span
          class={{
            [`${tag}-status-count`]: !!tag,
            show: selected3waCount > 1 && !isLoadingSelected3waCount,
          }}
          data-testid="status-count"
        >
          {selected3waCount > 99 ? "∞" : selected3waCount}
        </span>
        <img
          class={{
            [`${tag}-status-valid`]: !!tag,
            show: selected3waCount === 1 || isLoadingSelected3waCount,
          }}
          src={Checkmark}
          alt="Valid what3words address"
          data-testid="status-valid"
        />
      </div>
    </button>
  );
};
