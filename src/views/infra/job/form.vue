<template>
  <AModal
    v-model:open="open"
    :title="isAdd ? '新增定时任务' : '编辑定时任务'"
    destroy-on-close
    :confirm-loading="loading"
    :after-close="resetFields"
    @ok="submit"
  >
    <ASpin :spinning="loading">
      <AForm
        ref="formRef"
        :label-col="{ style: { width: '100px' } }"
        :model="formData"
        :rules="rules"
        class="mt-4"
      >
        <AFormItem label="任务名称" name="name">
          <AInput v-model:value="formData.name" placeholder="请填写任务名称" />
        </AFormItem>
        <AFormItem label="处理器名称" name="handlerName">
          <AInput v-model:value="formData.handlerName" placeholder="请填写处理器名称" />
        </AFormItem>
        <AFormItem label="处理器参数" name="handlerParam">
          <AInput v-model:value="formData.handlerParam" placeholder="请填写处理器参数" />
        </AFormItem>
        <AFormItem label="CRON表达式" name="cronExpression">
          <AInput
            v-model:value="formData.cronExpression"
            placeholder="请输入CRON表达式，或使用快捷设置选项"
          >
            <template #addonAfter>
              <ADropdown>
                <span class="cursor-pointer">
                  快捷设置
                  <DownOutlined />
                </span>
                <template #overlay>
                  <AMenu>
                    <AMenuItem>每分钟</AMenuItem>
                    <AMenuItem>每小时</AMenuItem>
                    <AMenuItem>每日0时</AMenuItem>
                    <AMenuItem>每月1日0时</AMenuItem>
                    <AMenuItem>每月最后一日0时</AMenuItem>
                    <AMenuItem>每周周日0时</AMenuItem>
                    <AMenuDivider />
                    <AMenuItem @click="openCronEditor(formData.cronExpression)">自定义</AMenuItem>
                  </AMenu>
                </template>
              </ADropdown>
            </template>
          </AInput>
        </AFormItem>
        <AFormItem label="重试次数" name="retryCount">
          <AInputNumber
            class="w-full"
            v-model:value="formData.retryCount"
            placeholder="请填写重试次数，设置为 0 表示不重试"
          />
        </AFormItem>
        <AFormItem label="重试间隔" name="retryInterval">
          <AInputNumber
            class="w-full"
            v-model:value="formData.retryInterval"
            placeholder="请填写重试间隔（毫秒），设置为 0 表示立即重试"
          />
        </AFormItem>
        <AFormItem label="监控超时时间" name="monitorTimeout">
          <AInputNumber
            class="w-full"
            v-model:value="formData.monitorTimeout"
            placeholder="请填写监控超时时间（毫秒）"
          />
        </AFormItem>
      </AForm>
    </ASpin>
  </AModal>

  <CronEditor
    v-if="cronEditorStates.open"
    :value="cronEditorStates.value"
    @update:value="setExpression"
    @close="cronEditorStates.open = false"
  />
</template>

<script lang="ts" setup>
import { ref, reactive, computed, type PropType } from 'vue'
import { message, type FormInstance, type FormProps } from 'ant-design-vue'
import CronEditor from './experssion-editor.vue'
import { DownOutlined } from '@ant-design/icons-vue'
import { createJob, updateJob, getJobDetail, type JobVO } from '@/api/infra/job'

const rules: FormProps['rules'] = {
  name: [{ required: true, message: '请填写任务名称' }],
  handlerName: [{ required: true, message: '请填写处理器名称' }],
  cronExpression: [{ required: true, message: '请填写CRON表达式' }],
  retryCount: [{ required: true, message: '请填写重试次数' }],
  retryInterval: [{ required: true, message: '请填写重试间隔' }],
}

const props = defineProps({
  record: {
    type: Object as PropType<JobVO>,
  },
})

const emit = defineEmits(['success', 'close'])

const formRef = ref<FormInstance>()
const loading = ref(false)
const open = ref(true)
const formData = ref<JobVO>({})

const cronEditorStates = reactive({
  open: false,
  value: '',
})

const isAdd = computed(() => props.record === undefined)

const submit = async () => {
  try {
    loading.value = true
    await formRef.value?.validate()

    if (isAdd.value) {
      await createJob(formData.value)
      message.success('创建成功')
    } else {
      await updateJob(formData.value)
      message.success('保存成功')
    }

    emit('success')
  } catch (e) {
    //
  } finally {
    loading.value = false
  }
}

const resetFields = () => {
  formRef.value?.resetFields()
  emit('close')
}

const openCronEditor = (val?: string) => {
  cronEditorStates.value = val || ''
  cronEditorStates.open = true
}

const setExpression = (val: string) => {
  formData.value.cronExpression = val
}

if (props.record?.id) {
  loading.value = true
  getJobDetail(props.record.id).then((res) => {
    formData.value = res
    loading.value = false
  })
}
</script>
