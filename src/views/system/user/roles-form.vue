<template>
  <AModal v-model:open="isOpen" title="分配角色" :confirm-loading="pending || loading" @ok="submit">
    <AAlert type="info" class="mt-4">
      <template #message>
        设置用户
        <b>{{ record?.nickname }}</b>
        的角色：
      </template>
    </AAlert>
    <AForm ref="formRef" :model="formData" class="mt-4">
      <ASpin :spinning="loading || pending">
        <AFormItem label="角色" name="roleIds">
          <ASelect
            v-model:value="formData.roleIds"
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
import useRequest from '@/hooks/use-request'
import useModalOpen from '@/hooks/use-modal'
import type { UserVO } from '@/api/system/user'

const props = defineProps<{
  record?: UserVO
  open?: boolean
}>()

const emit = defineEmits(['success', 'update:open'])
const formRef = ref<FormInstance>()

const isOpen = useModalOpen(props, emit, formRef)

const loading = ref(false)
const formData = ref<{ roleIds: number[] }>({
  roleIds: [],
})

const submit = async () => {
  loading.value = true
  try {
    await formRef.value?.validate()
    await setUserRole(props.record!.id!, formData.value.roleIds)
    message.success('保存成功')
    isOpen.value = false
  } catch (e) {
    // do nothing
  } finally {
    loading.value = false
  }
}

const { data, pending, execute } = useRequest(getSimpleList, {
  async onSuccess() {
    const data = await getUserRoles(props.record!.id!)
    formData.value.roleIds = data
    loading.value = false
  },
})

watch(
  () => props.record?.id,
  (val) => {
    if (val) {
      execute()
    }
  },
)
</script>
