<template>
  <AModal
    v-model:open="open"
    :title="isAdd ? '新增字典类型' : '编辑字典类型'"
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
        <AFormItem label="字典名称" name="name">
          <AInput v-model:value="formData.name" placeholer="如：用户性别" />
        </AFormItem>
        <AFormItem label="字典类型" name="type">
          <AInput v-model:value="formData.type" placeholer="如：system_user_gender" />
        </AFormItem>
        <AFormItem label="状态" name="status">
          <ARadioGroup v-model:value="formData.status" :options="commonStatus as RadioOptions" />
        </AFormItem>
        <AFormItem label="备注" name="remark">
          <ATextarea v-model:value="formData.remark" />
        </AFormItem>
      </AForm>
    </ASpin>
  </AModal>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import useDict from '@/hooks/use-dict'
import {
  addDictType,
  updateDictType,
  getDictTypeDetail,
  type DictTypeVO
} from '@/api/system/dict/type'
import { message, type FormInstance, type FormProps } from 'ant-design-vue'

const rules: FormProps['rules'] = {
  name: [{ required: true, message: '请填写字典名称' }],
  type: [{ required: true, message: '请填写字典类型' }]
}

const props = defineProps({
  id: {
    type: Number
  }
})

const emit = defineEmits(['success', 'close'])

const formRef = ref<FormInstance>()
const loading = ref(false)
const open = ref(true)
const formData = ref<DictTypeVO>({
  name: '',
  type: '',
  status: 0
})

const { commonStatus } = useDict('common_status')

const isAdd = computed(() => props.id === undefined)

const submit = async () => {
  try {
    loading.value = true
    await formRef.value?.validate()

    if (isAdd.value) {
      await addDictType(formData.value)
      message.success('创建成功')
    } else {
      await updateDictType(formData.value)
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

if (props.id) {
  loading.value = true
  getDictTypeDetail(props.id).then((res) => {
    formData.value = res
    loading.value = false
  })
}
</script>
