<template>
  <Teleport to="body">
    <div v-show="visible" class="captcha-mask">
      <div class="captcha-popup">
        <div class="flex items-center justify-between px-4 py-2">
          <div>请拖动滑块完成验证</div>
          <AButton type="text" @click="close">
            <template #icon>
              <CloseOutlined />
            </template>
          </AButton>
        </div>

        <div class="p-4 pt-0">
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
          </div>

          <div ref="dragTrackEl" class="drag-track">
            <div class="drag-progress" :style="{ left: dragAreaLeft }">
              <div ref="dragHandleEl" :class="['drag-handle', pressed ? 'pressed' : null]">
                <ArrowRightOutlined />
              </div>
              <div class="drag-block" :style="dragBlockStyle">
                <img :src="`data:image/png;base64,${data?.repData.jigsawImageBase64}`" />
              </div>
            </div>
          </div>

          <pre>{{ elementX }}</pre>
          <button @click="execute">123</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, type CSSProperties } from 'vue'
import { CloseOutlined, ReloadOutlined, ArrowRightOutlined } from '@ant-design/icons-vue'
import { useMouseInElement, useMousePressed } from '@vueuse/core'
import { aesEncrypt } from '@/utils/encryption'
import { getCaptcha, checkCaptcha, type CaptchaVO } from '@/api/login'
import useRequest from '@/hooks/use-request'

const backendFixedImgWidth = 310

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

const close = () => {
  visible.value = false
}

const { data, execute } = useRequest(getCaptcha, {
  immediate: true
})

// mouse drag
const dragHandleEl = ref<HTMLDivElement>()
const dragTrackEl = ref<HTMLDivElement>()
const dragAreaLeft = computed(() =>
  pressed.value && dragTrackEl.value ? `${elementX.value}px` : 0
)

const { pressed } = useMousePressed({ target: dragHandleEl })
const { elementX } = useMouseInElement(dragTrackEl)

const validate = () => {
  const secretKey = data.value?.repData.secretKey
  const token = data.value?.repData.token || ''
  const pointObj = {
    x: (elementX.value * backendFixedImgWidth) / props.imgWidth,
    y: 5.0
  }
  const pointJson = JSON.stringify(pointObj)
  const vo: CaptchaVO = {
    pointJson: secretKey ? aesEncrypt(pointJson, secretKey) : pointJson,
    token
  }

  checkCaptcha(vo).then((res) => {
    console.log(res)
    if (res.success) {
      const captchaVerification = secretKey
        ? aesEncrypt(`${token}---${pointJson}`, secretKey)
        : `${token}---${pointJson}`

      emit('success', captchaVerification)
    }
  })
}

watch(elementX, (val) => {
  const clampLimit = props.imgWidth - 32
  if (val <= 0) {
    elementX.value = 0
  }
  if (val >= clampLimit) {
    elementX.value = clampLimit
  }
})

watch(pressed, (newVal, oldVal) => {
  if (oldVal === true && newVal === false) {
    // released touch
    validate()
  }
})
</script>

<style lang="scss" scoped>
.captcha-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(#000, 0.45);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.captcha-popup {
  background-color: var(--colorBgContainer);
  box-shadow:
    0 6px 16px 0 rgba(0, 0, 0, 0.08),
    0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 9px 28px 8px rgba(0, 0, 0, 0.05);
  font-size: var(--fontSizeLG);
  border-radius: 6px;
}
.drag-track {
  width: 100%;
  height: 8px;
  border-radius: 18px;
  background-color: var(--colorFill);
  margin: 16px 0;
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
  width: 32px;
  position: absolute;
  top: -12px;
  left: 0px;
  border: 1px solid var(--colorBorder);
  border-radius: 50%;
  background-color: var(--colorBgContainer);
  color: var(--colorText);
  @apply flex-center shadow-lg transition-colors duration-200;

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
* {
  user-select: none;
  -webkit-user-drag: none;
}
</style>
