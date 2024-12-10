<template>
  <div class="w-screen h-screen overflow-hidden flex flex-col page">
    <div class="header flex-shrink-0 flex justify-end">
      <div class="extra"></div>
    </div>
    <div class="main flex-1"></div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.page {
  background: url('~vis/vis-bg.jpg') top center no-repeat;
  background-size: cover;
  background-attachment: fixed;
}
.header {
  height: 6rem;
  background: url('~vis/vis-header.svg') top left no-repeat;
  background-size: cover;
  background-position-x: -4rem;
  background-position-y: -1rem;
}
</style>
