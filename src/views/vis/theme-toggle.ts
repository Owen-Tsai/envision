import useAppStore from '@/stores/app'

const useThemeToggle = () => {
  const { setTheme } = useAppStore()
  const { theme } = storeToRefs(useAppStore())

  onMounted(() => {
    setTheme('dark')
  })

  onBeforeUnmount(() => {
    setTheme(theme.value)
  })
}

export default useThemeToggle
