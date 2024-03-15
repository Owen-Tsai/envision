import request from '@/utils/request'

export type TreeQueryParams = {
  name?: string
  status?: string
  type?: string
}

type MenuItem = {
  id?: number
  name: string
  path: string
  permission: string
  type: number
  sort: number
  parentId?: number
  icon?: string
  component?: string
  componentName?: string
  status?: number
  visible?: boolean
  keepAlive?: boolean
  alwaysShow?: boolean
}

export type MenuVO = MenuItem & {
  children?: MenuItem[]
}

export type MenuDTO = MenuItem

export function getMenuTree(params?: TreeQueryParams) {
  return request.get({
    url: '/system/menu/tree-list',
    params
  })
}

export function getMenuDetail(id: number) {
  return request.get<MenuVO>({
    url: `/system/menu/get?id=${id}`
  })
}

export function createMenu(data: MenuDTO) {
  return request.post({
    url: '/system/menu/create',
    data
  })
}

export function updateMenu(data: MenuDTO) {
  return request.put({
    url: '/system/menu/update',
    data
  })
}

export function deleteMenu(id: number) {
  return request.delete({
    url: `/system/menu/delete?id=${id}`
  })
}
