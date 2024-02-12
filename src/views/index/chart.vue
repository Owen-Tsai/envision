<template>
  <ACard>
    <div class="stat-container">
      <div>
        <div class="icon-wrapper bg-1">
          <img :src="icon1" />
        </div>
        <AStatistic title="人才总量" :value="287359" suffix="人" />
      </div>
      <div>
        <div class="icon-wrapper bg-2">
          <img :src="icon2" />
        </div>
        <AStatistic title="年度人才增量" :value="1342">
          <template #suffix>
            <div class="positive">
              <CaretUpFilled />
              <span>24</span>
            </div>
          </template>
        </AStatistic>
      </div>
      <div>
        <div class="icon-wrapper bg-3">
          <img :src="icon3" />
        </div>
        <AStatistic title="年度人才减量" :value="212">
          <template #suffix>
            <div class="nagative">
              <CaretUpFilled />
              <span>8</span>
            </div>
          </template>
        </AStatistic>
      </div>
    </div>
    <ADivider />
    <div class="chart-container">
      <VChart :option="option" :theme="theme" autoresize />
    </div>
  </ACard>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import useAppStore from '@/stores/app'
import { CaretUpFilled } from '@ant-design/icons-vue'
import { graphic, use } from 'echarts/core'
import {
  GridComponent,
  TooltipComponent,
  type GridComponentOption,
  type TooltipComponentOption
} from 'echarts/components'
import { LineChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'
import type { ComposeOption } from 'echarts/core'
import type { LineSeriesOption } from 'echarts/charts'

import icon1 from '~img/icon-team.svg'
import icon2 from '~img/icon-enter.svg'
import icon3 from '~img/icon-leave.svg'

type EChartsOption = ComposeOption<LineSeriesOption | GridComponentOption | TooltipComponentOption>

use([LineChart, CanvasRenderer, GridComponent, TooltipComponent])

const { theme } = storeToRefs(useAppStore())

const option = ref<EChartsOption>({
  backgroundColor: 'transparent',
  grid: {
    right: 0,
    left: 0,
    top: 10,
    bottom: 24,
    containLabel: true
  },
  xAxis: {
    type: 'category',
    offset: 2,
    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    axisLabel: {
      color: '#4E5969'
    },
    axisTick: {
      lineStyle: {
        color: '#E5E8EF'
      }
    },
    axisLine: {
      show: false
    },
    splitLine: {
      show: true,
      interval: (idx: number) => {
        if (idx === 0) return false
        return true
      },
      lineStyle: {
        color: '#E5E8EF',
        type: 'dashed'
      }
    }
  },
  yAxis: {
    type: 'value',
    splitLine: {
      lineStyle: {
        type: 'dashed'
      }
    },
    axisLabel: {
      formatter: (val: number, idx: number) => {
        if (idx === 0) return `${val}`
        return `${val}k`
      }
    }
  },
  tooltip: {
    trigger: 'axis',
    className: 'echart-tooltip',
    textStyle: {
      color: 'var(--colorTextSecondary)'
    }
  },
  series: [
    {
      type: 'line',
      smooth: true,
      data: [820, 932, 901, 934, 1290, 1330, 1320, 1108, 1159, 1284, 1340, 1380],
      showSymbol: false,
      symbolSize: 14,
      emphasis: {
        focus: 'series',
        itemStyle: {
          borderWidth: 3
        }
      },
      lineStyle: {
        width: 3,
        color: new graphic.LinearGradient(0, 0, 1, 0, [
          {
            offset: 0,
            color: 'rgba(30, 231, 255, 1)'
          },
          {
            offset: 0.5,
            color: 'rgba(36, 154, 255, 1)'
          },
          {
            offset: 1,
            color: 'rgba(111, 66, 251, 1)'
          }
        ])
      },
      areaStyle: {
        opacity: 0.8,
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgba(17, 126, 255, 0.16)'
          },
          {
            offset: 1,
            color: 'rgba(17, 128, 255, 0)'
          }
        ])
      }
    }
  ]
})
</script>

<style lang="scss" scoped>
.stat-container {
  @apply grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-0;
  & > div {
    @apply flex items-center gap-4;
    .icon-wrapper {
      @apply inline-flex items-center justify-center p-1 rounded-full;
    }
    img {
      @apply size-12;
    }
  }
}

.positive {
  color: var(--colorSuccess);
}
.nagative {
  color: var(--colorError);
}

.chart-container {
  @apply h-58 lg:h-80;
}

.bg-1 {
  background-color: var(--colorPrimaryBg);
}
.bg-2 {
  background-color: var(--colorSuccessBg);
}
.bg-3 {
  background-color: var(--colorWarningBg);
}
</style>
