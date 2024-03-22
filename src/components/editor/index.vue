<template>
  <div
    :class="[
      'editor-wrapper',
      'h-full',
      'overflow-y-auto',
      {
        'document-mode': props.type === 'document'
      }
    ]"
  >
    <Toolbar :editor="editorRef" :default-config="toolbarConfig" class="toolbar" mode="default" />
    <div class="editor-body" @click="onBodyClick">
      <Editor
        v-model="content"
        :default-config="editorConfig"
        style="min-height: 350px"
        mode="default"
        @on-created="onCreated"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, shallowRef, computed, onBeforeUnmount, onMounted, type PropType } from 'vue'
import { message } from 'ant-design-vue'
import { Toolbar, Editor } from '@wangeditor/editor-for-vue'
import { getTenantId, getFormattedToken } from '@/utils/auth'
import type { IEditorConfig, IToolbarConfig } from '@wangeditor/editor'

const editorRef = shallowRef()
const toolbar = ref()

const props = defineProps({
  type: {
    type: String as PropType<'document' | 'normal'>,
    default: 'normal'
  },
  value: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:value'])

const content = computed({
  get: () => props.value,
  set: (val) => {
    emit('update:value', val)
  }
})

const toolbarConfig: Partial<IToolbarConfig> = {
  excludeKeys: ['emotion', 'fullScreen']
}
const editorConfig = computed<Partial<IEditorConfig>>(() => {
  return {
    placeholder: '请输入内容...',
    scroll: true,
    autoFocus: false,
    customAlert(info, type) {
      switch (type) {
        case 'success':
          message.success(info)
          break
        case 'info':
          message.info(info)
          break
        case 'warning':
          message.warning(info)
          break
        case 'error':
          message.error(info)
          break
        default:
          message.info(info)
          break
      }
    },
    MENU_CONF: {
      ['uploadImage']: {
        maxFileSize: (10 * 1024) & 1024,
        maxNumberOfFiles: 20,
        // 自定义上传参数，例如传递验证的 token 等。参数会被添加到 formData 中，一起上传到服务端
        meta: { updateSupport: 0 },
        // 将 meta 拼接到 url 参数中，默认 false
        metaWithUrl: true,
        // custom http request headers
        headers: {
          Accept: '*',
          Authorization: getFormattedToken(),
          'tenant-id': getTenantId()
        },
        // 跨域是否传递 cookie ，默认为 false
        withCredentials: true,
        // 超时时间，默认为 10 秒
        timeout: 5 * 1000, // 5 秒
        // form-data fieldName，后端接口参数名称，默认值wangeditor-uploaded-image
        fieldName: 'file',
        onFailed(file: File, res: any) {
          alert(res.message)
          console.log('onFailed', file, res)
        },
        onError(file: File, err: any, res: any) {
          alert(err.message)
          console.error('onError', file, err, res)
        }
      }
    }
  }
})

const onCreated = (editor: unknown) => {
  editorRef.value = editor
}

const onBodyClick = () => {
  editorRef.value.focus()
}

onBeforeUnmount(() => {
  editorRef.value.destroy()
})

onMounted(() => {
  console.log(toolbar.value)
})
</script>

<style lang="scss" scoped>
.editor-wrapper {
  --w-e-toolbar-border-color: var(--colorBorder);
  border: 1px solid var(--colorBorder);
  @apply relative;
  .toolbar {
    @apply sticky top-0 z-999;
    border-bottom: 1px solid var(--colorBorder);
  }

  &.document-mode {
    .editor-body {
      width: 850px;
      padding: 24px 32px;
      margin: 32px auto;
      background-color: var(--colorBgContainer);
    }
  }
}
</style>
