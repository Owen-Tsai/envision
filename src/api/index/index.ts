import request from '@/utils/request'

export const getIndexData = () => {
  return request.get({
    url: '/admin-api/system/application/get-index-data',
  })
}
