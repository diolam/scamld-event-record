import { createRouter, createWebHashHistory } from "vue-router";

import Home from "../components/Home.vue";
import Query from "../components/Query.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/", name: "home", component: Home },
    { path: "/query", name: "query", component: Query },
  ],
});

export default router;
