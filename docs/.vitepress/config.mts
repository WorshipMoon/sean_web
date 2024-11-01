import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  // base: '/sean_web/',
  title: "孙凌的博客",
  description: "何为势",
  head: [
    [
      "meta",
      {
        name: "keywords",
        content:
          "Python, Node.js, Vue, React, CI/CD, Web3, 数据挖掘, 智能合约，办公脚本, 私有化仓库",
      },
    ],
  ],

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Examples", link: "/Examples/markdown-examples" },
      { text: "About", link: "/about" },
    ],

    sidebar: {
      // 当用户位于 `Examples` 目录时，会显示此侧边栏
      "/Examples/": [
        {
          text: "Examples",
          items: [
            { text: "Markdown Examples", link: "/markdown-examples" },
            { text: "Runtime API Examples", link: "/api-examples" },
          ],
        },
      ],
    },
    socialLinks: [{ icon: "github", link: "" }],
    footer: {
      message: "",
      copyright:
        '<a href="https://beian.miit.gov.cn/" target="_blank">粤ICP备2021059978号-1</a> Copyright © 2019 - Sean',
    },
  },
});
