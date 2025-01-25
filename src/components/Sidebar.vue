<template>
  <div class="sidebar-container">
    <el-menu
      :default-active="activeMenu"
      router
      :class="['sidebar-menu', { 'el-menu--collapse': isCollapse }]"
      :collapse="isCollapse">
      <el-menu-item index="/dashboard">
        <el-icon><Odometer /></el-icon>
        <template #title>仪表盘</template>
      </el-menu-item>

      <el-sub-menu index="/user">
        <template #title>
          <el-icon><User /></el-icon>
          <span>用户管理</span>
        </template>
        <el-menu-item index="/user/list">用户列表</el-menu-item>
      </el-sub-menu>

      <el-menu-item index="/statistics">
        <el-icon><TrendCharts /></el-icon>
        <template #title>统计分析</template>
      </el-menu-item>

      <el-menu-item index="/settings">
        <el-icon><Setting /></el-icon>
        <template #title>系统设置</template>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  Odometer,
  Setting,
  User,
  TrendCharts,
  Monitor,
  MessageBox,
  Van,
  Fold,
  Expand,
  Warning
} from '@element-plus/icons-vue'

const route = useRoute()
const activeMenu = computed(() => route.path)

defineProps({
  isCollapse: {
    type: Boolean,
    default: false
  }
})
</script>

<style>
.sidebar-menu {
  height: calc(100vh - 130px);
  border-right: none;
  transition: width 0.3s ease-in-out;
  background-color: var(--el-bg-color);
}

.sidebar-menu:not(.el-menu--collapse) {
  width: 200px;
}

.sidebar-menu.el-menu--collapse {
  width: 64px;
}

.el-menu {
  border-right: none !important;
}

.el-menu-item, .el-sub-menu__title {
  height: 50px;
  line-height: 50px;
}

.el-menu-item .el-icon,
.el-sub-menu__title .el-icon {
  width: 24px;
  text-align: center;
  font-size: 20px;
  margin-right: 12px;
}

.el-menu--collapse .el-menu-item,
.el-menu--collapse .el-sub-menu__title {
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.el-menu--collapse .el-menu-item .el-icon,
.el-menu--collapse .el-sub-menu__title .el-icon {
  margin: 0;
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.el-menu--collapse .el-sub-menu__title,
.el-menu--collapse .el-menu-item {
  text-align: center;
  height: 50px;
}

.el-menu--collapse .el-menu-item .el-icon,
.el-menu--collapse .el-sub-menu__title .el-icon {
  display: inline-flex;
  justify-content: center;
  align-items: center;
}

.el-menu--collapse .el-menu-item span,
.el-menu--collapse .el-sub-menu__title span {
  display: none;
}

.el-menu--collapse .el-sub-menu__icon-arrow {
  display: none;
}

/* 弹出菜单样式 */
.el-menu--popup {
  min-width: 200px;
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
}

.el-menu--popup .el-menu-item {
  height: 50px;
  line-height: 50px;
  padding: 0 20px;
  color: var(--el-text-color-primary);
  background-color: var(--el-bg-color);
}

.el-menu--popup .el-menu-item:hover {
  background-color: var(--el-menu-hover-bg-color);
}

.el-menu--popup .el-menu-item.is-active {
  color: var(--el-menu-active-color);
  background-color: var(--el-menu-hover-bg-color);
}

/* 暗黑模式下的弹出菜单 */
html.dark .el-menu--popup {
  background-color: var(--el-bg-color);
  border-color: var(--el-border-color-dark);
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .5);
}

html.dark .el-menu--popup .el-menu-item {
  color: var(--el-text-color-primary);
  background-color: var(--el-bg-color);
}

html.dark .el-menu--popup .el-menu-item:hover {
  background-color: var(--el-fill-color-dark);
}

/* 添加切换按钮样式 */
.sidebar-container {
  position: relative;
  height: 100%;
}

.collapse-trigger {
  position: fixed;
  bottom: 0;
  width: 200px;  /* 与展开时的侧边栏宽度一致 */
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: var(--el-bg-color);
  border-top: 1px solid var(--el-border-color-light);
  transition: width 0.3s;
}

.el-menu--collapse + .collapse-trigger {
  width: 64px;  /* 与收起时的侧边栏宽度一致 */
}

.collapse-trigger .el-icon {
  font-size: 20px;
  transition: transform 0.3s;
}

.collapse-trigger .el-icon.is-collapsed {
  transform: rotate(180deg);
}

.collapse-trigger:hover {
  background-color: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}

/* 暗黑模式适配 */
html.dark .collapse-trigger {
  background-color: var(--el-bg-color);
  border-color: var(--el-border-color-dark);
}

html.dark .collapse-trigger:hover {
  background-color: var(--el-color-primary-dark-2);
  color: var(--el-color-primary-light-5);
}
</style> 