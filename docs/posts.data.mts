// posts.data.mts
import { createContentLoader } from 'vitepress'
import { spawnSync } from 'node:child_process'

// 将 VitePress URL 转换为相对于 git 根目录的文件路径
// /vpn/telegram.html  → docs/vpn/telegram.md
// /vpn/              → docs/vpn/index.md
function urlToRelativePath(url: string): string {
  if (url.endsWith('/')) {
    return 'docs' + url + 'index.md'
  }
  return 'docs' + url.replace(/\.html$/, '.md')
}

// 通过 git log 获取文件最后一次提交的 Unix 时间戳（毫秒）
function getGitTimestamp(relativePath: string): number {
  const result = spawnSync(
    'git',
    ['log', '-1', '--format=%ct', '--', relativePath],
    {
      encoding: 'utf-8',
      cwd: process.cwd(), // npm run docs:dev / CI 的工作目录，即 git 仓库根目录
    }
  )
  const output = result.stdout?.trim()
  if (output) {
    return parseInt(output, 10) * 1000
  }
  return 0
}

export default createContentLoader('**/*.md', {
  includeSrc: false,
  render: false,
  excerpt: false,
  transform(raw) {
    return raw
      .filter(({ url }) => {
        return url !== '/' &&
               !url.includes('api-examples') &&
               !url.includes('markdown-examples')
      })
      .map(({ url, frontmatter }) => {
        const relativePath = urlToRelativePath(url)
        const timestamp = getGitTimestamp(relativePath)

        return {
          title: frontmatter.title || url.split('/').filter(Boolean).pop()?.replace('.html', '') || '无标题',
          url,
          time: timestamp,
          dateString: timestamp > 0
            ? new Date(timestamp).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              })
            : '近期更新'
        }
      })
      .sort((a, b) => b.time - a.time)
      .slice(0, 10)
  }
})

