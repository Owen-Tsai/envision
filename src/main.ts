import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import Antd from 'ant-design-vue'
import EScrollbar from 'custom-vue-scrollbar'
// use all the icons
import * as antIcons from '@ant-design/icons-vue'
import 'ant-design-vue/dist/reset.css'
import 'nprogress/nprogress.css'
import 'custom-vue-scrollbar/dist/style.css'
import 'virtual:uno.css'
import '@/styles/index.scss'

import App from './App.vue'
import router from './router'
import './router/guard'

const app = createApp(App)

app.use(createI18n({}))
app.use(createPinia())
app.use(Antd)
app.use(router)

app.component('EScrollbar', EScrollbar)

Object.keys(antIcons).forEach((k) => {
  app.component(k, (antIcons as Record<string, any>)[k])
})

app.config.globalProperties.$icons = antIcons

app.mount('#app')
