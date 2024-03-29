import { createApp } from "vue";
import App from "./App.vue";
import ElementPlus from "element-plus";
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";
import router from "./router/index.js";

const app = createApp(App);

app.use(ElementPlus);
app.use(router);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}

app.mount("#app");
