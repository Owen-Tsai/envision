import { ref, computed, type Ref } from 'vue'
import { useMouseInElement, useMousePressed } from '@vueuse/core'

export const SIZE_OFFSET = 32

const useMouseDrag = (
  dragHandleEl: Ref<HTMLDivElement | undefined>,
  dragTrackEl: Ref<HTMLDivElement | undefined>,
) => {
  const allowDrag = ref(true)

  const { pressed } = useMousePressed({ target: dragHandleEl })
  const { elementX: x } = useMouseInElement(dragTrackEl)

  const ghostPosLeft = ref<number | string | undefined>()
  const posLeft = computed(() =>
    allowDrag.value && pressed.value && dragTrackEl.value ? `${x.value - SIZE_OFFSET}px` : 0,
  )

  return {
    pressed,
    allowDrag,
    x,
    ghostPosLeft,
    posLeft,
  }
}

export default useMouseDrag
