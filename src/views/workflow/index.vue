<template>
  <div class="flex flex-col h-screen">
    <header class="flex-shrink-0">
      <div class="title-wrapper">
        <img class="logo" :src="logo" />
        <h1 class="title mb-0">{{ title }}</h1>
        <ADivider type="vertical" class="h-8" />
        <h1 class="title mb-0">业务流程编辑器</h1>
      </div>

      <div class="step-bar">
        <ASteps v-model:current="step" :items="steps" size="small" />
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
      <DataSourceConfig v-if="step === 0" @finished="onSetupFinish" />
      <Loader v-if="step === 1 && loading" />
      <FormCreator v-if="step === 1 && !loading" :schema="schema" class="h-full" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, toRefs } from 'vue'
import { useRoute } from 'vue-router'
import { Modal, type StepsProps } from 'ant-design-vue'
import { RollbackOutlined } from '@ant-design/icons-vue'
import { storeToRefs } from 'pinia'
import useUserStore from '@/stores/user'
import useFormCreator from './use-form-creator'
import type { Schema } from '@/types/workflow'
import logo from '~img/company-logo.svg'
import Loader from '@/components/loading/index.vue'
import FormCreator from './form/index.vue'
import DataSourceConfig from './data-source/index.vue'

const title = import.meta.env.VITE_APP_SHORT_TITLE

const steps: StepsProps['items'] = [
  { title: '数据源配置' },
  { title: '表单设计' },
  { title: '流程编排' }
]

const step = ref(0)
const { params } = useRoute()
const { initFormCreator, loading, schema } = useFormCreator(params.appId as string)

const onSetupFinish = () => {
  initFormCreator()
  step.value = 1
}
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
