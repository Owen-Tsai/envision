<template>
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-4">
      <AAvatar :src="avatar" :size="64" />
      <div>
        <div class="name">欢迎回来，{{ name }}</div>
        <div class="info">
          <span>{{ deptName || '暂无部门' }}</span>
          <ADivider type="vertical" />
          <span>{{ phoneNumber ? desensitizePhoneNumber(phoneNumber) : '未绑定手机' }}</span>
        </div>
      </div>
      <div>
        <ATooltip title="修改个人信息">
          <AButton type="text" class="profile-btn">
            <template #icon>
              <EditOutlined />
            </template>
          </AButton>
        </ATooltip>
      </div>
    </div>

    <div class="flex items-center gap-4">
      <AStatistic title="待办事项" :value="45" />
      <ADivider type="vertical" class="h-12" />
      <AStatistic title="待审批" :value="12" />
      <ADivider type="vertical" class="h-12" />
      <AStatistic title="已办结" :value="28" />
      <ADivider type="vertical" class="h-12" />
      <AStatistic title="完成率" :value="87.82" suffix="%" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { EditOutlined } from '@ant-design/icons-vue'
import useUserStore from '@/stores/user'
import { desensitizePhoneNumber } from '@/utils/envision'

const { avatar, name, deptName, phoneNumber } = storeToRefs(useUserStore())
</script>

<style lang="scss" scoped>
.name {
  font-size: 24px;
}
.info {
  color: var(--colorTextSecondary);
  @apply flex items-center gap-1;
}
.profile-btn {
  color: var(--colorTextSecondary);
}
</style>
