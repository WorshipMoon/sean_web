<!-- TodayPosts.vue -->
<script setup>
import { data as posts } from '../../../posts.data.mts'
</script>

<template>
  <div v-if="posts.length > 0" class="recent-posts-container">
    <h2 class="title">✨ 最近更新</h2>
    <div class="grid">
      <a v-for="post in posts" :key="post.url" :href="post.url" class="card">
        <div class="info">
          <p class="name">{{ post.title }}</p>
          <span class="time">{{ post.dateString }}</span>
        </div>
        <span class="arrow">→</span>
      </a>
    </div>
  </div>
</template>

<style scoped>
.recent-posts-container {
  max-width: 1152px;
  margin: 40px auto;
  padding: 0 24px;
}
.title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
  color: var(--vp-c-text-1);
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}
.card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-default-soft);
  border-radius: 12px;
  transition: all 0.25s;
  text-decoration: none;
}
.card:hover {
  border-color: var(--vp-c-brand-1);
  background-color: var(--vp-c-bg-mute);
  transform: translateY(-2px);
}
.name {
  margin: 0;
  font-weight: 500;
  color: var(--vp-c-text-1);
  /* 标题过长时显示省略号 */
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.time {
  font-size: 12px;
  color: var(--vp-c-text-2);
}
.arrow {
  color: var(--vp-c-brand-1);
  font-weight: bold;
}
</style>
