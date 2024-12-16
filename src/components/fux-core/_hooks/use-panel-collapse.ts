import { computed, type Ref } from 'vue'
import { useMouse, useToggle, useElementSize } from '@vueuse/core'
import { useClamp } from '@vueuse/math'

export const useCollapse = (target: Ref<HTMLElement | undefined>, edge = 100, offset = 0) => {
  const [collapsed, setCollapsed] = useToggle(false)
  const { y } = useMouse({ target })
  const { height } = useElementSize(target)
  const cTop = computed(() => height.value - edge)
  const yWithOffset = computed(() => y.value - offset)
  const top = useClamp(yWithOffset, edge, cTop)

  return {
    collapsed,
    setCollapsed,
    top,
  }
}
