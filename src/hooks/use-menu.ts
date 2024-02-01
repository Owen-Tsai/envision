import { ref, h, getCurrentInstance } from 'vue'
import type { ItemType, MenuProps } from 'ant-design-vue'
import type { RouteRecordRaw } from 'vue-router'

type MenuItems = MenuProps['items']

export const useMenuRenderer = () => {
  const menuItems = ref<MenuItems>()
  const proxy = getCurrentInstance()
  const icons = proxy?.appContext.config.globalProperties.$icons!

  const buildItem = (
    routeRecord: RouteRecordRaw,
    pathPrefix = '',
    children?: ItemType[]
  ): ItemType => {
    let key = `/${pathPrefix}/${routeRecord.path}`

    if (routeRecord.path.includes('http')) {
      key = routeRecord.path
    } else if (pathPrefix === '/') {
      key = `/${routeRecord.path}`
    }

    const res: ItemType = {
      label: routeRecord.meta?.title || routeRecord.name,
      key,
      icon: routeRecord.meta?.icon ? h(icons[routeRecord.meta.icon]) : undefined
    }

    if (children && children.length > 0) {
      ;(res as any).children = children
    }

    return res
  }

  const getSubMenuItems = (route: RouteRecordRaw, pathPrefix?: string): ItemType[] | undefined => {
    if (!route.children) return undefined
    const subMenu: ItemType[] = []

    route.children.forEach((cRoute) => {
      let cSubMenu: ItemType[] | undefined = []
      const path = pathPrefix && pathPrefix !== '/' ? `${pathPrefix}/${route.path}` : route.path

      if (cRoute.children) {
        cSubMenu = getSubMenuItems(cRoute, path)
      }
      subMenu.push(buildItem(cRoute, path, cSubMenu))
    })

    return subMenu
  }

  /**
   * Generate menu structure based on routes
   * @param routes routes that current user has acess to
   */
  const generateMenu = (routes: RouteRecordRaw[]): ItemType[] => {
    const items: ItemType[] = []

    routes.forEach((route) => {
      // if the route has custom layout,
      // a new browser tab should be opened
      // so we prepend the origin in order to process it as external links
      const origin = window.location.origin

      if (route.path === '/' && route.children) {
        const subMenuItems = getSubMenuItems(route)
        subMenuItems && items.push(...subMenuItems)
      } else {
        if (route.children) {
          // custom layout entry with sub items
          const subMenu = getSubMenuItems(route, route.path)

          items.push(buildItem(route, origin, subMenu))
        } else {
          // 1st level custom layout entry
          items.push(buildItem(route, ''))
        }
      }
    })

    return items
  }

  return {
    menuItems,
    generateMenu
  }
}
