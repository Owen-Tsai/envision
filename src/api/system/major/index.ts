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

const prefix = '/admin-api/system/major'

export const getMajorTree = () => {
  return request.get<MajorTreeVO>({
    url: `${prefix}/major-list_all`,
    params: {}
  })
}

export const getMajorInfo = (id: string) => {
  return request.get({
    url: `${prefix}/get`,
    params: {
      id: id
    }
  })
}

export const addMajorInfo = (data: AddMajorVO) => {
  return request.post({
    url: `${prefix}/create`,
    data
  })
}

export const deleteMajorInfo = (id: string) => {
  return request.delete({
    url: `${prefix}/delete`,
    params: {
      id
    }
  })
}

export const modifyMajorInfo = (id: string, name: string) => {
  return request.put({
    url: `${prefix}/update`,
    data: {
      id,
      name
    }
  })
}
