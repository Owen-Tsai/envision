import request from '@/utils/request'

export const getIndexData = () => {
  return request.get({
    url: '/admin-api/system/application/get-index-data',
  })
}

export const getApplications = () => {
  return request.get({
    url: '/admin-api/system/application/get-index-app-Data',
  })
}
