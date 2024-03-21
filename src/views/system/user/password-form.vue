<template>
  <AModal
    v-model:open="open"
    title="重置密码"
    destroy-on-close
    :after-close="resetFields"
    :confirm-loading="loading"
    @ok="submit"
  >
    <AAlert type="info" class="mt-4">
      <template #message>
        <div>
          修改用户
          <b>{{ nickname }}</b>
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
import { ref } from 'vue'
import { resetUserPwd } from '@/api/system/user'
import type { FormInstance } from 'ant-design-vue'

const props = defineProps({
  id: {
    type: Number,
    required: true
  },
  nickname: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['success', 'close'])

const formRef = ref<FormInstance>()
const loading = ref(false)
const open = ref(true)
const formData = ref({
  password: ''
})

const submit = async () => {
  loading.value = true
  try {
    await formRef.value?.validate()
    await resetUserPwd(props.id, formData.value.password as string)
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
</script>
