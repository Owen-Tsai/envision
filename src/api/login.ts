import request from '@/utils/request'

type CaptchaVO = {
  captchaEnabled: boolean
  code: number
  img: string
  uuid: string
  msg: string
}

export type LoginDTO = {
  username: string
  password: string
  code: string
  uuid: string
}

export type LoginVO = {
  token: string
}

export type UserInfoVO = {
  user: {
    userId: number
    avatar?: string
    userName: string
  }
  roles?: string[]
  permissions?: string[]
}

export function getCaptcha() {
  return request.getRaw<CaptchaVO>({
    url: '/captchaImage',
    headers: {
      requireToken: false
    }
  })
}

export function login(data: LoginDTO) {
  return request.postRaw<LoginVO>({
    url: '/login',
    headers: {
      requireToken: false,
      debounce: false
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
