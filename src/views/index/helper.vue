<template>
  <div class="px-4">
    <ADivider />
    <AFlex :gap="16" wrap="wrap">
      <a href="#">前端开发指南</a>
      <a href="#">后端开发指南</a>
      <a href="#">使用手册</a>
      <a href="#">Github 仓库</a>
      <a href="#">Gitee 仓库</a>
      <a href="#">部署指南</a>
    </AFlex>
  </div>
</template>

<style lang="scss" scoped>
a {
  color: var(--colorTextSecondary);
  &:hover {
    color: var(--colorTextBase);
  }
}
</style>
