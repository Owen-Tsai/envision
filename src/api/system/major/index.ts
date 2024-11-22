import request from '@/utils/request'

export type MajorTreeNode = {
  id: string
  key: string
  name: string
  code: string
  pid: string
  sort: number
  children?: MajorTreeNode[]
}

export type MajorTreeVO = MajorTreeNode[]

export type AddMajorVO = {
  name: string
  code: string
  pid: string
}

export const getMajorTree = () => {
  return request.get<MajorTreeVO>({
    url: '/system/major/major-list_all',
    params: {}
  })
}

export const getMajorInfo = (id: string) => {
  return request.get({
    url: '/system/major/get',
    params: {
      id: id
    }
  })
}

export const addMajorInfo = (data: AddMajorVO) => {
  return request.post({
    url: '/system/major/create',
    data
  })
}

export const deleteMajorInfo = (id: string) => {
  return request.delete({
    url: '/system/major/delete',
    params: {
      id
    }
  })
}

export const modifyMajorInfo = (id: string, name: string) => {
  return request.put({
    url: '/system/major/update',
    data: {
      id,
      name
    }
  })
}
