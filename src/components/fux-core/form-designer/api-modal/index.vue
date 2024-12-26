<template>
  <AModal
    v-model:open="isOpen"
    title="API 数据源"
    :width="700"
    :keyboard="false"
    :mask-closable="false"
    :closable="false"
  >
    <div class="flex gap-6">
      <div class="w-1/4">
        <div
          v-for="(api, uid, i) in appSchema.form.api"
          :key="i"
          :class="[
            'item',
            {
              active: selectedUid === uid,
            },
          ]"
          @click="onSelect(uid)"
        >
          <ATypographyText :content="api.name" class="px-4 text" ellipsis />
        </div>
        <AButton type="dashed" block :icon="h(PlusOutlined)" @click="addApi">新增 API</AButton>
      </div>
      <div class="w-3/4">
        <AForm
          v-if="appSchema.form.api && Object.keys(appSchema.form.api).length > 0"
          ref="formRef"
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
            <ADropdownButton class="ml-4" type="primary" @click="onItemSave">
              保存
              <template #overlay>
                <AMenu :items="menuItems" @click="onMenuItemClick" />
              </template>
            </ADropdownButton>
          </div>
        </AForm>
        <AEmpty
          v-else
          :description="
            !appSchema.form.api || Object.keys(appSchema.form.api).length <= 0
              ? '请先增加一个 API'
              : '请选中一个 API'
          "
        />
      </div>
    </div>

    <template #footer>
      <AButton
        v-if="!appSchema.form.api || Object.keys(appSchema.form.api).length <= 0 || !selectedUid"
        type="primary"
        @click="isOpen = false"
        >关闭</AButton
      >
    </template>
  </AModal>
</template>

<script setup lang="ts">
import { h } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { generateId } from '@fusionx/utils'
import useModalOpen from '@/hooks/use-modal'
import { useDesignerInjection } from '../../_hooks/use-context'
import { Codemirror } from 'vue-codemirror'
import extensions from '@/utils/codemirror'
import { message, type FormProps, type FormInstance, type MenuProps } from 'ant-design-vue'
import type { APIConfig } from '@/types/fux-core/form'

const reqTypeOpts = [
  { label: 'GET', value: 'get' },
  { label: 'POST', value: 'post' },
  { label: 'PUT', value: 'put' },
  { label: 'DELETE', value: 'delete' },
]

const menuItems = [{ label: '保存并关闭', key: 'saveAndClose' }]

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', open: boolean): void
}>()

const formRef = useTemplateRef<FormInstance>('formRef')
const isOpen = useModalOpen(props, emit)

const rules = ref<FormProps['rules']>({
  name: [{ required: true, message: '请输入名称' }],
  url: [{ required: true, message: '请输入URL' }],
  method: [{ required: true, message: '请选择请求方法' }],
})

const selectedUid = ref<string | undefined>()
const selectedItem = ref<APIConfig>({
  method: 'get',
  name: '',
  url: '',
  dataIndex: '',
})
const methodValidationStatus = computed<'success' | 'warning' | undefined>(() => {
  if (selectedItem.value.method === 'get') {
    return undefined
  }
  return 'warning'
})

const { appSchema } = useDesignerInjection()!

const addApi = () => {
  const id = generateId()
  if (!appSchema.value.form.api) {
    appSchema.value.form.api = {}
  }
  selectedItem.value = {
    method: 'get',
    name: id,
    url: '',
    dataIndex: id,
  }
  appSchema.value.form.api[id] = {
    ...selectedItem.value,
  }
  selectedUid.value = id
}

const onSelect = (uid: string) => {
  selectedUid.value = uid
  selectedItem.value = appSchema.value.form.api![uid]
}

const onItemDelete = () => {
  delete appSchema.value.form.api![selectedUid.value!]
  selectedUid.value = undefined
  message.success('删除成功')
}

const onItemSave = async () => {
  try {
    await formRef.value?.validate()
    if (!appSchema.value.form.api) {
      appSchema.value.form.api = {}
    }
    appSchema.value.form.api[selectedUid.value!] = {
      ...selectedItem.value,
    }
    message.success('修改成功')
  } catch (e) {
    return Promise.reject(e)
  }
}

const onMenuItemClick: MenuProps['onClick'] = async ({ key }) => {
  if (key === 'saveAndClose') {
    await onItemSave()
    isOpen.value = false
  }
}
</script>

<style lang="scss" scoped>
.item {
  @apply cursor-pointer flex-center;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  padding: 4px 0;
  &:hover {
    border-color: var(--color-primary);
    .text {
      color: var(--color-primary);
    }
  }
  &.active {
    border-color: var(--color-primary);
    .text {
      color: var(--color-primary);
    }
  }
  & {
    margin-bottom: 8px;
  }
}
</style>
