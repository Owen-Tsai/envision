export const desensitizePhoneNumber = (str: string) => {
  const start = str.substring(0, 3)
  const end = str.substring(7)

  return `${start}****${end}`
}
