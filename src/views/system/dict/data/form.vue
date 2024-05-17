<template>
  <AModal
    v-model:open="open"
    :title="isAdd ? '新增字典数据' : '编辑字典数据'"
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
        <AFormItem label="字典标签" name="label">
          <AInput v-model:value="formData.label" placeholder="请输入字典标签" />
        </AFormItem>
        <AFormItem label="字典键值" name="value">
          <AInput v-model:value="formData.value" placeholder="请输入该项数据对应的键值" />
        </AFormItem>
        <AFormItem name="colorType">
          <template #label>
            <div class="inline-flex items-center">
              <span>颜色类型</span>
              <ATooltip content="留空时将不使用标签组件的形式展示，而是直接显示字典标签">
                <QuestionCircleFilled />
              </ATooltip>
            </div>
          </template>
          <AInput v-model:value="formData.colorType" placeholder="请选择颜色类型" />
        </AFormItem>
        <AFormItem label="CSS Class" name="cssClass">
          <AInput v-model:value="formData.cssClass" placeholder="请输入 CSS Class" />
        </AFormItem>
        <ARow>
          <ACol :span="12">
            <AFormItem label="排序" name="sort">
              <AInputNumber v-model:value="formData.sort" />
            </AFormItem>
          </ACol>
          <ACol :span="12">
            <AFormItem label="状态" name="status">
              <ARadioGroup v-model:value="formData.status" :options="commonStatus" />
            </AFormItem>
          </ACol>
        </ARow>
        <AFormItem label="备注" name="remark">
          <ATextarea v-model:value="formData.remark" />
        </AFormItem>
      </AForm>
    </ASpin>
  </AModal>
</template>

<script lang="ts" setup>
import { ref, computed, type PropType } from 'vue'
import { QuestionCircleFilled } from '@ant-design/icons-vue'
import useDict from '@/hooks/use-dict'
import {
  addDictData,
  updateDictData,
  getDictDataDetail,
  type DictDataItemVO
} from '@/api/system/dict/data'
import { message, type FormInstance, type FormProps } from 'ant-design-vue'

const rules: FormProps['rules'] = {
  label: [{ required: true, message: '请填写字典标签' }],
  value: [{ required: true, message: '请填写字典键值' }]
}

const props = defineProps({
  record: {
    type: Object as PropType<DictDataItemVO>
  }
})

const emit = defineEmits(['success', 'close'])

const formRef = ref<FormInstance>()
const loading = ref(false)
const open = ref(true)
const formData = ref<Partial<DictDataItemVO>>({
  status: 0,
  sort: 0,
  value: ''
})

const { commonStatus } = useDict('common_status')

const isAdd = computed(() => props.record?.id === undefined)

const submit = async () => {
  try {
    loading.value = true
    await formRef.value?.validate()

    if (isAdd.value) {
      await addDictData(formData.value)
      message.success('创建成功')
    } else {
      await updateDictData(formData.value)
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

if (props.record) {
  loading.value = true
  getDictDataDetail(props.record.id).then((res) => {
    formData.value = res
    loading.value = false
  })
}
</script>
