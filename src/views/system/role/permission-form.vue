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
          <b>{{ record.name }}（{{ record.code }}）</b>
          的角色权限
        </template>
      </AAlert>
      <AForm ref="formRef" :label-col="{ span: 5 }" :model="formData" class="mt-4">
        <AFormItem
          v-if="mode === 'menu'"
          label="菜单权限"
          extra="必须勾选所有可被访问的菜单，即便改菜单为父级"
        >
          <ATreeSelect
            v-model:value="tempMenuIds"
            :key="`data-${loading}`"
            :tree-data="menuTree"
            :field-names="{ label: 'name', value: 'id' }"
            allow-clear
            tree-checkable
            tree-default-expand-all
            tree-check-strictly
            @change="onMenuSelected"
          />
        </AFormItem>
        <AFormItem v-if="mode === 'data'" label="数据权限范围" name="dataScope">
          <ASelect v-model:value="formData.dataScope" :options="systemDataScope" />
        </AFormItem>
        <AFormItem
          v-if="mode === 'data' && formData.dataScope === DICT_SYSTEM_DATA_SCOPE.custom"
          label="选择部门"
          name="dataScopeDeptIds"
        >
          <ATreeSelect
            v-model:value="formData.dataScopeDeptIds"
            :key="`render-${loading}`"
            :tree-data="deptTree"
            :field-names="{ label: 'name', value: 'id' }"
            allow-clear
            tree-checkable
            tree-default-expand-all
          />
        </AFormItem>
      </AForm>
    </ASpin>
  </AModal>
</template>

<script lang="ts" setup>
import { ref, type PropType } from 'vue'
import { message, type FormInstance } from 'ant-design-vue'
import {
  getRoleMenuList,
  setRoleMenuList,
  setRoleDataScope,
  type RolePermissionVO
} from '@/api/system/permission'
import { getMenuTree, type MenuVO } from '@/api/system/menu'
import { getDeptTree, type DeptTreeVO } from '@/api/system/dept'
import useDict from '@/hooks/use-dict'
import { DICT_SYSTEM_DATA_SCOPE } from '@/utils/constants'
import type { RoleVO } from '@/api/system/role'

const [systemDataScope] = useDict('system_data_scope')

const props = defineProps({
  record: {
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

const roleId = props.record.id as number
const formData = ref<RolePermissionVO>({
  roleId
})

const menuTree = ref<MenuVO[]>([])
const deptTree = ref<DeptTreeVO>([])

const tempMenuIds = ref<{ label: string; value: number }[]>([])

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
    open.value = false
  } finally {
    loading.value = false
  }
}

const onMenuSelected = () => {
  formData.value.menuIds = tempMenuIds.value.map((e) => e.value)
}

const resetFields = () => {
  formRef.value?.resetFields()
  emit('close')
}

if (props.mode === 'menu') {
  getRoleMenuList(roleId).then((data) => {
    formData.value.menuIds = data

    getMenuTree().then((data) => {
      menuTree.value = data
      loading.value = false
    })
  })
} else {
  formData.value.dataScope = props.record.dataScope
  formData.value.dataScopeDeptIds = props.record.dataScopeDeptIds || []

  getDeptTree().then((data) => {
    deptTree.value = data
    loading.value = false
  })
}
</script>
