<template>
  <div class="page flex flex-col items-center">
    <div class="flex-1 py-10">
      <div class="flex items-center justify-center">
        <img class="h-14 mx-auto" :src="logo" />
      </div>

      <div class="subtext mt-4">正确、简洁并易于扩展的低代码开发平台</div>

      <div class="wrapper mt-8 px-4">
        <div class="flex-center header">
          <div class="title px-2 py-1 flex-center rounded-full">管理后台登录</div>
        </div>
        <LoginForm />
      </div>
    </div>

    <footer>
      <div>{{ footer }}</div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import LoginForm from './login-form.vue'
import logo from '~img/logo-simple.svg'

const footer = import.meta.env.VITE_APP_FOOTER
</script>

<style lang="scss" scoped>
@use '@/styles/mixins.scss' as *;
.page {
  background: url('~img/login-bg.png') top center no-repeat;
  background-attachment: fixed;
  min-height: 100vh;
  overflow-x: hidden;
  background-size: 100%;
  background-color: var(--color-bg-container);
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
.wrapper {
  position: relative;
  .header {
    position: relative;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      width: 100%;
      height: 2px;
      background: radial-gradient(50% 50% at 50% 50%, var(--color-primary), transparent);
    }
  }
  .title {
    background-color: var(--color-primary-bg);
    color: var(--color-primary-text);
    border: 1px solid var(--color-primary);
    z-index: 0;
  }
}
</style>
