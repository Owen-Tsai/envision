import request from '@/utils/request'

export type TreeQueryParams = {
  name?: string
  status?: string
  type?: string
}

export type MenuLiteVO = {
  id: number
  name: string
  parentId: number
  type?: string
}

export type MenuVO = {
  id?: number
  name?: string
  path?: string
  permission?: string
  type?: number
  sort?: number
  parentId?: number
  icon?: string
  component?: string
  componentName?: string
  status?: number
  visible?: boolean
  keepAlive?: boolean
  alwaysShow?: boolean
  customLayout?: string
  params?: string
  children?: MenuVO[]
  skipProcess?: boolean
}

export const getMenuTree = (params?: TreeQueryParams) => {
  return request.get<MenuVO[]>({
    url: '/system/menu/tree-list',
    params
  })
}

export const getMenuDetail = (id: number) => {
  return request.get<MenuVO>({
    url: `/system/menu/get?id=${id}`
  })
}

export const createMenu = (data: MenuVO) => {
  return request.post({
    url: '/system/menu/create',
    data
  })
}

export const updateMenu = (data: MenuVO) => {
  return request.put({
    url: '/system/menu/update',
    data
  })
}

export const deleteMenu = (id: number) => {
  return request.delete({
    url: `/system/menu/delete?id=${id}`
  })
}

export const deleteMenuWithChildren = (id: number) => {
  return request.delete({
    url: `/system/menu/delete-batch?id=${id}`
  })
}

export const getMenuPlainList = () => {
  return request.get<MenuLiteVO[]>({
    url: '/system/menu/list-all-simple'
  })
}
