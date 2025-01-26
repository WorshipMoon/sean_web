import { createContentLoader, defineConfig } from "vitepress";
import { SitemapStream } from "sitemap";
import { createWriteStream } from "node:fs";
import { resolve } from "node:path";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

// 获取根目录文件md作为导航
function getBaseNav(dir: string) {
  const knowledgeBasePath = path.resolve(__dirname, `../${dir}`);
  const files = fs.readdirSync(knowledgeBasePath);

  return files
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const content = fs.readFileSync(
        path.join(knowledgeBasePath, file),
        "utf-8"
      );
      const { data } = matter(content);

      return {
        text: data.title || file.replace(/\.md$/, ""),
        link: `/${dir}/${file.replace(/\.md$/, "")}`,
      };
    });
}
// 在文件顶部添加类型定义
interface SidebarItem {
  text: string;
  collapsed?: boolean;
  items?: SidebarItem[];
  link?: string;
}

function generateSidebarItems(
  dir: string,
  basePath: string = ""
): SidebarItem[] {
  const fullPath = path.resolve(__dirname, `../${dir}`);
  const files = fs.readdirSync(fullPath);
  const items: SidebarItem[] = [];

  for (const file of files) {
    const filePath = path.join(fullPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      const children = generateSidebarItems(
        path.join(dir, file),
        `/${dir}/${file}` // 修改路径格式
      );
      if (children.length) {
        items.push({
          text: file,
          collapsed: false,
          items: children,
        });
      }
    } else if (file.endsWith(".md")) {
      const content = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(content);
      const name = file.replace(/\.md$/, "");

      items.push({
        text: data.title || name,
        link: `/${dir}/${name}`, // 修改路径格式
      });
    }
  }

  // 确保按字母顺序排序，这样可以保证 next/prev 链接的正确性
  return items.sort((a, b) => (a.text || "").localeCompare(b.text || ""));
}

function generateSidebar(dir: string, showParent: boolean = true) {
  const items = generateSidebarItems(dir);
  // 根据 showParent 参数决定是否显示父级
  return showParent
    ? [
        {
          text: dir,
          items: items,
          collapsed: false,
        },
      ]
    : items;
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  // base: '/sean_web/',
  title: "Sean何为势官网",
  description:
    "Python, Node.js, Vue, React, CI/CD, Web3, 数据挖掘, 智能合约，办公脚本, 私有化仓库，AI工作流，知识库平台",
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
          "Python, Node.js, Vue, React, CI/CD, Web3, 数据挖掘, 智能合约，办公脚本, 私有化仓库，AI工作流，知识库平台",
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
        text: "SEO文章专栏",
        items: getBaseNav("SeoColumn"),
        // items: [{ text: "SEO文章专栏", link: "/SeoColumn/" }],
      },
      {
        text: "相关阅读",
        items: [
          { text: "运维", link: "/KnowledgeBase/运维/django-docker" },
          { text: "UI", link: "/KnowledgeBase/UI/miev-nav" },
        ],
      },
      {
        text: "浅谈浅见",
        items: getBaseNav("CasualTalk"),
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
      "/Examples/": generateSidebar("Examples", false),
      "/KnowledgeBase/运维/": generateSidebar("KnowledgeBase/运维", false),
      // "/KnowledgeBase/Ops/": [
      //   {
      //     text: "运维",
      //     collapsed: false,
      //     items: [
      //       { text: "CICD", link: "/KnowledgeBase/Ops/CICD" },
      //       {
      //         text: "Ubuntu扩展分区",
      //         link: "/KnowledgeBase/Ops/ubuntu-partition",
      //       },
      //       {
      //         text: "Django 使用gitaction构建 dokcer镜像",
      //         link: "/KnowledgeBase/Ops/django-docker",
      //       },
      //     ],
      //   },
      // ],
      "/KnowledgeBase/UI/": generateSidebar("KnowledgeBase/UI", false),
      "/CasualTalk/": generateSidebar("CasualTalk", false),
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
