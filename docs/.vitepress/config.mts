import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  // base: '/sean_web/',
  title: "Sean何为势官网",
  description:
    "Python, Node.js, Vue, React, CI/CD, Web3, 数据挖掘, 智能合约，办公脚本, 私有化仓库",
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
    search: {
      provider: "local",
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Examples", link: "/Examples/markdown-examples" },
      // { text: "About", link: "/about" },
      {
        text: 'About',
        items: [
          { text: '业务介绍', link: '/about/business' },
          { text: 'Item B', link: '/item-2' },
          { text: 'Item C', link: '/item-3' }
        ]
      }
    ],

    sidebar: {
      // 当用户位于 `Examples` 目录时，会显示此侧边栏
      "/Examples/": [
        {
          text: "Examples",
          items: [
            { text: "Markdown Examples", link: "/Examples/markdown-examples" },
            { text: "Runtime API Examples", link: "/Examples/api-examples" },
          ],
        },
      ],
    },
    socialLinks: [{ icon: "github", link: "https://github.com/WorshipMoon/sean_web" }],
    footer: {
      message: "",
      copyright:
        `<a href="https://beian.miit.gov.cn/" target="_blank">粤ICP备2021059978号-1</a> Copyright © ${new Date().getFullYear()} - Sean何为势`,
    },
  },
});
