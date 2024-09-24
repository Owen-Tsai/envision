<template>
  <AFormItem :label="widget.props.field.label">
    <div class="entry-container">
      <div class="entry" v-for="(entry, index) in formData[field]" :key="index">
        <div v-for="(widget, j) in widget.props.children[0].widgets" :key="j">
          <WidgetRenderer :widget="widget" :field-ctx-config="{ parentField: { field, index } }" />
        </div>

        <ATooltip title="删除此组">
          <AButton
            class="btn-remove z-1"
            :icon="h(DeleteOutlined)"
            shape="circle"
            danger
            @click="removeEntry(index)"
          />
        </ATooltip>
      </div>

      <AButton class="btn-add" block type="dashed" :icon="h(PlusOutlined)" @click="addEntry">
        新增一项
      </AButton>
    </div>
  </AFormItem>
</template>

<script setup lang="ts">
import { ref, h, inject, type PropType, type Ref } from 'vue'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import WidgetRenderer from '../widget-renderer.vue'
import type { WidgetConfigMap } from '@/types/workflow/form'
import { formModelCtxKey, type FormModelContext } from '@/types/workflow'

const ctx = inject<FormModelContext>(formModelCtxKey)
const formData = ctx?.formData as Ref<Record<string, any>>

const props = defineProps({
  widget: {
    type: Object as PropType<WidgetConfigMap['subForm']>,
    required: true
  }
})

const field = props.widget.props.field.name || props.widget.uid
const children = ref(props.widget.props.children)

if (ctx) {
  formData.value[field] = [] as any
}

const addEntry = () => {
  formData.value[field].push({})
}

const removeEntry = (i: number) => {
  formData.value[field].splice(i, 1)
}
</script>

<style lang="scss" scoped>
.entry {
  position: relative;
  padding-right: 64px;
  padding-bottom: 16px;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 32px;
    right: 32px;
    width: 1px;
    background-color: var(--colorBorder);
  }

  &:last-of-type {
    &::before {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      right: 64px;
      height: 1px;
      background-color: var(--colorBorder);
    }
  }
}
.btn-add {
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translate(-50%, 50%);
}
.btn-remove {
  position: absolute;
  top: calc(50% - 16px);
  right: 0;
  transform: translate(-50%, -50%);
}
</style>
