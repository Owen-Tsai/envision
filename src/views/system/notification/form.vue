<template>
  <AModal
    v-model:open="open"
    :title="isAdd ? '发布通知公告' : '编辑通知公告'"
    destroy-on-close
    :confirm-loading="loading"
    :after-close="resetFields"
    wrap-class-name="fullscreen-modal"
    width="100%"
    @ok="submit"
  >
    <ASpin :spinning="loading">
      <div class="modal-content-wrapper">
        <AForm
          ref="formRef"
          :label-col="{ style: { width: '80px' } }"
          :model="formData"
          :rules="rules"
          class="mt-4"
        >
          <ARow :gutter="16">
            <ACol :span="12">
              <AFormItem label="公告标题" name="title">
                <AInput v-model:value="formData.title" placeholder="请输入通知公告的标题" />
              </AFormItem>
            </ACol>
            <ACol :span="6">
              <AFormItem label="公告类型" name="type">
                <ASelect
                  v-model:value="formData.type"
                  :options="systemNoticeType"
                  placeholder="请选择通知公告的类型"
                />
              </AFormItem>
            </ACol>
            <ACol :span="6">
              <AFormItem label="公告状态" name="status">
                <ARadioGroup v-model:value="formData.status" :options="commonStatus" />
              </AFormItem>
            </ACol>
          </ARow>
        </AForm>

        <div class="document-wrapper flex-grow">
          <EEditor type="document" v-model:value="formData.content" />
        </div>
      </div>
    </ASpin>
  </AModal>
</template>

<script lang="ts" setup>
import { ref, computed, type PropType } from 'vue'
import useDict from '@/hooks/use-dict'
import {
  addNotification,
  updateNotification,
  getNotificationDetail,
  type NotificationVO,
} from '@/api/system/notification'
import { message, type FormInstance, type FormProps } from 'ant-design-vue'
import EEditor from '@/components/editor/index.vue'

const rules: FormProps['rules'] = {
  title: [{ required: true, message: '请填写标题' }],
  type: [{ required: true, message: '请选择通知公告类别' }],
  content: [{ required: true, message: '请填写通知公告内容' }],
}

const props = defineProps({
  record: {
    type: Object as PropType<NotificationVO>,
  },
})

const emit = defineEmits(['success', 'close'])

const formRef = ref<FormInstance>()
const loading = ref(false)
const open = ref(true)
const formData = ref<NotificationVO>({
  status: 0,
  content: '',
})

const [commonStatus, systemNoticeType] = useDict('common_status', 'system_notice_type')

const isAdd = computed(() => props.record === undefined)

const submit = async () => {
  try {
    loading.value = true
    await formRef.value?.validate()

    if (isAdd.value) {
      await addNotification(formData.value)
      message.success('创建成功')
    } else {
      await updateNotification(formData.value)
      message.success('保存成功')
    }

    open.value = false
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

if (props.record?.id) {
  loading.value = true
  getNotificationDetail(props.record.id).then((res) => {
    formData.value = res
    loading.value = false
  })
}
</script>

<style lang="scss" scoped>
.modal-content-wrapper {
  @apply flex flex-col;
}
.document-wrapper {
  background-color: var(--color-bg-layout);
  height: calc(100% - 72px);
}
</style>
