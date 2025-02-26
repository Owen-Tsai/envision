<template>
  <div class="view relative">
    <div class="mb-4">
      <!-- page header, with return action -->
      <div class="flex items-center gap-4">
        <AButton>
          <template #icon>
            <ArrowLeftOutlined />
          </template>
        </AButton>

        <div>
          <h1>{{ `${basicInfo?.starter} 的 ${planInfo?.item}` }}</h1>
          <div class="flex items-center gap-8 text-muted">
            <span>所属应用：{{ planInfo?.item }}</span>
            <span>申报人：{{ basicInfo?.starter }}</span>
            <span>申报时间：{{ dayjs(basicInfo?.createTime).format('YYYY-MM-DD') }}</span>
          </div>
        </div>
      </div>
    </div>

    <ARow :gutter="16">
      <ACol :span="24" :lg="20">
        <!-- audit view renderer -->
        <ACard class="mb-4" :body-style="{ paddingTop: 8 }">
          <div class="audit-view">
            <FormRenderer
              ref="formRenderer"
              v-if="appSchema"
              :schema="appSchema"
              :taskDefKey="taskDefKey"
              mode="audit"
              disabled
            />
          </div>
        </ACard>
        <!-- attachment table renderer -->
        <AttachClass
          ref="attachClass"
          :app-id="appId"
          :apply-id="applyId"
          :plan-id="planInfo.id!"
          :current-audit-process="'0'"
          class="mb-4"
        />
        <!-- audit form -->
        <AuditForm
          v-if="taskDefKey !== 'All'"
          :starter="basicInfo?.starter"
          :create-time="basicInfo?.createTime"
          :fields="fields"
        />
      </ACol>
      <ACol :span="24" :lg="4">
        <!-- timeline -->
        <Scrollbar :style="{ height: 'calc(100vh - 180px)' }" class="fixed top-30">
          <h3>审核历史</h3>
          <Timeline class="pt-4" />
        </Scrollbar>
      </ACol>
    </ARow>
  </div>
</template>

<script setup lang="ts">
import useDict from '@/hooks/use-dict'
import useData from './use-data'
import useActions from './use-actions'
import dayjs from 'dayjs'
import Timeline from './timeline.vue'
import AuditForm from './form.vue'
import AuditView from '@/components/fux-core/audit-view-renderer/index.vue'
import AttachClass from '@/components/attach/attach-class/index.vue'
import FormRenderer from '@/components/fux-core/form-renderer/index.vue'
import useFields from './use-fields'

const { query } = useRoute()

const taskDefKey = query.taskDefKey as string
const formRenderer = useTemplateRef<InstanceType<typeof FormRenderer>>('formRenderer')
const attachClass = useTemplateRef<InstanceType<typeof AttachClass>>('attachClass')

const { appSchema, planInfo, basicInfo, appId, applyId } = useData(formRenderer, attachClass)
const { getFields } = useFields(appSchema, formRenderer)

const fields = getFields()
</script>
