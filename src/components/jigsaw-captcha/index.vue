<template>
  <AModal v-model:open="visible" title="请拖动滑块完成验证" :width="448">
    <template #footer></template>
    <ASpin :spinning="pending">
      <div class="mt-4">
        <div class="relative">
          <img
            :src="`data:image/png;base64,${data?.repData.originalImageBase64}`"
            :style="imgStyle"
          />
          <div
            class="absolute top-0 right-0 p-2 inline-flex items-center justify-center cursor-pointer"
            @click="execute"
          >
            <ReloadOutlined />
          </div>
          <Transition name="slide-up">
            <div
              v-show="validateResult.visible"
              :class="['validation-result', validateResult.success ? 'success' : 'error']"
            >
              {{ validateResult.msg }}
            </div>
          </Transition>
        </div>

        <div ref="dragTrackEl" class="drag-track">
          <div class="drag-progress" :style="{ left: dragAreaLeftTemp || dragAreaLeft }">
            <div ref="dragHandleEl" :class="['drag-handle', pressed ? 'pressed' : null]">
              <MenuOutlined :rotate="90" />
            </div>
            <div class="drag-block" :style="dragBlockStyle">
              <img :src="`data:image/png;base64,${data?.repData.jigsawImageBase64}`" />
            </div>
          </div>
        </div>
      </div>
    </ASpin>
  </AModal>
</template>

<script setup lang="ts">
import { ref, computed, watch, type CSSProperties } from 'vue'
import { message } from 'ant-design-vue'
import { ReloadOutlined, MenuOutlined } from '@ant-design/icons-vue'
import { useMouseInElement, useMousePressed } from '@vueuse/core'
import { aesEncrypt } from '@/utils/encryption'
import { getCaptcha, checkCaptcha, type CaptchaValidationDTO } from '@/api/login'
import useRequest from '@/hooks/use-request'

const backendFixedImgWidth = 310
const dragHandleWidthOffset = 32

const props = defineProps({
  open: Boolean,
  imgWidth: {
    type: Number,
    default: 400
  },
  imgHeight: {
    type: Number,
    default: 200
  }
})

const emit = defineEmits(['update:open', 'success'])

const imgStyle = computed<CSSProperties>(() => {
  return {
    height: `${props.imgHeight}px`,
    width: `${props.imgWidth}px`
  }
})

const dragBlockStyle = computed<CSSProperties>(() => {
  return {
    height: `${props.imgHeight}px`,
    top: `${-props.imgHeight - 16}px`
  }
})

const visible = computed({
  get: () => props.open,
  set: (val) => {
    emit('update:open', val)
  }
})

const { data, execute, pending } = useRequest(getCaptcha, {
  immediate: true
})

// mouse drag
const allowDrag = ref(true)
const dragHandleEl = ref<HTMLDivElement>()
const dragTrackEl = ref<HTMLDivElement>()
const dragAreaLeftTemp = ref<string | number | null>(null)
const dragAreaLeft = computed(() =>
  allowDrag.value && pressed.value && dragTrackEl.value ? `${elementX.value - 32}px` : 0
)
const validateResult = ref({
  visible: false,
  msg: '',
  success: false
})

const { pressed } = useMousePressed({ target: dragHandleEl })
const { elementX } = useMouseInElement(dragTrackEl)

const validate = () => {
  const secretKey = data.value?.repData.secretKey
  const token = data.value?.repData.token || ''
  const pointObj = {
    x: ((elementX.value - 32) * backendFixedImgWidth) / props.imgWidth,
    y: 5.0
  }
  const pointJson = JSON.stringify(pointObj)
  const vo: CaptchaValidationDTO = {
    pointJson: secretKey ? aesEncrypt(pointJson, secretKey) : pointJson,
    token
  }

  allowDrag.value = false

  checkCaptcha(vo).then((res) => {
    if (res.success) {
      const captchaVerification = secretKey
        ? aesEncrypt(`${token}---${pointJson}`, secretKey)
        : `${token}---${pointJson}`

      validateResult.value = {
        visible: true,
        msg: '验证通过',
        success: true
      }

      emit('success', captchaVerification)
    } else {
      message.error(res.repMsg)
      validateResult.value = {
        visible: true,
        msg: '验证失败',
        success: false
      }
      setTimeout(() => {
        validateResult.value.visible = false
        allowDrag.value = true
        dragAreaLeftTemp.value = dragAreaLeft.value
        execute()
      }, 1000)
    }
  })
}

watch(elementX, (val) => {
  const clampLimit = props.imgWidth - dragHandleWidthOffset
  if (val <= dragHandleWidthOffset) {
    elementX.value = dragHandleWidthOffset
  }
  if (val >= clampLimit) {
    elementX.value = clampLimit
  }
})

watch(pressed, (newVal, oldVal) => {
  if (oldVal === true && newVal === false && visible.value && allowDrag.value) {
    // released touch
    dragAreaLeftTemp.value = elementX.value
    validate()
  }
})

watch(visible, (val) => {
  if (val) {
    execute()
  }
})

defineExpose({
  refetch: execute
})
</script>

<style lang="scss" scoped>
.drag-track {
  @apply w-full h-2 mt-4;
  width: 100%;
  height: 8px;
  border-radius: 18px;
  background-color: var(--colorFill);
}
.drag-progress {
  width: 0;
  height: 8px;
  border-radius: 18px;
  background-color: var(--colorSuccess);
  position: relative;
}

.drag-handle {
  height: 32px;
  width: 64px;
  position: absolute;
  top: -12px;
  left: 0;
  border: 1px solid var(--colorBorder);
  border-radius: 64px;
  background-color: var(--colorBgContainer);
  color: var(--colorText);
  @apply flex-center shadow-lg transition-colors duration-200 cursor-move;

  &:hover,
  &.pressed {
    background-color: var(--colorPrimary);
    color: #fff;
  }
}
.drag-block {
  position: absolute;
  left: 0;
  img {
    height: 100%;
  }
}
.validation-result {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 4px 8px;

  &.success {
    background-color: var(--colorSuccessBg);
    color: var(--colorSuccess);
  }
  &.error {
    background-color: var(--colorErrorBg);
    color: var(--colorError);
  }
}
* {
  user-select: none;
  -webkit-user-drag: none;
}
</style>
