import { use } from 'echarts/core'
import { PieChart, LineChart, BarChart, MapChart, ScatterChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent, GeoComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GeoComponent,
  PieChart,
  LineChart,
  BarChart,
  MapChart,
  ScatterChart,
  CanvasRenderer,
])
