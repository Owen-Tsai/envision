import request from '@/utils/request'

export type ApplicationVO = {
  id?: string
  name?: string
  type?: string
  code?: string // 业务标志？
  dept?: string
  sort?: number
  iconFe?: string
  iconBe?: string
  createTime?: string
  updateTime?: string
  published?: number
  description?: string
  processIds?: string
  userType?: string
  comopen?: number
  linkName?: string
  daily?: boolean
  endTime?: string
}

export const getApplicationDetailCarryAuditProcessInfo = (taskDefKey: string, appId: string) => {
  return request.get<ApplicationVO>({
    url: `/admin-api/system/application/get-carry-auditprocess-info?actId=${taskDefKey}&id=${appId}`,
  })
}
