import request from '@/utils/request'

export type UploadListType = Array<{
  id: string
  name: string
  ismust: number
  maxFileSize: number
  allowFileType: string
  attachDO: object
}>

export const getUploadList = (planId: string, applyId: string, appId: string) => {
  return request.get<UploadListType>({
    url: '/attach/type/get_attach_type_list_by_planId',
    params: {
      planId: planId,
      applyId: applyId,
      appId: appId
    }
  })
}

export const getAttachView = (attachId: string, modeName: string) => {
  return request.getRaw({
    url: `/common/attach/get?attachId=${attachId}&modeName=${modeName}`,
    responseType: 'blob'
  })
}
