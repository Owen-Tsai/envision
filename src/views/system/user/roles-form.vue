<template>
  <AModal
    v-model:open="open"
    title="分配角色"
    destroy-on-close
    :after-close="resetFields"
    :confirm-loading="pending || loading"
    @ok="submit"
  >
    <AAlert type="info" class="mt-4">
      <template #message>
        设置用户
        <b>{{ record.nickname }}</b>
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
import { ref, type PropType } from 'vue'
import { message, type FormInstance } from 'ant-design-vue'
import { setUserRole, getUserRoles } from '@/api/system/permission'
import { getSimpleList } from '@/api/system/role'
import useRequest from '@/hooks/use-request'
import type { UserVO } from '@/api/system/user'

const props = defineProps({
  record: {
    type: Object as PropType<UserVO>,
    required: true
  }
})

const emit = defineEmits(['success', 'close'])

const formRef = ref<FormInstance>()
const loading = ref(false)
const open = ref(true)
const formData = ref<{ roleIds: number[] }>({
  roleIds: []
})

const submit = async () => {
  loading.value = true
  try {
    await formRef.value?.validate()
    await setUserRole(props.record.id!, formData.value.roleIds)
    message.success('保存成功')
    open.value = false
  } catch (e) {
    // do nothing
  } finally {
    loading.value = false
  }
}

const resetFields = () => {
  formRef.value?.resetFields()
  emit('close')
}

const { data, pending } = useRequest(getSimpleList, {
  immediate: true,
  async onSuccess() {
    const data = await getUserRoles(props.record.id!)
    formData.value.roleIds = data
    loading.value = false
  }
})
</script>
