import DefaultLayout from './default/index.vue'
import SplitLayout from './split/index.vue'

export default import.meta.env.VITE_DEFAULT_LAYOUT === 'default' ? DefaultLayout : SplitLayout
