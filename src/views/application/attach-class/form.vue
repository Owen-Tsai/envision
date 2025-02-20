<template>
  <AModal
    v-model:open="open"
    :title="isAdd ? '新建附件分类' : '编辑附件分类'"
    destroy-on-close
    :confirm-loading="loading"
    :after-close="resetFields"
    @ok="submit"
  >
    <ASpin :spinning="loading">
      <AForm
        ref="formRef"
        :label-col="{ style: { width: '120px' } }"
        :model="formData"
        :rules="rules"
        class="mt-4"
      >
        <AFormItem label="附件分类名称" name="name">
          <AInput v-model:value="formData.name" placeholder="如：身份证" />
        </AFormItem>
        <AFormItem label="附件代码" name="modeName">
          <AInput v-model:value="formData.modeName" placeholder="如：idcard" />
        </AFormItem>
        <AFormItem label="允许上传类型" name="allowFileType">
          <ASelect
            v-model:value="formData.allowFileType"
            mode="multiple"
            style="width: 100%"
            placeholder="请选择"
            :options="fileTypeOpts"
            :max-tag-count="5"
          />
        </AFormItem>
        <AFormItem label="最大文件大小" name="maxFileSize">
          <AInput type="number" v-model:value="formData.maxFileSize" placeholder="如：3">
            <template #addonAfter>MB</template>
          </AInput>
        </AFormItem>
        <!--        <AFormItem label="是否单个附件" name="isone">-->
        <!--          <ASwitch v-model:checked="formData.isone" checked-value="1" un-checked-value="0" />-->
        <!--        </AFormItem>-->
        <!--        <template v-if="formData.isone == '0'">-->
        <!--          <AFormItem label="附件个数" name="num">-->
        <!--            <AInput type="number" v-model:value="formData.num" placeholder="如：3" />-->
        <!--          </AFormItem>-->
        <!--        </template>-->
        <AFormItem label="是否必传" name="ismust">
          <ASwitch v-model:checked="formData.ismust" :checked-value="1" :un-checked-value="0" />
        </AFormItem>
        <a-space style="display: flex; margin-bottom: 8px" align="baseline">
          <AFormItem label="是否附件库附件" name="isLib">
            <ASwitch v-model:checked="formData.isLib" checked-value="1" un-checked-value="0" />
          </AFormItem>
          <AFormItem label="附件库类型" name="libType" v-if="libTypeShow">
            <ASelect v-model:value="formData.libType" :options="libTypeOpts" style="width: 180px" />
          </AFormItem>
        </a-space>
      </AForm>
    </ASpin>
  </AModal>
</template>

<script lang="ts" setup>
import { ref, computed, type PropType } from 'vue'
import {
  createAttachClass,
  updateAttachClass,
  getAttachClassDetail,
  type AttachClassVO,
} from '@/api/application/attach-class'
import { message, type FormInstance, type FormProps } from 'ant-design-vue'
import useDict from '@/hooks/use-dict'
import type { Rule } from 'ant-design-vue/es/form'

const [fileTypeOpts, libTypeOpts] = useDict('file_type', 'attach_lib_type')

const validateLibType = async (_rule: Rule, value: string) => {
  if (formData.value.isLib == '1' && (value === '' || value == undefined)) {
    return Promise.reject('请选择附件库类型！')
  } else {
    return Promise.resolve()
  }
}

const rules: FormProps['rules'] = {
  name: [{ required: true, message: '请填写附件分类名称' }],
  modeName: [{ required: true, message: '请填写附件分类代码' }],
  allowFileType: [{ required: true, message: '请选择允许上传类型' }],
  maxFileSize: [{ required: true, message: '请填写最大文件大小' }],
  libType: [{ required: true, trigger: 'change', validator: validateLibType }],
}

const props = defineProps({
  record: {
    type: Object as PropType<AttachClassVO>,
  },
})

const emit = defineEmits(['success', 'close'])

const formRef = ref<FormInstance>()
const loading = ref(false)
const open = ref(true)
const formData = ref<Partial<AttachClassVO>>({
  isone: 1,
  ismust: 0,
  isLib: '0',
})
const isAdd = computed(() => props.record === undefined)
const submit = async () => {
  try {
    loading.value = true
    await formRef.value?.validate()
    if (isAdd.value) {
      await createAttachClass(formData.value)
      message.success('创建成功')
      emit('success')
      open.value = false
    } else {
      await updateAttachClass(formData.value)
      message.success('保存成功')
      emit('success')
      open.value = false
    }
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
  getAttachClassDetail(props.record.id).then((res) => {
    formData.value = res
    loading.value = false
  })
}

const libTypeShow = ref<boolean>(false)

watch(
  () => formData.value.isLib,
  (val) => {
    if (val == 1) {
      libTypeShow.value = true
    } else {
      formData.value.libType = ''
      libTypeShow.value = false
    }
  },
)
</script>
