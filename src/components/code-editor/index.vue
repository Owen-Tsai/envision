<template>
  <div class="code-editor">
    <div ref="wrapperEl" class="wrapper h-full w-full" :style="computedStyle">
      // 请输入 {{ props.lang }} 代码
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, type PropType, type CSSProperties } from 'vue'
import { CodeJar } from 'codejar'
import useHighlighter from '@/hooks/use-highlighter'
import type { BundledLanguage } from 'shiki'

const props = defineProps({
  lang: {
    type: [String, Array] as PropType<BundledLanguage>,
    default: 'txt',
  },
  tabSize: {
    type: Number,
    default: 2,
  },
})

const wrapperEl = ref<HTMLDivElement>()

const computedStyle = computed<CSSProperties>(() => ({
  tabSize: props.tabSize,
}))

const highlightFn = (el: HTMLElement) => {
  const content = el.textContent
  if (content) {
    const highlighted = useHighlighter(content, props.lang)

    el.innerHTML = highlighted
  }
}

onMounted(() => {
  CodeJar(wrapperEl.value!, highlightFn)
  highlightFn(wrapperEl.value!)
})
</script>

<style lang="scss" scoped>
.code-editor {
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border);
  padding: 8px;
}
</style>
