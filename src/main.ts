import { createApp } from "vue";
import App from "./App.vue";
import "uno.css";
import router from "@/router";
import { setupElIcons, setupI18n, setupPermission } from "@/plugins";
import { setupStore } from "@/store";
// 本地SVG图标
import "virtual:svg-icons-register";
import "element-plus/theme-chalk/dark/css-vars.css";
import "@/styles/index.scss";
import "uno.css";
import "animate.css";

const app = createApp(App);

//全局注册element图标
setupElIcons(app);

//全局注册store
setupStore(app);
setupI18n(app);
setupPermission();
app.use(router).mount("#app");
