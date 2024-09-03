<template>
  <div class="flex flex-col h-screen">
    <header class="flex-shrink-0">
      <div class="title-wrapper">
        <img class="logo" :src="logo" />
        <h1 class="title mb-0">
          Fusion
          <span class="font-bold font-italic">X</span>
        </h1>
        <ADivider type="vertical" class="h-8" />
        <h1 class="title mb-0">业务流程编辑器</h1>
      </div>

      <div class="step-bar">
        <ASteps :current="step" :items="steps" size="small" />
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
      <FormCreator :schema="schema" class="h-full" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, toRefs } from 'vue'
import { Modal, type StepsProps } from 'ant-design-vue'
import { RollbackOutlined } from '@ant-design/icons-vue'
import { storeToRefs } from 'pinia'
import useUserStore from '@/stores/user'
import type { Schema } from '@/types/workflow'
import logo from '~img/company-logo.svg'

import FormCreator from './form/index.vue'

const steps: StepsProps['items'] = [
  { title: '表单设计' },
  { title: '流程编排' },
  { title: '事务配置' }
]

const step = ref(0)

const schema = ref<Schema>({
  form: {
    widgets: [],
    colon: true,
    layout: 'horizontal'
  },
  remoteAPIs: {},
  functions: {}
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
