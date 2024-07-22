<template>
  <AFormItem label="默认值" name="defaultValue">
    <AInput v-model:value="computedProps.defaultValue" placeholder="输入合法的JSON" />
  </AFormItem>
  <AFormItem label="自定义选项字段" name="fieldNames">
    <AInput v-model:value="computedProps.fieldNames" placeholder='{ "label": ?, "value": ? }' />
  </AFormItem>
  <AFormItem label="允许多选" class="setter-boolean-field">
    <ASwitch v-model:checked="computedProps.multiple" />
  </AFormItem>
  <template v-if="multiple">
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
  <AFormItem label="选项懒加载" class="setter-boolean-field">
    <ASwitch v-model:checked="computedProps.lazyLoad" />
  </AFormItem>
  <AFormItem v-if="computedProps.lazyLoad" label="懒加载请求地址" name="lazyLoadUrl">
    <AInput v-model:value="computedProps.lazyLoadUrl" />
  </AFormItem>
  <AFormItem label="选项" name="options">
    <ARadioGroup
      v-model:value="computedProps.options.type"
      :options="[...optionTypeOpts].filter((e) => e.value !== 'dict')"
      option-type="button"
    />
    <template v-if="computedProps.options.type === 'static'">
      <AFormItemRest>
        <div class="mt-4">
          <pre>{{ computedProps.options.staticData }}</pre>
        </div>
      </AFormItemRest>
    </template>
  </AFormItem>

  <AFormItem label="显示策略" name="placement">
    <ASelect
      v-model:value="computedProps.placement"
      :options="showCheckedStrategyOpts"
      :default-value="Cascader.SHOW_PARENT"
    />
  </AFormItem>
  <AFormItem label="选项菜单位置" name="placement">
    <ASelect
      v-model:value="computedProps.placement"
      :options="popoverPlacementOpts"
      default-value="bottomLeft"
    />
  </AFormItem>
  <AFormItem label="允许选择父级" name="allowParentNode" class="setter-boolean-field">
    <ASwitch v-model:checked="computedProps.allowParentNode" />
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
import { Cascader } from 'ant-design-vue'
import { optionTypeOpts, popoverPlacementOpts } from '../use-settings-data'
import { getPlainDictTypeList, type DictTypeVO } from '@/api/system/dict/type'
import type { WPropsCascader } from '@/types/workflow'

const showCheckedStrategyOpts = [
  { label: '仅显示叶子节点', value: Cascader.SHOW_CHILD },
  { label: '可显示父节点', value: Cascader.SHOW_PARENT }
]

const multiple = ref(false)
const dictTypes = ref<DictTypeVO[]>([])

const props = defineProps({
  opts: {
    type: Object as PropType<WPropsCascader>,
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

getPlainDictTypeList().then((res) => {
  dictTypes.value = res
})
</script>
