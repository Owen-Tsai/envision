import { get } from 'lodash-es'

/**
 * evaluate expression with given context
 */
function evalExpression(expression: string, context: Record<string, any>): any {
  // 移除模板表达式中的双花括号
  const cleanedExpression = expression.replace(/\{\{(.*?)\}\}/, (_, expr) => expr.trim())

  try {
    // 替换嵌套路径的表达式，以支持路径解析
    const pathExpression = cleanedExpression.replace(
      /([a-zA-Z_$][\w$]*(?:\.[\w$]+)*)/g,
      (match) => {
        const value = get(context, match)
        return value !== undefined ? JSON.stringify(value) : match
      }
    )

    // 使用 Function 执行表达式并返回值
    const result = new Function(`return ${pathExpression};`)()
    return result
  } catch (error) {
    console.error(`Error evaluating expression: ${expression}`, error)
    return undefined
  }
}

export default evalExpression
