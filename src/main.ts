import registerGlobalComponents from '@/plugins/global-components'
import registerAntd from '@/plugins/ant-design'
import '@/plugins/dayjs'

import 'virtual:uno.css'

import '@/styles/index.scss'

import App from './app'
import router from './router'
import './router/guard'

const app = createApp(App)

registerGlobalComponents(app)
registerAntd(app)
app.use(createPinia())
app.use(router)
app.mount('#app')
