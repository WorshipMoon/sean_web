import DefaultTheme from "vitepress/theme";
// import MyLayout from "./Layout.vue";
import { h, watch, onMounted, nextTick } from "vue";
import { useRoute } from "vitepress";
import "./style/index.css";
let homePageStyle: HTMLStyleElement | undefined;
import Layout from "./Layout.vue";
import mediumZoom from "medium-zoom";

export default {
  // extends: DefaultTheme,
  Layout,
  // Layout() {
  //   return h(DefaultTheme.Layout, null, {
  //     "aside-outline-before": () => h(MyLayout),
  //   });
  // },
  setup() {
    const route = useRoute();
    const initZoom = () => {
      mediumZoom("[data-zoomable]", { background: "var(--vp-c-bg)" });
      // mediumZoom(".main img", { background: "var(--vp-c-bg)" });
    };

    onMounted(() => {
      initZoom();
    });

    watch(
      () => route.path,
      () => nextTick(() => initZoom())
    );
  },
  markdown: {
    image: {
      // 默认禁用；设置为 true 可为所有图片启用懒加载。
      lazyLoading: true,
    },
  },
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
