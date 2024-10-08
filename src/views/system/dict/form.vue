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
          <AInput v-model:value="formData.name" placeholder="如：用户性别" />
        </AFormItem>
        <AFormItem label="字典类型" name="type">
          <AInput v-model:value="formData.type" placeholder="如：system_user_gender" />
        </AFormItem>
        <AFormItem label="状态" name="status">
          <ARadioGroup v-model:value="formData.status" :options="commonStatus" />
        </AFormItem>
        <AFormItem label="备注" name="remark">
          <ATextarea v-model:value="formData.remark" />
        </AFormItem>
        <AFormItem label="使用字符串" name="useString" extra="强制将字典数据视为字符串类型">
          <ASwitch v-model:checked="formData.useString" />
        </AFormItem>
      </AForm>
    </ASpin>
  </AModal>
</template>

<script lang="ts" setup>
import { ref, computed, type PropType } from 'vue'
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
  record: {
    type: Object as PropType<DictTypeVO>
  }
})

const emit = defineEmits(['success', 'close'])

const formRef = ref<FormInstance>()
const loading = ref(false)
const open = ref(true)
const formData = ref<Partial<DictTypeVO>>({
  name: '',
  type: '',
  status: 0
})

const [commonStatus] = useDict('common_status')

const isAdd = computed(() => props.record === undefined)

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
    open.value = false
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
  getDictTypeDetail(props.record.id).then((res) => {
    formData.value = res
    loading.value = false
  })
}
</script>
