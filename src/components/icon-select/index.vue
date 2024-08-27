<template>
  <div>
    <APopover
      title="选择图标"
      v-model:open="open"
      :placement="placement"
      trigger="click"
      :overlayStyle="{ width: '400px' }"
      :overlayInnerStyle="{ overflowY: 'scroll', overflowX: 'hidden', maxHeight: '400px' }"
    >
      <AInput v-model:value="icon" allow-clear>
        <template v-if="showPreview || $slots['addonBefore']" #addonBefore>
          <template v-if="showPreview">
            <component v-if="icon" :is="iconsMap![icon]" />
            <span v-else>未选择</span>
          </template>
          <slot v-else name="addonBefore" />
        </template>
      </AInput>

      <template #content>
        <AInput v-model:value="keyword" placeholder="输入图标名称进行过滤" />
        <div class="mt-4">
          <div class="grid grid-cols-5 gap-2">
            <div v-for="(page, i) in icons[currentPage - 1]" :key="i">
              <div v-for="(entry, j) in page" :key="j" class="entry" @click="onSelect(j)">
                <Icon :component="entry" style="font-size: 32px" />
              </div>
            </div>
          </div>
          <div class="flex items-center justify-center mt-4">
            <APagination v-model:current="currentPage" simple :total="total" />
          </div>
        </div>
      </template>
    </APopover>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, getCurrentInstance, type PropType } from 'vue'
import Icon from '@ant-design/icons-vue'
import { Form, type PopoverProps } from 'ant-design-vue'
import { chunk } from 'lodash'

const ctx = Form.useInjectFormItemContext()

const props = defineProps({
  value: {
    type: String
  },
  showPreview: {
    type: Boolean,
    default: true
  },
  placement: {
    type: String as PropType<PopoverProps['placement']>
  }
})

const emit = defineEmits(['update:value'])

const open = ref(false)
const currentPage = ref(1)
const keyword = ref('')

const iconsMap = getCurrentInstance()?.proxy?.$icons

const total = Object.keys(iconsMap!).length

const filteredIcons = computed(() =>
  Object.keys(iconsMap!).filter((e) => e.toLowerCase().includes(keyword.value.toLowerCase()))
)

const icons = computed(() =>
  chunk(
    filteredIcons.value.map((k) => {
      return { [k]: iconsMap?.[k] }
    }),
    50
  )
)

const icon = computed({
  get: () => props.value,
  set: (val) => {
    emit('update:value', val)
  }
})

const onSelect = (entry: any) => {
  icon.value = entry
  ctx.onFieldChange()
  open.value = false
}
</script>

<style lang="scss" scoped>
.entry {
  @apply flex items-center justify-center cursor-pointer;
  &:hover {
    color: var(--colorPrimary);
  }
}
</style>
