<template>
  <AAlert v-if="error" :message="error" type="error" show-icon />
  <AForm :model="formState" size="large" class="mt-6" :rules="rules" @submit="handleSubmit">
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
    <AFormItem no-style>
      <div class="flex items-center justify-between mb-4">
        <ACheckbox v-model:checked="formState.remember">记住密码</ACheckbox>
        <ATypographyLink>忘记密码？</ATypographyLink>
      </div>
    </AFormItem>
    <AButton type="primary" html-type="submit" block :loading="pending">登录</AButton>
  </AForm>

  <Captcha
    v-if="captchaEnabled"
    ref="captcha"
    v-model:open="capcthaVisible"
    @success="(verificationCode: string) => doLogin(verificationCode)"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import useRequest from '@/hooks/use-request'
import useUserStore from '@/stores/user'
import useStorage from '@/hooks/use-storage'
import { decrypt, encrypt } from '@/utils/encryption'
import { useRouter, useRoute } from 'vue-router'
import Captcha from '@/components/jigsaw-captcha/index.vue'
import type { FormProps } from 'ant-design-vue'

const captchaEnabled = import.meta.env.VITE_CAPTCHA_ENABLED === 'true'

type Rules = FormProps['rules']

const storage = useStorage()
const { login } = useUserStore()
const router = useRouter()
const route = useRoute()

const captcha = ref<InstanceType<typeof Captcha>>()
const capcthaVisible = ref(false)

const rules: Rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
}

const formState = ref({
  username: 'admin',
  password: 'admin123',
  captchaVerification: '',
  remember: false
})

const { error, pending, execute } = useRequest(() => login(formState.value), {
  onSuccess() {
    setRememberedForm()

    const query = route.query
    let redirect: string | null = query.redirect as string | null
    delete query.redirect
    router.push({ path: redirect || '/', query })
  },
  onError() {
    captchaEnabled && captcha.value?.refetch()
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

const doLogin = (verificationCode: string) => {
  formState.value.captchaVerification = verificationCode
  execute()
  capcthaVisible.value = false
}

const handleSubmit = () => {
  if (captchaEnabled) {
    capcthaVisible.value = true
  } else {
    execute()
  }
}

getRememberedForm()
</script>
