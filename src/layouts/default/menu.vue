<template>
  <AMenu
    v-show="!loading"
    :items="menuItems"
    mode="inline"
    class="bg-transparent"
    v-model:selected-keys="selectedKeys"
    v-model:open-keys="expandedKeys"
    @click="({ key }) => onSelect(key as string)"
  />
  <AFlex v-show="loading" vertical :gap="8" class="w-full px-6 py-4">
    <ASkeletonButton active block />
    <ASkeletonButton active block />
    <ASkeletonButton active block />
    <ASkeletonButton active block />
    <ASkeletonButton active block />
  </AFlex>
</template>

<script lang="ts" setup>
import { AppstoreOutlined } from '@ant-design/icons-vue'
import useUserStore from '@/stores/user'
import { useMenuRenderer } from '@/hooks/use-menu'

const userStore = useUserStore()
const { push, currentRoute } = useRouter()

const loading = ref(true)

const selectedKeys = ref<string[]>([])
const expandedKeys = ref<string[]>([])

const { menuItems, generateMenu } = useMenuRenderer()

menuItems.value = generateMenu(userStore.routerMap!)
menuItems.value.unshift({
  label: '首页',
  key: '/index',
  icon: h(AppstoreOutlined),
})

loading.value = false

const onSelect = (key: string) => {
  // we use @click instead of @select, because:
  // if the active menu key is not the current route path
  // meaning that the active menu key was set by route.meta
  // then we still need to change route
  if (key.includes('http')) {
    window.open(key)
    // when opening a new browser tab/window
    // reset selected key to the current window's route path
    const { path } = currentRoute.value
    selectedKeys.value = [path]
  } else {
    push(key)
  }
}

const setDefaultExpandedKeys = () => {
  const { path } = currentRoute.value
  const portions = path.split('/')
  const [, ...rest] = portions

  const keys: string[] = []

  if (rest.length <= 1) return

  rest.reduce((acc, curr) => {
    const key = `${acc}/${curr}`
    keys.push(key)
    return key
  }, '')

  expandedKeys.value = keys
}

watchEffect(() => {
  const { fullPath, meta } = currentRoute.value

  if (meta.ignoreActiveMenu) return

  if (meta.activeMenuKey) {
    selectedKeys.value = [meta.activeMenuKey]
  } else {
    selectedKeys.value = [fullPath]
  }
  setDefaultExpandedKeys()
})

setDefaultExpandedKeys()
</script>
