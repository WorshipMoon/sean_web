import DefaultTheme from "vitepress/theme";
// import MyLayout from "./Layout.vue";
import { h, watch } from "vue";
import "./style/index.css";
let homePageStyle: HTMLStyleElement | undefined;

export default {
  extends: DefaultTheme,
  // Layout() {
  //   return h(DefaultTheme.Layout, null, {
  //     "aside-outline-before": () => h(MyLayout),
  //   });
  // },
  enhanceApp({ app, router, siteData }) {
    // ...
    if (typeof window === "undefined") return;

    watch(
      () => router.route.data.relativePath,
      // () => updateHomePageStyle(location.pathname === "/"), // 监听路由变化，更新样式, 改为 首页 时更新样式
      () => updateHomePageStyle(true),
      { immediate: true }
    );

  },
};
function updateHomePageStyle(value: boolean) {
  if (value) {
    if (homePageStyle) return;
    // console.log(location.pathname);
    homePageStyle = document.createElement("style");
    homePageStyle.innerHTML = `
    :root {
      animation: rainbow 5s linear infinite;
    }`;
    document.body.appendChild(homePageStyle);
  } else {
    if (!homePageStyle) return;

    homePageStyle.remove();
    homePageStyle = undefined;
  }
}