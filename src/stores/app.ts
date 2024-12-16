import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useDark, useTitle } from '@vueuse/core'

type Theme = 'light' | 'dark'

const isDark = useDark({ storageKey: 'milestoneTheme' })

export default defineStore('app', () => {
  const device = ref<'desktop' | 'mobile'>('desktop')
  const title = useTitle()

  const theme = computed(() => (isDark.value ? 'dark' : 'light'))

  const setTheme = (val: Theme) => {
    isDark.value = val === 'dark'
    document.documentElement.style.setProperty('color-scheme', val)
  }

  const setTitle = (val: string) => {
    title.value = `${val} | ${import.meta.env.VITE_APP_SHORT_TITLE}`
  }

  return {
    theme,
    device,
    setTheme,
    setTitle,
  }
})
