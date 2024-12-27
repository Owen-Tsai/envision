<template>
  <div class="flex flex-col h-screen">
    <header class="flex-shrink-0">
      <div class="title-wrapper">
        <Logo class="logo" />
        <ADivider type="vertical" class="h-8" />
        <h1 class="title mb-0">应用设计</h1>
      </div>

      <div class="step-bar">
        <ASteps v-model:current="step" :items="steps" size="small" />
      </div>

      <div class="actions">
        <AFlex justify="end" align="center" :gap="8">
          <ATooltip title="查看 Schema">
            <AButton :icon="h(CodeOutlined)" @click="schemaVisible = true" />
          </ATooltip>
          <AButton v-show="step === 2" type="primary" @click="saveAppDesign">保存应用</AButton>
          <ATooltip title="返回首页" placement="bottom">
            <AButton type="text" :icon="h(RollbackOutlined)" @click="$router.push('/index')" />
          </ATooltip>
        </AFlex>
      </div>
    </header>

    <div class="flex-grow-0 h-full overflow-hidden">
      <Loader v-if="!schemaLoaded" />
      <template v-else>
        <DataSourceConfig v-if="step === 0" @finish="step = 1" />
        <FormDesign v-if="step === 1" />
        <WorkflowDesign v-if="step === 2" />
      </template>
    </div>

    <AModal v-model:open="schemaVisible" title="应用 Schema" :width="480">
      <div class="relative">
        <div v-html="highlighted" />
        <ATooltip :title="copied ? '已复制' : '复制 Schema'">
          <AButton shape="circle" :icon="h(CopyOutlined)" ghost @click="copy()" />
        </ATooltip>
      </div>

      <template #footer>
        <div class="text-right">
          <AButton type="primary" @click="schemaVisible = false">关闭</AButton>
        </div>
      </template>
    </AModal>
  </div>
</template>

<script setup lang="ts">
import { h } from 'vue'
import Loader from '@/components/loading/index.vue'
import { RollbackOutlined, CodeOutlined, CopyOutlined } from '@ant-design/icons-vue'
import DataSourceConfig from './data-source/index.vue'
import FormDesign from './form/index.vue'
import WorkflowDesign from './workflow/index.vue'
import useHighlighter from '@/hooks/use-highlighter'
import { useSteps, useAppDesigner } from './use-app-design'

const { appSchema, saveAppDesign, schemaLoaded } = useAppDesigner()
const { step, steps } = useSteps()
const { copy, copied } = useClipboard({ source: JSON.stringify(appSchema.value, null, 2) })

const schemaVisible = ref(false)
const highlighted = computed(() => useHighlighter(JSON.stringify(appSchema.value, null, 2), 'json'))
</script>

<style lang="scss" scoped>
@use '@/styles/mixins.scss' as *;

header {
  @apply flex-between px-4 lg:px-6;
  height: $header-height;
  background: unset;
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--color-border-secondary);
  position: sticky;
  top: 0;
  left: 0;
  z-index: 20;
  background-color: var(--color-bg-alt);

  & > div {
    width: 33.3333%;
  }
}

.title-wrapper {
  @apply flex items-center;
  gap: 8px;
  justify-self: flex-start;
  .logo {
    height: 30px;
    border-radius: 6px;
    user-select: none;
    -webkit-user-drag: none;
  }
}
</style>
