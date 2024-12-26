export const runInSandbox = (code: string, context: Record<string, any> = {}) => {
  const ctxKeys = Object.keys(context)
  const ctxValues = Object.values(context)

  const sandboxedFn = new Function(...ctxKeys, code)

  return sandboxedFn(...ctxValues)
}

export const safeEval = (code: string, context: Record<string, any> = {}) => {
  const forbiddenKeywords = ['window', 'document', 'eval', 'Function', 'constructor']
  const forbiddenRegex = new RegExp(`\\b(${forbiddenKeywords.join('|')})\\b`, 'g')

  if (forbiddenRegex.test(code)) {
    throw new Error('包含禁止使用的对象（DOM、BOM等）')
  }

  return runInSandbox(code, context)
}
