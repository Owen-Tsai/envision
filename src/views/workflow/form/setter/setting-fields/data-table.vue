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
      <AButton block type="dashed" @click="columnConfigModal.visible = true">编辑列配置</AButton>
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
    <AFormItem
      label="表单对话框宽度"
      placeholder="请输入含单位的值(px/%)"
      extra="实际宽度将考虑内边距"
    >
      <AInput v-model:value="computedProps.children[0].width" />
    </AFormItem>
  </div>

  <AModal
    v-model:open="columnConfigModal.visible"
    title="数据表列配置"
    :width="840"
    @ok="saveColumnsConfig"
  >
    <AForm :model="columnConfigModal" class="mt-4 dense-form">
      <div
        v-for="(item, index) in columnConfigModal.columns"
        :key="index"
        class="flex items-center gap-4 mb-4"
      >
        <AFormItem label="列名称" :name="['columns', index, 'title']" class="flex-1">
          <AInput v-model:value="item.title" />
        </AFormItem>
        <AFormItem label="键名" :name="['columns', index, 'key']" class="flex-1">
          <AInput v-model:value="item.key" />
        </AFormItem>
        <AFormItem label="宽度" :name="['columns', index, 'width']" class="flex-1">
          <AInput v-model:value="item.width" placeholder="请输入含单位的值" />
        </AFormItem>
        <AFormItem label="对齐方式" :name="['columns', index, 'align']" class="flex-1">
          <ASelect v-model:value="item.align" :options="colAlignOpts" />
        </AFormItem>
        <AButton
          class="flex-shrink-0"
          :icon="h(DeleteOutlined)"
          danger
          @click="columnConfigModal.columns.splice(index, 1)"
        />
      </div>
      <AButton type="dashed" block @click="addColumn">新增一列</AButton>
    </AForm>
  </AModal>
</template>

<script setup lang="ts">
import { ref, h, reactive, computed, type PropType } from 'vue'
import { DeleteOutlined } from '@ant-design/icons-vue'
import type { WPropsDataTable, WPropsTableColumn } from '@/types/workflow/form'

const modeOpts = [
  { label: '配置表格', value: 'table' },
  { label: '配置表单', value: 'form' }
]

const colAlignOpts = [
  { label: '左对齐', value: 'left' },
  { label: '居中', value: 'center' },
  { label: '右对齐', value: 'right' }
]

const props = defineProps({
  opts: {
    type: Object as PropType<WPropsDataTable>,
    required: true
  }
})

const emit = defineEmits(['update:opts'])

const usePagination = ref(false)
const columnConfigModal = reactive<{
  columns: WPropsTableColumn[]
  visible: boolean
}>({
  columns: [],
  visible: false
})

const computedProps = computed({
  get: () => props.opts,
  set: (val) => {
    emit('update:opts', val)
  }
})

const saveColumnsConfig = () => {
  computedProps.value.columns = columnConfigModal.columns
  columnConfigModal.visible = false
}

const addColumn = () => {
  columnConfigModal.columns.push({})
}
</script>
