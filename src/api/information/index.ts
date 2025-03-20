import request from '@/utils/request'

export type ListQueryParams = CommonQueryParams & {
  title?: string
  infotype?: number
}

export type InformationVO = {
  id: string
  title?: string
  creator?: string
  createTime?: string
  infotype?: string
}

const prefix = '/admin-api/information'

export const getList = () => {
  return request.get({
    url: '/user/info/get_info_list',
  })
}

export const deleteInformation = (id: string) => {
  return request.delete({
    url: `${prefix}/delete?id=${id}`,
  })
}
