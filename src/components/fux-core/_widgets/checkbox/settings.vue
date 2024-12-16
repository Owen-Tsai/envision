<template>
  <AFormItem label="默认值" name="defaultValue">
    <TagInput v-model:value="model.defaultValue" />
  </AFormItem>
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
            <AInput
              v-model:value="(item as CheckboxOptionType).label as string"
              placeholder="label"
            />
            <AInput
              v-model:value="(item as CheckboxOptionType).value as string"
              placeholder="value"
            />
            <AButton class="flex-shrink-0" type="dashed" @click="removeOption(i)">
              <template #icon>
                <CloseOutlined />
              </template>
            </AButton>
          </AFlex>
        </div>
        <AButton block type="dashed" @click="addOption">新增选项</AButton>
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
import { computed } from 'vue'
import { CloseOutlined } from '@ant-design/icons-vue'
import { optionSourceOpts } from '../../_utils/const'
import TagInput from '@/components/tag-input/index.vue'
import useRequest from '@/hooks/use-request'
import { useOptionSettings } from '../../_hooks/use-options'
import { getPlainDictTypeList } from '@/api/system/dict/type'
import type { CheckboxOptionType } from 'ant-design-vue'
import type { WPropsCheckbox } from '@/types/fux-core/form'

const { attrs } = defineProps<{
  attrs: WPropsCheckbox
}>()

const emit = defineEmits(['update:attrs'])

const { data: dictTypes, pending } = useRequest(getPlainDictTypeList, { immediate: true })

const model = computed({
  get: () => attrs,
  set: (val) => {
    emit('update:attrs', val)
  },
})

const { addOption, removeOption } = useOptionSettings(model)
</script>
