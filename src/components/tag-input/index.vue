<template>
  <div class="input-box" :style="computedStyle" @click="setFocus">
    <span class="mirror-ref" ref="mirrorRef">{{ inputModel || placeholder }}</span>
    <div class="tags flex flex-wrap items-center gap-1">
      <template v-if="maxTagCount">
        <ATag
          v-for="(item, i) in computedValue.slice(0, maxTagCount)"
          :key="i"
          closable
          class="me-0"
          @close.prevent="removeTag(i)"
        >
          {{ getText(item) }}
        </ATag>
        <ATag v-if="computedValue.length > maxTagCount" class="me-0">
          + {{ computedValue.length - maxTagCount }}
        </ATag>
      </template>
      <template v-else>
        <ATag
          v-for="(item, i) in computedValue"
          :key="i"
          closable
          class="me-0"
          @close.prevent="removeTag(i)"
        >
          {{ getText(item) }}
        </ATag>
      </template>
      <input
        v-model="inputModel"
        ref="inputEl"
        type="text"
        :style="{ width: `${inputWidth}px` }"
        :placeholder="placeholder"
        @focus="focused = true"
        @blur="onBlur"
        @keydown.enter="processInput"
        @keydown.delete="onDelete"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, type PropType, type CSSProperties } from 'vue'
import { theme } from 'ant-design-vue'

const { token } = theme.useToken()

const props = defineProps({
  value: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  maxTagCount: {
    type: Number,
  },
  maxTagTextLength: {
    type: Number,
  },
  placeholder: {
    type: String,
  },
})

const emit = defineEmits(['update:value'])

const computedValue = computed({
  get: () => {
    if ((props.value as any) === '' || !props.value) {
      return []
    }

    return props.value
  },
  set: (val) => {
    emit('update:value', val)
  },
})

const computedStyle = computed<CSSProperties>(() =>
  focused.value
    ? {
        boxShadow: `0 0 0 ${token.value.controlOutlineWidth}px ${token.value.controlOutline}`,
        borderColor: 'var(--color-primary-hover)',
      }
    : {},
)

const focused = ref(false)
const inputModel = ref('')
const mirrorRef = ref<HTMLSpanElement>()
const inputEl = ref<HTMLInputElement>()
const inputWidth = ref<number>(12)

const processInput = () => {
  if (inputModel.value !== '' && !computedValue.value.includes(inputModel.value)) {
    computedValue.value = [...computedValue.value, inputModel.value]
    inputModel.value = ''
  }
}

const removeTag = (idx: number) => {
  const copy = [...computedValue.value]
  copy.splice(idx, 1)
  computedValue.value = copy
}

const onDelete = () => {
  if (inputModel.value === '' && computedValue.value.length > 0) {
    removeTag(computedValue.value.length - 1)
  }
}

const getText = (str: string) => {
  if (props.maxTagTextLength && str.length > props.maxTagTextLength) {
    return str.substring(0, props.maxTagTextLength) + '...'
  }
  return str
}

const setWidth = () => {
  if (mirrorRef.value) {
    if (mirrorRef.value.offsetWidth) {
      inputWidth.value = mirrorRef.value.offsetWidth + 12
    }
  }
}

const setFocus = () => {
  if (inputEl.value) {
    inputEl.value.focus()
  }
}

const onBlur = () => {
  focused.value = false
  inputModel.value = ''
}

watch(
  () => inputModel.value,
  () => {
    setWidth()
  },
)
</script>

<style lang="scss" scoped>
.input-box {
  box-sizing: border-box;
  margin: 0;
  padding: 4px 11px;
  font-size: 14px;
  line-height: 1.5714285714285714;
  list-style: none;
  position: relative;
  display: inline-block;
  width: 100%;
  min-width: 0;
  background-color: var(--color-bg-container);
  background-image: none;
  border-width: 1px;
  border-style: solid;
  border-color: var(--color-border);
  border-radius: 6px;
  transition: all 0.2s;
  cursor: text;

  &:hover {
    border-color: var(--color-primary-hover);
    border-inline-end-width: 1px;
  }

  input {
    margin: 0;
    padding: 0;
    background: transparent;
    border: none;
    outline: none;
    appearance: none;

    &::placeholder {
      color: var(--color-text-quaternary);
    }
  }
}

.mirror-ref {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -99;
  white-space: pre;
  visibility: hidden;
  pointer-events: none;
}
</style>
