<template>
  <AModal
    v-model:open="open"
    title="代码预览"
    destroy-on-close
    wrap-class-name="fullscreen-modal"
    width="100%"
    :after-close="onClose"
  >
    <template #footer>
      <AButton type="primary">关闭</AButton>
    </template>
    <div class="modal-content-wrapper">
      <ARow :gutter="40" class="h-full">
        <ACol :lg="7" class="h-full">
          <Scrollbar :auto-expand="false" :throttle-wait="0" wrapper-class="h-full" class="h-full">
            <ATree
              :tree-data="filePathTree"
              default-expand-all
              :key="renderKey"
              :selected-keys="selectedKeys"
              class="h-full"
              @select="(keys) => onSelect(keys)"
            />
          </Scrollbar>
        </ACol>
        <ACol :lg="17" class="h-full">
          <ATabs v-model:active-key="selectedKeys![0]" class="h-full code-tabs-pane">
            <ATabPane
              v-for="file in data!"
              :key="file.filePath"
              :tab="last(file.filePath.split('/'))"
              class="h-full"
            >
              <Scrollbar
                :auto-expand="false"
                :throttle-wait="50"
                wrapper-class="h-full"
                class="h-full"
              >
                <div class="h-full" v-html="code" />
              </Scrollbar>
            </ATabPane>
          </ATabs>
        </ACol>
      </ARow>
    </div>
  </AModal>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { last } from 'lodash-es'
import { previewCode, type CodePreviewVO } from '@/api/infra/code-gen'
import useHighlighter from '@/hooks/use-highlighter'
import type { BundledLanguage } from 'shiki/langs'

type FileNode = {
  key: string
  title: string
  pKey?: string | null
  children?: FileNode[]
}

const props = defineProps({
  id: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['close'])

const open = ref(true)
const renderKey = ref(0)
const data = ref<CodePreviewVO>()
const selectedKeys = ref<string[]>([])
const loading = ref(true)

const code = computed<string>(() => {
  const entry = data.value?.find((e) => e.filePath === selectedKeys.value[0])
  if (!entry) return ''
  const snippet = entry.code
  const lang = last(entry.filePath.split('/'))?.split('.')[1]
  return useHighlighter(snippet, (lang as BundledLanguage) || 'txt')
})

const filePathTree = computed<FileNode[]>(() => {
  if (!data.value) return []
  const existedMap: Record<string, boolean> = {}
  const files: FileNode[] = []

  for (const entry of data.value) {
    let pathFrags = entry.filePath.split('/')
    // full path from top level dir, used for key generation
    let fullPath = ''

    if (pathFrags[pathFrags.length - 1].includes('.java')) {
      const newPathFrags: string[] = []
      for (let i = 0; i < pathFrags.length; i++) {
        let p = pathFrags[i]
        if (p !== 'java') {
          newPathFrags.push(p)
          continue
        }

        newPathFrags.push(p)
        let temp = ''
        while (i < pathFrags.length) {
          p = pathFrags[i + 1]
          if (
            [
              'controller',
              'convert',
              'dal',
              'enums',
              'service',
              'vo',
              'mysql',
              'dataobject'
            ].includes(p)
          ) {
            break
          }
          temp = temp ? temp + '.' + p : p
          i++
        }

        if (temp) {
          newPathFrags.push(temp)
        }
      }

      pathFrags = newPathFrags
    }

    for (let i = 0; i < pathFrags.length; i++) {
      const oldFullPath = fullPath
      fullPath =
        fullPath.length === 0 ? pathFrags[i] : fullPath.replaceAll('.', '/') + '/' + pathFrags[i]
      if (existedMap[fullPath]) {
        continue
      }
      // 添加到 files 中
      existedMap[fullPath] = true
      files.push({
        key: fullPath,
        title: pathFrags[i],
        pKey: oldFullPath || '/' // `/` -> root node
      })
    }
  }

  return constructTree(files)
})

const constructTree = (files: FileNode[]) => {
  const clonedData = [...files]

  const treeData = clonedData.filter((parent) => {
    const branchArr = clonedData.filter((child) => {
      return parent.key === child.pKey
    })

    if (branchArr.length > 0) {
      parent.children = branchArr
    }
    return parent.pKey === '/'
  })

  return treeData
}

const onClose = () => {
  emit('close')
}

const onSelect = (keys: (string | number)[]) => {
  selectedKeys.value = keys as string[]
}

// get generated code
previewCode(props.id).then((res) => {
  data.value = res
  renderKey.value++
  selectedKeys.value[0] = data.value[0].filePath
  loading.value = true
})
</script>

<style lang="scss">
.code-tabs-pane .ant-tabs-content {
  height: 100%;
}
</style>
