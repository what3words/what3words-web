import { DEFAULTS } from "@javascript-components/lib/constants";
import { Component, h, Prop } from "@stencil/core";

@Component({
  tag: "what3words-symbol",
  styleUrl: "what3words-symbol.scss",
})
export class What3wordsSymbol {
  @Prop() color: string = DEFAULTS.iconColor;
  @Prop() size: number = DEFAULTS.symbolSize;

  render() {
    return (
      <svg
        viewBox="0 0 32 32"
        class="what3words-logo"
        style={{
          color: this.color,
          width: `${this.size}px`,
          height: `${this.size}px`,
        }}
        data-testid="what3words-symbol"
      >
        <path
          fill="currentColor"
          d="M10.7,4h2L4,28H2L10.7,4z M19.7,4h2L13,28h-2L19.7,4z M28.7,4h2L22,28h-2L28.7,4z"
        />
      </svg>
    );
  }
}
