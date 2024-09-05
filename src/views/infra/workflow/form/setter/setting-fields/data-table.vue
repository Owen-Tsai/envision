<template>
  <AFormItem label="切换配置对象">
    <ARadioGroup
      v-model:value="computedProps.model.mode"
      buttonStyle="solid"
      optionType="button"
      :options="modeOpts"
    />
  </AFormItem>
  <div v-show="computedProps.model.mode === 'table'">
    <AFormItem label="列配置">
      <AButton block type="dashed">编辑列配置</AButton>
    </AFormItem>
    <AFormItem label="启用分页" class="setter-boolean-field">
      <ASwitch v-model:checked="usePagination" />
    </AFormItem>
    <div v-show="usePagination">
      <AFormItem label="精简分页模式" class="setter-boolean-field">
        <ASwitch v-model:checked="computedProps.pagination.lite" />
      </AFormItem>
      <AFormItem label="小尺寸" class="setter-boolean-field">
        <ASwitch v-model:checked="computedProps.pagination.small" />
      </AFormItem>
      <AFormItem label="每页数量" :name="['pagination', 'pageSize']">
        <AInputNumber
          v-model:value="computedProps.pagination.pageSize"
          :min="1"
          :step="1"
          class="w-full"
        />
      </AFormItem>
    </div>
  </div>
  <div v-show="computedProps.model.mode === 'form'">
    <AFormItem label="表单标题" extra="标题将自动添加动作前缀">
      <AInput v-model:value="computedProps.children[0].title" />
    </AFormItem>
  </div>

  <AModal></AModal>
</template>

<script setup lang="ts">
import { ref, computed, type PropType } from 'vue'
import type { WPropsDataTable } from '@/types/workflow'

const modeOpts = [
  { label: '配置表格', value: 'table' },
  { label: '配置表单', value: 'form' }
]

const props = defineProps({
  opts: {
    type: Object as PropType<WPropsDataTable>,
    required: true
  }
})

const emit = defineEmits(['update:opts'])

const usePagination = ref(false)

const computedProps = computed({
  get: () => props.opts,
  set: (val) => {
    emit('update:opts', val)
  }
})
</script>
