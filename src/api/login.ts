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

export type CaptchaDTO = {
  repData: {
    jigsawImageBase64: string
    originalImageBase64: string
    secretKey: string
    token: string
  }
  success: boolean
  repMsg: string | null
}

export type CaptchaValidationDTO = {
  success: boolean
  repMsg: string | null
}

export type CaptchaVO = {
  pointJson: string
  token: string
}

export type LoginVO = {
  tenantName?: string // only needed if tenant feature is enabled
  username: string
  password: string
  captchaVerification?: string // only needed if captcha feature is enabled
}

export type LoginDTO = {
  accessToken: string
  refreshToken: string
  userId: number
}

export type UserInfoVO = {
  user: {
    userId: number
    avatar?: string
    userName: string
    phonenumber?: string
    dept: {
      deptName?: string
    }
  }
  roles?: string[]
  permissions?: string[]
}

export function getCaptcha() {
  return request.postRaw<CaptchaDTO>({
    url: '/system/captcha/get',
    params: {
      captchaType: 'blockPuzzle'
    },
    headers: {
      requireToken: false
    }
  })
}

export function checkCaptcha(params: CaptchaVO) {
  return request.postRaw<CaptchaValidationDTO>({
    url: '/system/captcha/check',
    params: {
      ...params,
      captchaType: 'blockPuzzle'
    }
  })
}

export function login(data: LoginVO) {
  return request.postRaw<LoginDTO>({
    url: '/login',
    headers: {
      requireToken: false
    },
    data
  })
}

export function logout() {
  return request.postRaw({
    url: '/logout'
  })
}

export function getInfo() {
  return request.getRaw<UserInfoVO>({
    url: '/getInfo'
  })
}
