import DefaultTheme from "vitepress/theme";
// import MyLayout from "./Layout.vue";
// import { h } from "vue";
import "./var.css";
export default {
  extends: DefaultTheme,
  // Layout() {
  //   return h(DefaultTheme.Layout, null, {
  //     "aside-outline-before": () => h(MyLayout),
  //   });
  // },
  enhanceApp({ app, router, siteData }) {
    // ...
  },
};
