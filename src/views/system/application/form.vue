<template>
  <AModal
    v-model:open="open"
    :title="isAdd ? '新建应用' : '编辑应用'"
    destroy-on-close
    :confirm-loading="loading"
    :after-close="resetFields"
    @ok="submit"
  >
    <ASpin :spinning="loading">
      <AForm
        ref="formRef"
        :label-col="{ style: { width: '80px' } }"
        :model="formData"
        :rules="rules"
        class="mt-4"
      >
        <AFormItem label="应用名称" name="name">
          <AInput v-model:value="formData.name" placeholder="如：用户性别" />
        </AFormItem>
        <AFormItem label="是否上架" name="published">
          <ARadioGroup v-model:value="formData.published" :options="statusOpts" />
        </AFormItem>
        <AFormItem label="备注" name="remark">
          <ATextarea v-model:value="formData.remark" />
        </AFormItem>
      </AForm>
    </ASpin>
  </AModal>
</template>

<script lang="ts" setup>
import { ref, computed, type PropType } from 'vue'
import useDict from '@/hooks/use-dict'
import {
  addApplication,
  updateApplication,
  getApplicationDetail,
  type ApplicationVO
} from '@/api/system/application'
import { message, type FormInstance, type FormProps } from 'ant-design-vue'

const rules: FormProps['rules'] = {
  name: [{ required: true, message: '请填写字典名称' }],
  type: [{ required: true, message: '请填写字典类型' }]
}

const props = defineProps({
  record: {
    type: Object as PropType<ApplicationVO>
  }
})

const emit = defineEmits(['success', 'close'])

const formRef = ref<FormInstance>()
const loading = ref(false)
const open = ref(true)
const formData = ref<Partial<ApplicationVO>>({
  name: '',
  type: '',
  published: 0
})

const [statusOpts] = useDict('system_application_status')

const isAdd = computed(() => props.record === undefined)

const submit = async () => {
  try {
    loading.value = true
    await formRef.value?.validate()

    if (isAdd.value) {
      await addApplication(formData.value)
      message.success('创建成功')
    } else {
      await updateApplication(formData.value)
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

if (props.record?.id) {
  loading.value = true
  getApplicationDetail(props.record.id).then((res) => {
    formData.value = res
    loading.value = false
  })
}
</script>
