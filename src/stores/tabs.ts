/**
 * Horizontal navigation tabs in default layout
 */
import { defineStore } from 'pinia'
import { ref, toRefs, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import useViewCache from './view-cache'

export default defineStore('tabs', () => {
  const tabs = ref<Map<string, string>>(new Map())
  // stores full path in visit order
  const tabsHistory = ref<string[]>([])
  const { fullPath, meta, name } = toRefs(useRoute())
  const router = useRouter()

  const viewCache = useViewCache()

  /**
   * Add tab, will NOT change the current route
   * will be automatically called on route change if tabs view is activited
   * @param path fullpath of the route to bed added
   * @param title text that will be displayed on tab
   */
  const addTab = (path: string, title: string, cacheName?: string): void => {
    tabs.value.set(path, title)
    tabsHistory.value.push(path)
    if (cacheName) {
      viewCache.addCache(path, cacheName)
    }
  }

  /**
   * Remove the tab and open the last active tab in history
   * @param path fullpath of the route to be removed
   */
  const removeTab = (path: string, redirect: string | boolean = true) => {
    tabs.value.delete(path)
    // remove all occurances in history
    removeTabHistory(path)
    // if the current active tab is removed,
    // open the last viewed tab
    if (path === fullPath.value && redirect) {
      router.replace(typeof redirect === 'string' ? redirect : getLatestVisitedTab())
    }

    viewCache.removeCache(path)
  }

  const removeTabsAfter = (idx: number) => {
    const keys = tabs.value.keys()
    let i = 0,
      key = keys.next(),
      requireRedirect = false

    while (i <= idx) {
      key = keys.next()
      i++
    }
    while (!key.done) {
      removeTab(key.value, false)
      if (fullPath.value === key.value) {
        requireRedirect = true
      }
      key = keys.next()
    }

    if (requireRedirect) {
      router.replace(getLatestVisitedTab())
    }
  }

  const removeOtherTabs = (path: string) => {
    const keys = tabs.value.keys()
    let key = keys.next()

    while (!key.done) {
      if (key.value !== path && key.value !== '/index') {
        removeTab(key.value, false)
      }
      key = keys.next()
    }

    if (path !== fullPath.value) {
      router.replace(getLatestVisitedTab())
    }
  }

  const removeTabHistory = (path: string) => {
    tabsHistory.value = tabsHistory.value.filter((e) => e !== path)
  }

  const getLatestVisitedTab = () => {
    const len = tabsHistory.value.length
    return tabsHistory.value[len - 1]
  }

  const setTabName = (key: string, name: string) => {
    tabs.value.set(key, name)
  }

  /**
   * Remove a tab, open a new one and navigate to that route
   * @param pathToOpen the fullpath of the route that will be opened
   * @param pathToRemove the fullpath of the route that need to be removed.
   * If omitted, current active tab will be closed
   */
  const removeAndOpenTab = (pathToOpen: string, pathToRemove?: string) => {
    removeTab(pathToRemove || fullPath.value, pathToOpen)
  }

  onMounted(() => {
    addTab('/index', '首页', 'index')
    if (fullPath.value !== '/index') {
      addTab(
        fullPath.value,
        meta.value.title || (name.value as string),
        meta.value.keepAlive && name.value ? (name.value as string) : undefined
      )
    }
  })

  return {
    tabs,
    addTab,
    setTabName,
    removeTab,
    removeAndOpenTab,
    removeTabsAfter,
    removeOtherTabs
  }
})
