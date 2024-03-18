<template>
  <AModal
    v-model:open="computedOpen"
    :title="isAdd ? '新增菜单' : '编辑菜单'"
    :after-close="resetFields"
    @cancel="computedOpen = false"
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
              <AInputNumber v-model="formData.sort" class="w-full" />
            </AFormItem>
          </ACol>
          <ACol :span="12">
            <AFormItem label="状态" name="status">
              <ASelect v-model="formData.status" />
            </AFormItem>
          </ACol>
        </ARow>
      </ASpin>
    </AForm>
  </AModal>
</template>

<script lang="ts" setup>
import { ref, computed, watch, type PropType } from 'vue'
import { message, type FormInstance, type TreeSelectProps, type FormProps } from 'ant-design-vue'
import { getDeptDetail, createDept, updateDept, type DeptDTO } from '@/api/system/dept'
import { type SimpleUserVO } from '@/api/system/user'

const loading = ref(false)

const rules: FormProps['rules'] = {
  name: [{ required: true, message: '请输入部门名称' }]
}

const props = defineProps({
  open: {
    type: Boolean,
    required: true
  },
  mode: {
    type: String as PropType<'add' | 'edit'>,
    default: 'add'
  },
  value: {
    type: Object as PropType<DeptDTO>,
    required: true
  },
  treeData: {
    type: Object as PropType<TreeSelectProps['treeData']>
  },
  userData: {
    type: Array as PropType<SimpleUserVO>
  },
  id: {
    type: Number,
    default: undefined
  }
})

const emit = defineEmits(['update:open', 'update:value', 'success'])

const formData = computed({
  get: () => props.value,
  set: (val) => {
    emit('update:value', val)
  }
})

const computedOpen = computed({
  get: () => props.open,
  set: (val) => {
    emit('update:open', val)
  }
})

const isAdd = computed(() => props.mode === 'add')

const formRef = ref<FormInstance>()

const resetFields = () => {
  formRef.value?.resetFields()
}

const submit = async () => {
  try {
    loading.value = true
    await formRef.value?.validate()
    if (props.id !== undefined) {
      // edit
      await updateDept(formData.value)
      message.success('保存成功')
    } else {
      // add
      await createDept(formData.value)
      message.success('创建成功')
    }

    computedOpen.value = false
    emit('success')
  } catch (e) {
    // do nothing at the moment
    // until we have a unified error handling precedure
  } finally {
    loading.value = false
  }
}

watch(
  () => props.id,
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
  }
)
</script>
