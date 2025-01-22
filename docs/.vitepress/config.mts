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
        items: [
          { text: "运维", link: "/KnowledgeBase/Ops/CICD" },
          { text: "UI", link: "/KnowledgeBase/UI/miev-nav" },
        ],
      },
      {
        text: "浅谈浅见",
        items: [{ text: "看山是山", link: "/CasualTalk/看山是山" }],
      },
      {
        text: "技术服务",
        items: [
          { text: "业务介绍", link: "/about/business" },
          { text: "外贸商家门店采集", link: "/utility/google-maps-poi" },
          { text: "Hws文件富搜索", link: "/utility/everything-voidtools" },
        ],
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
      "/KnowledgeBase/Ops/": [
        {
          text: "运维",
          collapsed: false,
          items: [
            { text: "CICD", link: "/KnowledgeBase/Ops/CICD" },
            {
              text: "Ubuntu扩展分区",
              link: "/KnowledgeBase/Ops/ubuntu-partition",
            },
            {
              text: "Django 使用gitaction构建 dokcer镜像",
              link: "/KnowledgeBase/Ops/django-docker",
            },
          ],
        },
      ],
      "/KnowledgeBase/UI/": [
        {
          text: "UI",
          collapsed: false,
          items: [
            { text: "仿小米汽车网站导航", link: "/KnowledgeBase/UI/miev-nav" },
          ],
        },
      ],
      "/CasualTalk/": [{ text: "看山是山", link: "/CasualTalk/看山是山" }],
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/WorshipMoon/sean_web" },
    ],
    footer: {
      message: "",
      copyright: `<a href="https://beian.miit.gov.cn/" target="_blank">粤ICP备2021059978号-1</a> Copyright © ${new Date().getFullYear()} - Sean何为势`,
    },
  },
  lastUpdated: true,
  buildEnd: async ({ outDir }) => {
    const sitemap = new SitemapStream({ hostname: "https://sunling729.top" });
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
