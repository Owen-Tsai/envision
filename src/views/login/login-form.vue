<template>
  <AAlert v-if="error" :message="error" type="error" show-icon />
  <AForm :model="formState" size="large" class="mt-6" :rules="rules" @submit="doLogin">
    <AFormItem name="username">
      <AInput v-model:value="formState.username" allow-clear placeholder="请输入用户名">
        <template #prefix>
          <UserOutlined />
        </template>
      </AInput>
    </AFormItem>
    <AFormItem name="password">
      <AInputPassword v-model:value="formState.password" allow-clear placeholder="请输入密码">
        <template #prefix>
          <LockOutlined />
        </template>
      </AInputPassword>
    </AFormItem>
    <ARow v-if="!data || data.captchaEnabled" :gutter="16">
      <ACol :span="16">
        <AFormItem name="code">
          <AInput v-model:value="formState.code" placeholder="请输入验证码">
            <template #prefix>
              <SafetyCertificateOutlined />
            </template>
          </AInput>
        </AFormItem>
      </ACol>
      <ACol :span="8">
        <ATooltip title="点击更换验证码">
          <img
            v-show="data"
            class="block w-full cursor-pointer h-[40px]"
            :src="`data:image/gif;base64,${data?.img}`"
            @click="fetchCaptcha"
          />
        </ATooltip>
      </ACol>
    </ARow>
    <AFormItem no-style>
      <div class="flex items-center justify-between mb-4">
        <ACheckbox v-model:checked="formState.remember">记住密码</ACheckbox>
        <ATypographyLink>忘记密码？</ATypographyLink>
      </div>
    </AFormItem>
    <AButton type="primary" html-type="submit" block :loading="pending">登录</AButton>
  </AForm>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { UserOutlined, LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons-vue'
import useRequest from '@/hooks/use-request'
import { getCaptcha } from '@/api/login'
import useUserStore from '@/stores/user'
import useStorage from '@/hooks/use-storage'
import { decrypt, encrypt } from '@/utils/encryption'
import { useRouter, useRoute } from 'vue-router'
import type { FormProps } from 'ant-design-vue'

type Rules = FormProps['rules']

const storage = useStorage()
const { login } = useUserStore()
const router = useRouter()
const route = useRoute()

const rules: Rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
}

const formState = ref({
  username: 'admin',
  password: 'admin123',
  code: '',
  uuid: '',
  remember: false
})

const { data, execute: fetchCaptcha } = useRequest(getCaptcha, {
  immediate: true,
  onSuccess(data) {
    formState.value.uuid = data.uuid
  }
})

const {
  error,
  pending,
  execute: doLogin
} = useRequest(() => login(formState.value), {
  onSuccess() {
    setRememberedForm()

    const query = route.query
    let redirect: string | null = query.redirect as string | null
    delete query.redirect
    router.push({ path: redirect || '/', query })
  },
  onError() {
    fetchCaptcha()
  }
})

const getRememberedForm = () => {
  const memorize: boolean = storage.get('remember')
  const password = storage.get('password')
  if (memorize === true) {
    formState.value.username = storage.get('username')
    formState.value.password = password ? (decrypt(password) as string) : ''
    formState.value.remember = true
  }
}

const setRememberedForm = () => {
  const memorize = formState.value.remember
  const expireSeconds = 3600 * 24 * 7
  if (memorize) {
    storage.set('username', formState.value.username, { exp: expireSeconds })
    storage.set('password', encrypt(formState.value.username), { exp: expireSeconds })
  } else {
    storage.delete('username')
    storage.delete('password')
  }
}

getRememberedForm()
</script>
