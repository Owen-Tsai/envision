import { reactive } from 'vue'
import { emitter } from '@fusionx/utils'
import { BuildOutlined, FileTextOutlined, PartitionOutlined } from '@ant-design/icons-vue'

export const toolbarItems = [
  { title: '树视图', icon: PartitionOutlined },
  { title: '组件库', icon: BuildOutlined },
  { title: 'JSON Schema', icon: FileTextOutlined },
]

export const useToolbar = () => {
  const visible = reactive({
    preview: false,
    func: false,
    api: false,
    schemaView: false,
  })

  emitter.on('show:func-modal', () => (visible.func = true))

  return {
    visible,
  }
}
