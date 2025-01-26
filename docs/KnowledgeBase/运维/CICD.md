---
title: CICD Vitepress gitactions stiemap
---
# CICD Vitepress gitactions stiemap
## 简单场景

### Vitepress gitactions 和 stiemap 配置

####  使用gitactions部署vitepress
```yml
# https://vitepress.dev/zh/guide/deploy#github-pages
# .github\workflows\deploy.yml
name: sean_web

on: push
permissions:
  contents: write

jobs:
  # 构建工作
  npm-build:
    runs-on: ubuntu-latest
    steps:
      - name: checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0 # 如果未启用 lastUpdated，则不需要

      - name: 设置Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: 安装依赖并打包
        run: |
          npm ci
          npm run docs:build

      # - name: 复制 CNAME 文件到生成的静态文件目录
      #   run: |
      #     cp CNAME docs/.vitepress/dist/CNAME

      - name: 编译代码到另一个分支
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          branch: gh-pages # 目标分支
          folder: docs/.vitepress/dist # 源目录

  deploy-to-server:
    needs: npm-build
    runs-on: ubuntu-latest

    steps:
      - name: checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
          ref: gh-pages
      - name: 部署到服务器
        uses: appleboy/scp-action@master
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          source: "."
          target: "/opt/1panel/apps/openresty/openresty/www/sites/sunling729.top/index"
          rm: true
```
#### sitemap 配置
```ts
// docs\.vitepress\config.mts
export default defineConfig({
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
```
