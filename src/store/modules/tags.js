import { defineStore } from 'pinia'

export const useTagsStore = defineStore('tags', {
  state: () => ({
    visitedViews: [],
    cachedViews: []
  }),
  
  actions: {
    addVisitedView(view) {
      if (this.visitedViews.some(v => v.path === view.path)) return
      this.visitedViews.push(
        Object.assign({}, view, {
          title: view.meta?.title || 'unknown'
        })
      )
    },
    
    addCachedView(view) {
      if (this.cachedViews.includes(view.name)) return
      if (view.meta?.keepAlive) {
        this.cachedViews.push(view.name)
      }
    },
    
    delVisitedView(view) {
      const i = this.visitedViews.findIndex(v => v.path === view.path)
      if (i > -1) {
        this.visitedViews.splice(i, 1)
      }
    },
    
    delCachedView(view) {
      const index = this.cachedViews.indexOf(view.name)
      if (index > -1) {
        this.cachedViews.splice(index, 1)
      }
    },
    
    delOthersViews(view) {
      this.visitedViews = this.visitedViews.filter(v => {
        return v.meta?.affix || v.path === view.path
      })
    },
    
    delAllViews() {
      this.visitedViews = this.visitedViews.filter(view => view.meta?.affix)
      this.cachedViews = []
    }
  }
}) 