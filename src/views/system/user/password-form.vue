<template>
  <AModal v-model:open="isOpen" title="重置密码" :confirm-loading="loading" @ok="submit">
    <AAlert type="info" class="mt-4">
      <template #message>
        <div>
          修改用户
          <b>{{ record?.nickname }}</b>
          的密码，该操作不可撤销。
        </div>
      </template>
    </AAlert>
    <AForm ref="formRef" :model="formData" class="mt-4">
      <AFormItem
        label="密码"
        name="password"
        :rules="[{ required: true, message: '请输入新密码' }]"
      >
        <AInputPassword v-model:value="formData.password" placeholder="请输入新密码" />
      </AFormItem>
    </AForm>
  </AModal>
</template>

<script lang="ts" setup>
import { resetUserPwd, type UserVO } from '@/api/system/user'
import useModalOpen from '@/hooks/use-modal'
import { message, type FormInstance } from 'ant-design-vue'

const props = defineProps<{
  record?: UserVO
  open?: boolean
}>()

const emit = defineEmits(['success', 'update:open'])
const formRef = useTemplateRef<FormInstance>('formRef')

const isOpen = useModalOpen(props, emit, formRef)

const loading = ref(false)
const formData = ref({
  password: '',
})

const submit = async () => {
  loading.value = true
  try {
    await formRef.value?.validate()
    await resetUserPwd(props.record!.id!, formData.value.password as string)
    message.success('密码重置成功')
    isOpen.value = false
  } catch (e) {
    // do nothing
  } finally {
    loading.value = false
  }
}
</script>
