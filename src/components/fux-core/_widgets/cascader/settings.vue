<template>
  <AFormItem label="默认值" name="defaultValue" extra="输入合法的JSON">
    <AInput v-model:value="model.defaultValue" />
  </AFormItem>
  <AFormItem label="自定义选项字段" name="fieldNames">
    <AInput v-model:value="model.fieldNames" placeholder='{ "label": ?, "value": ? }' />
  </AFormItem>
  <AFormItem v-if="model.lazyLoad" label="懒加载请求地址" name="lazyLoadUrl">
    <AInput v-model:value="model.lazyLoadUrl" />
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
          <Codemirror
            v-model="model.options.value"
            :extensions="extensions"
            style="height: 160px"
          />
        </div>
      </AFormItemRest>
    </template>
    <template v-if="model.options.type === 'expression'">
      <AInput
        v-model:value="model.options.value"
        prefix="{{ $state."
        suffix="}}"
        placeholder="请输入表达式"
        class="mt-4"
      />
    </template>
  </AFormItem>
  <AFormItem label="允许多选" class="boolean-field">
    <ASwitch v-model:checked="model.multiple" />
  </AFormItem>
  <template v-if="model.multiple">
    <AFormItem label="最大标签数量" name="maxTagCount">
      <AInputNumber
        v-model:value="model.maxTagCount"
        :min="1"
        :step="1"
        :precision="0"
        allow-clear
        class="w-full"
      />
    </AFormItem>
    <AFormItem label="最大标签文字长度" name="maxTagTextLength">
      <AInputNumber
        v-model:value="model.maxTagTextLength"
        :min="1"
        :step="1"
        :precision="0"
        allow-clear
        class="w-full"
      />
    </AFormItem>
    <AFormItem label="显示策略" name="showCheckedStrategy">
      <ASelect
        v-model:value="model.showCheckedStrategy"
        :options="showCheckedStrategyOpts"
        :default-value="Cascader.SHOW_PARENT"
      />
    </AFormItem>
  </template>
  <AFormItem label="选项菜单位置" name="placement">
    <ASelect
      v-model:value="model.placement"
      :options="popoverPlacementOpts"
      default-value="bottomLeft"
    />
  </AFormItem>
  <AFormItem label="选项懒加载" class="boolean-field">
    <ASwitch v-model:checked="model.lazyLoad" />
  </AFormItem>
  <AFormItem
    v-if="model.lazyLoad"
    label="懒加载地址"
    name="lazyLoadUrl"
    extra="接口需接受value参数"
  >
    <AInput v-model:value="model.lazyLoadUrl" placeholder="/api/example/get" />
  </AFormItem>
  <AFormItem label="允许选择父级" name="allowParentNode" class="boolean-field">
    <ASwitch v-model:checked="model.allowParentNode" />
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
import { ref, computed, watch } from 'vue'
import { Cascader } from 'ant-design-vue'
import { Codemirror } from 'vue-codemirror'
import extensions from '@/utils/codemirror'
import { optionSourceOpts, popoverPlacementOpts } from '../../_utils/const'
import type { WPropsCascader } from '@/types/fux-core/form'

const showCheckedStrategyOpts = [
  { label: '仅显示叶子节点', value: Cascader.SHOW_CHILD },
  { label: '可显示父节点', value: Cascader.SHOW_PARENT }
]

const cachedMap = ref<Record<string, any>>({})

const { attrs } = defineProps<{
  attrs: WPropsCascader
}>()

const emit = defineEmits(['update:attrs'])

const model = computed({
  get: () => attrs,
  set: (val) => {
    emit('update:attrs', val)
  }
})

watch(
  () => model.value.options.type,
  (newVal, oldVal) => {
    const value = model.value.options.value
    cachedMap.value[oldVal!] = value
    if (cachedMap.value[newVal!]) {
      model.value.options.value = cachedMap.value[newVal!]
    } else {
      model.value.options.value = undefined
    }
  }
)
</script>
