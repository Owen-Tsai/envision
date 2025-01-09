// register ant design modules

import Antd from 'ant-design-vue'
import { iconPlugin } from '@fusionx/utils'
import * as antIcons from '@ant-design/icons-vue'
import type { App } from 'vue'

import 'ant-design-vue/dist/reset.css'

export default (app: App) => {
  app.use(Antd)

  app.use(iconPlugin, {
    icons: antIcons,
  })
}
