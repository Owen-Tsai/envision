<template>
  <AFormItem label="默认值" name="defaultValue">
    <AInput v-model:value="model.defaultValue" />
  </AFormItem>
  <AFormItem label="自定义选项字段" name="fieldNames">
    <AInput v-model:value="model.fieldNames" />
  </AFormItem>
  <AFormItem label="占位文字" name="placeholder">
    <AInput v-model:value="model.placeholder" />
  </AFormItem>
  <AFormItem label="下拉列表高度" name="listHeight">
    <AInputNumber
      v-model:value="model.listHeight"
      :min="3"
      :step="1"
      :precision="0"
      class="w-full"
    />
  </AFormItem>
  <AFormItem label="允许多选" class="boolean-field">
    <ASwitch v-model:checked="model.multiple" />
  </AFormItem>
  <template v-if="multiple">
    <AFormItem label="下拉列表高度" name="listHeight">
      <AInputNumber
        v-model:value="model.listHeight"
        :min="3"
        :step="1"
        :precision="0"
        class="w-full"
      />
    </AFormItem>
    <AFormItem label="最大标签数量" name="maxTagCount">
      <AInputNumber
        v-model:value="model.maxTagCount"
        :min="1"
        :step="1"
        :precision="0"
        class="w-full"
      />
    </AFormItem>
    <AFormItem label="最大标签文字长度" name="maxTagTextLength">
      <AInputNumber
        v-model:value="model.maxTagTextLength"
        :min="1"
        :step="1"
        :precision="0"
        class="w-full"
      />
    </AFormItem>
  </template>
  <AFormItem label="允许搜索" name="showSearch" class="boolean-field">
    <ASwitch v-model:checked="model.showSearch" />
  </AFormItem>
  <AFormItem v-if="model.showSearch" label="搜索框占位文字" name="searchPlaceholder">
    <AInput v-model:value="model.searchPlaceholder" />
  </AFormItem>
  <AFormItem label="选项" name="options">
    <ASegmented
      v-model:value="model.options.type"
      :options="[...optionSourceOpts].filter((e) => e.value !== 'dict')"
      class="width-expanded"
    />
    <template v-if="model.options.type === 'static'">
      <AFormItemRest>
        <div class="mt-4">
          <Codemirror v-model="model.options.value" :extensions="extensions" :height="160" />
        </div>
      </AFormItemRest>
    </template>
  </AFormItem>
  <AFormItem label="选项菜单位置" name="placement">
    <ASelect
      v-model:value="model.placement"
      :options="popoverPlacementOpts"
      default-value="bottomLeft"
    />
  </AFormItem>
  <AFormItem label="回显策略" name="showCheckedStrategy">
    <ASelect
      v-model:value="model.showCheckedStrategy"
      :options="displayStrategyOpts"
      :default-value="TreeSelect.SHOW_CHILD"
    />
  </AFormItem>
  <AFormItem label="扁平数据源" name="simpleMode" class="boolean-field">
    <ASwitch v-model:checked="model.simpleMode" />
  </AFormItem>
  <AFormItem label="显示标线" name="showLine" class="boolean-field">
    <ASwitch v-model:checked="model.showLine" />
  </AFormItem>
  <AFormItem label="允许清空" name="allowClear" class="boolean-field">
    <ASwitch v-model:checked="model.allowClear" />
  </AFormItem>
  <AFormItem label="禁用组件" name="disabled" class="boolean-field">
    <ASwitch v-model:checked="model.disabled" />
  </AFormItem>
  <AFormItem label="只读字段" name="readonly" class="boolean-field">
    <ASwitch v-model:checked="model.readonly" />
  </AFormItem>
  <AFormItem label="隐藏字段" name="hide" class="boolean-field">
    <ASwitch v-model:checked="model.hide" />
  </AFormItem>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { Codemirror } from 'vue-codemirror'
import extensions from '@/utils/codemirror'
import { TreeSelect } from 'ant-design-vue'
import { popoverPlacementOpts, optionSourceOpts } from '../../_utils/const'
import type { WPropsTreeSelect } from '@/types/fux-core/form'

const displayStrategyOpts = [
  { label: '显示所有选中节点', value: TreeSelect.SHOW_ALL },
  { label: '仅显示子节点', value: TreeSelect.SHOW_CHILD },
  { label: '显示父/子节点', value: TreeSelect.SHOW_PARENT }
]

const { attrs } = defineProps<{
  attrs: WPropsTreeSelect
}>()

const emit = defineEmits(['update:attrs'])

const multiple = ref(false)

const model = computed({
  get: () => attrs,
  set: (val) => {
    emit('update:attrs', val)
  }
})
</script>
