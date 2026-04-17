// posts.data.mts
import { createContentLoader } from 'vitepress'
import { execSync } from 'node:child_process'

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
            // 使用 git log 获取该文件最后一次提交的时间（Unix 时间戳）
            // 这在本地和 CI 环境中都准确，不受 git clone 重置 mtime 的影响
            const result = execSync(
              `git log -1 --format="%ct" -- "${srcPath}"`,
              { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }
            ).trim()
            if (result) {
              timestamp = parseInt(result, 10) * 1000 // 转为毫秒
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
