<template>
  <AModal
    v-model:open="open"
    title="任务执行计划"
    destroy-on-close
    :confirm-loading="loading"
    :after-close="() => emit('close')"
  >
    <ASpin :spinning="loading">
      <div>
        <p>任务 {{ record?.name }} 近 5 次规划的执行时间：</p>
        <ATimeline class="mt-6">
          <ATimelineItem v-for="(item, i) in data" :key="i">
            {{ dayjs(item).format('YYYY-MM-DD dddd HH:mm:ss') }}
          </ATimelineItem>
        </ATimeline>
      </div>
    </ASpin>

    <template #footer>
      <AButton @click="open = false">关闭</AButton>
    </template>
  </AModal>
</template>

<script lang="ts" setup>
import { ref, type PropType } from 'vue'
import dayjs from 'dayjs'
import { getJobScheduledTimes, type JobVO } from '@/api/infra/job'

const props = defineProps({
  record: {
    type: Object as PropType<JobVO>
  }
})

const emit = defineEmits(['close'])

const loading = ref(false)
const open = ref(true)

const data = ref<number[]>([])

if (props.record?.id) {
  loading.value = true
  getJobScheduledTimes(props.record.id).then((res) => {
    data.value = res
    loading.value = false
  })
}
</script>
