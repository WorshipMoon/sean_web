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
      () => updateHomePageStyle(location.pathname === "/"),
      { immediate: true }
    );
  },
};
function updateHomePageStyle(value: boolean) {
  if (value) {
    if (homePageStyle) return;
    console.log("updateHomePageStyle");
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
