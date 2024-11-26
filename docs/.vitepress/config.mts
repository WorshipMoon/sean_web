import { createContentLoader, defineConfig } from "vitepress";
import { SitemapStream } from "sitemap";
import { createWriteStream } from "node:fs";
import { resolve } from "node:path";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  // base: '/sean_web/',
  title: "Sean何为势官网",
  description:
    "Python, Node.js, Vue, React, CI/CD, Web3, 数据挖掘, 智能合约，办公脚本, 私有化仓库",
  head: [
    ["link", { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" }],
    [
      "link",
      {
        rel: "alternate icon",
        href: "/favicon.ico",
        type: "image/png",
        sizes: "16x16",
      },
    ],
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
    outline: "deep",
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      // { text: "Examples", link: "/Examples/markdown-examples" },
      // { text: "KnowledgeBase", link: "/CICD" },
      {
        text: "相关阅读",
        items: [{ text: "运维", link: "/KnowledgeBase/Ops/CICD" }],
      },
      {
        text: "浅谈浅见",
        items: [{ text: "看山是山", link: "/CasualTalk/看山是山" }],
      },
      {
        text: "技术服务",
        items: [{ text: "业务介绍", link: "/about/business" }],
      },
    ],

    sidebar: {
      // 当用户位于 `Examples` 目录时，会显示此侧边栏
      "/Examples/": [
        {
          text: "Examples",
          collapsed: false,
          items: [
            { text: "Markdown Examples", link: "/Examples/markdown-examples" },
            { text: "Runtime API Examples", link: "/Examples/api-examples" },
          ],
        },
      ],
      "/KnowledgeBase/": [
        {
          text: "运维",
          collapsed: false,
          items: [
            { text: "CICD", link: "/KnowledgeBase/Ops/CICD" },
            {
              text: "Ubuntu扩展分区",
              link: "/KnowledgeBase/Ops/ubuntu-partition",
            },
          ],
        },
      ],
      "/CasualTalk/": [{ text: "看山是山", link: "/CasualTalk/看山是山" }],
      // "/vpn/": [{ text: "vpn", link: "/vpn/index" }],
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/WorshipMoon/sean_web" },
    ],
    // footer: {
    //   message: "",
    //   copyright: `<a href="https://beian.miit.gov.cn/" target="_blank">粤ICP备2021059978号-1</a> Copyright © ${new Date().getFullYear()} - Sean何为势`,
    // },
  },
  lastUpdated: true,
  buildEnd: async ({ outDir }) => {
    const sitemap = new SitemapStream({ hostname: "https://amusi755.com" });
    const pages = await createContentLoader("**/*.md").load();
    const writeStream = createWriteStream(resolve(outDir, "sitemap.xml"));

    sitemap.pipe(writeStream);
    pages.forEach((page) =>
      sitemap.write(
        page.url
          // Strip `index.html` from URL
          .replace(/index.html$/g, "")
          // Optional: if Markdown files are located in a subfolder
          .replace(/^\/docs/, "")
      )
    );
    sitemap.end();

    await new Promise((r) => writeStream.on("finish", r));
  },
});
