<template>
  <AFormItem label="切换配置对象">
    <ARadioGroup
      v-model:value="model.state.mode"
      buttonStyle="solid"
      optionType="button"
      :options="modeOpts"
    />
  </AFormItem>
  <div v-show="model.state.mode === 'table'">
    <AFormItem label="列配置">
      <AButton block type="dashed" @click="columnConfigModal.visible = true">编辑列配置</AButton>
    </AFormItem>
    <AFormItem label="启用分页" class="boolean-field">
      <ASwitch v-model:checked="usePagination" />
    </AFormItem>
    <div v-show="usePagination">
      <AFormItem label="精简分页模式" class="boolean-field">
        <ASwitch v-model:checked="model.pagination.lite" />
      </AFormItem>
      <AFormItem label="小尺寸" class="boolean-field">
        <ASwitch v-model:checked="model.pagination.small" />
      </AFormItem>
      <AFormItem label="每页数量" :name="['pagination', 'pageSize']">
        <AInputNumber v-model:value="model.pagination.pageSize" :min="1" :step="1" class="w-full" />
      </AFormItem>
    </div>
  </div>
  <div v-show="model.state.mode === 'form'">
    <AFormItem
      label="表单对话框宽度"
      placeholder="请输入含单位的值(px/%)"
      extra="实际宽度将考虑内边距"
    >
      <AInput v-model:value="model.formWidth" />
    </AFormItem>
  </div>

  <AModal
    v-model:open="columnConfigModal.visible"
    title="数据表列配置"
    :width="1000"
    force-render
    @ok="saveColumnsConfig"
  >
    <AForm :model="columnConfigModal" class="mt-4 dense-form">
      <div ref="dragWrapperEl">
        <div
          v-for="(item, index) in columnConfigModal.columns"
          :key="item.idx"
          class="flex items-center gap-4 mb-4"
        >
          <div class="handle cursor-move">
            <MenuOutlined />
          </div>
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
          <AButton type="dashed" @click="configFormatter(index)">配置格式</AButton>
          <AButton
            class="flex-shrink-0"
            :icon="h(CloseOutlined)"
            type="dashed"
            @click="columnConfigModal.columns.splice(index, 1)"
          />
        </div>
      </div>
      <AButton type="dashed" block @click="addColumn">新增一列</AButton>
    </AForm>
  </AModal>

  <AModal v-model:open="formatterConfig.visible" title="格式化配置" @ok="saveColumnsConfig">
    <AForm :model="columnConfigModal">
      <AFormItem label="格式化类型" :name="['formatter', 'type']">
        <ARadioGroup
          v-model:value="columnConfigModal.columns[formatterConfig.index]!.formatter!.type"
          :options="colFormatterOpts"
        />
      </AFormItem>
      <AFormItem
        v-if="columnConfigModal.columns[formatterConfig.index]?.formatter?.type === 'dict'"
        label="字典"
        :name="['formatter', 'value']"
      >
        <ASelect
          v-model:value="columnConfigModal.columns[formatterConfig.index]!.formatter!.value"
          :options="data"
          :loading="pending"
          :field-names="{ label: 'name', value: 'id' }"
        />
      </AFormItem>
      <AFormItem
        v-else-if="columnConfigModal.columns[formatterConfig.index]?.formatter?.type === 'custom'"
        label="格式化函数"
        :name="['formatter', 'value']"
      >
        <Codemirror
          v-model="columnConfigModal.columns[formatterConfig.index]!.formatter!.value"
          :extensions="extensions"
          style="height: 100px"
        />
      </AFormItem>
    </AForm>
  </AModal>
</template>

<script setup lang="ts">
import { ref, toRef, h, reactive, computed, nextTick, useTemplateRef } from 'vue'
import { CloseOutlined } from '@ant-design/icons-vue'
import useRequest from '@/hooks/use-request'
import { getPlainDictTypeList } from '@/api/system/dict/type'
import extensions from '@/utils/codemirror'
import { Codemirror } from 'vue-codemirror'
import { useSortable } from '@vueuse/integrations/useSortable'
import type { WPropsDataTable, WPropsTableColumn } from '@/types/fux-core/form'

const { data, pending } = useRequest(getPlainDictTypeList, { immediate: true })

const modeOpts = [
  { label: '配置表格', value: 'table' },
  { label: '配置表单', value: 'form' }
]

const colAlignOpts = [
  { label: '左对齐', value: 'left' },
  { label: '居中', value: 'center' },
  { label: '右对齐', value: 'right' }
]

const colFormatterOpts = [
  { label: '不设置', value: null },
  { label: '字典', value: 'dict' },
  { label: '自定义', value: 'custom' }
]

const { attrs } = defineProps<{
  attrs: WPropsDataTable
}>()

const emit = defineEmits(['update:attrs'])

const model = computed({
  get: () => attrs,
  set: (val) => {
    emit('update:attrs', val)
  }
})

const usePagination = ref(false)
const columnConfigModal = reactive<{
  columns: Array<WPropsTableColumn & { idx?: number }>
  visible: boolean
}>({
  columns: attrs.columns || [],
  visible: false
})

columnConfigModal.columns = columnConfigModal.columns.map((e, i) => ({
  ...e,
  idx: i
}))

const dragWrapperEl = useTemplateRef('dragWrapperEl')

useSortable(dragWrapperEl, columnConfigModal.columns, {
  animation: 200,
  handle: '.handle'
})

const formatterConfig = reactive<{
  index: number
  visible: boolean
}>({
  index: 0,
  visible: false
})

const saveColumnsConfig = () => {
  model.value.columns = columnConfigModal.columns
  columnConfigModal.visible = false
}

const addColumn = () => {
  columnConfigModal.columns.push({
    formatter: {
      type: null,
      value: ''
    }
  })
}

const configFormatter = (index: number) => {
  formatterConfig.index = index

  console.log(columnConfigModal.columns[formatterConfig.index])

  if (!columnConfigModal.columns[index].formatter) {
    columnConfigModal.columns[index].formatter = {
      type: null,
      value: ''
    }
  }

  nextTick(() => {
    formatterConfig.visible = true
  })
}
</script>
