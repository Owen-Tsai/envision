import { graphic, registerMap, type EChartsOption } from 'echarts'
import jinan from '@/assets/geojson/jinan.json'
import type { ExampleRespVO } from './common'

const useChart = () => {
  registerMap('jinan', jinan as any)

  const data = reactive<ExampleRespVO>([
    { name: '历下区', value: 28764 },
    { name: '市中区', value: 21359 },
    { name: '天桥区', value: 14076 },
    { name: '槐荫区', value: 12354 },
    { name: '历城区', value: 18002 },
    { name: '济阳区', value: 9872 },
    { name: '章丘区', value: 11192 },
    { name: '莱芜区', value: 7762 },
    { name: '长清区', value: 9900 },
    { name: '平阴县', value: 7721 },
    { name: '商河县', value: 6421 },
    { name: '钢城区', value: 5468 },
  ])

  const max = computed<number>(() => data[0].value as number)

  const maxBarHeight = computed(() => 0.6 / max.value)

  const getCoordByName = (name: string) => {
    const target = jinan.features.find((item) => item.properties.name === name)
    return target ? target.properties.center : [-100, -100]
  }

  const scatterDataTop = computed(() => {
    return data.map((item) => ({
      name: item.name,
      value: [
        getCoordByName(item.name!)[0],
        getCoordByName(item.name!)[1] + (item.value as number) * maxBarHeight.value,
      ],
    }))
  })

  const scatterDataBottom = computed(() => {
    return data.map((item) => ({
      name: item.name,
      value: [...getCoordByName(item.name!), item.value],
    }))
  })

  const lineData = computed(() => {
    return data.map((item) => [
      getCoordByName(item.name!),
      [
        getCoordByName(item.name!)[0],
        getCoordByName(item.name!)[1] + (item.value as number) * maxBarHeight.value,
      ],
    ])
  })

  const options = computed<EChartsOption>(
    () =>
      ({
        geo: {
          map: 'jinan',
          roam: false,
          zoom: 1.2,
          itemStyle: {
            areaColor: new graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(112, 158, 204, 0.7)' },
              { offset: 0.9, color: 'rgba(83, 105, 128, 0.2)' },
            ]),
            borderColor: '#A0D0FF',
          },
          label: {
            show: true,
            color: '#BFEAFF',
            fontWeight: 'bold',
          },
        },
        series: [
          {
            name: 'top-of-bar',
            type: 'scatter',
            coordinateSystem: 'geo',
            zlevel: 9,
            symbol:
              'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADoAAAA6CAMAAADWZboaAAAAZlBMVEUAAABe3uVe3+Vf3uVf3+Zf3uVg3+Zg3+Zf3+Vi4OZh4OZg3+Z86/Bh3+Zi4Odj4Odi4OZ86/B76/B86/Bj4ed56+9x5+xn4umB7/N87PB36e+A7/N+7fF/7vJ/7vJ+7fGA7/OB7/PReX+lAAAAIXRSTlMABQkVDREmIhk3MR10LEFFPHh7cUprXE35h2XnqMLAp+mHAG9cAAAB5ElEQVRIx83WjU7CMBQFYIoiKMqU/XUboHv/l/Tce7t2XamDNSacETEmX86tlK2rx4py150o+MstMBLwWRfHKo6JCVxLnvmFGBjFQ58oF1//sUZhGy/ClSTWObgnL4O+bkeN4nY2okfNMbkRt9/vtxz8InoTsWplJSCzFxPmO8+GpSIByX3YQAuGDWtRKhKjCnxDXhF6Z4yxnZ20Wgko7BMRDmxtSGVaI4kdTIgb+zTYoJQlIMlDlmUFgrcDWWC201qSayqlTkiCddWWeV62VU0YlnpRi9VOKaSUsiyq/N0krwq2Ugt7lVpZl5BfHNiytjagMi+XYp0kCR45hMlivVQrE/uU5pXSrCB5bM6d1t2lOZItMqmliT3q5uVxqxzyW/ccfYLNKx7ZTeykMvNyac2yt2Fbc61MHLSC0rwoxbiNdlQ3GBm1NLHQsHUrtEXppR/ljNpW6DbSCoqlFiVoN6YdaFlgsSFVPs1BdT8OaB5QyQzVcaqWDows/zepxR8ObLglTrdtCRVuRNj4Rrxh+//0ke2f8KVL+Kon3GCSbmsJN9OUW3j6g0Ns+LgCij2u0h+Sghc8mlMPBMgdx5DFh59VmOVHrvmDnoNxCz3J7MFWsMuaLyR089xz/xhlfijvwutR8gv3zk6BLUUeCgAAAABJRU5ErkJggg==',
            symbolSize: 32,
            silent: true,
            data: scatterDataTop.value,
          },
          {
            name: 'bottom-of-bar',
            type: 'scatter',
            coordinateSystem: 'geo',
            zlevel: 6,
            symbol: 'circle',
            symbolSize: [16, 8],
            silent: true,
            itemStyle: {
              color: '#33CCCCA6',
            },
            data: scatterDataBottom.value,
          },
          {
            name: 'bar',
            type: 'lines',
            coordinateSystem: 'geo',
            zlevel: 8,
            effect: {
              show: false,
            },
            lineStyle: {
              width: 4,
              color: new graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(51, 204, 204, 1)' },
                { offset: 1, color: 'rgba(31, 89, 89, 0.25)' },
              ]),
              opacity: 1,
              curveness: 0,
            },
            data: lineData.value,
          },
        ],
      }) as EChartsOption,
  )

  return {
    data,
    options,
  }
}

export default useChart
