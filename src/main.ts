import { createApp } from "vue";
import { createPinia } from "pinia";
import PrimeVue from 'primevue/config';
import "./style.css";
import 'primevue/resources/themes/aura-light-green/theme.css'
import App from "./App.vue";

const app = createApp(App);
const pinia = createPinia();
app.directive("visible", function (el, binding) {
  el.style.visibility = !!binding.value ? "visible" : "hidden";
});
app.use(pinia);
app.use(PrimeVue);
app.mount("#app");
