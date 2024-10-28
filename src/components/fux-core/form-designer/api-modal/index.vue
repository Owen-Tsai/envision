<template>
  <AModal
    v-model:open="isOpen"
    title="API 数据源"
    :width="680"
    :keyboard="false"
    :mask-closable="false"
  >
    <div class="flex gap-6">
      <div class="w-1/4">
        <div
          v-for="(api, uid, i) in schema.api"
          :key="i"
          :class="[
            'item',
            {
              active: selectedUid === uid
            }
          ]"
          @click="onSelect(uid)"
        >
          {{ api.name }}
        </div>
        <AButton type="dashed" block :icon="h(PlusOutlined)" @click="addApi">新增 API</AButton>
      </div>
      <div class="w-3/4">
        <AForm
          v-if="schema.api && Object.keys(schema.api).length > 0"
          :model="selectedItem"
          :label-col="{ span: 4 }"
          :rules="rules"
        >
          <AFormItem label="名称" name="name">
            <AInput v-model:value="selectedItem.name" />
          </AFormItem>
          <AFormItem label="数据索引" name="dataIndex">
            <AInput v-model:value="selectedItem.dataIndex" />
          </AFormItem>
          <AFormItem label="URL" name="url">
            <AInput v-model:value="selectedItem.url" />
          </AFormItem>
          <AFormItem
            label="请求方法"
            name="method"
            :validate-status="methodValidationStatus"
            :help="methodValidationStatus === 'warning' ? '使用 get 请求更符合项目规范' : undefined"
          >
            <ARadioGroup v-model:value="selectedItem.method" :options="reqTypeOpts" />
          </AFormItem>
          <AFormItem label="请求参数" name="params">
            <Codemirror
              v-model:value="selectedItem.params"
              :extensions="extensions"
              style="height: 160px"
            />
          </AFormItem>
          <div class="text-right">
            <AButton danger @click="onItemDelete">删除此 API</AButton>
            <AButton type="primary" class="ml-4" @click="onItemSave">保存</AButton>
          </div>
        </AForm>
        <AEmpty
          v-else
          :description="
            !schema.api || Object.keys(schema.api).length <= 0
              ? '请先增加一个 API'
              : '请选中一个 API'
          "
        />
      </div>
    </div>

    <template #footer></template>
  </AModal>
</template>

<script setup lang="ts">
import { h, ref, computed } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { generateId } from '@fusionx/utils'
import { useDesignerInjection } from '../../_hooks/use-context'
import { Codemirror } from 'vue-codemirror'
import extensions from '@/utils/codemirror'
import { message, type FormProps } from 'ant-design-vue'
import type { APIConfig } from '@/types/fux-core/form'

const reqTypeOpts = [
  { label: 'GET', value: 'get' },
  { label: 'POST', value: 'post' },
  { label: 'PUT', value: 'put' },
  { label: 'DELETE', value: 'delete' }
]

const { open } = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', open: boolean): void
}>()

const rules = ref<FormProps['rules']>({
  name: [{ required: true, message: '请输入名称' }],
  url: [{ required: true, message: '请输入URL' }],
  method: [{}]
})

const isOpen = computed({
  get() {
    return open
  },
  set(val) {
    emit('update:open', val)
  }
})

const selectedUid = ref<string | undefined>()
const selectedItem = ref<APIConfig>({
  method: 'get',
  name: '',
  url: '',
  dataIndex: ''
})
const methodValidationStatus = computed<'success' | 'warning' | undefined>(() => {
  if (selectedItem.value.method === 'get') {
    return undefined
  }
  return 'warning'
})

const { schema } = useDesignerInjection()

const addApi = () => {
  const id = generateId()
  if (!schema.value.api) {
    schema.value.api = {}
  }
  selectedItem.value = {
    method: 'get',
    name: id,
    url: '',
    dataIndex: id
  }
  schema.value.api[id] = {
    ...selectedItem.value
  }
  selectedUid.value = id
}

const onSelect = (uid: string) => {
  selectedUid.value = uid
  selectedItem.value = schema.value.api![uid]
}

const onItemDelete = () => {
  delete schema.value.api![selectedUid.value!]
  selectedUid.value = undefined
  message.success('删除成功')
}

const onItemSave = () => {
  if (!schema.value.api) {
    schema.value.api = {}
  }
  schema.value.api[selectedUid.value!] = {
    ...selectedItem.value
  }
  message.success('修改成功')
}
</script>

<style lang="scss" scoped>
.item {
  @apply cursor-pointer flex-center;
  border: 1px solid var(--colorBorder);
  border-radius: var(--borderRadius);
  padding: 4px 0;
  &:hover {
    border-color: var(--colorPrimary);
    color: var(--colorPrimary);
  }
  &.active {
    border-color: var(--colorPrimary);
    color: var(--colorPrimary);
  }
  & {
    margin-bottom: 8px;
  }
}
</style>
