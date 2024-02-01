<template>
  <div class="page flex flex-col items-center">
    <div class="flex-1 py-10">
      <div class="flex items-center justify-center">
        <img class="h-12 w-12 mr-4 rounded" :src="logo" alt="Envision Logo" />
        <h1 class="mb-0">Envision</h1>
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
      <div>Envision &copy; 2024. All Rights Reserved</div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LoginForm from './login-form.vue'
import logo from '~img/logo.svg'

const activeTab = ref(0)
</script>

<style lang="scss" scoped>
@use '@/styles/mixins.scss' as *;
.page {
  background: url('~img/bg-login.png') top center no-repeat;
  background-attachment: fixed;
  min-height: 100vh;
  overflow-x: hidden;
  background-size: 100%;
  background-color: var(--colorBgContainer);
}

h1 {
  color: var(--colorText);
  @apply text-4xl font-bold;
  @include title-font;
}
.subtext {
  color: var(--colorTextSecondary);
  text-align: center;
}
.credit {
  color: var(--colorTextSecondary);
}
.icon {
  @apply mx-1;
  color: var(--red);
}
footer {
  @apply mb-4 text-center;
  color: var(--colorTextTertiary);
}
</style>
