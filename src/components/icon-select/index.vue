<template>
  <div>
    <APopover
      title="选择图标"
      trigger="focus"
      :overlayStyle="{ width: '400px' }"
      :overlayInnerStyle="{ overflowY: 'scroll', overflowX: 'hidden', maxHeight: '400px' }"
    >
      <AInput v-model:value="icon" allow-clear readonly>
        <template #addonBefore>
          <component :is="icon" />
        </template>
      </AInput>

      <template #content>
        <AInput placeholder="输入图标名称进行过滤" />
        <div class="mt-4">
          <div class="grid grid-cols-5 gap-2">
            <div v-for="(entry, i) in icons" :key="i" @click="onSelect(entry)">
              <component :is="entry" />
            </div>
          </div>
        </div>
      </template>
    </APopover>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, getCurrentInstance } from 'vue'
import { Form } from 'ant-design-vue'

const icons = getCurrentInstance()?.proxy?.$icons
const ctx = Form.useInjectFormItemContext()

const props = defineProps({
  value: {
    type: String
  }
})

const emit = defineEmits(['update:value'])

const icon = computed({
  get: () => props.value,
  set: (val) => {
    emit('update:value', val)
  }
})

const onSelect = (entry: any) => {
  console.log(entry)
  icon.value = entry
  ctx.onFieldChange()
}
</script>
