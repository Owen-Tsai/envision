<template>
  <div>
    <AFlex justify="end">
      <AButton :icon="h(PlusOutlined)" @click="visible = true">新增</AButton>
    </AFlex>
    <ATable :columns="widget.props.columns" :data-source="data" :pagination="pagination" />
    <AModal v-model:open="visible" :title="title" :width="widget.props.children[0].width">
      <WidgetRenderer
        v-for="child in formWidgets"
        :key="child.uid"
        :widget="child"
        :parent-form-config="parentFormConfig"
      />
    </AModal>
  </div>
</template>

<script setup lang="ts">
import { ref, h, computed, inject, type PropType } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import WidgetRenderer from '../widget-renderer.vue'
import type { TableProps } from 'ant-design-vue'
import {
  parentFieldKey,
  type WidgetConfigMap,
  type ParentFormPropType
} from '@/types/workflow/form'

const props = defineProps({
  widget: {
    type: Object as PropType<WidgetConfigMap['dataTable']>,
    required: true
  }
})

const data = ref<any>([])
const visible = ref(false)
const mode = ref<'edit' | 'add'>('add')

const formWidgets = props.widget.props.children?.[0].widgets || []
const formTitle = props.widget.props.children?.[0].title || ''

const title = computed<string>(() =>
  mode.value === 'edit' ? `编辑${formTitle}` : `新增${formTitle}`
)
const pagination = computed<TableProps['pagination']>(() => {
  if (props.widget.props.pagination) {
    const { lite, pageSize, small } = props.widget.props.pagination
    return {
      pageSize,
      mini: !!small,
      showLessItems: !!lite
    }
  }

  return undefined
})

const onSave = () => {}

const loadData = () => {}

const parentFormConfig = inject<ParentFormPropType | undefined>(parentFieldKey, undefined)
</script>
