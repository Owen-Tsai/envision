import DefaultLayout from '@/layouts/default/index.vue'
import type { RouteRecordRaw } from 'vue-router'
import type { RouteItem } from '@/api/login'

const modules = import.meta.glob('../views/**/*.vue')

const loadComponentFrom = (path: string, folder: 'views' | 'layouts') => {
  let res
  for (const filename in modules) {
    const file = filename.split(`${folder}/`)[1].split('.vue')[0]
    if (file === path) {
      res = () => modules[filename]()
    }
  }
  return res
}

export const generateRoutes = (routerMap: RouteItem[]): RouteRecordRaw[] => {
  const res: RouteRecordRaw[] = []

  routerMap.forEach((rawEntry) => {
    if (!rawEntry.path.includes('http')) {
      const entry: any = {
        path: rawEntry.path,
        component: () => ({})
      }
      const hasChildren = rawEntry.children && rawEntry.children.length > 0
      if (hasChildren) {
        entry.children = generateRoutes(rawEntry.children!)
      }
      if (rawEntry.isCustomLayout) {
        entry.component = loadComponentFrom(
          rawEntry.component as string,
          hasChildren ? 'layouts' : 'views'
        )
      } else {
        if (rawEntry.parentId === 0) {
          // 1st level menu/directory
          entry.component = hasChildren
            ? DefaultLayout
            : loadComponentFrom(rawEntry.component as string, 'views')
        } else {
          entry.component = loadComponentFrom(rawEntry.component as string, 'views')
        }
      }

      entry.meta = {
        id: rawEntry.id,
        parentId: rawEntry.parentId,
        icon: rawEntry.icon,
        isCustomLayout: rawEntry.isCustomLayout,
        keepAlive: !!rawEntry.keepAlive,
        title: rawEntry.name || rawEntry.componentName || '',
        visible: rawEntry.visible
      }

      res.push(entry)
    }
  })

  return res
}
