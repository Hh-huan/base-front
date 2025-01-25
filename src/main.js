// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 引入暗黑模式样式
import 'element-plus/theme-chalk/dark/css-vars.css'
import { useThemeStore } from '@/store/modules/theme'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'


// 创建Vue应用实例
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 创建 Pinia 实例
const pinia = createPinia()

// 使用Element Plus UI库
app.use(ElementPlus)

// 使用 Pinia
app.use(pinia)

// 使用路由
app.use(router)

// 初始化主题
const themeStore = useThemeStore(pinia)
themeStore.initTheme()

// 挂载Vue应用到DOM上
app.mount('#app')