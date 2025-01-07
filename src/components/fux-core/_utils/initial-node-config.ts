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
  condition: {
    name: '条件分支',
    props: {
      condition: '',
    },
    type: 'condition',
    uid: '',
  },
  group: {
    name: '',
    props: {
      children: [],
    },
    type: 'group',
    uid: '',
  },
}

export default initialNodeConfig
