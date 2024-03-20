type RadioOptions = Array<{
  label: string
  value: string | number
  disabled?: boolean
}>

type User = {
  username: string
  nickname: string
  id: number | string
  avatar?: string
  mobile?: string
}
