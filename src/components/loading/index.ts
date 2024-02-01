import { createVNode, render, ref, type ComponentPublicInstance } from 'vue'
import LoaderConstructor from './index.vue'

export const instance = ref<ComponentPublicInstance | null>(null)

export const createLoader = () => {
  if (instance.value !== null) {
    return instance.value
  }

  const loaderVNode = createVNode(LoaderConstructor)
  instance.value = loaderVNode.component as unknown as ComponentPublicInstance

  render(loaderVNode, document.body)

  return instance.value
}

export const destroyLoader = () => {
  if (instance.value) {
    instance.value = null
    render(null, document.body)
  }
}
