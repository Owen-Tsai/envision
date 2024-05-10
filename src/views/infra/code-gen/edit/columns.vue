<template>
  <ATable
    :data-source="tableData"
    :columns="tableColumns"
    :loading="loading"
    :scroll="{ x: 1500 }"
    :sticky="{ offsetHeader: 90 }"
    :pagination="false"
  >
    <template #bodyCell="scope: TableScope<ColumnVO>">
      <template v-if="scope?.column.key === 'columnComment'">
        <AInput v-model:value="scope.record.columnComment" placeholder="如：姓名" />
      </template>
      <template v-if="scope?.column.key === 'javaType'">
        <ASelect
          v-model:value="scope.record.javaType"
          :options="javaTypeOpts"
          placeholder="请选择..."
          class="w-full"
        />
      </template>
      <template v-if="scope?.column.key === 'javaField'">
        <AInput v-model:value="scope.record.javaField" placeholder="如：name" />
      </template>
      <template v-if="scope?.column.key === 'createOperation'">
        <ACheckbox v-model:checked="scope.record.createOperation" />
      </template>
      <template v-if="scope?.column.key === 'updateOperation'">
        <ACheckbox v-model:checked="scope.record.updateOperation" />
      </template>
      <template v-if="scope?.column.key === 'listOperation'">
        <ACheckbox v-model:checked="scope.record.listOperation" />
      </template>
      <template v-if="scope?.column.key === 'listOperationResult'">
        <ACheckbox v-model:checked="scope.record.listOperationResult" />
      </template>
      <template v-if="scope?.column.key === 'listOperationCondition'">
        <ASelect
          v-model:value="scope.record.listOperationCondition"
          :options="listOperationConditionOpts"
          placeholder="请选择..."
          class="w-full"
        />
      </template>
      <template v-if="scope?.column.key === 'nullable'">
        <ACheckbox v-model:checked="scope.record.nullable" />
      </template>
      <template v-if="scope?.column.key === 'htmlType'">
        <ASelect
          v-model:value="scope.record.htmlType"
          :options="htmlTypeOpts"
          placeholder="请选择..."
          class="w-full"
        />
      </template>
      <template v-if="scope?.column.key === 'dictType'">
        <ASelect
          v-model:value="scope.record.dictType"
          :options="dictList"
          :field-names="{ label: 'name', value: 'id' }"
          placeholder="请选择..."
          class="w-full"
        />
      </template>
      <template v-if="scope?.column.key === 'example'">
        <AInput v-model:value="scope.record.example" placeholder="如：张三" />
      </template>
    </template>
  </ATable>
</template>

<script lang="ts" setup>
import { ref, computed, type PropType } from 'vue'
import { getPlainDictTypeList, type DictTypeVO } from '@/api/system/dict/type'
import { type ConfigDetailVO, type ColumnVO } from '@/api/infra/code-gen'
import { type TableProps } from 'ant-design-vue'

const tableColumns: TableProps['columns'] = [
  { title: '字段名称', key: 'columnName', dataIndex: 'columnName', fixed: 'left' },
  { title: '字段描述', key: 'columnComment', width: 160 },
  { title: '存储类型', key: 'dataType', dataIndex: 'dataType' },
  { title: 'java 类型', key: 'javaType', width: 160 },
  { title: 'java 类属性', key: 'javaField' },
  { title: '插入', key: 'createOperation', width: 46 },
  { title: '编辑', key: 'updateOperation', width: 46 },
  { title: '列表', key: 'listOperation', width: 46 },
  { title: '查询', key: 'listOperationResult', width: 46 },
  { title: '查询方式', key: 'listOperationCondition' },
  { title: '允许空', key: 'nullable', width: 80 },
  { title: '显示组件', key: 'htmlType', width: 160 },
  { title: '引用字典', key: 'dictType', width: 160 },
  { title: '示例', key: 'example' }
]

const javaTypeOpts = [
  { value: 'Long' },
  { value: 'String' },
  { value: 'Integer' },
  { value: 'Douoble' },
  { value: 'BigDecimal' },
  { value: 'LocalDateTime' },
  { value: 'Boolean' }
]

const listOperationConditionOpts = [
  { value: '=' },
  { value: '!=' },
  { value: '>' },
  { value: '>=' },
  { value: '<' },
  { value: '<=' },
  { value: 'LIKE' },
  { value: 'BETWEEN' }
]

const htmlTypeOpts = [
  { label: '文本框', value: 'input' },
  { label: '数字输入框', value: 'number' },
  { label: '下拉选择框', value: 'select' },
  { label: '单选框', value: 'radio' },
  { label: '复选框', value: 'checkbox' },
  { label: '日期选择框', value: 'datetime' },
  { label: '图片上传', value: 'imageUpload' },
  { label: '文件上传', value: 'fileUpload' },
  { label: '富文本编辑器', value: 'editor' }
]

const props = defineProps({
  model: {
    type: Array as PropType<ConfigDetailVO['columns']>
  }
})

const emit = defineEmits(['update:model'])

const loading = ref(true)
const dictList = ref<DictTypeVO[]>([])

const tableData = computed({
  get: () => {
    props.model?.forEach((e) => {
      if (e.dictType === '') {
        e.dictType = undefined
      }
    })

    return props.model
  },
  set: (val) => {
    emit('update:model', val)
  }
})

getPlainDictTypeList()
  .then((res) => {
    dictList.value = res
  })
  .finally(() => {
    loading.value = false
  })
</script>
