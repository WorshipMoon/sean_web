// posts.data.mts
import { createContentLoader } from 'vitepress'

export default createContentLoader('**/*.md', {
  includeSrc: false,
  render: false,
  excerpt: false,
  lastUpdated: true, // 【关键！】必须显式设为 true，Data Loader 才会去抓取 Git 时间戳
  transform(raw) {
    return raw
      .filter(({ url }) => {
        // 排除首页、示例页、以及可能的 404 页面
        return url !== '/' && 
               !url.includes('api-examples') && 
               !url.includes('markdown-examples') &&
               url !== '/404.html'
      })
      .map(({ url, frontmatter, lastUpdated }) => {
        // 这里的 lastUpdated 就是 VitePress 根据你的 config.mts 逻辑抓取到的毫秒时间戳
        return {
          title: frontmatter.title || url.split('/').pop()?.replace('.html', '') || '无标题',
          url,
          time: lastUpdated || 0,
          dateString: lastUpdated 
            ? new Date(lastUpdated).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              })
            : '近期更新'
        }
      })
      .sort((a, b) => b.time - a.time) // 按时间戳降序排列
      .slice(0, 10)
  }
})
