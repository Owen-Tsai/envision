<template>
  <AFormItem label="默认值" name="defaultValue">
    <AInput v-if="!multiple" v-model:value="computedProps.defaultValue as string" />
    <TagInput v-else v-model:value="computedProps.defaultValue as string[]" />
  </AFormItem>
  <AFormItem label="自定义选项字段" name="fieldNames">
    <AInput v-model:value="computedProps.fieldNames" placeholder='{ "label": ?, "value": ? }' />
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
  <AFormItem label="允许过滤" class="setter-boolean-field">
    <ASwitch v-model:checked="computedProps.showSearch" :disabled="multiple" />
  </AFormItem>
  <AFormItem label="允许多选" class="setter-boolean-field">
    <ASwitch v-model:checked="multiple" @change="onModeChange" />
  </AFormItem>
  <template v-if="multiple">
    <AFormItem label="允许创建选项" class="setter-boolean-field">
      <ASwitch
        v-model:checked="computedProps.mode"
        checked-value="tags"
        un-checked-value="multiple"
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
            v-for="(item, i) in computedProps.options.staticData"
            :key="i"
            :gap="8"
            class="mb-2"
          >
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

  <AFormItem label="选项菜单位置" name="placement">
    <ASelect
      v-model:value="computedProps.placement"
      :options="popoverPlacementOpts"
      default-value="bottomLeft"
    />
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
import { CloseOutlined } from '@ant-design/icons-vue'
import { optionTypeOpts, popoverPlacementOpts } from '../use-settings-data'
import { getPlainDictTypeList, type DictTypeVO } from '@/api/system/dict/type'
import TagInput from '@/components/tag-input/index.vue'
import type { WPropsSelect } from '@/types/workflow'

const multiple = ref(false)
const dictTypes = ref<DictTypeVO[]>([])

const props = defineProps({
  opts: {
    type: Object as PropType<WPropsSelect>,
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

const onModeChange = () => {
  if (multiple.value) {
    computedProps.value.mode = 'multiple'
  } else {
    computedProps.value.mode = undefined
  }
}

const addOption = () => {
  computedProps.value.options.staticData?.push({ label: undefined, value: undefined })
}

const removeOption = (idx: number) => {
  computedProps.value.options.staticData?.splice(idx, 1)
}

getPlainDictTypeList().then((res) => {
  dictTypes.value = res
})
</script>
