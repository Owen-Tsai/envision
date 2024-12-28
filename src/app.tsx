import { defineComponent } from 'vue'
import { theme as antTheme, App as AApp, ConfigProvider, Watermark } from 'ant-design-vue'
import { RouterView } from 'vue-router'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import useAppStore from '@/stores/app'
import useUserStore from '@/stores/user'
import dayjs from 'dayjs'

export default defineComponent({
  setup() {
    const showWatermark = import.meta.env.VITE_WATERMARK_ENABLED === 'true'
    const { theme } = storeToRefs(useAppStore())
    const { user } = storeToRefs(useUserStore())
    const time = dayjs().format('YYYY.MM.DD HH:mm:ss')

    const { darkAlgorithm, defaultAlgorithm } = antTheme
    const algorithm = computed(() => (theme.value === 'dark' ? darkAlgorithm : defaultAlgorithm))

    const watermarkContent = computed<string | string[]>(() => {
      return user.value?.nickname
        ? [import.meta.env.VITE_APP_TITLE, `${user.value.nickname} ${time}`]
        : [import.meta.env.VITE_APP_TITLE, time]
    })

    const appMain = computed(() =>
      showWatermark ? (
        <Watermark content={watermarkContent.value}>
          <RouterView />
        </Watermark>
      ) : (
        <RouterView />
      ),
    )

    return () => (
      <AApp>
        <ConfigProvider
          dropdown-match-select-width
          locale={zhCN}
          theme={{ algorithm: algorithm.value }}
        >
          {appMain.value}
        </ConfigProvider>
      </AApp>
    )
  },
})
