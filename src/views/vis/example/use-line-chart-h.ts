import { commonOpts, type ExampleRespVO } from './common'
import { graphic, type EChartsOption } from 'echarts'

const useChart = () => {
  const data = reactive<ExampleRespVO>([
    { name: '￥5000以下', value: 7382 },
    { name: '￥5001-8000', value: 12382 },
    { name: '￥8001-10000', value: 8012 },
    { name: '￥10000以上', value: 7166 },
  ])

  const options = computed<EChartsOption>(
    () =>
      ({
        grid: commonOpts.grid,
        xAxis: {
          type: 'value',
          axisLabel: commonOpts.axisLabel,
          splitLine: {
            show: false,
          },
        },
        yAxis: {
          type: 'category',
          axisLabel: commonOpts.axisLabel,
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          data: data.map((item) => item.name),
        },
        series: [
          {
            type: 'bar',
            data,
            itemStyle: {
              color: new graphic.LinearGradient(1, 0, 0, 0, [
                { offset: 0, color: 'rgba(51, 204, 204, 1)' },
                { offset: 0.9, color: 'rgba(31, 89, 89, 0.25)' },
              ]),
            },
            barWidth: 5,
          },
          {
            type: 'pictorialBar',
            symbol:
              'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADoAAAA6CAMAAADWZboaAAAAZlBMVEUAAABe3uVe3+Vf3uVf3+Zf3uVg3+Zg3+Zf3+Vi4OZh4OZg3+Z86/Bh3+Zi4Odj4Odi4OZ86/B76/B86/Bj4ed56+9x5+xn4umB7/N87PB36e+A7/N+7fF/7vJ/7vJ+7fGA7/OB7/PReX+lAAAAIXRSTlMABQkVDREmIhk3MR10LEFFPHh7cUprXE35h2XnqMLAp+mHAG9cAAAB5ElEQVRIx83WjU7CMBQFYIoiKMqU/XUboHv/l/Tce7t2XamDNSacETEmX86tlK2rx4py150o+MstMBLwWRfHKo6JCVxLnvmFGBjFQ58oF1//sUZhGy/ClSTWObgnL4O+bkeN4nY2okfNMbkRt9/vtxz8InoTsWplJSCzFxPmO8+GpSIByX3YQAuGDWtRKhKjCnxDXhF6Z4yxnZ20Wgko7BMRDmxtSGVaI4kdTIgb+zTYoJQlIMlDlmUFgrcDWWC201qSayqlTkiCddWWeV62VU0YlnpRi9VOKaSUsiyq/N0krwq2Ugt7lVpZl5BfHNiytjagMi+XYp0kCR45hMlivVQrE/uU5pXSrCB5bM6d1t2lOZItMqmliT3q5uVxqxzyW/ccfYLNKx7ZTeykMvNyac2yt2Fbc61MHLSC0rwoxbiNdlQ3GBm1NLHQsHUrtEXppR/ljNpW6DbSCoqlFiVoN6YdaFlgsSFVPs1BdT8OaB5QyQzVcaqWDows/zepxR8ObLglTrdtCRVuRNj4Rrxh+//0ke2f8KVL+Kon3GCSbmsJN9OUW3j6g0Ns+LgCij2u0h+Sghc8mlMPBMgdx5DFh59VmOVHrvmDnoNxCz3J7MFWsMuaLyR089xz/xhlfijvwutR8gv3zk6BLUUeCgAAAABJRU5ErkJggg==',
            symbolSize: [32, 32],
            symbolPosition: 'end',
            symbolOffset: [20, 0],
            data: data.map((item) => item.value),
          },
        ],
      }) as EChartsOption,
  )

  return {
    options,
  }
}

export default useChart
