<template>
  <div class="btn-add">
    <APopover v-model:open="open" :arrow="false" trigger="click" placement="rightTop">
      <AButton type="primary" shape="circle" :icon="h(PlusOutlined)" />
      <template #content>
        <div class="flex gap-2">
          <div class="item" @click="onClick('audit')">
            <span class="icon icon-audit">
              <AuditOutlined />
            </span>
            <span class="title">审核人</span>
          </div>
          <div class="item disabled !cursor-not-allowed">
            <span class="icon icon-cc">
              <SendOutlined />
            </span>
            <span class="title">抄送人</span>
          </div>
          <div class="item disabled !cursor-not-allowed">
            <span class="icon icon-condition">
              <BranchesOutlined :rotate="180" />
            </span>
            <span class="title">条件分支</span>
          </div>
        </div>
      </template>
    </APopover>
  </div>
</template>

<script setup lang="ts">
import { h, ref } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'

const emit = defineEmits(['click'])

const open = ref(false)

const onClick = (type: 'audit' | 'group') => {
  emit('click', type)
  open.value = false
}
</script>

<style lang="scss" scoped>
@use '@/styles/flow.scss' as f;

.item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  border-radius: var(--border-radius);
  align-items: center;
  justify-content: center;
  width: 72px;
  cursor: pointer;
  padding: 8px;

  .icon {
    font-size: var(--font-size-xl);
    background-color: var(--color-fill-secondary);
    height: 32px;
    width: 32px;
    border-radius: var(--border-radius);
    @apply flex-center;
  }

  &:not(.disabled):hover {
    background-color: var(--color-fill-secondary);
    .icon {
      background-color: var(--color-primary);
      color: var(--color-white);
    }
  }
}
</style>
