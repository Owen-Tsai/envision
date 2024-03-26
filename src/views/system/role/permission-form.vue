<template>
  <AModal
    v-model:open="open"
    :title="mode === 'data' ? '数据权限' : '菜单权限'"
    destroy-on-close
    :confirm-loading="loading"
    :after-close="resetFields"
    @ok="submit"
  >
    <ASpin :spinning="loading">
      <AAlert>
        <template #message>
          正在修改
          <b>{{ row.name }}（{{ row.code }}）</b>
          的角色权限
        </template>
      </AAlert>
      <AForm
        ref="formRef"
        :label-col="{ style: { width: '80px' } }"
        :model="formData"
        :rules="rules"
        class="mt-4"
      >
        <AFormItem v-if="mode === 'menu'" label="菜单权限" name="menuIds">
          <ATreeSelect
            v-model:value="formData.menuIds"
            :tree-data="menuTree"
            :field-names="{ label: 'name', value: 'id' }"
            allow-clear
          />
        </AFormItem>
        <AFormItem v-if="mode === 'data'" label="数据权限范围" name="dataScope">
          <ASelect v-model:value="formData.dataScope" :options="systemDataScope" />
        </AFormItem>
        <AFormItem v-if="mode === 'data' && formData.dataScope === DICT_SYSTEM_DATA_SCOPE.custom">
          <ATreeSelect
            v-model:value="formData.dataScopeDeptIds"
            :tree-data="menuTree"
            :field-names="{ label: 'name', value: 'id' }"
            allow-clear
          />
        </AFormItem>
      </AForm>
    </ASpin>
  </AModal>
</template>

<script lang="ts" setup>
import { ref, type PropType } from 'vue'
import { message, type FormInstance, type FormProps } from 'ant-design-vue'
import { setRoleMenuList, setRoleDataScope, type RolePermissionVO } from '@/api/system/permission'
import { getMenuTree, type MenuVO } from '@/api/system/menu'
import { getDeptTree, type DeptTreeVO } from '@/api/system/dept'
import useDict from '@/hooks/use-dict'
import { DICT_SYSTEM_DATA_SCOPE } from '@/utils/constants'
import type { RoleVO } from '@/api/system/role'

const rules: FormProps['rules'] = {
  name: [{ required: true, message: '请填写角色名称' }],
  code: [{ required: true, message: '请填写角色标识' }]
}

const { systemDataScope } = useDict('system_data_scope')

const props = defineProps({
  row: {
    type: Object as PropType<RoleVO>,
    required: true
  },
  mode: {
    type: String as PropType<'menu' | 'data'>,
    default: 'menu'
  }
})

const emit = defineEmits(['success', 'close'])

const formRef = ref<FormInstance>()
const loading = ref(true)
const open = ref(true)

const roleId = props.row.id as number
const formData = ref<RolePermissionVO>({
  roleId
})

const menuTree = ref<MenuVO[]>([])
const deptTree = ref<DeptTreeVO>([])

const submit = async () => {
  try {
    loading.value = true
    await formRef.value?.validate()
    if (props.mode === 'menu') {
      await setRoleMenuList(formData.value)
    } else {
      await setRoleDataScope(formData.value)
    }

    message.success('保存成功')
    emit('success')
  } finally {
    loading.value = false
  }
}

const resetFields = () => {
  formRef.value?.resetFields()
  emit('close')
}

if (props.mode === 'menu') {
  getMenuTree().then((data) => {
    menuTree.value = data
    loading.value = false
  })
} else {
  getDeptTree().then((data) => {
    deptTree.value = data
    loading.value = false
  })
}
</script>
