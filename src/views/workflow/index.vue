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
      <Loader v-if="loading" />
      <DataSourceConfig
        v-if="step === 0 && schema"
        @finish="step += 1"
        @generate="reGenerateSchema"
      />
      <FormCreator v-if="step === 1 && schema" :schema="schema" class="h-full" />
      <FlowCreator v-if="step === 2 && schema" :schema="schema.flow" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, provide } from 'vue'
import { useRoute } from 'vue-router'
import { flattenDeep, drop } from 'lodash-es'
import { Modal, message, type StepsProps } from 'ant-design-vue'
import { RollbackOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import {
  createAppDesignSchema,
  updateAppDesignSchema,
  getSchemaByAppId,
  getProcessXML,
  updateProcessXML,
  addMenuById,
  updateMenuById,
  type AppDesignSchemaVO
} from '@/api/workflow'
import { getApplicationDetail, type ApplicationVO } from '@/api/application'
import { useFormCreator, schemaCtxKey, emptySchema } from './use-workflow'
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
const loading = ref(true)
const appDetail = ref<ApplicationVO>()
const { params } = useRoute()
const formData = ref<AppDesignSchemaVO>({})
const schema = ref<Schema | undefined>()

// todo: get application detail based on params appId,
// before load schema
loading.value = true
getApplicationDetail(params.appId as string)
  .then((data) => {
    appDetail.value = data
  })
  .then(() => {
    getSchemaByAppId(params.appId as string)
      .then((data) => {
        if ((data as any) === null) {
          schema.value = emptySchema
        } else {
          formData.value = data
          schema.value = JSON.parse(data.appSchema!)
          isAdd.value = false
        }
      })
      .catch(() => {
        schema.value = emptySchema
      })
      .finally(() => {
        loading.value = false
      })
  })

const { generateInitalSchema } = useFormCreator()

const reGenerateSchema = () => {
  loading.value = true
  generateInitalSchema(schema.value!.info)
    .then((data) => {
      schema.value!.form = data
      step.value = 1
    })
    .catch((err) => {
      console.error(err)
    })
    .finally(() => {
      loading.value = false
    })
}

const getSteps = () => {
  const list = flattenDeep(schema.value?.flow.nodes).map((node) => {
    return {
      uid: node.uid,
      name: node.name
    }
  })

  return drop(list)
}

const onAppSave = () => {
  formData.value = {
    ...formData.value,
    appSchema: JSON.stringify(schema.value),
    name: `${params.appId}-${dayjs().format('YYYYMMDDHHmmss')}`,
    conf: `{}`,
    appId: params.appId as string
  }

  Modal.confirm({
    title: '提示',
    content: '是否保存当前应用？',
    onOk: async () => {
      loading.value = true
      const xml = await getProcessXML({
        id: params.appId as string,
        name: appDetail.value?.name || 'unnamed',
        data: schema.value!.flow.nodes
      })

      await updateProcessXML({
        id: appDetail.value!.processIds!,
        name: appDetail.value?.name || 'unnamed',
        bpmnXml: xml.data,
        category: appDetail.value?.type || 'unknown'
      })

      if (isAdd.value) {
        const id = await createAppDesignSchema(formData.value)
        await addMenuById(id, getSteps())
      } else {
        const id = await updateAppDesignSchema(formData.value)
        await updateMenuById(id, getSteps())
      }

      loading.value = false
      message.success('保存成功')
    }
  })
}

provide(schemaCtxKey, {
  schema,
  isAdd
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
