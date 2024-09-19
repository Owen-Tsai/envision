<template>
  <AFormItem label="默认值" name="defaultValue">
    <AInput v-model:value="computedProps.defaultValue" />
  </AFormItem>
  <AFormItem label="外观类型">
    <ASelect
      v-model:value="computedProps.optionType"
      :options="appearance"
      default-value="default"
    />
  </AFormItem>
  <AFormItem label="选项" name="options">
    <ARadioGroup
      v-model:value="computedProps.options.type"
      :options="optionTypeOpts"
      option-type="button"
    />
    <template v-if="computedProps.options.type === 'static'">
      <AFormItemRest>
        <div class="mt-4">
          <AFlex
            v-for="(item, i) in computedProps.options.staticData as CheckboxOptionType[]"
            :key="i"
            :gap="8"
            class="mb-2"
          >
            <AInput v-model:value="item.label as string" placeholder="label" />
            <AInput v-model:value="item.value as string" placeholder="value" />
            <AButton class="flex-shrink-0" type="text" danger @click="removeOption(i)">
              <template #icon>
                <CloseOutlined />
              </template>
            </AButton>
          </AFlex>
        </div>
        <AButton block type="primary" ghost @click="addOption">新增选项</AButton>
      </AFormItemRest>
    </template>

    <template v-if="computedProps.options.type === 'dict'">
      <AFormItemRest>
        <ASelect
          v-model:value="computedProps.options.dictType"
          :options="dictTypes"
          :field-names="{ label: 'name', value: 'type' }"
          placeholder="请选择字典类型"
          class="mt-4"
        />
      </AFormItemRest>
    </template>
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
import type { CheckboxOptionType } from 'ant-design-vue'
import { CloseOutlined } from '@ant-design/icons-vue'
import { optionTypeOpts } from '../use-settings-data'
import { getPlainDictTypeList, type DictTypeVO } from '@/api/system/dict/type'
import type { WPropsRadio } from '@/types/workflow/form'

const appearance = [
  { label: '默认', value: 'default' },
  { label: '按钮', value: 'button' },
  { label: '填充按钮', value: 'solid-button' }
]

const dictTypes = ref<DictTypeVO[]>([])

const props = defineProps({
  opts: {
    type: Object as PropType<WPropsRadio>,
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

const addOption = () => {
  computedProps.value.options.staticData?.push({ label: undefined, value: '' })
}

const removeOption = (idx: number) => {
  computedProps.value.options.staticData?.splice(idx, 1)
}

getPlainDictTypeList().then((res) => {
  dictTypes.value = res
})
</script>
