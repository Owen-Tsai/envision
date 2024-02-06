import type { Dayjs } from 'dayjs'

export const formatDateRange = (value: any[]): any => {
  return {
    beginTime: value[0],
    endTime: value[1]
  }
}

export const dateTimeSorter = (a: Dayjs, b: Dayjs) => {
  return a.isSameOrBefore(b)
}
