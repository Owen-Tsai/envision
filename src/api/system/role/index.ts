import request from '@/utils/request'

type Role = {
  id?: number
  name?: string
}

export type RoleListVO = Role[]

export const getSimpleList = () => {
  return request.get<RoleListVO>({
    url: 'system/role/simple-list'
  })
}
