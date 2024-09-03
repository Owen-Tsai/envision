<template>
  <header class="header">
    <div class="title-wrapper">
      <AButton v-if="!screen.lg" type="text" @click="drawerVisible = true">
        <template #icon>
          <MenuOutlined />
        </template>
      </AButton>
      <img class="logo" :src="logo" />
      <h1 class="title mb-0">
        Fusion
        <span class="font-bold font-italic">X</span>
        开发平台
      </h1>
    </div>

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

    <ADrawer
      v-model:open="drawerVisible"
      placement="left"
      :closeable="false"
      :body-style="{ padding: 0 }"
      :width="240"
      :header-style="{ display: 'none' }"
    >
      <Menu />
    </ADrawer>
  </header>
</template>

<script lang="ts" setup>
import { ref, computed, toRefs } from 'vue'
import { Modal } from 'ant-design-vue'
import { BellOutlined, MenuOutlined } from '@ant-design/icons-vue'
import { storeToRefs } from 'pinia'
import logo from '~img/company-logo.svg'
import useAppStore from '@/stores/app'
import useUserStore from '@/stores/user'
import useBreakpoint from '@/hooks/use-breakpoint'
import ThemeIcon from './theme-icon.vue'
import Menu from './menu.vue'

const drawerVisible = ref(false)

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
</script>

<style lang="scss" scoped>
@use '@/styles/mixins.scss' as *;

header {
  @apply flex-between px-4 lg:px-6;
  background: unset;
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--colorBorderSecondary);
  position: sticky;
  top: 0;
  left: 0;
  z-index: 20;
  background-color: var(--colorBgAlt);
}

.title-wrapper {
  @apply flex-center;
  gap: 8px;
  .logo {
    @apply size-30px;
    border-radius: 6px;
    user-select: none;
    -webkit-user-drag: none;
  }
}
</style>
