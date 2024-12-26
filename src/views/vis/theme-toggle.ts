import useAppStore from '@/stores/app'

const useThemeToggle = () => {
  const { setTheme } = useAppStore()
  const { theme } = storeToRefs(useAppStore())
  const cachedTheme = theme.value

  onMounted(() => {
    setTheme('dark')
  })

  onBeforeUnmount(() => {
    setTheme(cachedTheme)
  })
}

export default useThemeToggle
