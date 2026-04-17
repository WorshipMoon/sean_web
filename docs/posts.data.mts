// posts.data.mts
import { createContentLoader } from 'vitepress'
import fs from 'node:fs'

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
            // 直接读取文件的最后修改时间 (mtime)
            // 这不依赖 Git 提交，只要你保存了文件，它就会更新
            const stat = fs.statSync(srcPath)
            timestamp = stat.mtime.getTime()
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
