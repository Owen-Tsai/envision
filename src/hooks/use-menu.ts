import { ref, h, getCurrentInstance } from 'vue'
import type { ItemType, MenuProps } from 'ant-design-vue'
import type { RouteRecordRaw } from 'vue-router'

type MenuItems = MenuProps['items']

export const useMenuRenderer = () => {
  const menuItems = ref<MenuItems>()
  const proxy = getCurrentInstance()
  const icons = proxy?.appContext.config.globalProperties.$icons!

  /**
   * Generate menu structure based on routes
   * @param routes routes that current user has acess to
   */
  const generateMenu = (routes: RouteRecordRaw[], parentPath = ''): ItemType[] => {
    const items: ItemType[] = []

    routes.forEach((route) => {
      const item: any = {
        label: route.meta?.title,
        key: ''
      }
      // if the route has custom layout,
      // a new browser tab should be opened
      // so we prepend the origin in order to process it as external links
      const origin = window.location.origin

      if (route.children) {
        const children = generateMenu(route.children, route.path)
        item.children = children
      }

      if (route.path.includes('http')) {
        item.key = route.path
      } else {
        item.key =
          route.meta?.parentId === 0 ? `${parentPath}${route.path}` : `${parentPath}/${route.path}`
        if (route.meta?.isCustomLayout) {
          item.key = origin + item.key
        }
      }

      if (route.meta?.icon) {
        item.icon = h(icons[route.meta.icon])
      }

      items.push(item)
    })

    return items
  }

  return {
    menuItems,
    generateMenu
  }
}
