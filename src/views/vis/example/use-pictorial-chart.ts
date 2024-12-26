import { commonOpts, type ExampleRespVO } from './common'
import { graphic, type EChartsOption } from 'echarts'

const useChart = () => {
  const data = reactive<ExampleRespVO>([
    { name: '30岁以下', value: 3872 },
    { name: '31-40岁', value: 4884 },
    { name: '41-50岁', value: 6812 },
    { name: '51-60岁', value: 3984 },
    { name: '61岁以上', value: 1505 },
  ])

  const colors = ['rgba(112, 158, 204, 1)', 'rgba(83, 105, 128, 0)']

  const options = computed<EChartsOption>(
    () =>
      ({
        grid: commonOpts.grid,
        xAxis: {
          type: 'category',
          data: data.map((item) => item.name),
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
        series: [
          {
            type: 'pictorialBar',
            // symbol: 'path://M0,10 L10,10 C5.5,10 5.5,5 5,5 C4.5,5 4.5,10 0,10 z',
            symbol: 'path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z',
            data: data.map((item) => item.value),
            barCategoryGap: '-130%',
            itemStyle: {
              color: new graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: colors[0] },
                { offset: 1, color: colors[1] },
              ]),
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
