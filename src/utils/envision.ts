import { customAlphabet } from 'nanoid'
import { throttle } from 'lodash'

export const desensitizePhoneNumber = (str: string) => {
  const start = str.substring(0, 3)
  const end = str.substring(7)

  return `${start}****${end}`
}

export const filterOption = (input: string, option: any, key = 'value') => {
  return option[key].toLowerCase().includes(input.toLowerCase())
}

export const tryParse = throttle((str: string | undefined) => {
  try {
    return str ? JSON.parse(str) : undefined
  } catch {
    return undefined
  }
}, 100)

export const generateID = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  12
)
