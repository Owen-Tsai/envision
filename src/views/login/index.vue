<template>
  <div class="page flex flex-col items-center">
    <div class="flex-1 py-10">
      <div class="flex items-center justify-center">
        <img class="h-14 mx-auto" :src="logo" />
      </div>

      <div class="subtext mt-4">正确、简洁并易于扩展的低代码开发平台</div>

      <ATabs
        v-model:active-key="activeTab"
        class="mt-6"
        centered
        style="width: 328px; min-width: 280px"
      >
        <ATabPane :key="0" tab="账号密码登录">
          <LoginForm />
        </ATabPane>
        <ATabPane :key="1" tab="钉钉扫码登录"></ATabPane>
      </ATabs>
    </div>

    <footer>
      <div>FuxionX 开发团队 &copy; 2024. All Rights Reserved</div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LoginForm from './login-form.vue'
import logo from '~img/logo-simple.svg'

const activeTab = ref(0)

const title = import.meta.env.VITE_APP_SHORT_TITLE
</script>

<style lang="scss" scoped>
@use '@/styles/mixins.scss' as *;
.page {
  background: url('~img/bg-login.png') top center no-repeat;
  background-attachment: fixed;
  min-height: 100vh;
  overflow-x: hidden;
  background-size: 100%;
  background-color: var(--color-bg-container);
}

h1 {
  color: var(--color-text);
  @apply text-4xl font-bold;
  @include title-font;
}
.subtext {
  color: var(--color-text-secondary);
  text-align: center;
}
.credit {
  color: var(--color-text-secondary);
}
.icon {
  @apply mx-1;
  color: var(--red);
}
footer {
  @apply mb-4 text-center;
  color: var(--color-text-tertiary);
}
</style>
