import { commonOpts } from './common'
import { graphic, type EChartsOption } from 'echarts'

const useChart = () => {
  const data = reactive({
    labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
    dataset: [
      [2974, 2085, 1883, 1091, 2331, 2701],
      [2331, 2701, 962, 886, 1026, 1155],
    ],
  })

  const colors = [
    ['rgba(112, 158, 204, 0.5)', 'rgba(83, 105, 128, 0)'],
    ['rgba(38, 191, 191, 0.5)', 'rgba(31, 89, 89, 0)'],
  ]

  const categories = ['流入数', '流出数']

  const getBarOpts = (i: number) => {
    return {
      type: 'line',
      smooth: true,
      name: categories[i],
      symbol: 'circle',
      data: data.dataset[i],
      areaStyle: {
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: colors[i][0] },
          { offset: 1, color: colors[i][1] },
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
        color: ['#A0D0FF', '#33CCCC'],
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
          textStyle: {
            color: '#FFFFFFA6',
            fontSize: 12,
          },
          itemStyle: {
            color: '#FFFFFFA6',
          },
          data: legendData,
        },
        series: [getBarOpts(0), getBarOpts(1)],
      }) as EChartsOption,
  )

  return {
    options,
    data,
  }
}

export default useChart
