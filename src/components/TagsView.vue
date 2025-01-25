<template>
  <div class="tags-view-container">
    <el-scrollbar class="tags-view-wrapper">
      <router-link
        v-for="tag in visitedViews"
        :key="tag.path"
        :class="isActive(tag) ? 'active' : ''"
        :to="{ path: tag.path, query: tag.query }"
        class="tags-view-item"
        @contextmenu.prevent="openMenu($event, tag)"
      >
        {{ tag.title }}
        <el-icon 
          v-if="!tag.meta?.affix" 
          class="close-icon"
          @click.prevent.stop="closeSelectedTag(tag)"
        >
          <Close />
        </el-icon>
      </router-link>
    </el-scrollbar>
    
    <!-- 右键菜单 -->
    <ul v-show="visible" :style="{left: left+'px', top: top+'px'}" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)">刷新页面</li>
      <li @click="closeSelectedTag(selectedTag)">关闭当前</li>
      <li @click="closeOthersTags(selectedTag)">关闭其他</li>
      <li @click="closeAllTags">关闭所有</li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTagsStore } from '@/store/modules/tags'
import { Close } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const tagsStore = useTagsStore()

const visitedViews = computed(() => tagsStore.visitedViews)

// 右键菜单
const visible = ref(false)
const top = ref(0)
const left = ref(0)
const selectedTag = ref(null)

const isActive = (tag) => {
  return tag.path === route.path
}

const closeSelectedTag = (view) => {
  tagsStore.delVisitedView(view)
  tagsStore.delCachedView(view)
  if (isActive(view)) {
    toLastView(visitedViews.value, view)
  }
}

const toLastView = (visitedViews, view) => {
  const latestView = visitedViews.slice(-1)[0]
  if (latestView) {
    router.push(latestView.path)
  } else {
    router.push('/')
  }
}

const openMenu = (e, tag) => {
  selectedTag.value = tag
  visible.value = true
  left.value = e.clientX
  top.value = e.clientY
}

const closeMenu = () => {
  visible.value = false
}

const refreshSelectedTag = (view) => {
  tagsStore.delCachedView(view)
  router.replace({ path: '/redirect' + view.path })
}

const closeOthersTags = (view) => {
  tagsStore.delOthersViews(view)
  router.push(view.path)
}

const closeAllTags = () => {
  tagsStore.delAllViews()
  router.push('/')
}

// 点击其他地方关闭右键菜单
document.addEventListener('click', closeMenu)
</script>

<style>
.tags-view-container {
  height: 34px;
  width: 100%;
  background-color: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-light);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);
}

.tags-view-wrapper .tags-view-item {
  display: inline-block;
  position: relative;
  cursor: pointer;
  height: 26px;
  line-height: 26px;
  border: 1px solid var(--el-border-color-light);
  color: var(--el-text-color-regular);
  background: var(--el-bg-color);
  padding: 0 8px;
  font-size: 12px;
  margin-left: 5px;
  margin-top: 4px;
  text-decoration: none;
}

.tags-view-wrapper .tags-view-item:first-of-type {
  margin-left: 15px;
}

.tags-view-wrapper .tags-view-item:last-of-type {
  margin-right: 15px;
}

.tags-view-wrapper .tags-view-item.active {
  background-color: var(--el-color-primary);
  color: #fff;
  border-color: var(--el-color-primary);
}

.tags-view-wrapper .tags-view-item.active::before {
  content: '';
  background: #fff;
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  position: relative;
  margin-right: 4px;
}

.tags-view-wrapper .tags-view-item .close-icon {
  width: 16px;
  height: 16px;
  vertical-align: -3px;
  margin-left: 2px;
  color: var(--el-text-color-regular);
}

.tags-view-wrapper .tags-view-item .close-icon:hover {
  color: #fff;
  background-color: var(--el-text-color-regular);
  border-radius: 50%;
}

.tags-view-wrapper .tags-view-item:not(.active):hover {
  background-color: var(--el-fill-color-light);
}

.contextmenu {
  margin: 0;
  background: var(--el-bg-color);
  z-index: 3000;
  position: absolute;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  color: var(--el-text-color-regular);
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
  border: 1px solid var(--el-border-color-light);
}

.contextmenu li {
  margin: 0;
  padding: 7px 16px;
  cursor: pointer;
}

.contextmenu li:hover {
  background: var(--el-fill-color-light);
}

/* 暗黑模式样式 */
html.dark .tags-view-container {
  background: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-dark);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .3);
}

html.dark .tags-view-wrapper .tags-view-item {
  border-color: var(--el-border-color-dark);
  color: var(--el-text-color-primary);
  background: var(--el-bg-color);
}

html.dark .tags-view-wrapper .tags-view-item:not(.active):hover {
  background-color: var(--el-fill-color-dark);
}

html.dark .tags-view-wrapper .tags-view-item.active {
  background-color: var(--el-color-primary);
  border-color: var(--el-color-primary);
  color: #fff;
}

html.dark .tags-view-wrapper .tags-view-item .close-icon {
  color: var(--el-text-color-primary);
}

html.dark .tags-view-wrapper .tags-view-item .close-icon:hover {
  background-color: var(--el-text-color-primary);
}

html.dark .contextmenu {
  background: var(--el-bg-color);
  color: var(--el-text-color-primary);
  border-color: var(--el-border-color-dark);
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .5);
}

html.dark .contextmenu li:hover {
  background: var(--el-fill-color-dark);
}
</style> 