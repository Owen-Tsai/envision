import request from '@/utils/request'

export type ProfileVO = {
  avatar?: string
  createTime?: number
  dept?: {
    id?: number
    name: string
  }
  email?: string
  loginDate?: number
  loginIp?: string
  mobile?: string
  nickname?: string
  posts?: Array<{
    id?: number
    name?: string
  }>
  sex?: number
  username?: string
}

export const getProfile = () => {
  return request.get<ProfileVO>({
    url: '/system/user/profile/get'
  })
}

export const updateProfile = (data: ProfileVO) => {
  return request.put({
    url: '/system/user/profile/update',
    data
  })
}

export const updatePassword = (data: { oldPassword: string; newPassword: string }) => {
  return request.put({
    url: '/system/user/profile/update-password',
    data
  })
}
