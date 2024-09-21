<template>
  <div class="btn-add">
    <APopover :arrow="false" trigger="click" placement="rightTop">
      <AButton type="primary" shape="circle" :icon="h(PlusOutlined)" />
      <template #content>
        <div class="flex gap-2">
          <div class="item" @click="addNode('audit')">
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
          <div class="item" @click="addNode('group')">
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
import { h } from 'vue'
import { PlusOutlined, AuditOutlined, BranchesOutlined, SendOutlined } from '@ant-design/icons-vue'

const emit = defineEmits(['addNode'])

const addNode = (type: 'audit' | 'group') => {
  emit('addNode', type)
}
</script>

<style lang="scss" scoped>
@use '@/styles/flow.scss' as f;

.item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  border-radius: var(--borderRadius);
  align-items: center;
  justify-content: center;
  width: 72px;
  cursor: pointer;
  padding: 8px;

  .icon {
    font-size: var(--fontSizeXL);
    background-color: var(--colorFillSecondary);
    height: 32px;
    width: 32px;
    border-radius: var(--borderRadius);
    @apply flex-center;
  }

  &:not(.disabled):hover {
    background-color: var(--colorFillSecondary);
    .icon {
      background-color: var(--colorPrimary);
      color: var(--colorWhite);
    }
  }
}
</style>
