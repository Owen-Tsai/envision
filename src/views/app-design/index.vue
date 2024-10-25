<template>
  <div class="flex flex-col h-screen">
    <header class="flex-shrink-0">
      <div class="title-wrapper">
        <img class="logo" :src="logo" />
        <h1 class="title mb-0">{{ title }}</h1>
        <ADivider type="vertical" class="h-8" />
        <h1 class="title mb-0">应用设计器</h1>
      </div>

      <div class="actions">
        <AFlex justify="end" align="center" :gap="8">
          <ATooltip title="返回首页" placement="bottom">
            <AButton type="text" @click="$router.push('/index')">
              <template #icon>
                <RollbackOutlined />
              </template>
            </AButton>
          </ATooltip>
        </AFlex>
      </div>
    </header>

    <div class="flex-grow-0 h-full overflow-hidden">
      <!-- <Loader v-if="loading" /> -->
      <FormDesigner v-model:schema="schema" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RollbackOutlined } from '@ant-design/icons-vue'
import logo from '~img/company-logo.svg'
import Loader from '@/components/loading/index.vue'
import FormDesigner from '@/components/fux-core/form-designer/index.vue'
import type { FormSchema } from '@/types/fux-core'

const title = import.meta.env.VITE_APP_SHORT_TITLE

const loading = ref(true)

const schema = ref<FormSchema>({
  widgets: [],
  labelWidth: '88px',
  labelAlign: 'right'
})
</script>

<style lang="scss" scoped>
@use '@/styles/mixins.scss' as *;

header {
  @apply flex-between px-4 lg:px-6;
  height: $header-height;
  background: unset;
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--colorBorderSecondary);
  position: sticky;
  top: 0;
  left: 0;
  z-index: 20;
  background-color: var(--colorBgAlt);

  & > div {
    width: 33.3333%;
  }
}

.title-wrapper {
  @apply flex items-center;
  gap: 8px;
  justify-self: flex-start;
  .logo {
    @apply size-30px;
    border-radius: 6px;
    user-select: none;
    -webkit-user-drag: none;
  }
}
</style>
