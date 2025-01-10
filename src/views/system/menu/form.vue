<template>
  <AModal
    v-model:open="visible"
    :title="mode === 'create' ? '新增菜单' : '编辑菜单'"
    :confirm-loading="loading"
    @ok="submit"
  >
    <AForm
      ref="formRef"
      :model="formData"
      :rules="rules"
      :label-col="{ style: { width: '100px' } }"
      class="mt-4"
    >
      <ASpin :spinning="loading">
        <AFormItem label="上级菜单" name="parentId">
          <ATreeSelect
            v-model:value="formData.parentId"
            show-search
            allow-clear
            :dropdown-style="{ maxHeight: '300px', overflow: 'auto' }"
            tree-default-expand-all
            :tree-data="treeData"
            :field-names="{ label: 'name', value: 'id' }"
            @clear="() => (formData.parentId = 0)"
          />
        </AFormItem>
        <AFormItem label="菜单名称" name="name">
          <AInput v-model:value="formData.name" placeholder="请输入菜单名称" />
        </AFormItem>
        <AFormItem label="菜单类型" name="type">
          <ARadioGroup v-model:value="formData.type" :options="menuTypes" />
        </AFormItem>
        <template v-if="formData.type !== 3">
          <AFormItem label="菜单图标" name="icon">
            <IconSelect v-model:value="formData.icon" placeholder="请选择菜单图标" />
          </AFormItem>
          <AFormItem label="路由地址" name="path">
            <AInput v-model:value="formData.path" placeholder="请输入路由地址" />
          </AFormItem>
          <AFormItem label="布局类型">
            <ARadioGroup v-model:value="isCustomLayout" option-type="button">
              <ARadio :value="false">默认布局</ARadio>
              <ARadio :value="true">非默认布局</ARadio>
            </ARadioGroup>
            <ATooltip
              title="当菜单或目录启用非默认布局时，组件内容将不再渲染到默认布局组件中。另外，当目录启用非默认布局时，其下所有子菜单都将渲染到【组件路径】字段对应的组件中作为子路由。"
            >
              <QuestionCircleFilled class="field-help ml-4" />
            </ATooltip>
          </AFormItem>
        </template>
        <AFormItem v-if="isCustomLayout" label="布局组件路径">
          <AInput
            v-model:value="formData.customLayout"
            placeholder="请输入非默认布局组件的文件路径"
          />
        </AFormItem>
        <template v-if="formData.type === 2">
          <AFormItem label="组件路径">
            <AInput v-model:value="formData.component" placeholder="请输入组件文件路径" />
          </AFormItem>
          <AFormItem label="组件名称">
            <AInput v-model:value="formData.componentName" placeholder="请输入组件名称" />
          </AFormItem>
          <AFormItem label="路由参数">
            <AInput v-model:value="formData.params" placeholder="请输入路由参数" />
          </AFormItem>
        </template>
        <AFormItem v-if="formData.type !== 1" label="权限标识" name="permission">
          <AInput v-model:value="formData.permission" placeholder="请输入权限标识" />
        </AFormItem>
        <ARow>
          <ACol :span="12" v-if="formData.type !== 3">
            <AFormItem label="显示排序" name="sort">
              <AInputNumber v-model:value="formData.sort" class="w-full" />
            </AFormItem>
          </ACol>
          <ACol :span="12">
            <AFormItem label="启用状态" name="status">
              <ARadioGroup
                v-model:value="formData.status"
                :options="commonStatus"
                option-type="button"
              />
            </AFormItem>
          </ACol>
          <ACol :span="12" v-if="formData.type === 2">
            <AFormItem label="缓存策略" name="keepAlive" option-type="button">
              <ARadioGroup v-model:value="formData.keepAlive" option-type="button">
                <ARadio :value="true">缓存</ARadio>
                <ARadio :value="false">不缓存</ARadio>
              </ARadioGroup>
            </AFormItem>
          </ACol>
          <template v-if="formData.type !== 3">
            <ACol :span="12">
              <AFormItem label="显示状态" name="visible">
                <ARadioGroup v-model:value="formData.visible" option-type="button">
                  <ARadio :value="true">显示</ARadio>
                  <ARadio :value="false">隐藏</ARadio>
                </ARadioGroup>
              </AFormItem>
            </ACol>
            <ACol :span="12">
              <AFormItem label="总是显示" name="alwaysShow">
                <ARadioGroup v-model:value="formData.alwaysShow" option-type="button">
                  <ARadio :value="true">是</ARadio>
                  <ARadio :value="false">否</ARadio>
                </ARadioGroup>
              </AFormItem>
            </ACol>
          </template>
        </ARow>
      </ASpin>
    </AForm>
  </AModal>
</template>

<script lang="ts" setup>
import IconSelect from '@/components/icon-select/index.vue'
import { message, type FormInstance, type TreeSelectProps, type FormProps } from 'ant-design-vue'
import { getMenuDetail, createMenu, updateMenu, type MenuVO } from '@/api/system/menu'
import useDict from '@/hooks/use-dict'
import logger from '@/utils/logger'
import { menuTypes } from '@/utils/constants'
import { QuestionCircleFilled } from '@ant-design/icons-vue'

const [commonStatus] = useDict('common_status')

const rules: FormProps['rules'] = {
  name: [{ required: true, message: '请填写菜单名称' }],
  type: [{ required: true, message: '请选择菜单类型' }],
  path: [{ required: true, message: '请填写路由地址' }],
  component: [{ required: true, message: '请填写组件文件路径' }],
}

const { treeData } = defineProps<{
  treeData: TreeSelectProps['treeData']
}>()

const visible = ref(false)
const loading = ref(false)

const mode = ref<'create' | 'update'>('create')
const formRef = ref<FormInstance>()
const emit = defineEmits(['success'])

const isCustomLayout = ref(false)

const formData = ref<MenuVO>({
  alwaysShow: true,
  type: 1,
  status: 0,
  sort: 1,
  keepAlive: true,
  visible: true,
})

const submit = async () => {
  loading.value = true
  try {
    await formRef.value?.validate()
    if (formData.value.parentId === undefined) {
      formData.value.parentId = 0
    }
    if (mode.value === 'create') {
      // add
      await createMenu(formData.value)
    } else {
      // edit
      await updateMenu(formData.value)
    }

    message.success('保存成功')
    visible.value = false
    emit('success')
  } catch (e) {
    logger.error(import.meta.url, '表单提交失败。', e)
  } finally {
    loading.value = false
  }
}

const loadData = async (id: number) => {
  loading.value = true
  const data = await getMenuDetail(id)
  if (data.parentId === 0) {
    data.parentId = undefined
  }
  formData.value = data
  isCustomLayout.value = !!data.customLayout
  loading.value = false
}

const open = (type: 'create' | 'update', id?: number) => {
  formRef.value?.resetFields()
  mode.value = type

  if (type === 'create' && id) {
    // add sub menu
    formData.value.parentId = id
  }

  if (type === 'update') {
    loadData(id!)
  }

  visible.value = true
}

defineExpose({ open })
</script>
