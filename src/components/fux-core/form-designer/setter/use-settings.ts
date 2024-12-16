import { ref } from 'vue'

const useSettings = () => {
  const tabs = ref([
    { label: '表单配置', value: 1 },
    { label: '组件配置', value: 0 },
  ])

  const activeKey = ref(1)

  return {
    tabs,
    activeKey,
  }
}

export default useSettings
