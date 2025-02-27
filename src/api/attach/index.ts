import request from '@/utils/request'

export type UploadListType = Array<{
  id: string
  name: string
  ismust: number
  maxFileSize: number
  allowFileType: string
  attachDO: {
    id: string
    modeName: string
    [x: string]: any
  }
}>

export const getUploadList = (planId: string, applyId: string, appId: string) => {
  return request.get<UploadListType>({
    url: '/admin-api/attach/type/get_attach_type_list_by_planId',
    params: {
      planId: planId,
      applyId: applyId,
      appId: appId,
    },
  })
}

export const getAttachView = (attachId: string, modeName: string) => {
  return request.getRaw({
    url: `/admin-api/common/attach/get?attachId=${attachId}&modeName=${modeName}&islib=0`,
    responseType: 'blob',
  })
}
