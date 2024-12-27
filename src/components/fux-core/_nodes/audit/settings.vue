<template>
  <ASegmented v-model:value="active" :options="options" size="large" block />
  <div class="mt-6">
    <div v-show="active === 1">
      <AForm :model="model.actor" :label-col="{ style: { width: '80px' } }">
        <AFormItem
          label="审核人"
          name="strategy"
          :rules="[{ required: true, message: '请选择审核人' }]"
        >
          <ASelect
            v-model:value="model.actor.strategy"
            :options="auditActorStrategyOpts"
            @change="onSelectChange"
          />
        </AFormItem>
        <AFormItem
          v-if="model.actor.strategy === NodeTaskStrategy.ROLE"
          label="选择角色"
          name="value"
          :rules="[{ required: true, message: '请选择角色' }]"
        >
          <ASelect
            v-model:value="model.actor.value"
            :options="rolesList"
            :field-names="{ label: 'name', value: 'id' }"
            show-search
            mode="multiple"
            :filter-option="(input, option) => filterOption(input, option, 'name')"
            placeholder="请输入角色名称进行过滤"
            allow-clear
            :loading="pending"
            @change="onSelectChange"
          />
        </AFormItem>
      </AForm>
    </div>
    <div v-show="active === 2">
      <AForm ref="formRef" :model="model.fields" :validate-trigger="['change', 'blur']">
        <div
          v-for="(fieldConfig, index) in model.fields"
          :key="index"
          class="flex items-baseline gap-4"
        >
          <AFormItem
            label="字段名"
            :name="[index, 'name']"
            class="flex-grow"
            :rules="[{ required: true, message: '请输入字段名' }]"
          >
            <AInput v-model:value="fieldConfig.name" placeholder="如：com_apply:name" />
          </AFormItem>
          <AFormItem
            label="字段配置"
            :name="[index, 'config']"
            class="flex-shrink-0"
            :rules="[{ required: true, message: '请选择字段配置' }]"
          >
            <ASelect
              v-model:value="fieldConfig.config"
              :options="fieldConfigOpts"
              style="width: 100px"
            />
          </AFormItem>
          <AButton type="text" danger @click="removeFieldConfig(fieldConfig)" class="flex-shrink-0">
            <template #icon>
              <CloseOutlined />
            </template>
          </AButton>
        </div>
        <AFormItem>
          <AButton type="dashed" block @click="addFieldConfig">
            <PlusOutlined />
            添加字段配置
          </AButton>
        </AFormItem>
      </AForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getSimpleAuditList } from '@/api/system/role'
import useRequest from '@/hooks/use-request'
import { NodeTaskStrategy } from '../../_utils/const'
import { filterOption } from '@fusionx/utils'
import type { SegmentedProps } from 'ant-design-vue'
import type { NPropsAudit, NPropsFieldConfig } from '@/types/fux-core/flow'

const options: SegmentedProps['options'] = [
  { label: '审核人设置', value: 1 },
  { label: '表单设置', value: 2 },
]

const auditActorStrategyOpts = [
  { label: '指定角色', value: NodeTaskStrategy.ROLE },
  { label: '所属单位', value: NodeTaskStrategy.ORG },
]

const { data: rolesList, pending } = useRequest(getSimpleAuditList, { immediate: true })

const { attrs } = defineProps<{
  attrs: NPropsAudit
}>()

const emit = defineEmits(['update:attrs'])

const model = computed({
  get: () => attrs,
  set: (val) => {
    emit('update:attrs', val)
  },
})

const active = ref(1)

const onSelectChange = () => {
  const first = model.value.actor.value?.[0]
  model.value.actor.text = rolesList.value?.find((u) => u.id === first)?.name
}

watch(
  () => model.value.actor.strategy,
  (val) => {
    if (val === NodeTaskStrategy.ORG) {
      model.value.actor.value = ['org']
    } else {
      model.value.actor.value = undefined
    }
    model.value.actor.text = val === NodeTaskStrategy.ORG ? '发起人所属单位' : undefined
  },
)

const fieldConfigOpts = [
  { label: '可见', value: 'show' },
  { label: '隐藏', value: 'hide' },
  { label: '只读', value: 'readonly' },
  { label: '可编辑', value: 'edit' },
]

const removeFieldConfig = (item: NPropsFieldConfig) => {
  const index = model.value.fields.indexOf(item)
  if (index !== -1) {
    model.value.fields.splice(index, 1)
  }
}
const addFieldConfig = () => {
  model.value.fields.push({})
}
</script>
