<template>
  <ASegmented v-model:value="active" :options="options" size="large" block />
  <div class="mt-6">
    <div v-show="active === 1">
      <AForm :model="model.actor" :label-col="{ style: { width: '80px' } }">
        <AFormItem label="审核人" name="strategy">
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
      <!--      <AAlert message="仍在开发中" type="warning" class="mb-6" show-icon />-->
      <a-form ref="formRef" name="field_config_form" :model="model.fields">
        <a-space
          v-for="(fieldConfig, index) in model.fields"
          :key="index"
          style="display: flex; margin-bottom: 8px; gap: 20px"
          align="baseline"
        >
          <a-form-item
            label="字段名"
            :name="[index, 'name']"
            :rules="[{ required: true, message: '请填写字段名！', trigger: 'blur' }]"
          >
            <a-input v-model:value="fieldConfig.name" placeholder="字段名"></a-input>
          </a-form-item>
          <a-form-item
            label="字段配置"
            :name="[index, 'config']"
            :rules="[{ required: true, message: '请选择字段配置！', trigger: 'blur' }]"
          >
            <a-select
              v-model:value="fieldConfig.config"
              :options="fieldConfigOpts"
              style="width: 130px"
            ></a-select>
          </a-form-item>
          <MinusSquareOutlined
            @click="removeFieldConfig(fieldConfig)"
            :style="{ fontSize: '20px' }"
          />
        </a-space>
        <a-form-item>
          <a-button type="dashed" block @click="addFieldConfig">
            <PlusSquareOutlined />
            添加字段配置
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, reactive } from 'vue'
import { getSimpleAuditList, getSimpleList } from '@/api/system/role'
import useRequest from '@/hooks/use-request'
import { NodeTaskStrategy } from '../../_utils/const'
import { filterOption } from '@/utils/fusion'
import type { SegmentedProps } from 'ant-design-vue'
import type { NPropsAudit } from '@/types/fux-core/flow'
import { PlusSquareOutlined, MinusSquareOutlined } from '@ant-design/icons-vue'

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
type FieldConfigType = {
  name: string
  config: string
}
const removeFieldConfig = (item: FieldConfigType) => {
  const index = model.value.fields.indexOf(item)
  if (index !== -1) {
    model.value.fields.splice(index, 1)
  }
}
const addFieldConfig = () => {
  model.value.fields.push({
    name: '',
    config: '',
  })
}
</script>
