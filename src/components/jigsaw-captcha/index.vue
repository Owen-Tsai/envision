<template>
  <AModal v-model:open="visible" title="请拖动滑块完成验证" :width="448" destroy-on-close>
    <template #footer></template>
    <ASpin :spinning="pending">
      <div class="mt-4">
        <div class="relative" :style="`--width: ${width}px; --height: ${height}px;`">
          <img
            v-if="data"
            :src="`data:image/png;base64,${data?.repData.originalImageBase64}`"
            class="puzzle-image"
          />
          <div
            class="absolute top-0 right-0 p-2 inline-flex items-center justify-center cursor-pointer"
            @click="execute"
          >
            <ReloadOutlined />
          </div>
          <Transition name="slide-up">
            <div
              v-show="validationInfo.visible"
              :class="['validation-result', validationInfo.success ? 'success' : 'error']"
            >
              {{ validationInfo.msg }}
            </div>
          </Transition>
        </div>

        <div
          ref="dragTrackEl"
          class="drag-track"
          :style="`--height: ${height}px; --top: ${-height - 16}px`"
        >
          <div class="drag-progress" :style="{ left: ghostPosLeft || posLeft }">
            <div ref="dragHandleEl" :class="['drag-handle', pressed ? 'pressed' : null]">
              <MenuOutlined :rotate="90" />
            </div>
            <div class="puzzle-block">
              <img :src="`data:image/png;base64,${data?.repData.jigsawImageBase64}`" />
            </div>
          </div>
        </div>
      </div>
    </ASpin>
  </AModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ReloadOutlined, MenuOutlined } from '@ant-design/icons-vue'
import useMouseDrag, { SIZE_OFFSET } from './use-mouse'
import useValidation, { BACKEND_FIXED_IMG_WIDTH } from './use-validation'
import { getCaptcha } from '@/api/login'
import useRequest from '@/hooks/use-request'

const {
  open,
  width = 400,
  height = 200,
} = defineProps<{
  open: boolean
  width?: number
  height?: number
}>()

const emit = defineEmits<{
  (e: 'update:open', val: boolean): void
  (e: 'success', val: string): void
}>()

// 鼠标拖拽的锚点元素
const dragHandleEl = ref<HTMLDivElement>()
// 锚点拖拽时的轨道元素
const dragTrackEl = ref<HTMLDivElement>()

const visible = computed({
  get: () => open,
  set: (val) => {
    emit('update:open', val)
  },
})

const { data, execute, pending } = useRequest(getCaptcha, {
  immediate: true,
})

const { allowDrag, ghostPosLeft, posLeft, pressed, x } = useMouseDrag(dragHandleEl, dragTrackEl)

const { validate, validationInfo } = useValidation({
  onSuccess: (val) => {
    emit('success', val)
  },
  onError: () => {
    reLoad()
  },
})

const reLoad = () => {
  validationInfo.value.visible = false
  allowDrag.value = true
  ghostPosLeft.value = posLeft.value
  execute()
}

watch(pressed, async (newVal, oldVal) => {
  if (oldVal === true && newVal === false && visible.value && allowDrag.value) {
    // released touch
    console.log(posLeft.value)
    ghostPosLeft.value = x.value
    allowDrag.value = false
    await validate(((x.value - SIZE_OFFSET) * BACKEND_FIXED_IMG_WIDTH) / width, data.value)
  }
})

watch(visible, (val) => {
  if (val) {
    reLoad()
  }
})

defineExpose({
  refetch: execute,
})
</script>

<style lang="scss" scoped>
.puzzle-image {
  width: var(--width);
  height: var(--height);
}
.puzzle-block {
  position: absolute;
  left: 0;
  height: var(--height);
  top: var(--top);
  img {
    height: 100%;
  }
}
.drag-track {
  @apply w-full h-2 mt-4;
  width: 100%;
  height: 8px;
  border-radius: 18px;
  background-color: var(--color-fill);
}
.drag-progress {
  width: 0;
  height: 8px;
  border-radius: 18px;
  background-color: var(--color-success);
  position: relative;
}

.drag-handle {
  height: 32px;
  width: 64px;
  position: absolute;
  top: -12px;
  left: 0;
  border: 1px solid var(--color-border);
  border-radius: 64px;
  background-color: var(--color-bg-container);
  color: var(--color-text);
  @apply flex-center shadow-lg transition-colors duration-200 cursor-move;

  &:hover,
  &.pressed {
    background-color: var(--color-primary);
    color: #fff;
  }
}
.validation-result {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 4px 8px;

  &.success {
    background-color: var(--color-success-bg);
    color: var(--color-success);
  }
  &.error {
    background-color: var(--color-error-bg);
    color: var(--color-error);
  }
}
* {
  user-select: none;
  -webkit-user-drag: none;
}
</style>
