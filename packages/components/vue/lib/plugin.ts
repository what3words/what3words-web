import { Plugin } from "vue";

import { defineCustomElements } from "@what3words/javascript-components/loader";

export const ComponentLibrary: Plugin = {
  async install() {
    defineCustomElements();
  },
};
