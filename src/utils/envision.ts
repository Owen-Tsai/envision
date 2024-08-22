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

export const tryThrottledParse = throttle((str: string | undefined) => {
  return tryParse(str)
}, 100)

export const tryParse = (str: string | undefined) => {
  try {
    return str ? JSON.parse(str) : undefined
  } catch {
    return undefined
  }
}

export const generateID = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  12
)
