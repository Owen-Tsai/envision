/**
 * Horizontal navigation tabs in default layout
 */
import { last } from 'lodash-es'
import useViewCache from './view-cache'

export default defineStore('tabs', () => {
  // { fullPath: title } format
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
  const addTab = (path: string, title: string): void => {
    tabs.value.set(path, title)
    tabsHistory.value.push(path)
    if (meta.value.keepAlive && name.value) {
      viewCache.addCache(path, name.value as string)
    }
  }

  /**
   * Set custom title of the tab that is currently active
   * @param title custom title to apply
   */
  const setTabTitle = (title: string) => {
    tabs.value.set(fullPath.value, title)
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
      const latest = getLatestVisitedTab()
      router.replace(typeof redirect === 'string' ? redirect : latest)
    }

    viewCache.removeCache(path)
  }

  const removeTabsAfter = (idx: number) => {
    const keys = Array.from(tabs.value.keys())
    const keysToRemove = keys.slice(idx + 1)

    keysToRemove.forEach((key) => {
      removeTab(key, false)
    })

    if (keysToRemove.includes(fullPath.value)) {
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
    return last(tabsHistory.value)!
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

  /**
   * Refresh the current active route
   * @param pathToRefresh the fullpath of the route that will be refreshed
   */
  const refreshTab = () => {
    router.go(0)
  }

  onMounted(() => {
    addTab('/index', '首页')
    if (fullPath.value !== '/index') {
      addTab(fullPath.value, meta.value.title || (name.value as string))
    }
  })

  return {
    tabs,
    addTab,
    setTabTitle,
    removeTab,
    removeAndOpenTab,
    removeTabsAfter,
    removeOtherTabs,
    refreshTab,
  }
})
