<template>
  <ACard title="快捷操作">
    <template #extra>
      <ATypographyLink>管理</ATypographyLink>
    </template>
    <div class="grid grid-cols-3 gap-x-1 gap-y-5">
      <div v-for="(action, i) in actions" :key="i" class="action-item">
        <div class="icon">
          <component v-if="action.icon" :is="icons[action.icon]" class="text-lg" />
          <div class="px-1" v-else>{{ getShortName(action.label) }}</div>
        </div>
        <div class="label">{{ action.label }}</div>
      </div>

      <div class="action-item">
        <div class="icon icon-plus">
          <PlusOutlined />
        </div>
        <div class="label">新增</div>
      </div>
    </div>
  </ACard>
</template>

<script lang="ts" setup>
import { ref, getCurrentInstance } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'

const icons = getCurrentInstance()?.proxy?.$icons!

const actions = ref([
  { label: '托育补贴审核' },
  { label: '通知发布', icon: 'NotificationOutlined' },
  { label: '人才引进补贴审核' },
  { label: '人才公寓审核' },
  { label: '留言反馈', icon: 'MessageOutlined' },
  { label: '流程管理', icon: 'SisternodeOutlined' },
  { label: '人才卡审核', icon: 'IdcardOutlined' }
])

const getShortName = (name: string) => {
  return name.substring(0, 2)
}
</script>

<style lang="scss" scoped>
.action-item {
  @apply flex flex-col items-center px-2 cursor-pointer;

  .icon-plus {
    background-color: transparent !important;
    border: 1px dashed var(--colorBorder);
    color: var(--colorTextSecondary);
  }

  .icon {
    @apply h-10 w-10 rounded inline-flex items-center justify-center;
    background-color: var(--colorFillTertiary);
  }
  .label {
    @apply truncate w-full overflow-hidden text-center mt-2 text-xs;
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
