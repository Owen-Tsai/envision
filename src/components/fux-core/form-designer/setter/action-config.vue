<!-- used in form widgets and special widgets -->
<template>
  <AFormItemRest>
    <div
      v-for="(entry, evtName) in selectedWidget.props.event"
      :key="evtName"
      class="action-entry mb-2"
    >
      <div class="header">
        <div class="font-bold">{{ evtName }}</div>
        <div class="flex items-center mt-1">
          <AButton type="text" size="small" :icon="h(CodeOutlined)" @click="toEdit" />
          <AButton
            type="text"
            size="small"
            :icon="h(DeleteOutlined)"
            @click="deleteAction(evtName)"
          />
        </div>
      </div>
      <div class="body pb-1">
        <ASelect
          v-model:value="selectDisplayValue[evtName]"
          :options="functions || []"
          :field-names="{ label: 'name', value: 'name' }"
          label-in-value
          size="small"
          @change="(v) => onFunctionSelected(v as SelectValue, evtName)"
        />
      </div>
    </div>
    <ADropdown trigger="click">
      <AButton block>增加动作</AButton>
      <template #overlay>
        <AMenu @click="({ key }) => setAction(key as string)">
          <AMenuItem
            v-for="opt in eventOpts"
            :key="opt"
            :disabled="selectedWidget.props.event?.[opt] !== undefined"
          >
            {{ opt }}
          </AMenuItem>
        </AMenu>
      </template>
    </ADropdown>
  </AFormItemRest>
</template>

<script setup lang="ts">
import { h, ref, computed, type PropType } from 'vue'
import { generateId } from '@fusionx/utils'
import { CodeOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { useDesignerInjection } from '../../_hooks'
import { emitter } from '@fusionx/utils'
import type { FormWidget, SpecialWidget, FunctionConfig } from '@/types/fux-core/form'

type SelectValue = {
  label: string
  value: string
  option: FunctionConfig
}

const eventOpts = ['input', 'change', 'focus', 'blur', 'click']

const props = defineProps({
  widget: {
    type: Object as PropType<FormWidget | SpecialWidget>,
    required: true
  }
})

const emit = defineEmits(['update:widget'])
const selectDisplayValue = ref<Record<any, string>>({})

const selectedWidget = computed({
  get: () => props.widget,
  set: (val) => {
    emit('update:widget', val)
  }
})

const { schema } = useDesignerInjection()

const functions = computed(() =>
  schema.value.form.function ? Object.values(schema.value.form.function) : null
)

const onFunctionSelected = (func: SelectValue, evtName: string) => {
  const id = Object.keys(schema.value.form.function!).find(
    (key) => schema.value.form.function![key].name === func.option.name
  ) as string
  if (selectedWidget.value.props.event === undefined) {
    selectedWidget.value.props.event = {}
  }
  selectedWidget.value.props.event[evtName] = id
  selectDisplayValue.value[evtName] = func.label
}

const setAction = (evt: string) => {
  // insert new function
  const id = generateId()
  if (schema.value.form.function === undefined) {
    schema.value.form.function = {}
  }
  schema.value.form.function[id] = {
    name: `${evt}_${id}`,
    body: `console.log(this)`
  }
  if (selectedWidget.value.props.event === undefined) {
    selectedWidget.value.props.event = {}
  }
  // set as handler
  selectedWidget.value.props.event[evt] = id
  selectDisplayValue.value[evt] = `${evt}_${id}`
}

const deleteAction = (evt: string) => {
  if (selectedWidget.value.props.event?.[evt]) {
    delete selectedWidget.value.props.event[evt]
  }
}

const toEdit = () => {
  emitter.emit('show:func-modal')
}
</script>

<style lang="scss" scoped>
.action-entry {
  border: 1px solid var(--colorBorder);
  padding: 4px 8px;
  border-radius: var(--borderRadius);
  .header {
    @apply flex-between;
  }
}
</style>
