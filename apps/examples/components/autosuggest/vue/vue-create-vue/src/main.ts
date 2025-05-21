import "./assets/main.css";

import { createApp } from "vue";

import { ComponentLibrary } from "@what3words/vue-components";

import App from "./App.vue";

createApp(App).use(ComponentLibrary).mount("#app");
