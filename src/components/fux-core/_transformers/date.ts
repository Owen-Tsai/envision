import dayjs from 'dayjs'

const dateTransformer = {
  toSubmitFormat: (rawValue: string | string[], format = 'YYYY-MM-DD HH:mm:ss') => {
    const normalize = (value: string): string => {
      const parsed = parseInt(value)
      return isNaN(parsed) ? value : dayjs(parsed).format(format)
    }

    return Array.isArray(rawValue) ? rawValue.map(normalize) : normalize(rawValue)
  },
  toWidgetFormat: (value: string | string[], format: string = 'x'): string | string[] => {
    if (!value) return ''

    const normalize = (v: string): string => dayjs(v).format(format)

    return Array.isArray(value) ? value.map(normalize) : normalize(value)
  }
}

export default dateTransformer
