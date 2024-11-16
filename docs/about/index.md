## sean

<h1 class="cus-color">样式测试</h1>
<div class="udo">123</div>

<script setup>
import { useData } from 'vitepress'
const { page } = useData()
const { theme } = useData()
console.log(theme)

</script>
道
解析世界的武器
克服孤独的力量
为什么有时会被情绪左右 因为孤独的壁垒有了漏洞
<style lang="sass" scoped>
.cus-color
  font-size: 20px !important
  color: red

.vp-doc h2
  color: blue

.dark .cus-color
  color: red

.udo
  color: var(--vp-c-brand-1)
</style>
