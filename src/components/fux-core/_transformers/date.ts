import dayjs from 'dayjs'
import type { Widget } from '@/types/fux-core/form'

const dateTransformer = {
  requireTransform: (widget: Widget) => {
    return (
      (widget.type === 'datePicker' || widget.type === 'dateRangePicker') &&
      !!widget.props.submitFormat
    )
  },
  /**
   * Convert valueFormat (typically a timestamp) to submit format.
   * Should be invoked by setter
   */
  toSubmitValue: (
    rawValue: string | string[] | number | number[],
    format = 'YYYY-MM-DD HH:mm:ss',
  ) => {
    if (!rawValue) return rawValue
    const normalize = (value: string | number): string | number => {
      const parsed = typeof value === 'number' ? value : parseInt(value, 10)
      return isNaN(parsed) ? dayjs(value).format(format) : dayjs(parsed).format(format)
    }

    return Array.isArray(rawValue) ? rawValue.map(normalize) : normalize(rawValue)
  },
  /**
   * Convert submitFormat to valueFormat (typically a timestamp).
   * Should be invoked by getter
   */
  toWidgetValue: (rawValue: string | string[] | number | number[], format = 'x') => {
    if (!rawValue) return rawValue
    const normalize = (value: string | number): string | number => {
      return dayjs(value).format(format)
    }

    return Array.isArray(rawValue) ? rawValue.map(normalize) : normalize(rawValue)
  },
}

export default dateTransformer
