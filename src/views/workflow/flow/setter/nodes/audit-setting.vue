<template>
  <ASegmented v-model:value="active" :options="options" size="large" block />
  <div class="mt-6">
    <div v-show="active === 1">
      <AForm :model="computedConfig.actor" :label-col="{ style: { width: '80px' } }">
        <AFormItem label="审核人" name="strategy">
          <ASelect
            v-model:value="computedConfig.actor.strategy"
            :options="auditActorStrategyOpts"
          />
        </AFormItem>
        <AFormItem v-if="computedConfig.actor.strategy" :label="label" name="value">
          <ASelect
            v-if="computedConfig.actor.strategy === ActorStrategy.USER"
            v-model:value="computedConfig.actor.value"
            :options="selectOpts.users"
            :field-names="{ label: 'nickname', value: 'id' }"
            show-search
            mode="multiple"
            :filter-option="(input, option) => filterOption(input, option, 'nickname')"
            placeholder="请输入用户名称进行过滤"
            allow-clear
            @change="onSelectChange"
          />
          <ASelect
            v-if="computedConfig.actor.strategy === ActorStrategy.ROLE"
            v-model:value="computedConfig.actor.value"
            :options="selectOpts.roles"
            :field-names="{ label: 'name', value: 'id' }"
            show-search
            mode="multiple"
            :filter-option="(input, option) => filterOption(input, option, 'name')"
            placeholder="请输入角色名称进行过滤"
            allow-clear
            @change="onSelectChange"
          />
          <ATreeSelect
            v-if="computedConfig.actor.strategy === ActorStrategy.DEPT"
            v-model:value="computedConfig.actor.value"
            :tree-data="selectOpts.depts"
            allow-clear
            multiple
            tree-checkable
            :field-names="{ label: 'name', value: 'id' }"
            tree-default-expand-all
            @change="onTreeSelectChange"
          />
        </AFormItem>
      </AForm>
    </div>
    <div v-show="active === 2">
      <AAlert message="Under Development" type="warning" class="mb-6" show-icon />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, type PropType } from 'vue'
import { getSimpleUserList, type SimpleUserVO } from '@/api/system/user'
import { getSimpleList as getSimpleRoleList, type RoleVO } from '@/api/system/role'
import { getDeptTree, type DeptTreeVO } from '@/api/system/dept'
import { ActorStrategy, type NPropsAudit } from '@/types/workflow/flow'
import { filterOption } from '@/utils/fusion'
import type { SegmentedProps } from 'ant-design-vue'

const options: SegmentedProps['options'] = [
  { label: '审核人设置', value: 1 },
  { label: '表单设置', value: 2 }
]

const auditActorStrategyOpts = [
  { label: '本单位', value: ActorStrategy.USER },
  { label: '指定角色', value: ActorStrategy.ROLE }
]

const props = defineProps({
  config: {
    type: Object as PropType<NPropsAudit>,
    required: true
  }
})

const emit = defineEmits(['update:config'])
let __cached: number | string | undefined = undefined

const active = ref(1)
const selectOpts = ref<{
  users: SimpleUserVO
  roles: RoleVO[]
  depts: DeptTreeVO
}>({
  depts: [],
  roles: [],
  users: []
})

const computedConfig = computed({
  get: () => props.config,
  set: (val) => {
    emit('update:config', val)
  }
})

const label = computed(() => {
  const { strategy } = computedConfig.value.actor

  if (strategy === ActorStrategy.USER) {
    return '选择用户'
  }
  if (strategy === ActorStrategy.ROLE) {
    return '选择角色'
  }
  if (strategy === ActorStrategy.DEPT) {
    return '选择部门'
  }

  return ''
})

const onSelectChange = () => {
  const { strategy } = computedConfig.value.actor
  const first = computedConfig.value.actor.value?.[0]
  if (first !== __cached) {
    __cached = first
    if (strategy === ActorStrategy.USER) {
      computedConfig.value.actor.text = selectOpts.value.users.find((u) => u.id === first)?.nickname
    }
    if (strategy === ActorStrategy.ROLE) {
      computedConfig.value.actor.text = selectOpts.value.roles.find((u) => u.id === first)?.name
    }
  }
}

const onTreeSelectChange = (_: any, label: string[]) => {
  const first = computedConfig.value.actor.value?.[0]
  if (first !== __cached) {
    __cached = first
    if (first) {
      computedConfig.value.actor.text = label[0]
    }
  }
}

getSimpleUserList().then((res) => {
  selectOpts.value.users = res
})

getSimpleRoleList().then((res) => {
  selectOpts.value.roles = res
})

getDeptTree().then((res) => {
  selectOpts.value.depts = res
})

watch(
  () => computedConfig.value.actor.strategy,
  (item) => {
    if (item === 30) {
      computedConfig.value.actor.value = ['org']
      computedConfig.value.actor.text = '单位'
    } else {
      computedConfig.value.actor.value = undefined
      computedConfig.value.actor.text = undefined
    }
  }
)
</script>
