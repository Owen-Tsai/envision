<template>
  <ACard title="常用应用">
    <template #extra>
      <ATypographyLink>创建应用</ATypographyLink>
    </template>
    <div class="grid grid-cols-2 gap-2">
      <div v-for="(action, i) in actions" :key="i" class="action-item">
        <div class="icon">
          <img class="icon-img" v-if="action.icon" :src="action.icon" />
          <div class="icon-div" v-else>{{ getShortName(action.label) }}</div>
        </div>
        <div class="label">{{ action.label }}</div>
      </div>
    </div>
  </ACard>
</template>

<script lang="ts" setup>
import { ref, getCurrentInstance } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import icon from '~img/icon-package.svg'

const icons = getCurrentInstance()?.proxy?.$icons!

const actions = ref([
  { label: '生活补贴审核', icon },
  { label: '测试应用10001审核', icon },
  { label: '测试应用10002审核', icon },
  { label: '测试应用10003审核', icon }
])

const getShortName = (name: string) => {
  return name.substring(0, 2)
}
</script>

<style lang="scss" scoped>
.action-item {
  @apply flex p-2 cursor-pointer gap-2;
  background-color: var(--colorFillTertiary);
  border-radius: var(--borderRadius);

  .icon-plus {
    background-color: transparent !important;
    border: 1px dashed var(--colorBorder);
    color: var(--colorTextSecondary);
  }

  .icon-div {
    @apply h-12 w-12 rounded inline-flex items-center justify-center flex-shrink-0;
    background-color: var(--colorFillTertiary);
  }
  .icon-img {
    @apply h-12 w-12;
  }
  .label {
  }
  &:hover {
    color: var(--colorPrimaryText);
    .icon {
      background-color: var(--colorPrimaryBg);
    }
    .icon-plus {
      border-color: var(--colorPrimaryText);
      color: var(--colorPrimaryText);
    }
  }
}
</style>
