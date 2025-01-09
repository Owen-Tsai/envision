// register components globally
import DictTag from '@/components/dict-tag/index.vue'
import Upload from '@/components/upload/index.vue'
import Logo from '@/components/_internal/logo.vue'
import Counter from 'vue-countup-v3'
import Scrollbar from 'custom-vue-scrollbar'
// import STable from '@surely-vue/table'

import '@wangeditor/editor/dist/css/style.css'
// import '@surely-vue/table/dist/style.css'
import 'nprogress/nprogress.css'
import 'custom-vue-scrollbar/dist/style.css'

import type { App } from 'vue'

export default (app: App) => {
  app.component('DictTag', DictTag)
  app.component('Upload', Upload)
  app.component('Logo', Logo)
  app.component('Counter', Counter)
  app.component('Scrollbar', Scrollbar)
  // app.component('STable', STable)
}
