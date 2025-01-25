import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDark: localStorage.getItem('theme') === 'dark'
  }),
  
  actions: {
    toggleTheme() {
      this.isDark = !this.isDark
      this.applyTheme()
    },

    applyTheme() {
      const html = document.documentElement
      if (this.isDark) {
        html.classList.add('dark')
        localStorage.setItem('theme', 'dark')
      } else {
        html.classList.remove('dark')
        localStorage.setItem('theme', 'light')
      }
    },

    initTheme() {
      // 从 localStorage 获取主题设置
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme) {
        this.isDark = savedTheme === 'dark'
      } else {
        // 如果没有保存的主题设置，则使用系统主题
        this.isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      }
      // 应用主题
      this.applyTheme()
    }
  }
}) 