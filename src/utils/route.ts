import DefaultLayout from '@/layouts/default/index.vue'
import type { RouteRecordRaw } from 'vue-router'
import type { MenuVO } from '@/api/system/menu'

const modules = import.meta.glob('../views/**/*.vue')
const layoutModules = import.meta.glob('../layouts/**/*.vue')

const loadComponentFrom = (path: string, folder: 'views' | 'layouts') => {
  const map = folder === 'layouts' ? layoutModules : modules

  const [filename] =
    Object.entries(map).find(([filename]) => {
      const file = filename.split(`${folder}/`)[1].split('.vue')[0]
      return file === path
    }) || []

  return filename ? () => map[filename]() : undefined
}

/**
 * Generate `RouteRecordRaw[]` based on menuVO
 */
export const generateRoutes = (menuVO: MenuVO[]): RouteRecordRaw[] => {
  const ret: RouteRecordRaw[] = []

  const traverse = (menus: MenuVO[], parentPath = '') => {
    const res: RouteRecordRaw[] = []
    menus.forEach((rawEntry) => {
      rawEntry.children?.forEach((e) => (e.skipProcess = false))
      // internet addresses start with `http` should noe be processed by router
      if (!rawEntry.path?.includes('http')) {
        const hasChildren = rawEntry.children && rawEntry.children.length > 0

        // fill meta fields
        const meta = {
          id: rawEntry.id,
          parentId: rawEntry.parentId,
          icon: rawEntry.icon,
          customLayout: rawEntry.customLayout,
          keepAlive: !!rawEntry.keepAlive,
          title: rawEntry.name || rawEntry.componentName || '',
          visible: rawEntry.visible
        }

        const entry: any = {
          name: rawEntry.componentName,
          path: rawEntry.path,
          meta
        }

        if (rawEntry.customLayout) {
          if (rawEntry.type === 2) {
            // if route with customLayout is a menu
            // construct a parent route record containing this route
            const parentRecord: any = {
              path: `${parentPath}/${rawEntry.path}`,
              name: rawEntry.componentName,
              redirect: '',
              component: loadComponentFrom(rawEntry.customLayout, 'layouts'),
              children: [
                {
                  path: '',
                  name: rawEntry.componentName + 'Child',
                  component: loadComponentFrom(rawEntry.component!, 'views'),
                  meta
                }
              ]
            }

            ret.push(parentRecord as RouteRecordRaw)
            // mark as processed, so it won't be processed again in recursion
            rawEntry.skipProcess = true
            return
          } else {
            // if route with customLayout is a directory,
            entry.component = loadComponentFrom(rawEntry.customLayout!, 'layouts')
          }
        } else {
          // normal layout
          if (rawEntry.parentId === 0 && rawEntry.type !== 2) {
            entry.component = DefaultLayout
          } else {
            entry.component = loadComponentFrom(rawEntry.component!, 'views')
          }
        }

        // route params
        if (rawEntry.params) {
          entry.query = JSON.parse(rawEntry.params)
        }

        if (hasChildren) {
          // do not process menu entries that already been marked as processed
          entry.children = traverse(
            rawEntry.children!.filter((e) => e.skipProcess !== true),
            rawEntry.path
          )
        }

        res.push(entry)
      }
    })

    return res
  }

  ret.push(...traverse(menuVO))
  return ret
}
