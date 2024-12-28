import type { ExampleRespVO } from './common'
import type { EChartsOption } from 'echarts'

const useChart = () => {
  const data = reactive<ExampleRespVO>([
    { name: '专科', value: 500 },
    { name: '本科', value: 250 },
    { name: '硕士', value: 150 },
    { name: '博士', value: 50 },
  ])

  const options = computed<EChartsOption>(
    () =>
      ({
        series: [
          {
            type: 'pie',
            radius: ['40%', '70%'],
            label: {
              fontSize: 12,
              color: '#FFFFFFA6',
              formatter: '{b}: {c}\n({d}%)',
            },
            data,
            color: ['#7299BF', '#33CCCC', '#BFEAFF', '#DBB36E'],
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
