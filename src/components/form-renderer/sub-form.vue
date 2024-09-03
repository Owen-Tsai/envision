<template>
  <AFormItem :label="config.props.field.label">
    <AFormItemRest>
      <div class="entry-container">
        <div class="entry" v-for="(child, i) in children" :key="i">
          <WidgetRenderer v-for="(widget, j) in child.widgets" :key="j" :widget="widget" />

          <ATooltip title="删除此组">
            <AButton
              class="btn-remove z-1"
              :icon="h(DeleteOutlined)"
              shape="circle"
              danger
              @click="removeEntry(i)"
            />
          </ATooltip>
        </div>

        <ATooltip title="新增一组">
          <AButton
            class="btn-add"
            type="primary"
            :icon="h(PlusOutlined)"
            shape="circle"
            @click="addEntry"
          />
        </ATooltip>
      </div>
    </AFormItemRest>
  </AFormItem>
</template>

<script setup lang="ts">
import { ref, h, type PropType } from 'vue'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { getDuplicatedWidgets } from './use-renderer'
import useModel from './use-model'
import WidgetRenderer from './widget-renderer.vue'

import type { WidgetConfigMap } from '@/types/workflow'

const props = defineProps({
  config: {
    type: Object as PropType<WidgetConfigMap['subForm']>,
    required: true
  }
})

// form value map
const entries = ref<Record<string, any>[]>([{}])
// widgets map
const children = ref(...[props.config.props.children])

const { model } = useModel(props.config.props.field.name || props.config.uid)

const addEntry = () => {
  entries.value.push({})
  const cloned = getDuplicatedWidgets(children.value)
  children.value.push({
    widgets: cloned
  })
}

const removeEntry = (i: number) => {
  entries.value.splice(i, 1)
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
