import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import PrimeVue from 'primevue/config';
import { GridLayout, GridItem } from 'grid-layout-plus'
import "./style.css";
import 'primevue/resources/themes/aura-light-green/theme.css'
import App from "./App.vue";

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.directive("visible", function (el, binding) {
  el.style.visibility = !!binding.value ? "visible" : "hidden";
});
app.use(pinia);
app.use(PrimeVue);
app.component('GridLayout', GridLayout);
app.component('GridItem', GridItem);
app.mount("#app");
