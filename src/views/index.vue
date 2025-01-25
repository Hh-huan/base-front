<template>
  <el-container class="layout-container">
    <el-header class="header-container">
      <Navbar />
    </el-header>
    
    <el-container class="main-wrapper">
      <el-aside class="aside-container" :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button">
          <el-button 
            :type="isDark ? 'primary' : 'default'"
            :icon="isCollapse ? Expand : Fold"
            @click="toggleSidebar"
            :class="{ 'is-collapse': isCollapse }"
          >
          </el-button>
        </div>
        <Sidebar :is-collapse="isCollapse" />
      </el-aside>

      <el-container class="main-container" :class="{ collapsed: isCollapse }">
        <TagsView />
        <el-main class="content-container">
          <router-view v-slot="{ Component }">
            <keep-alive :include="cachedViews">
              <component :is="Component" />
            </keep-alive>
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Expand, Fold } from '@element-plus/icons-vue'
import { useTagsStore } from '@/store/modules/tags'
import { useThemeStore } from '@/store/modules/theme'
import Navbar from '@/components/Navbar.vue'
import Sidebar from '@/components/Sidebar.vue'
import TagsView from '@/components/TagsView.vue'

const isCollapse = ref(false)
const tagsStore = useTagsStore()
const themeStore = useThemeStore()
const cachedViews = computed(() => tagsStore.cachedViews)
const isDark = computed(() => themeStore.isDark)

const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value
}
</script>

<style>
.layout-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header-container {
  height: 50px !important;
  padding: 0;
  background-color: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-light);
  width: 100%;
  z-index: 1000;
}

.main-wrapper {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.aside-container {
  height: 100%;
  border-right: 1px solid var(--el-border-color-light);
  background-color: var(--el-bg-color);
  transition: width 0.3s;
  overflow: hidden;
  z-index: 999;
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: var(--el-bg-color-page);
  overflow: hidden;
  transition: margin-left 0.3s;
}

.main-container.collapsed {
  margin-left: 64px;
}

.content-container {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  overflow-x: hidden;
}

/* 修改切换按钮样式 */
.toggle-button {
  padding: 8px 16px;
  background-color: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-light);
}

.toggle-button .el-button {
  width: 100%;
  justify-content: center;
  transition: all 0.3s;
  border: none;
  color: var(--el-text-color-primary);
  height: 32px;
  line-height: 1;
}

.toggle-button .el-button.is-collapse {
  width: 32px;
  padding: 0;
  min-height: 32px;
}

.toggle-button .el-button .el-icon {
  margin-right: 4px;
  font-size: 16px;
  line-height: 1;
}

.toggle-button .el-button.is-collapse .el-icon {
  margin-right: 0;
}

/* 暗黑模式适配 */
html.dark .header-container {
  background-color: var(--el-bg-color);
  border-color: var(--el-border-color-dark);
}

html.dark .aside-container {
  background-color: var(--el-bg-color);
  border-color: var(--el-border-color-dark);
}

html.dark .main-container {
  background-color: var(--el-bg-color);
}

html.dark .toggle-button {
  background-color: var(--el-bg-color);
  border-color: var(--el-border-color-dark);
}

html.dark .toggle-button .el-button {
  border: none;
  color: var(--el-text-color-primary);
  background-color: var(--el-bg-color);
}
</style> 