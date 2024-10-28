import type { NodeConfigMap } from '@/types/fux-core/flow'

const initialNodeConfig: NodeConfigMap = {
  audit: {
    name: '审核人',
    props: {
      actor: {},
      fields: []
    },
    type: 'audit',
    uid: ''
  },
  start: {
    name: '发起人',
    props: {},
    type: 'start',
    uid: ''
  }
}

export default initialNodeConfig
