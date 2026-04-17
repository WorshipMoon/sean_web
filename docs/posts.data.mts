// posts.data.ts
import { createContentLoader } from 'vitepress'

export default createContentLoader('**/*.md', {
  includeSrc: false, // 不需要源码
  render: false,     // 不需要渲染 html
  excerpt: false,    // 不需要摘要
  transform(raw) {
    return raw
      .filter(({ url }) => url !== '/') // 排除首页
      .map(({ url, frontmatter, lastUpdated }) => ({
        title: frontmatter.title || url.split('/').pop()?.replace('.html', '') || '无标题',
        url,
        // 使用内置的 lastUpdated 时间戳
        time: lastUpdated || 0, 
        dateString: lastUpdated 
          ? new Date(lastUpdated).toLocaleDateString('zh-CN', {
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            })
          : '未知日期'
      }))
      .sort((a, b) => b.time - a.time) // 降序排列
      .slice(0, 10) // 取前10条
  }
})
