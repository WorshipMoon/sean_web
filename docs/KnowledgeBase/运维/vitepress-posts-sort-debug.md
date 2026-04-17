---
title: 记一次 VitePress 博客"最近更新"排序失效的完整调试过程
---

# 记一次 VitePress 博客"最近更新"排序失效的完整调试过程

> 一个看似简单的"按时间排序"需求，背后藏着三个连环坑。

## 背景

博客首页有一个 `TodayPosts` 组件，用来展示最近更新的文章列表，按最后修改时间倒序排列。数据由 `posts.data.mts`（VitePress Data Loader）负责读取并排序。

**现象**：我明明刚改了一篇文章并提交推送，但首页列表里它并没有排到最前面，所有文章的时间都显示"近期更新"，顺序完全乱掉。

---

## 坑一：`fs.statSync().mtime` —— 在 CI 环境中完全不可靠

最初的实现使用文件系统的最后修改时间：

```ts
// ❌ 原始代码
import fs from 'node:fs'

const stat = fs.statSync(srcPath)
timestamp = stat.mtime.getTime()
```

**本地开发**时，保存文件就会更新 `mtime`，看起来没问题。

**但是**，GitHub Actions 执行 `actions/checkout` 做 `git clone` 时，**所有文件的 `mtime` 都会被重置为 checkout 那一刻的时间**，导致所有文章时间戳相同，排序完全随机。

### 修复思路

改用 `git log` 获取每个文件最后一次 **commit** 的时间，这个信息存在 git 历史里，不受 clone 影响：

```ts
// ✅ 第一次修复：execSync 调用 git log
import { execSync } from 'node:child_process'

const result = execSync(
  `git log -1 --format="%ct" -- "${srcPath}"`,
  { encoding: 'utf-8' }
).trim()
timestamp = parseInt(result, 10) * 1000
```

---

## 坑二：Windows `cmd.exe` 把 `%ct` 当环境变量吞掉了

修复部署后，所有文章依然显示"近期更新"。问题没有解决。

通过调试，发现 `git log` 返回了空字符串。原因是：

**在 Windows 的 `cmd.exe` 中，`%ct%` 会被识别为环境变量并展开**。`execSync` 默认通过 shell 执行命令，于是 `--format="%ct"` 里的 `%ct` 被 cmd 尝试展开为环境变量，找不到就变成了空字符串，git 收到的 format 参数变成了 `""`，自然返回空输出。

### 修复思路

改用 `spawnSync`，以**参数数组**的形式传递给 git，完全绕过 shell，`%ct` 就只是普通字符串：

```ts
// ✅ 第二次修复：spawnSync 绕过 shell
import { spawnSync } from 'node:child_process'
import path from 'node:path'

const result = spawnSync(
  'git',
  ['log', '-1', '--format=%ct', '--', srcPath],  // 数组传参，不经过 shell
  { encoding: 'utf-8', cwd: path.dirname(srcPath) }
)
const output = result.stdout?.trim()
timestamp = parseInt(output, 10) * 1000
```

---

## 坑三：`srcPath` 始终是 `undefined`——根本原因

即使改成了 `spawnSync`，问题仍然存在。加入 `console.log` 调试后，终于看到了真相：

```
[DEBUG] NO srcPath for url=/vpn/telegram.html
[DEBUG] NO srcPath for url=/CasualTalk/看山是山.html
[DEBUG] NO srcPath for url=/KnowledgeBase/运维/CICD.html
... （所有文件都一样）
```

**`srcPath` 对每一个文件都是 `undefined`！**

回头查阅 VitePress 文档，发现 `createContentLoader` 返回的 `ContentData` 类型中，**`srcPath` 根本不是一个有保证的标准字段**，在默认配置下它不会被填充。

所以前两次修复的代码都卡在了 `if (srcPath)` 这个判断上，永远走不进去，`timestamp` 永远是 `0`，全部显示"近期更新"。这才是真正的根源。

---

## 最终解决方案

不依赖 `srcPath`，改为**从 `url` 推导出文件的相对路径**，再用 `process.cwd()`（即 git 仓库根目录）作为 `cwd` 运行 `git log`：

```ts
// ✅ 最终方案：从 URL 推导路径，绕开 srcPath
import { createContentLoader } from 'vitepress'
import { spawnSync } from 'node:child_process'

// /vpn/telegram.html  → docs/vpn/telegram.md
// /vpn/              → docs/vpn/index.md
function urlToRelativePath(url: string): string {
  if (url.endsWith('/')) {
    return 'docs' + url + 'index.md'
  }
  return 'docs' + url.replace(/\.html$/, '.md')
}

function getGitTimestamp(relativePath: string): number {
  const result = spawnSync(
    'git',
    ['log', '-1', '--format=%ct', '--', relativePath],
    {
      encoding: 'utf-8',
      cwd: process.cwd(), // git 仓库根目录，本地和 CI 一致
    }
  )
  const output = result.stdout?.trim()
  return output ? parseInt(output, 10) * 1000 : 0
}

export default createContentLoader('**/*.md', {
  transform(raw) {
    return raw
      .filter(({ url }) => url !== '/' && !url.includes('api-examples'))
      .map(({ url, frontmatter }) => {
        const relativePath = urlToRelativePath(url)
        const timestamp = getGitTimestamp(relativePath)
        return {
          title: frontmatter.title || '无标题',
          url,
          time: timestamp,
          dateString: timestamp > 0
            ? new Date(timestamp).toLocaleDateString('zh-CN', {
                year: 'numeric', month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit'
              })
            : '近期更新'
        }
      })
      .sort((a, b) => b.time - a.time)
      .slice(0, 10)
  }
})
```

---

## 注意事项

### CI 必须拉取完整 git 历史

`git log` 依赖完整的提交历史。如果 `fetch-depth` 不为 `0`，浅克隆会导致大量文件找不到历史，返回空结果。

```yaml
# .github/workflows/deploy.yml
- name: checkout
  uses: actions/checkout@v4
  with:
    fetch-depth: 0  # ← 必须，否则 git log 取不到历史
```

### 排序基于 commit 时间，不是保存时间

修改文件后，**必须 `git commit` 才会更新排序**，仅仅保存文件不会有效果。

### 本地调试需重启 dev server

VitePress 的 data loader 只在服务器**启动时**运行一次，修改 md 文件或 data loader 后需要重启 `npm run docs:dev` 才能看到更新后的排序。

---

## 调试思路复盘

遇到"排序不对"这类问题时，直觉容易让人猜代码逻辑，但猜测往往浪费时间。这次用了两步定位法：

### 第一步：用独立脚本验证工具本身

把怀疑的核心调用抽出来，写一个单独的 `debug-git.mjs`，在 Node.js 里直接运行：

```js
// debug-git.mjs
import { spawnSync } from 'node:child_process'
import path from 'node:path'

const srcPath = String.raw`G:\node-pro\sean_web\docs\vpn\telegram.md`

const result = spawnSync(
  'git',
  ['log', '-1', '--format=%ct', '--', srcPath],
  { encoding: 'utf-8', cwd: path.dirname(srcPath) }
)
console.log('stdout:', JSON.stringify(result.stdout))  // "1776393358\n"
console.log('stderr:', JSON.stringify(result.stderr))
console.log('status:', result.status)
console.log('error:', result.error)
```

```bash
node debug-git.mjs
```

输出 `"1776393358\n"`，证明 **git 命令本身没有问题**，问题一定出在 VitePress 内部。

### 第二步：在 data loader 里加 console.log

直接在 `posts.data.mts` 的 `transform` 里打印每个文件的关键变量：

```ts
console.log(`[DEBUG] url=${url} | srcPath=${srcPath} | stdout=${JSON.stringify(result.stdout)}`)
```

重启 dev server 后，终端里立刻看到：

```
[DEBUG] NO srcPath for url=/vpn/telegram.html
[DEBUG] NO srcPath for url=/CasualTalk/看山是山.html
...
```

**所有文件的 `srcPath` 都是 `undefined`。** 根本原因暴露。

### 两步的价值

| 步骤 | 验证了什么 |
|---|---|
| 独立脚本 `debug-git.mjs` | **工具没问题**：`spawnSync` + `git log` 能正常返回时间戳 |
| `console.log` in data loader | **参数有问题**：`srcPath` 在 VitePress 运行时始终为 `undefined` |

前者排除外部依赖，后者定位内部状态。两步缺一，都会在错误的地方继续猜测。

> 核心教训：**在加日志之前，不要猜测。** 先用最小化的独立脚本验证工具，再用日志观察运行时状态。

---

## 总结：三个坑对照表

| 坑 | 现象 | 原因 | 修复 |
|---|---|---|---|
| 1 | CI 部署后排序错乱 | `fs.statSync().mtime` 在 git clone 时被重置 | 改用 `git log` 获取 commit 时间 |
| 2 | 所有文章显示"近期更新" | Windows `cmd.exe` 吞掉 `%ct` 变量 | 改用 `spawnSync` 数组传参绕过 shell |
| 3 | 所有文章显示"近期更新" | `srcPath` 始终为 `undefined` | 从 `url` 推导文件路径，不依赖 `srcPath` |

调试过程的核心教训：**在加日志之前，不要猜测**。最终靠 `console.log` 打出 `[DEBUG] NO srcPath for url=...` 才找到根本原因，前两次修复都是在治标。
