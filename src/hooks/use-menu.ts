import type { ItemType, MenuProps } from 'ant-design-vue'
import type { MenuVO } from '@/api/system/menu'

type MenuItems = MenuProps['items']

export const useMenuRenderer = () => {
  const menuItems = ref<MenuItems>()
  const proxy = getCurrentInstance()
  const icons = proxy?.appContext.config.globalProperties.$icons!

  /**
   * Generate menu structure based on routes
   * @param routes routes that current user has acess to
   */
  const generateMenu = (menuVO: MenuVO[], parentPath = ''): ItemType[] => {
    const items: ItemType[] = []

    menuVO.forEach((route) => {
      if (!route.visible) {
        return
      }
      const item: any = {
        label: route.name,
        key: '',
      }
      // if the route has custom layout,
      // a new browser tab should be opened
      // so we prepend the origin in order to process it as external links
      const origin = window.location.origin

      if (route.children) {
        const children = generateMenu(
          route.children,
          parentPath === '' ? `${parentPath}${route.path}` : `${parentPath}/${route.path}`,
        )
        item.children = children
      }

      if (route.path?.includes('http')) {
        item.key = route.path
      } else {
        item.key =
          route.parentId === 0 ? `${parentPath}${route.path}` : `${parentPath}/${route.path}`
        if (route.customLayout) {
          item.key = origin + item.key
        }
      }

      if (route.icon && icons[route.icon]) {
        item.icon = h(icons[route.icon])
      }

      items.push(item)
    })

    return items
  }

  return {
    menuItems,
    generateMenu,
  }
}
