import type { NodeConfigMap } from '@/types/fux-core/flow'
import { generateId } from '@fusionx/utils'

const initialNodeConfig: NodeConfigMap = {
  audit: {
    name: '审核人',
    props: {
      actor: {},
      fields: [],
    },
    type: 'audit',
    uid: '',
  },
  start: {
    name: '发起人',
    props: {},
    type: 'start',
    uid: generateId(),
  },
}

export default initialNodeConfig
