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
      <Loader v-if="loading" />
      <FormCreator v-if="step === 1 && !loading" :schema="formSchema" class="h-full" />
      <FlowCreator v-if="step === 2" :schema="flowSchema" @finished="onDesignFinish" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, toRefs } from 'vue'
import { useRoute } from 'vue-router'
import { Modal, message, type StepsProps } from 'ant-design-vue'
import { RollbackOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import emitter from '@/utils/emitter'
import { createAppDesignSchema, type AppDesignSchemaVO } from '@/api/workflow'
import { useFlowCreator, useFormCreator } from './use-workflow'
import type { Schema } from '@/types/workflow'
import logo from '~img/company-logo.svg'
import Loader from '@/components/loading/index.vue'
import FormCreator from './form/index.vue'
import DataSourceConfig from './data-source/index.vue'
import FlowCreator from './flow/index.vue'

const title = import.meta.env.VITE_APP_SHORT_TITLE

const steps: StepsProps['items'] = [
  { title: '数据源配置' },
  { title: '表单设计' },
  { title: '流程编排' }
]

const step = ref(0)
const { params } = useRoute()
const { initFormCreator, loading, schema: formSchema } = useFormCreator(params.appId as string)
const { schema: flowSchema } = useFlowCreator()

const schema = computed<Schema>(() => {
  return {
    version: '1',
    form: formSchema.value,
    flow: flowSchema.value
  }
})

const formData = computed<AppDesignSchemaVO>(() => {
  return {
    name: `${params.appId}-${dayjs().format('YYYYMMDDHHmmss')}-表单`,
    conf: {},
    schema: schema.value
  }
})

const onSetupFinish = () => {
  initFormCreator()
  step.value = 1
}

const onDesignFinish = () => {
  Modal.confirm({
    title: '提示',
    content: '是否保存当前应用？',
    onOk: () => {
      loading.value = true
      createAppDesignSchema(formData.value).then((res) => {
        console.log(res)
        loading.value = false
        message.success('保存成功')
      })
    }
  })
}

emitter.on('finished', () => {
  step.value = 2
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
