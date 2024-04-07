<template>
  <AModal
    v-model:open="open"
    :title="isAdd ? '新增菜单' : '编辑菜单'"
    :after-close="resetFields"
    destroy-on-close
    @cancel="open = false"
    @ok="submit"
  >
    <AForm
      ref="formRef"
      :model="formData"
      :rules="rules"
      :label-col="{ style: { width: '90px' } }"
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
            <IconSelect v-model:value="formData.icon" placeholer="请选择菜单图标" />
          </AFormItem>
          <AFormItem label="路由地址" name="path">
            <AInput v-model:value="formData.path" placeholder="请输入路由地址" />
          </AFormItem>
          <AFormItem label="布局类型">
            <ARadioGroup v-model:value="formData.isCustomLayout" option-type="button">
              <ARadio :value="false">默认布局</ARadio>
              <ARadio :value="true">非默认布局</ARadio>
            </ARadioGroup>
            <ATooltip
              title="当菜单或目录启用非默认布局时，组件内容将不再渲染到默认布局组件中。另外，当目录启用非默认布局时，其下所有子菜单都将渲染到【组件路径】字段对应的组件中作为子路由。"
            >
              <QuestionCircleFilled class="field-help ml-4" />
            </ATooltip>
          </AFormItem>
          <AFormItem label="组件路径">
            <AInput v-model:value="formData.component" placeholder="请输入组件文件路径" />
          </AFormItem>
        </template>
        <template v-if="formData.type === 2">
          <AFormItem label="组件名称">
            <AInput v-model:value="formData.componentName" placeholder="请输入组件名称" />
          </AFormItem>
          <AFormItem label="路由参数">
            <AInput v-model:value="formData.params" placeholder="请输入路由参数" />
          </AFormItem>
        </template>
        <AFormItem v-if="formData.type !== 3" label="权限标识" name="permission">
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
import { ref, computed, type PropType } from 'vue'
import IconSelect from '@/components/icon-select/index.vue'
import { message, type FormInstance, type TreeSelectProps, type FormProps } from 'ant-design-vue'
import { getMenuDetail, createMenu, updateMenu, type MenuVO } from '@/api/system/menu'
import useDict from '@/hooks/use-dict'
import { menuTypes } from '@/utils/constants'
import { QuestionCircleFilled } from '@ant-design/icons-vue'

const { commonStatus } = useDict('common_status')

const rules: FormProps['rules'] = {
  name: [{ required: true, message: '请填写菜单名称' }],
  type: [{ required: true, message: '请选择菜单类型' }],
  path: [{ required: true, message: '请填写路由地址' }],
  component: [{ required: true, message: '请填写组件文件路径' }]
}

const loading = ref(false)

const props = defineProps({
  mode: {
    type: String as PropType<'add' | 'edit'>,
    default: 'add'
  },
  treeData: {
    type: Object as PropType<TreeSelectProps['treeData']>
  },
  id: {
    type: Number,
    default: undefined
  }
})

const emit = defineEmits(['success', 'close'])

const isAdd = computed(() => props.mode === 'add')

const formRef = ref<FormInstance>()
const formData = ref<MenuVO>({
  alwaysShow: true,
  type: 1,
  status: 0,
  sort: 1,
  keepAlive: true,
  visible: true,
  isCustomLayout: false
})
const open = ref(true)

const resetFields = () => {
  formRef.value?.resetFields()
  emit('close')
}

const submit = async () => {
  try {
    loading.value = true
    await formRef.value?.validate()
    if (formData.value.parentId === undefined) {
      formData.value.parentId = 0
    }
    if (props.mode === 'add') {
      // add
      await createMenu(formData.value)
      message.success('创建成功')
    } else {
      // edit
      await updateMenu(formData.value)
      message.success('保存成功')
    }

    open.value = false
    emit('success')
  } catch (e) {
    // do nothing
  } finally {
    loading.value = false
  }
}

if (props.mode === 'edit') {
  loading.value = true
  if (props.id) {
    getMenuDetail(props.id).then((data) => {
      if (data.parentId === 0) {
        data.parentId = undefined
      }
      formData.value = data
      loading.value = false
    })
  }
} else {
  if (props.id) {
    formData.value.parentId = props.id
  }
}
</script>
