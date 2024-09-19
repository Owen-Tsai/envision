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
          :options="functions"
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
            v-for="opt in eventEnums"
            :key="opt"
            :disabled="selectedWidget.props.event[opt] !== undefined"
          >
            {{ opt }}
          </AMenuItem>
        </AMenu>
      </template>
    </ADropdown>
  </AFormItemRest>
</template>

<script setup lang="ts">
import { h, ref, inject, computed, type PropType } from 'vue'
import { generateID } from '@/utils/fusion'
import { CodeOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import {
  injectionKey,
  eventEnums,
  type EventType,
  type FormCreatorCtx,
  type FormWidget,
  type SpecialWidget,
  type FunctionConfig
} from '@/types/workflow/form'

type SelectValue = {
  label: string
  value: string
  option: FunctionConfig
}

const props = defineProps({
  widget: {
    type: Object as PropType<FormWidget | SpecialWidget>,
    required: true
  }
})

const emit = defineEmits(['update:widget', 'show-editor'])
const selectDisplayValue = ref<Record<any, string>>({})

const selectedWidget = computed({
  get: () => props.widget,
  set: (val) => {
    emit('update:widget', val)
  }
})

const { schema } = inject<FormCreatorCtx>(injectionKey)!

const functions = computed(() => Object.values(schema.functions))

const onFunctionSelected = (func: SelectValue, evtName: string) => {
  const id = Object.keys(schema.functions).find(
    (key) => schema.functions[key].name === func.option.name
  )
  selectedWidget.value.props.event[evtName as EventType] = id
  selectDisplayValue.value[evtName] = func.label
}

const setAction = (evt: string) => {
  // insert new function
  const id = generateID()
  schema.functions[id] = {
    name: `${evt}_${id}`,
    body: `console.log(this)`
  }
  // set as handler
  selectedWidget.value.props.event[evt as EventType] = id
  selectDisplayValue.value[evt] = `${evt}_${id}`
}

const deleteAction = (evt: string) => {
  delete selectedWidget.value.props.event[evt as EventType]
}

const toEdit = () => {
  emit('show-editor')
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
