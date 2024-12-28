import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'
import Scrollbar from 'custom-vue-scrollbar'
import DictTag from '@/components/dict-tag/index.vue'
import Upload from '@/components/upload/index.vue'
import Logo from '@/components/_internal/logo.vue'
import Counter from 'vue-countup-v3'
import STable from '@surely-vue/table'
import { iconPlugin } from '@fusionx/utils'
import '@/utils/dayjs'
import '@/utils/echarts'
// use all the icons
import * as antIcons from '@ant-design/icons-vue'
import 'ant-design-vue/dist/reset.css'
import 'nprogress/nprogress.css'
import 'custom-vue-scrollbar/dist/style.css'
import 'virtual:uno.css'
import '@wangeditor/editor/dist/css/style.css'

import '@/styles/index.scss'

import App from './app'
import router from './router'
import './router/guard'

const app = createApp(App)

app.use(createPinia())
app.use(Antd)
app.use(router)
app.use(STable)

app.component('Scrollbar', Scrollbar)
app.component('EDictTag', DictTag)
app.component('EUpload', Upload)
app.component('ECounter', Counter)
app.component('Logo', Logo)

app.use(iconPlugin, {
  icons: antIcons,
})

app.mount('#app')
