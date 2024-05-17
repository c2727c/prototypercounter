import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import App from "./App.vue";

const app = createApp(App);
const pinia = createPinia();
app.directive("visible", function (el, binding) {
  el.style.visibility = !!binding.value ? "visible" : "hidden";
});
app.use(pinia);
app.mount("#app");
