<template>
  <AModal
    v-model:open="open"
    :title="id === undefined ? '新增岗位' : '编辑岗位'"
    :after-close="onClose"
    destroy-on-close
    @ok="submit"
  >
    <AForm
      ref="formRef"
      :model="formData"
      :label-col="{ style: { width: '80px' } }"
      :rules="rules"
      class="mt-4"
    >
      <ASpin :spinning="loading">
        <AFormItem label="岗位标题" name="name">
          <AInput v-model:value="formData.name" placeholder="请输入岗位标题" />
        </AFormItem>

        <AFormItem label="岗位编码" name="code">
          <AInput v-model:value="formData.code" placeholder="请输入岗位编码" />
        </AFormItem>

        <AFormItem label="岗位顺序" name="sort">
          <AInputNumber v-model:value="formData.sort" class="w-full" />
        </AFormItem>

        <AFormItem label="状态" name="status">
          <ASelect v-model:value="formData.status" :options="commonStatus" />
        </AFormItem>

        <AFormItem label="备注" name="remark">
          <ATextarea v-model:value="formData.remark" />
        </AFormItem>
      </ASpin>
    </AForm>
  </AModal>
</template>

<script lang="ts" setup>
import { ref, type PropType } from 'vue'
import { message, type FormInstance, type TreeSelectProps, type FormProps } from 'ant-design-vue'
import { getPostDetail, createPost, updatePost, type PostVO } from '@/api/system/post'
import { filterOption } from '@/utils/envision'
import useDict from '@/hooks/use-dict'
import type { SimpleUserVO } from '@/api/system/user'

const loading = ref(false)

const { commonStatus } = useDict('common_status')

const rules = ref<FormProps['rules']>({
  name: [{ required: true, message: '请输入部门名称' }]
})

const props = defineProps({
  id: {
    type: Number,
    default: undefined
  }
})

const emit = defineEmits(['success', 'close'])

const formData = ref<PostVO>({})
const formRef = ref<FormInstance>()

const open = ref(true)

const onClose = () => {
  formRef.value?.resetFields()
  emit('close')
}

const submit = async () => {
  try {
    loading.value = true
    await formRef.value?.validate()
    if (props.id !== undefined) {
      // edit
      await updatePost(formData.value)
      message.success('保存成功')
    } else {
      // add
      await createPost(formData.value)
      message.success('创建成功')
    }

    open.value = false
    emit('success')
  } catch (e) {
    // do nothing at the moment
    // until we have a unified error handling precedure
  } finally {
    loading.value = false
  }
}

// load detail
if (props.id) {
  loading.value = true
  getPostDetail(props.id).then((data) => {
    formData.value = data
    loading.value = false
  })
}
</script>
