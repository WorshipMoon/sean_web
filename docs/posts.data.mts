// posts.data.mts
import { createContentLoader } from 'vitepress'

export default createContentLoader('**/*.md', {
  includeSrc: false,
  render: false,
  excerpt: false,
  // 【最关键一步】这里必须为 true，否则拿不到 Git 时间戳，排序会失效
  lastUpdated: true, 
  transform(raw) {
    return raw
      .filter(({ url }) => {
        // 过滤掉首页和 VitePress 默认示例页面
        return url !== '/' && 
               !url.includes('api-examples') && 
               !url.includes('markdown-examples')
      })
      .map(({ url, frontmatter, lastUpdated }) => ({
        title: frontmatter.title || url.split('/').pop()?.replace('.html', '') || '无标题',
        url,
        // 这里的 lastUpdated 是毫秒数字，用于排序
        time: lastUpdated || 0,
        // 格式化后的字符串用于组件显示
        dateString: lastUpdated 
          ? new Date(lastUpdated).toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            })
          : '近期更新'
      }))
      .sort((a, b) => b.time - a.time) // 降序：最新修改的排在最前
      .slice(0, 10) // 只保留最近的 10 条
  }
})
