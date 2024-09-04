<template>
  <header class="header">
    <AButton v-if="screen.lg" type="text" @click="handleMenuCollapse">
      <template #icon>
        <MenuFoldOutlined v-if="!menuCollapsed" />
        <MenuUnfoldOutlined v-else />
      </template>
    </AButton>
    <AButton v-else type="text" @click="$emit('showDrawer')">
      <template #icon>
        <MenuOutlined />
      </template>
    </AButton>

    <div class="actions">
      <AFlex align="center" :gap="8">
        <ATooltip title="通知消息" placement="bottom">
          <AButton type="text">
            <template #icon>
              <BellOutlined />
            </template>
          </AButton>
        </ATooltip>
        <ATooltip :title="themeBtnText" placement="bottom">
          <AButton type="text" class="ant-btn-icon-only" @click="switchTheme">
            <ThemeIcon :theme="theme" />
          </AButton>
        </ATooltip>

        <ADropdown placement="bottomRight">
          <div class="flex items-center gap-2 cursor-pointer">
            <AAvatar :src="user?.avatar" />
            <div v-if="screen.lg">{{ user?.nickname }}</div>
          </div>

          <template #overlay>
            <AMenu>
              <AMenuItem v-if="!screen.lg">用户：{{ user?.nickname }}</AMenuItem>
              <AMenuDivider v-if="!screen.lg" />
              <AMenuItem>个人设置</AMenuItem>
              <AMenuDivider />
              <AMenuItem @click="onClickLogout">退出登录</AMenuItem>
            </AMenu>
          </template>
        </ADropdown>
      </AFlex>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, toRefs } from 'vue'
import { Modal } from 'ant-design-vue'
import {
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MenuOutlined
} from '@ant-design/icons-vue'
import { storeToRefs } from 'pinia'
import useAppStore from '@/stores/app'
import useUserStore from '@/stores/user'
import useBreakpoint from '@/hooks/use-breakpoint'
import ThemeIcon from './theme-icon.vue'

const props = defineProps({
  menuCollapsed: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['update:menuCollapsed', 'showDrawer'])

const { theme } = storeToRefs(useAppStore())
const screen = useBreakpoint()
const userStore = useUserStore()
const { setTheme } = useAppStore()

const { user } = toRefs(userStore)

const themeBtnText = computed(() => (theme.value === 'light' ? '暗黑模式' : '明亮模式'))

const switchTheme = () => {
  setTheme(theme.value === 'dark' ? 'light' : 'dark')
}

const onClickLogout = () => {
  Modal.confirm({
    title: '注销登录',
    content: '确定注销并退出系统吗',
    okText: '确定',
    cancelText: '取消',
    onOk() {
      userStore.logout().then(() => {
        location.reload()
      })
    }
  })
}

const handleMenuCollapse = () => {
  emit('update:menuCollapsed', !props.menuCollapsed)
}
</script>

<style lang="scss" scoped>
@use '@/styles/mixins.scss' as *;

.header {
  @apply flex-between px-4;
  height: $header-height;
}
</style>
