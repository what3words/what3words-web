import type { FunctionalComponent } from "@stencil/core";
import { h } from "@stencil/core";

import CloseButton from "../assets/close-button.svg";
import What3wordsLogo from "../assets/what3words-logo.svg";

interface HeaderProps {
  class?: string;
  style?: Record<string, string>;
  tag: string;
  onClose: () => void;
}

export const Header: FunctionalComponent<HeaderProps> = ({
  tag,
  onClose,
  style,
  ...props
}) => {
  return (
    <header
      style={style}
      class={Object.fromEntries(
        Object.entries({
          [`${tag}-header`]: !!tag,
          [String(props.class)]: !!props.class,
        }).filter(([k]) => !["undefined"].includes(k))
      )}
    >
      <img
        class={{ [`${tag}-header-logo`]: !!tag }}
        src={What3wordsLogo}
        height={14}
        alt="what3words logo"
      />
      <button
        class={{ [`${tag}-header-close-button`]: !!tag }}
        type="button"
        aria-label="Close suggestions"
        onClick={onClose}
      >
        <img src={CloseButton} height={16} width={16} alt="close icon" />
      </button>
    </header>
  );
};
