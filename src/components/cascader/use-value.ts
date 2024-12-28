import type { CascaderProps } from 'ant-design-vue'

const findPath = (options: CascaderProps['options'], value: string | number) => {
  if (!options) return []
  for (const item of options) {
    if (item.value === value) {
      return item
    }
    if (Array.isArray(item.children)) {
      const res = findPath(item.children, value)
      if (res) {
        return res
      }
    }
  }
}

const useValue = (options: CascaderProps['options']) => {
  /**
   * callback for `@change` event
   */
  const getValue = (
    value: CascaderProps['value'],
  ): string | number | (string | number)[] | undefined => {
    if (!value) return undefined
    if (Array.isArray(value[1])) {
      return value.map((e) => {
        return e[e.length - 1]
      })
    } else {
      return value[1]
    }
  }

  /**
   * 回显时调用
   */
  const setValue = (
    data: string | number | (string | number)[] | undefined,
  ): CascaderProps['value'] => {
    if (!data) return []

    if (Array.isArray(data)) {
      return data.map((e) => {
        return findPath(options, e)
      })
    } else {
      return findPath(options, data)
    }
  }

  return {
    getValue,
    setValue,
  }
}

export default useValue
