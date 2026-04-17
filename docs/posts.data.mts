// posts.data.mts
import { createContentLoader } from 'vitepress'
import { spawnSync } from 'node:child_process'
import path from 'node:path'

export default createContentLoader('**/*.md', {
  includeSrc: false,
  render: false,
  excerpt: false,
  transform(raw) {
    return raw
      .filter(({ url }) => {
        // 过滤首页和示例页面
        return url !== '/' && 
               !url.includes('api-examples') && 
               !url.includes('markdown-examples')
      })
      .map(({ url, frontmatter, srcPath }) => {
        let timestamp = 0
        if (srcPath) {
          try {
            // 使用 spawnSync 直接调用 git，不经过 shell
            // 避免 Windows cmd.exe 将 %ct 当做环境变量展开导致返回空字符串
            const result = spawnSync(
              'git',
              ['log', '-1', '--format=%ct', '--', srcPath],
              {
                encoding: 'utf-8',
                cwd: path.dirname(srcPath), // 确保在 git 仓库范围内
              }
            )
            const output = result.stdout?.trim()
            if (output) {
              timestamp = parseInt(output, 10) * 1000 // 转为毫秒
            }
          } catch (e) {
            timestamp = 0
          }
        }

        return {
          title: frontmatter.title || url.split('/').pop()?.replace('.html', '') || '无标题',
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
      .sort((a, b) => b.time - a.time) // 严格降序排列
      .slice(0, 10)
  }
})
