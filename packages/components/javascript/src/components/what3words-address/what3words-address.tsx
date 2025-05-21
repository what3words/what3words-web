import { DEFAULTS } from "@javascript-components/lib/constants";
import { Component, h, Prop } from "@stencil/core";

@Component({
  tag: "what3words-address",
  styleUrl: "what3words-address.scss",
})
export class What3wordsAddress {
  @Prop() words: string = DEFAULTS.threeWordAddress;
  @Prop() iconColor: string = DEFAULTS.iconColor;
  @Prop() textColor: string = DEFAULTS.textColor;
  @Prop() size: number = DEFAULTS.addressSize;
  @Prop() target = DEFAULTS.target;
  @Prop() link = DEFAULTS.true;
  @Prop() tooltip = DEFAULTS.true;
  @Prop() tooltipLocation = DEFAULTS.tooltipLocation;
  @Prop() showTooltip = DEFAULTS.false;

  render() {
    const url = `https://map.what3words.com/${this.words}`;
    const attributes = this.link ? { href: url, target: this.target } : {};

    return (
      <span
        {...attributes}
        class={`what3words-address notranslate ${
          this.showTooltip ? "what3words-address_tooltip" : ""
        }`}
        style={{ fontSize: `${this.size}px` }}
      >
        {this.tooltip && (
          <div class="what3words-tooltip-container">
            <div class="what3words-tooltip">
              what3words gives every 3m x 3m in the world a unique 3 word
              address. This one describes the precise {this.tooltipLocation}
              .{" "}
            </div>
          </div>
        )}
        <div class="what3words-address_container">
          <what3words-symbol size={this.size * 1.25} color={this.iconColor} />
          <span
            class="what3words-address_text"
            style={{ color: this.textColor }}
          >
            {this.words}
          </span>
        </div>
      </span>
    );
  }
}
