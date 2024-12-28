import type { ExampleRespVO } from './common'
import type { EChartsOption } from 'echarts'

const useChart = () => {
  const data = reactive<ExampleRespVO>([
    { name: 'A类', value: 25 },
    { name: 'B类', value: 30 },
    { name: 'C类', value: 55 },
    { name: 'D类', value: 60 },
    { name: 'E类', value: 70 },
  ])

  const options = computed<EChartsOption>(
    () =>
      ({
        radar: [
          {
            indicator: data.map((item) => ({ name: item.name, max: 100 })),
            center: ['50%', '58%'],
            axisName: {
              formatter: '【{value}人才】',
              color: '#FFFFFFA6',
              fontSize: 12,
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(160, 208, 255, 0.5)',
              },
            },
            splitArea: {
              areaStyle: {
                color: [
                  'rgba(160, 208, 255, 0.5)',
                  'rgba(160, 208, 255, 0.4)',
                  'rgba(160, 208, 255, 0.3)',
                  'rgba(160, 208, 255, 0.2)',
                  'rgba(160, 208, 255, 0.1)',
                ],
              },
            },
          },
        ],
        series: [
          {
            type: 'radar',
            data: [data.map((item) => item.value)],
            lineStyle: {
              color: '#BFEAFF',
            },
            areaStyle: {
              color: '#BFEAFFA6',
            },
            itemStyle: {
              color: '#BFEAFF',
            },
          },
        ],
      }) as EChartsOption,
  )

  return {
    options,
    data,
  }
}

export default useChart
