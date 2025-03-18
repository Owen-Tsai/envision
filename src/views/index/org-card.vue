<template>
  <ACard>
    <ARow>
      <ACol :span="11" class="user">
        <div class="flex items-center gap-2 lg:gap-4 overflow-hidden">
          <AAvatar :src="user?.avatar" :size="screen.lg ? 64 : 48" class="flex-shrink-0" />
          <div class="text-truncate">
            <div class="text-xl lg:text-2xl text-truncate">你好，{{ user?.nickname }}</div>
            <div class="info">
              <span>{{ depts?.find((d) => d.id === user?.deptId)?.name || '未分配部门' }}</span>
              <ADivider type="vertical" />
              <span>未绑定手机</span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2 mt-6">
          <RouterLink v-for="link in links" :key="link.path" :to="link.path" class="link">
            <div class="flex items-center gap-2">
              <img :src="link.icon" />
              <div>{{ link.name }}</div>
            </div>
          </RouterLink>
        </div>
      </ACol>
      <ACol :span="13" class="stats">
        <div class="title">整体情况统计</div>
        <div class="grid grid-cols-3 gap-2">
          <AStatistic
            v-for="(entry, i) in stats"
            :key="i"
            :title="entry.name"
            :suffix="entry.suffix"
            :value="entry.value"
          >
            <template #formatter>
              <Counter :end-val="entry.value" :decimal-places="entry.decimal || 0" />
            </template>
          </AStatistic>
        </div>
      </ACol>
    </ARow>
  </ACard>
</template>

<script setup lang="ts">
import { Grid } from 'ant-design-vue'
import useRequest from '@/hooks/use-request'
import useUserStore from '@/stores/user'
import { getDeptSimpleList } from '@/api/system/dept'
import iGroup from '~img/icon-ugroup.svg'
import iDept from '~img/icon-dept.svg'
import iProfile from '~img/icon-id-card.svg'
import iAccount from '~img/icon-account.svg'
import { getIndexData } from '@/api/index'

const links = [
  { name: '用户管理', icon: iGroup, path: '/system/user' },
  { name: '部门管理', icon: iDept, path: '/system/dept' },
  { name: '角色设置', icon: iAccount, path: '/system/role' },
  { name: '个人设置', icon: iProfile, path: '/me' },
]

// let stats = [
//   { name: '应用总数', value: 6 },
//   { name: '上架应用数', value: 2 },
//   { name: '计划启用数', value: 7 },
//   { name: '业务办理量', value: 8, suffix: '人次' },
//   { name: '办理通过率', value: '90.65', suffix: '%', decimal: 2 },
// ]

const { user } = storeToRefs(useUserStore())
const { data: depts } = useRequest(getDeptSimpleList, {
  immediate: true,
})

const { data: stats, pending } = useRequest(getIndexData, {
  immediate: true,
})

const screen = Grid.useBreakpoint()
</script>

<style lang="scss" scoped>
.user {
  border-right: 1px solid var(--color-border);
  padding-right: 24px;
}
.link {
  color: var(--color-text);
  background-color: var(--color-fill-secondary);
  border-radius: var(--border-radius);
  padding: 4px 8px;

  img {
    @apply size-32px;
  }

  &:hover {
    background-color: var(--color-fill);
  }
}
.stats {
  padding-left: 24px;

  .title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 16px;
  }
}
</style>
