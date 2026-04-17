// posts.data.mts
import { createContentLoader } from 'vitepress'
import { execSync } from 'child_process'

export default createContentLoader('**/*.md', {
  includeSrc: false,
  transform(raw) {
    return raw
      .filter(({ url }) => {
        // 排除首页和一些示例页面
        return url !== '/' && !url.includes('api-examples') && !url.includes('markdown-examples')
      })
      .map(({ url, frontmatter, srcPath }) => {
        let timestamp = 0
        try {
          // 通过 git 命令获取文件最后一次提交的 UNIX 时间戳
          const log = execSync(`git log -1 --format=%at "${srcPath}"`, { encoding: 'utf-8' })
          timestamp = parseInt(log.trim()) * 1000
        } catch (e) {
          // 如果 Git 获取失败，回退到文件系统时间
          // timestamp = fs.statSync(srcPath).mtime.getTime()
        }

        return {
          title: frontmatter.title || url.split('/').pop()?.replace('.html', '') || '无标题',
          url,
          time: timestamp,
          dateString: timestamp 
            ? new Date(timestamp).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
              })
            : '近期更新'
        }
      })
      .sort((a, b) => b.time - a.time) // 按时间倒序排列
      .slice(0, 10)
  }
})
