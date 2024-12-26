import type { EChartsOption } from 'echarts'

export type ExampleRespVO = Array<{
  label?: string
  name?: string
  value: number | string
}>

export const commonOpts = {
  grid: {
    containLabel: true,
    top: '8%',
    left: '2%',
    right: '2%',
    bottom: '0%',
  },
  axisLabel: {
    color: '#FFFFFFA6',
    fontSize: 12,
  },
}
