import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export default defineStore('viewCache', () => {
  const cached = ref<Map<string, string>>(new Map())
  const keepsList = computed(() => [...cached.value.values()])

  /**
   * Add router to the cache, which will be used in keep-alive
   */
  const addCache = (fullPath: string, componentName: string) => {
    cached.value.set(fullPath, componentName)
  }

  const removeCache = (fullPath: string) => {
    cached.value.delete(fullPath)
  }

  return {
    cached,
    keepsList,
    addCache,
    removeCache,
  }
})
