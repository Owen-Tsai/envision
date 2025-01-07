<template>
  <div class="conditional-group">
    <div class="text-center relative z-2">
      <AButton shape="round" @click="addBranch">添加条件</AButton>
    </div>
    <div class="node-wrapper -mt-4 z-1">
      <div class="branches">
        <div class="branch" v-for="(subNodes, branchIdx) in config.props.children" :key="branchIdx">
          <NodeRenderer :nodes="subNodes" @clear-branch="clearBranch(branchIdx)" />
          <div v-if="branchIdx === 0" class="edge-line line-tl"></div>
          <div v-if="branchIdx === 0" class="edge-line line-bl"></div>
          <div
            v-if="branchIdx === config.props.children.length - 1"
            class="edge-line line-tr"
          ></div>
          <div
            v-if="branchIdx === config.props.children.length - 1"
            class="edge-line line-br"
          ></div>
        </div>
      </div>
      <div>
        <NodeButton @click="onParentNodeAdd" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import { generateId } from '@fusionx/utils'
import initNodeConfig from '../_utils/initial-node-config'
import NodeButton from './node-button.vue'
import NodeRenderer from './index.vue'
import type { NodeConfigMap } from '@/types/fux-core/flow'

const { config, index } = defineProps<{
  config: NodeConfigMap['group']
  index: number
}>()

const emit = defineEmits(['update:config', 'add-node', 'delete'])

const computedProps = computed({
  get: () => config,
  set: (val) => {
    emit('update:config', val)
  },
})

const addBranch = () => {
  computedProps.value.props.children.push([
    {
      ...cloneDeep(initNodeConfig.condition),
      name: `条件${computedProps.value.props.children.length + 1}`,
      uid: generateId(),
    },
  ])
}

const clearBranch = (branchIdx: number) => {
  if (computedProps.value.props.children.length === 2) {
    emit('delete')
  } else {
    computedProps.value.props.children.splice(branchIdx, 1)
  }
}

const onParentNodeAdd = (type: keyof NodeConfigMap) => {
  emit('add-node', type)
}
</script>
