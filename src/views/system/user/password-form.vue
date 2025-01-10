<template>
  <AModal v-model:open="visible" title="重置密码" :confirm-loading="loading" @ok="submit">
    <AAlert type="info" class="mt-4">
      <template #message>
        <div>
          修改用户
          <b>{{ state?.nickname }}</b>
          的密码，该操作不可撤销。
        </div>
      </template>
    </AAlert>
    <AForm ref="formRef" :model="state" class="mt-4">
      <AFormItem
        label="密码"
        name="password"
        :rules="[{ required: true, message: '请输入新密码' }]"
      >
        <AInputPassword v-model:value="state.password" placeholder="请输入新密码" />
      </AFormItem>
    </AForm>
  </AModal>
</template>

<script lang="ts" setup>
import { resetUserPwd, type UserVO } from '@/api/system/user'
import logger from '@/utils/logger'
import { message, type FormInstance } from 'ant-design-vue'

const visible = ref(false)
const formRef = useTemplateRef<FormInstance>('formRef')

const loading = ref(false)
const state = ref<{ password?: string; id?: number; nickname?: string }>({})

const submit = async () => {
  loading.value = true
  try {
    await formRef.value?.validate()
    await resetUserPwd(state.value.id!, state.value.password!)
    message.success('密码重置成功')
    visible.value = false
  } catch (e) {
    logger.error('[system/user/password-form.vue] 表单提交失败。', e)
  } finally {
    loading.value = false
  }
}

const open = (record: UserVO) => {
  formRef.value?.resetFields()

  state.value.id = record.id
  state.value.nickname = record.nickname
  visible.value = true
}

defineExpose({ open })
</script>
