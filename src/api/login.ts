import request from '@/utils/request'

export type Token = {
  id: number // 编号
  accessToken: string // 访问令牌
  refreshToken: string // 刷新令牌
  userId: number // 用户编号
  userType: number //用户类型
  clientId: string //客户端编号
  expiresTime: number //过期时间
}

export type CaptchaVO = {
  repData: {
    jigsawImageBase64: string
    originalImageBase64: string
    secretKey: string
    token: string
  }
  success: boolean
  repMsg: string | null
}

export type CaptchaValidationVO = {
  success: boolean
  repMsg: string | null
}

export type CaptchaValidationDTO = {
  pointJson: string
  token: string
}

export type LoginDTO = {
  tenantName?: string // only needed if tenant feature is enabled
  username: string
  password: string
  captchaVerification?: string // only needed if captcha feature is enabled
}

export type LoginVO = {
  accessToken: string
  refreshToken: string
  userId: number
}

export type RouteItem = {
  alwaysShow?: boolean
  children?: RouteItem[] | null
  component?: string | null
  componentName?: string | null
  icon?: string | null
  id: number
  keepAlive?: boolean | null
  name: string | null
  parentId: number
  path: string
  visible?: boolean
  isCustomLayout?: boolean
}

export type PermissionInfoVO = {
  user: User
  menus: RouteItem[]
  roles: string[]
  permissions: string[]
}

export function getCaptcha() {
  return request.postRaw<CaptchaVO>({
    url: '/system/captcha/get',
    data: {
      captchaType: 'blockPuzzle'
    },
    headers: {
      requireToken: false
    }
  })
}

export function checkCaptcha(params: CaptchaValidationDTO) {
  return request.postRaw<CaptchaValidationVO>({
    url: '/system/captcha/check',
    data: {
      ...params,
      captchaType: 'blockPuzzle'
    }
  })
}

export function login(data: LoginDTO) {
  return request.post<LoginVO>({
    url: '/system/auth/login',
    headers: {
      requireToken: false
    },
    data
  })
}

export function logout() {
  return request.postRaw({
    url: '/system/auth/logout'
  })
}

export function getPermissionInfo() {
  return request.get<PermissionInfoVO>({
    url: '/system/auth/get-permission-info'
  })
}
