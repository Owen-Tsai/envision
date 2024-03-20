export const desensitizePhoneNumber = (str: string) => {
  const start = str.substring(0, 3)
  const end = str.substring(7)

  return `${start}****${end}`
}

export const filterOption = (input: string, option: any, key = 'value') => {
  return option[key].toLowerCase().includes(input.toLowerCase())
}
