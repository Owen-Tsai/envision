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

const prefix = '/admin-api/system/user/profile'

export const getProfile = () => {
  return request.get<ProfileVO>({
    url: `${prefix}/get`
  })
}

export const updateProfile = (data: ProfileVO) => {
  return request.put({
    url: `${prefix}/update`,
    data
  })
}

export const updatePassword = (data: { oldPassword: string; newPassword: string }) => {
  return request.put({
    url: `${prefix}/update-password`,
    data
  })
}

export const updateAvatar = (file: File) => {
  return request.upload({
    url: `${prefix}/update-avatar`,
    data: {
      avatarFile: file
    }
  })
}
