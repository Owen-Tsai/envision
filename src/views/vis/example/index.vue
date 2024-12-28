<template>
  <div class="w-screen h-screen overflow-hidden flex flex-col page">
    <div class="header flex-shrink-0 flex justify-end">
      <div class="extra"></div>
    </div>
    <div class="main flex-1">
      <div class="flex gap-4 h-full p-4">
        <div class="w-2/5 flex flex-col gap-4">
          <ChartContainer class="h-1/3" title="人才供需对比">
            <Chart class="h-full" autoresize :option="optsBar" />
          </ChartContainer>
          <ChartContainer class="h-1/3" title="人才流入流出情况">
            <Chart class="h-full" autoresize :option="optsLine" />
          </ChartContainer>
          <ChartContainer class="h-1/3" title="人才学历分布情况">
            <Chart class="h-full" autoresize :option="optsPie" />
          </ChartContainer>
        </div>
        <div class="w-3/5 flex flex-col gap-4">
          <div class="h-full">
            <Chart class="h-full" autoresize :option="optsMap" />
          </div>
        </div>
        <div class="w-2/5 flex flex-col gap-4">
          <ChartContainer class="h-1/3" title="人才薪资分布情况">
            <Chart class="h-full" autoresize :option="optsLineH" />
          </ChartContainer>
          <ChartContainer class="h-1/3" title="人才年龄分布">
            <Chart class="h-full" autoresize :option="optsPictorial" />
          </ChartContainer>
          <ChartContainer class="h-1/3" title="引进人才分类认定情况">
            <Chart class="h-full" autoresize :option="optsRadar" />
          </ChartContainer>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ChartContainer from '@/components/_internal/chart-s-stripe.vue'
import useThemeToggle from '../theme-toggle'
import Chart from 'vue-echarts'
import useBarChart from './use-bar-chart'
import useLineChart from './use-line-chart'
import usePieChart from './use-pie-chart'
import useGaugeChart from './use-line-chart-h'
import usePictorialChart from './use-pictorial-chart'
import useRadarChart from './use-radar-chart'
import useMap from './use-map'

useThemeToggle()

const { options: optsBar } = useBarChart()
const { options: optsLine } = useLineChart()
const { options: optsPie } = usePieChart()
const { options: optsLineH } = useGaugeChart()
const { options: optsPictorial } = usePictorialChart()
const { options: optsRadar } = useRadarChart()
const { options: optsMap } = useMap()
</script>

<style lang="scss" scoped>
.page {
  background: url('~img/vis/vis-bg.jpg') top center no-repeat;
  background-size: cover;
  background-attachment: fixed;
}
.header {
  height: 6rem;
  background: url('~img/vis/vis-header.svg') top left no-repeat;
  background-size: cover;
  background-position-x: -4rem;
  background-position-y: -1rem;
}
</style>
