<template>
  <AFormItem label="默认值" name="defaultValue">
    <AInput v-if="!multiple" v-model:value="model.defaultValue as string" />
    <TagInput v-else v-model:value="model.defaultValue as string[]" />
  </AFormItem>
  <AFormItem label="自定义选项字段" name="fieldNames">
    <AInput v-model:value="model.fieldNames" placeholder='{ "label": ?, "value": ? }' />
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
  <AFormItem label="允许过滤" class="boolean-field">
    <ASwitch v-model:checked="model.showSearch" :disabled="multiple" />
  </AFormItem>
  <AFormItem label="允许多选" class="boolean-field">
    <ASwitch v-model:checked="multiple" @change="onModeChange" />
  </AFormItem>
  <template v-if="multiple">
    <AFormItem label="允许创建选项" class="boolean-field">
      <ASwitch v-model:checked="model.mode" checked-value="tags" un-checked-value="multiple" />
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
  <AFormItem label="选项" name="options">
    <ASegmented
      v-model:value="model.options.type"
      :options="optionSourceOpts"
      class="width-expanded"
    />
    <template v-if="model.options.type === 'static'">
      <AFormItemRest>
        <div class="mt-4">
          <AFlex v-for="(item, i) in model.options.value" :key="i" :gap="8" class="mb-2">
            <AInput v-model:value="item.label" placeholder="label" />
            <AInput v-model:value="item.value as string" placeholder="value" />
            <AButton class="flex-shrink-0" type="text" danger @click="removeOption(i)">
              <template #icon>
                <CloseOutlined />
              </template>
            </AButton>
          </AFlex>
          <AButton block type="primary" ghost @click="addOption">新增选项</AButton>
        </div>
      </AFormItemRest>
    </template>

    <template v-if="model.options.type === 'dict'">
      <AFormItemRest>
        <ASelect
          v-model:value="model.options.value"
          :options="dictTypes"
          :field-names="{ label: 'name', value: 'type' }"
          placeholder="请选择字典类型"
          :loading="pending"
          show-search
          class="mt-4"
        />
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

  <AFormItem label="选项菜单位置" name="placement">
    <ASelect
      v-model:value="model.placement"
      :options="popoverPlacementOpts"
      default-value="bottomLeft"
    />
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
import { CloseOutlined } from '@ant-design/icons-vue'
import { optionSourceOpts, popoverPlacementOpts } from '../../_utils/const'
import TagInput from '@/components/tag-input/index.vue'
import useRequest from '@/hooks/use-request'
import { useOptionSettings } from '../../_hooks/use-options'
import { getPlainDictTypeList } from '@/api/system/dict/type'
import type { WPropsSelect } from '@/types/fux-core/form'

const { attrs } = defineProps<{
  attrs: WPropsSelect
}>()

const emit = defineEmits(['update:attrs'])

const multiple = ref(false)
const { data: dictTypes, pending } = useRequest(getPlainDictTypeList, { immediate: true })

const model = computed({
  get: () => attrs,
  set: (val) => {
    emit('update:attrs', val)
  }
})

const onModeChange = () => {
  if (multiple.value) {
    model.value.mode = 'multiple'
  } else {
    model.value.mode = undefined
  }
}

const { addOption, removeOption } = useOptionSettings(model)
</script>
