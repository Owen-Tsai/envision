<template>
  <AModal
    v-model:open="visible"
    :title="mode === 'data' ? '数据权限' : '菜单权限'"
    :confirm-loading="loading"
    @ok="submit"
  >
    <ASpin :spinning="loading">
      <AAlert>
        <template #message>
          正在修改
          <b>{{ state.name }}（{{ state.code }}）</b>
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
            tree-data-simple-mode
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
import { message, type FormInstance } from 'ant-design-vue'
import {
  getRoleMenuList,
  setRoleMenuList,
  setRoleDataScope,
  type RolePermissionVO,
} from '@/api/system/permission'
import { getSimpleMenuList, type MenuLiteVO } from '@/api/system/menu'
import { getDeptTree, type DeptTreeVO } from '@/api/system/dept'
import useDict from '@/hooks/use-dict'
import logger from '@/utils/logger'
import { DICT_SYSTEM_DATA_SCOPE } from '@/utils/constants'
import type { RoleVO } from '@/api/system/role'

const [systemDataScope] = useDict('system_data_scope')

const visible = ref(false)
const mode = ref<'menu' | 'data'>()
const emit = defineEmits(['success'])
const formRef = ref<FormInstance>()

const loading = ref(true)

const formData = ref<RolePermissionVO>({})
const state = reactive<RoleVO>({})

const menuTree = ref<MenuLiteVO[]>([])
const deptTree = ref<DeptTreeVO>([])

const tempMenuIds = ref<{ label: string; value: number }[]>([])

const submit = async () => {
  try {
    loading.value = true
    await formRef.value?.validate()
    if (mode.value === 'menu') {
      await setRoleMenuList(formData.value)
    } else {
      await setRoleDataScope(formData.value)
    }

    message.success('保存成功')
    emit('success')
    visible.value = false
  } catch (e) {
    logger.error(import.meta.url, '表单提交失败', e)
  } finally {
    loading.value = false
  }
}

const onMenuSelected = () => {
  formData.value.menuIds = tempMenuIds.value.map((e) => e.value)
}

const loadMenuData = async () => {
  if (!formData.value.roleId) return
  const assignedMenuIds = await getRoleMenuList(formData.value.roleId)
  formData.value.menuIds = assignedMenuIds
  const menuList = await getSimpleMenuList()
  menuTree.value = menuList.map((e) => ({
    ...e,
    pId: e.parentId,
  }))

  tempMenuIds.value = menuList
    .filter((e) => assignedMenuIds.includes(e.id))
    .map((e) => ({ label: e.name, value: e.id }))

  loading.value = false
}

const loadDeptData = async () => {
  loading.value = true
  const data = await getDeptTree()
  deptTree.value = data
  loading.value = false
}

const loadData = async () => {
  loading.value = true
  if (mode.value === 'menu') {
    await loadMenuData()
  } else {
    await loadDeptData()
  }
}

const open = (record: RoleVO, modalMode: 'menu' | 'data') => () => {
  mode.value = modalMode
  formData.value.roleId = record.id
  state.name = record.name
  state.code = record.code
  loadData()
  visible.value = true
}

defineExpose({ open })
</script>
