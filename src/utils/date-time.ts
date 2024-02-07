import type { Dayjs } from 'dayjs'

export const formatDateRange = (value?: any[]): any => {
  if (!value) return undefined
  const [start, end] = value
  if (typeof start === 'string' && typeof end === 'string') {
    return {
      beginTime: start,
      endTime: end
    }
  } else {
    return {
      beginTime: (start as Dayjs).format('YYYY-MM-DD'),
      endTime: (end as Dayjs).format('YYYY-MM-DD')
    }
  }
}

export const dateTimeSorter = (a: Dayjs, b: Dayjs) => {
  return a.isSameOrBefore(b)
}
