<template>
  <Teleport to="body">
    <div class="page-modal">
      <Spin size="large" />
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { Spin } from 'ant-design-vue'
</script>

<style lang="scss" scoped>
.page-modal {
  position: absolute;
  top: 0;
  left: 0;
  background-color: var(--color-bg-alt);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  z-index: 999;
}
</style>
