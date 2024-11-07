## sean

<h1 class="cus-color">样式测试</h1>
<div class="udo">123</div>

<script setup>
import { useData } from 'vitepress'
const { page } = useData()
const { theme } = useData()
console.log(theme)

</script>

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
