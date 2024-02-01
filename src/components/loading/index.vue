<template>
  <Teleport to="body">
    <div class="page-modal">
      <ASpin size="large" />
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.page-modal {
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(#fff, 0.4);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
</style>
