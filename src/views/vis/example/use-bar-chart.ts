import { commonOpts } from './common'
import { graphic, type EChartsOption } from 'echarts'

const useChart = () => {
  const data = reactive({
    labels: ['信息技术服务', '设计', '交通运输', '市场营销'],
    dataset: [
      [2974, 2085, 1883, 1091],
      [2331, 2701, 962, 886],
    ],
  })

  const colors = [
    ['rgba(122, 163, 204, 1)', 'rgba(96, 112, 128, 0.1)'],
    ['rgba(51, 204, 204, 1)', 'rgba(31, 89, 89, 0.25)'],
  ]

  const categories = ['供给', '需求']

  const getSeries = (i: number) => {
    return {
      name: categories[i],
      type: 'bar',
      data: data.dataset[i],
      barWidth: 10,
      itemStyle: {
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: colors[i][0] },
          { offset: 0.9, color: colors[i][1] },
        ]),
      },
    } as EChartsOption['series']
  }

  const legendData = categories.map((_, i) => {
    return {
      name: categories[i],
      itemStyle: {
        color: colors[i][0],
      },
    }
  })

  const options = computed<EChartsOption>(
    () =>
      ({
        grid: commonOpts.grid,
        xAxis: {
          type: 'category',
          data: data.labels,
          axisLabel: {
            ...commonOpts.axisLabel,
            interval: 0,
          },
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: false,
          },
          splitLine: {
            show: false,
          },
          axisLabel: {
            ...commonOpts.axisLabel,
          },
        },
        legend: {
          top: '0',
          right: '2%',
          itemWidth: 12,
          itemHeight: 12,
          textStyle: {
            color: '#FFFFFFA6',
            fontSize: 12,
          },
          itemStyle: {
            color: '#FFFFFFA6',
          },
          data: legendData,
        },
        series: [getSeries(0), getSeries(1)],
      }) as EChartsOption,
  )

  return {
    options,
    data,
  }
}

export default useChart
