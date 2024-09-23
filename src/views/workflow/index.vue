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
          <AButton v-show="step === 2" type="primary" @click="onAppSave">保存应用</AButton>
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
      <Loader v-if="generating || loading" />
      <DataSourceConfig v-if="step === 0" @finished="onSetupFinish" />
      <FormCreator v-if="step === 1 && !generating" :schema="formSchema" class="h-full" />
      <FlowCreator v-if="step === 2" :schema="flowSchema" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Modal, message, type StepsProps } from 'ant-design-vue'
import { RollbackOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import {
  createAppDesignSchema,
  updateAppDesignSchema,
  type AppDesignSchemaVO
} from '@/api/workflow'
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

const isAdd = ref(true)
const step = ref(0)
const loading = ref(false)
const { params } = useRoute()
const {
  initFormCreator,
  loading: generating,
  schema: formSchema
} = useFormCreator(params.appId as string)
const { schema: flowSchema } = useFlowCreator()

const formData = ref<AppDesignSchemaVO>({})

const schema = computed<Schema>(() => {
  return {
    version: '1',
    form: formSchema.value,
    flow: flowSchema.value,
    info: {
      tables: []
    }
  }
})

const onSetupFinish = () => {
  initFormCreator()
  step.value = 1
}

const onAppSave = () => {
  formData.value = {
    ...formData.value,
    schema: JSON.stringify(schema.value),
    name: `${params.appId}-${dayjs().format('YYYYMMDDHHmmss')}`,
    conf: `{}`
  }

  Modal.confirm({
    title: '提示',
    content: '是否保存当前应用？',
    onOk: async () => {
      loading.value = true
      if (isAdd.value) {
        await createAppDesignSchema(formData.value)
      } else {
        await updateAppDesignSchema(formData.value)
      }
      loading.value = false
      message.success('保存成功')
    }
  })
}

// todo
// loading.value = true
// fetch saved schame based on appId from routeParams
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
