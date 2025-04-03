<template>
  <ACard title="常用应用">
    <template #extra>
      <ATypographyLink @click="createApplication">创建应用</ATypographyLink>
    </template>
    <div class="grid grid-cols-2 gap-2">
      <div v-for="(action, i) in actions" :key="i" class="action-item" @click="go(action.path)">
        <div class="icon">
          <img class="icon-img" v-if="action.icon" :src="action.icon" />
          <img class="icon-img" v-else :src="icon" />
        </div>
        <div class="label">{{ action.appName }}</div>
      </div>
    </div>
  </ACard>
</template>

<script lang="ts" setup>
import { ref, getCurrentInstance } from 'vue'
import icon from '~img/icon-package.svg'
import { getApplications } from '@/api/index'
const { push } = useRouter()

const actions = ref([])

const getShortName = (name: string) => {
  return name.substring(0, 2)
}

onMounted(async () => {
  const res = await getApplications()
  for (let i = 0; i < 4; i++) {
    actions.value.push(res[i])
  }
})

const go = (path: string) => {
  push(path)
}
const createApplication = () => {
  push('/app/list')
}
</script>

<style lang="scss" scoped>
.action-item {
  @apply flex p-2 cursor-pointer gap-2;
  background-color: var(--color-fill-tertiary);
  border-radius: var(--border-radius);

  .icon-plus {
    background-color: transparent !important;
    border: 1px dashed var(--color-border);
    color: var(--color-text-secondary);
  }

  .icon-div {
    @apply h-12 w-12 rounded inline-flex items-center justify-center flex-shrink-0;
    background-color: var(--color-fill-tertiary);
  }
  .icon-img {
    @apply h-12 w-12;
  }
  .label {
  }
  &:hover {
    color: var(--color-primary-text);
    .icon {
      background-color: var(--color-primary-bg);
    }
    .icon-plus {
      border-color: var(--color-primary-text);
      color: var(--color-primary-text);
    }
  }
}
</style>
