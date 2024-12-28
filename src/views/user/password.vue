<template>
  <AForm
    :model="formData"
    :label-col="{ style: { width: '100px' } }"
    :rules="rules"
    @submit="submit"
  >
    <ASpin :spinning="loading">
      <AFormItem label="旧密码" name="oldPassword">
        <AInputPassword v-model:value="formData.oldPassword" />
      </AFormItem>
      <AFormItem label="新密码" name="newPassword">
        <AInputPassword v-model:value="formData.newPassword" />
      </AFormItem>
      <AFormItem label="确认新密码" name="newPasswordConfirm">
        <AInputPassword v-model:value="formData.newPasswordConfirm" />
      </AFormItem>

      <div class="ml-100px">
        <AButton type="primary" html-type="submit">保存</AButton>
      </div>
    </ASpin>
  </AForm>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { message, type FormProps } from 'ant-design-vue'
import useUserStore from '@/stores/user'
import { updatePassword } from '@/api/system/user/profile'

const passValidator = async (_rule: any, value: string) => {
  if (value !== formData.value.newPassword) {
    return Promise.reject('两次输入的密码不一致')
  } else {
    return Promise.resolve()
  }
}

const rules: FormProps['rules'] = {
  oldPassword: [{ required: true, message: '请输入旧密码' }],
  newPassword: [{ required: true, message: '请设置新密码' }],
  newPasswordConfirm: [
    { required: true, message: '请再次输入新密码' },
    { validator: passValidator, trigger: 'change' },
  ],
}

const loading = ref(false)
const formData = ref({
  oldPassword: '',
  newPassword: '',
  newPasswordConfirm: '',
})

const submit = async () => {
  try {
    await updatePassword(formData.value)
    message.success('保存成功，即将重新登录', 3000)

    setTimeout(() => {
      useUserStore()
        .logout()
        .then(() => {
          window.location.href = '/login'
        })
    }, 3000)
  } finally {
    loading.value = false
  }
}
</script>
