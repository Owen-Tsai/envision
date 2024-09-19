<template>
  <AFormItem label="默认值" name="defaultValue">
    <AInput v-if="!multiple" v-model:value="computedProps.defaultValue as string" />
    <TagInput v-else v-model:value="computedProps.defaultValue as string[]" />
  </AFormItem>
  <AFormItem label="自定义选项字段" name="fieldNames">
    <AInput v-model:value="computedProps.fieldNames" />
  </AFormItem>
  <AFormItem label="占位文字" name="placeholder">
    <AInput v-model:value="computedProps.placeholder" />
  </AFormItem>
  <AFormItem label="下拉列表高度" name="listHeight">
    <AInputNumber
      v-model:value="computedProps.listHeight"
      :min="3"
      :step="1"
      :precision="0"
      class="w-full"
    />
  </AFormItem>
  <AFormItem label="允许多选" class="setter-boolean-field">
    <ASwitch v-model:checked="computedProps.multiple" />
  </AFormItem>
  <template v-if="multiple">
    <AFormItem label="下拉列表高度" name="listHeight">
      <AInputNumber
        v-model:value="computedProps.listHeight"
        :min="3"
        :step="1"
        :precision="0"
        class="w-full"
      />
    </AFormItem>
    <AFormItem label="最大标签数量" name="maxTagCount">
      <AInputNumber
        v-model:value="computedProps.maxTagCount"
        :min="1"
        :step="1"
        :precision="0"
        class="w-full"
      />
    </AFormItem>
    <AFormItem label="最大标签文字长度" name="maxTagTextLength">
      <AInputNumber
        v-model:value="computedProps.maxTagTextLength"
        :min="1"
        :step="1"
        :precision="0"
        class="w-full"
      />
    </AFormItem>
  </template>
  <AFormItem label="允许搜索" name="showSearch" class="setter-boolean-field">
    <ASwitch v-model:checked="computedProps.showSearch" />
  </AFormItem>
  <AFormItem v-if="computedProps.showSearch" label="搜索框占位文字" name="searchPlaceholder">
    <AInput v-model:value="computedProps.searchPlaceholder" />
  </AFormItem>
  <AFormItem label="选项" name="options">
    <ARadioGroup
      v-model:value="computedProps.treeData.type"
      :options="optionTypeOmitDictOpts"
      option-type="button"
    />
    <template v-if="computedProps.treeData.type === 'static'">
      <AFormItemRest>
        <div class="mt-4">
          <pre>{{ computedProps.treeData.staticData }}</pre>
        </div>
      </AFormItemRest>
    </template>
  </AFormItem>
  <AFormItem label="选项菜单位置" name="placement">
    <ASelect
      v-model:value="computedProps.placement"
      :options="popoverPlacementOpts"
      default-value="bottomLeft"
    />
  </AFormItem>
  <AFormItem label="回显策略" name="showCheckedStrategy">
    <ASelect
      v-model:value="computedProps.showCheckedStrategy"
      :options="options"
      :default-value="TreeSelect.SHOW_CHILD"
    />
  </AFormItem>
  <AFormItem label="扁平数据源" name="simpleMode" class="setter-boolean-field">
    <ASwitch v-model:checked="computedProps.simpleMode" />
  </AFormItem>
  <AFormItem label="显示标线" name="showLine" class="setter-boolean-field">
    <ASwitch v-model:checked="computedProps.showLine" />
  </AFormItem>
  <AFormItem label="允许清空" name="allowClear" class="setter-boolean-field">
    <ASwitch v-model:checked="computedProps.allowClear" />
  </AFormItem>
  <AFormItem label="禁用组件" name="disabled" class="setter-boolean-field">
    <ASwitch v-model:checked="computedProps.disabled" />
  </AFormItem>
  <AFormItem label="只读字段" name="readonly" class="setter-boolean-field">
    <ASwitch v-model:checked="computedProps.readonly" />
  </AFormItem>
  <AFormItem label="隐藏字段" name="hide" class="setter-boolean-field">
    <ASwitch v-model:checked="computedProps.hide" />
  </AFormItem>
</template>

<script lang="ts" setup>
import { ref, computed, type PropType } from 'vue'
import { TreeSelect } from 'ant-design-vue'
import { CloseOutlined } from '@ant-design/icons-vue'
import { optionTypeOmitDictOpts, popoverPlacementOpts } from '../use-settings-data'
import TagInput from '@/components/tag-input/index.vue'
import type { WPropsTreeSelect } from '@/types/workflow/form'

const options = [
  { label: '显示所有选中节点', value: TreeSelect.SHOW_ALL },
  { label: '仅显示子节点', value: TreeSelect.SHOW_CHILD },
  { label: '显示父/子节点', value: TreeSelect.SHOW_PARENT }
]

const multiple = ref(false)

const props = defineProps({
  opts: {
    type: Object as PropType<WPropsTreeSelect>,
    required: true
  }
})

const emit = defineEmits(['update:opts'])

const computedProps = computed({
  get: () => props.opts,
  set: (val) => {
    emit('update:opts', val)
  }
})
</script>
