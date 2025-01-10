<template>
  <AModal
    v-model:open="visible"
    title="分配角色"
    :confirm-loading="pending || loading"
    @ok="submit"
  >
    <AAlert type="info" class="mt-4">
      <template #message>
        设置用户
        <b>{{ state.nickname }}</b>
        的角色：
      </template>
    </AAlert>
    <AForm ref="formRef" :model="state" class="mt-4">
      <ASpin :spinning="loading || pending">
        <AFormItem label="角色" name="roleIds">
          <ASelect
            v-model:value="state.roleIds"
            :loading="pending || loading"
            :options="data"
            :field-names="{ label: 'name', value: 'id' }"
            mode="multiple"
          />
        </AFormItem>
      </ASpin>
    </AForm>
  </AModal>
</template>

<script lang="ts" setup>
import { message, type FormInstance } from 'ant-design-vue'
import { setUserRole, getUserRoles } from '@/api/system/permission'
import { getSimpleList } from '@/api/system/role'
import logger from '@/utils/logger'
import useRequest from '@/hooks/use-request'
import type { UserVO } from '@/api/system/user'

const visible = ref(false)

const formRef = ref<FormInstance>()

const loading = ref(false)
const state = ref<{ roleIds: number[]; id?: number; nickname?: string }>({
  roleIds: [],
})

const submit = async () => {
  loading.value = true
  try {
    await formRef.value?.validate()
    await setUserRole(state.value.id!, state.value.roleIds)
    message.success('保存成功')
    visible.value = false
  } catch (e) {
    logger.error('[system/user/roles-form.vue] 表单提交失败。', e)
  } finally {
    loading.value = false
  }
}

const { data, pending, execute } = useRequest(getSimpleList, {
  async onSuccess() {
    const data = await getUserRoles(state.value.id!)
    state.value.roleIds = data
    loading.value = false
  },
})

const open = (record: UserVO) => {
  formRef.value?.resetFields()
  execute()
  state.value.id = record.id
  state.value.nickname = record.nickname
  visible.value = true
}

defineExpose({ open })
</script>
