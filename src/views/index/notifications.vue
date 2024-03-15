<template>
  <ACard title="通知公告">
    <template #extra>
      <ATypographyLink>查看全部</ATypographyLink>
    </template>
    <div>
      <RouterLink
        v-for="item in data?.rows"
        :key="item.noticeId"
        :to="`/notice/${item.noticeId}`"
        class="item"
      >
        <EDictTag :dict-object="noticeType" :value="item.noticeType" />
        <div class="truncate flex-grow-1">{{ item.noticeTitle }}</div>
      </RouterLink>
    </div>
  </ACard>
</template>

<script lang="ts" setup>
import useDict from '@/hooks/use-dict'
import useRequest from '@/hooks/use-request'
import { shortList } from '@/api/system/notice'

const { sys_notice_type: noticeType } = useDict('sys_notice_type')

// const { data, pending } = useRequest(shortList, { immediate: true })
</script>

<style lang="scss" scoped>
.item {
  @apply flex items-center gap-1 mt-2 first:mt-0;
  color: var(--colorTextSecondary);

  &:hover {
    color: var(--colorText);
  }
}
</style>
