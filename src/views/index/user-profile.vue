<template>
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-2 lg:gap-4">
      <AAvatar :src="user?.avatar" :size="screen.lg ? 64 : 48" />
      <div>
        <div class="text-xl lg:text-2xl">欢迎回来，{{ user?.nickname }}</div>
        <div class="info">
          <span>人才公共服务部</span>
          <ADivider type="vertical" />
          <span>{{ user?.mobile ? desensitizePhoneNumber(user.mobile) : '未绑定手机' }}</span>
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

    <div v-show="screen.lg" class="flex items-center gap-4">
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
import { Grid } from 'ant-design-vue'
import useUserStore from '@/stores/user'

const { user } = storeToRefs(useUserStore())

const screen = Grid.useBreakpoint()

const desensitizePhoneNumber = (str: string) => {
  return str.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}
</script>

<style lang="scss" scoped>
.info {
  color: var(--color-text-secondary);
  @apply flex items-center gap-1;
}
.profile-btn {
  color: var(--color-text-secondary);
}
</style>
