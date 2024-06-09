<template>
  <ACard title="通知公告">
    <template #extra>
      <ATypographyLink @click="toNotificationList">查看全部</ATypographyLink>
    </template>
    <div>
      <ASpin :spinning="pending">
        <div class="min-h-20">
          <RouterLink
            v-for="item in data?.list"
            :key="item.id"
            :to="`/system/notice/${item.id}`"
            class="item"
          >
            <EDictTag :dict-object="systemNoticeType" :value="item.type!" />
            <div class="truncate flex-grow-1">{{ item.title }}</div>
          </RouterLink>
        </div>
      </ASpin>
    </div>
  </ACard>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import useDict from '@/hooks/use-dict'
import useRequest from '@/hooks/use-request'
import { getNotificationList } from '@/api/system/notification'

const { push } = useRouter()

const [systemNoticeType] = useDict('system_notice_type')

const { data, pending } = useRequest(() => getNotificationList({ pageNo: 1, pageSize: 5 }), {
  immediate: true
})

const toNotificationList = () => {
  push('/system/notice')
}
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
