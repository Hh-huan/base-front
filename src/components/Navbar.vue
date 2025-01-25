<template>
  <div class="navbar">
    <div class="left">
      <div class="logo">后台管理系统</div>
    </div>
    
    <div class="right">
      <!-- 主题切换 -->
      <el-tooltip :content="isDark ? '浅色模式' : '深色模式'" placement="bottom">
        <el-icon class="right-icon" @click="toggleTheme">
          <Sunny v-if="isDark" />
          <Moon v-else />
        </el-icon>
      </el-tooltip>

      <!-- 消息通知 -->
      <el-badge :value="unreadCount" class="notice-badge">
        <el-tooltip content="消息通知" placement="bottom">
          <el-icon class="right-icon" @click="handleNoticeClick">
            <Bell />
          </el-icon>
        </el-tooltip>
      </el-badge>

      <!-- 用户信息 -->
      <el-tooltip content="个人中心" placement="bottom">
        <el-icon class="right-icon" @click="goToProfile">
          <User />
        </el-icon>
      </el-tooltip>

      <!-- 退出登录 -->
      <el-tooltip content="退出登录" placement="bottom">
        <el-icon class="right-icon" @click="handleLogout">
          <SwitchButton />
        </el-icon>
      </el-tooltip>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '@/store/modules/theme'
import {
  Sunny,
  Moon,
  Bell,
  User,
  SwitchButton,
  Fold,
  Expand
} from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
import { logout } from '@/api/auth'

const router = useRouter()
const themeStore = useThemeStore()
const userStore = useUserStore()

// 主题切换
const isDark = computed(() => themeStore.isDark)
const toggleTheme = () => {
  themeStore.toggleTheme()
}

// 消息通知
const unreadCount = ref(3)
const handleNoticeClick = () => {
  ElMessageBox.alert('这里是您的未读消息列表', '消息通知', {
    confirmButtonText: '知道了'
  })
}

// 个人中心
const goToProfile = () => {
  router.push('/profile')
}

// 退出登录
const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    logout().then(() => {
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      ElMessage.success('已退出登录')
      router.push('/login')
    })
  })
}

// 添加侧边栏折叠状态
const isCollapse = ref(false)

// 切换侧边栏
const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value
  // 这里需要通过 props 或 store 传递给 Sidebar 组件
}
</script>

<style scoped>
.navbar {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background-color: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-light);
}

.left {
  display: flex;
  align-items: center;
}

.logo {
  font-size: 18px;
  font-weight: bold;
  color: var(--el-text-color-primary);
  margin-right: 20px;
}

.right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.right-icon {
  font-size: 20px;
  color: var(--el-text-color-primary);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.3s;
}

.right-icon:hover {
  background-color: var(--el-fill-color-light);
}

.notice-badge :deep(.el-badge__content) {
  z-index: 1;
}

/* 暗黑模式适配 */
html.dark .navbar {
  background-color: var(--el-bg-color);
  border-color: var(--el-border-color-dark);
}

html.dark .right-icon:hover {
  background-color: var(--el-fill-color-dark);
}

.toggle-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-right: 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  background-color: var(--el-fill-color-light);
}

.toggle-button:hover {
  background-color: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}

.toggle-button .el-icon {
  font-size: 20px;
  transition: transform 0.3s;
}

.toggle-button .el-icon.is-collapsed {
  transform: rotate(180deg);
}

/* 暗黑模式适配 */
html.dark .toggle-button {
  background-color: var(--el-fill-color-dark);
}

html.dark .toggle-button:hover {
  background-color: var(--el-color-primary-dark-2);
  color: var(--el-color-primary-light-5);
}
</style> 