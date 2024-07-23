import { createVNode, render, ref } from 'vue'
import LoaderConstructor from './index.vue'

export const instance = ref<boolean>(false)

export const createLoader = () => {
  if (instance.value) {
    return
  }

  const loaderVNode = createVNode(LoaderConstructor)
  instance.value = true

  render(loaderVNode, document.body)

  document.body.classList.add('overflow-hidden')
}

export const destroyLoader = () => {
  if (instance.value) {
    render(null, document.body)
    instance.value = false
    document.body.classList.remove('overflow-hidden')
  }
}
