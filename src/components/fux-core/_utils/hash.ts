const simpleHash = (str: string) => {
  let hash = 0
  if (str.length === 0) return hash

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash |= 0 // 将其转换为32位整数
  }

  return hash
}

export default simpleHash
