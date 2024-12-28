<template>
  <AModal
    v-model:open="isOpen"
    :title="record === undefined ? '新增部门' : '编辑部门'"
    :confirm-loading="loading"
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
        <AFormItem label="上级部门" name="parentId">
          <ATreeSelect
            v-model:value="formData.parentId"
            show-search
            :dropdown-style="{ maxHeight: '300px', overflow: 'auto' }"
            :field-names="{ label: 'name', value: 'id' }"
            tree-default-expand-all
            :tree-data="treeData"
          />
        </AFormItem>
        <AFormItem label="部门名称" name="name">
          <AInput v-model:value="formData.name" placeholder="请输入菜单名称" />
        </AFormItem>
        <AFormItem label="负责人" name="leaderUserId">
          <ASelect
            v-model:value="formData.leaderUserId"
            :options="userData"
            :field-names="{ label: 'nickname', value: 'id' }"
            placeholder="请输入用户名称进行过滤"
            show-search
            :filter-option="(input, option) => filterOption(input, option, 'nickname')"
          />
        </AFormItem>
        <AFormItem label="联系电话" name="phone">
          <AInput v-model:value="formData.phone" placeholder="请输入联系电话" />
        </AFormItem>
        <AFormItem label="邮箱" name="email">
          <AInput v-model:value="formData.email" placeholder="请输入邮箱" />
        </AFormItem>
        <ARow>
          <ACol :span="12">
            <AFormItem label="显示顺序" name="sort">
              <AInputNumber v-model:value="formData.sort" class="w-full" />
            </AFormItem>
          </ACol>
          <ACol :span="12">
            <AFormItem label="状态" name="status">
              <ASelect v-model:value="formData.status" :options="commonStatus" />
            </AFormItem>
          </ACol>
        </ARow>
      </ASpin>
    </AForm>
  </AModal>
</template>

<script lang="ts" setup>
import { message, type FormInstance, type TreeSelectProps, type FormProps } from 'ant-design-vue'
import { getDeptDetail, createDept, updateDept, type DeptVO } from '@/api/system/dept'
import { filterOption } from '@fusionx/utils'
import useModalOpen from '@/hooks/use-modal'
import useDict from '@/hooks/use-dict'
import type { SimpleUserListVO } from '@/api/system/user'

const loading = ref(false)

const [commonStatus] = useDict('common_status')

const rules = ref<FormProps['rules']>({
  name: [{ required: true, message: '请输入部门名称' }],
})

const props = defineProps<{
  treeData?: TreeSelectProps['treeData']
  userData?: SimpleUserListVO
  record?: DeptVO
  open?: boolean
}>()

const emit = defineEmits(['success', 'update:open'])
const formRef = ref<FormInstance>()

const isOpen = useModalOpen(props, emit, formRef)

const formData = ref<DeptVO>({})

const submit = async () => {
  try {
    loading.value = true
    await formRef.value?.validate()
    if (props.record !== undefined) {
      // edit
      await updateDept(formData.value)
      message.success('保存成功')
    } else {
      // add
      await createDept(formData.value)
      message.success('创建成功')
    }

    isOpen.value = false
    emit('success')
  } catch (e) {
    // do nothing at the moment
    // until we have a unified error handling precedure
  } finally {
    loading.value = false
  }
}

watch(
  () => props.record?.id,
  (val) => {
    if (val) {
      loading.value = true
      getDeptDetail(val).then((data) => {
        if (data.parentId === 0) {
          data.parentId = undefined
        }
        formData.value = data
        loading.value = false
      })
    }
  },
)
</script>
