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
        :label-col="{ style: { width: '140px' } }"
        :model="formData"
        :rules="rules"
        class="mt-4"
      >
        <AFormItem label="应用名称" name="name">
          <AInput v-model:value="formData.name" placeholder="如：人才分类认定" />
        </AFormItem>
        <AFormItem label="应用编码" name="code">
          <AInput v-model:value="formData.code" placeholder="如：talent_classification" />
        </AFormItem>
        <AFormItem label="业务类别" name="type">
          <ASelect v-model:value="formData.type" :options="appTypeOpts" />
        </AFormItem>
        <AFormItem label="用户类别" name="userType">
          <ASelect v-model:value="formData.userType">
            <a-select-option value="3">个人用户</a-select-option>
            <a-select-option value="4">单位用户</a-select-option>
          </ASelect>
        </AFormItem>
        <AFormItem label="单位开通权限" name="comopen" v-if="formData.userType === '3'">
          <ASelect v-model:value="formData.comopen">
            <a-select-option value="0">否</a-select-option>
            <a-select-option value="1">是</a-select-option>
          </ASelect>
        </AFormItem>
        <AFormItem label="主管部门" name="dept">
          <ATreeSelect
            v-model:value="formData.dept"
            show-search
            :dropdown-style="{ maxHeight: '300px', overflow: 'auto' }"
            :field-names="{ label: 'name', value: 'id' }"
            tree-default-expand-all
            :tree-data="deptOpts"
          />
        </AFormItem>
        <AFormItem label="备注" name="description">
          <ATextarea v-model:value="formData.description" />
        </AFormItem>
        <ARow>
          <ACol :span="12">
            <AFormItem label="前台图标" name="iconFe" extra="支持 png, svg, jpg 格式">
              <EUpload
                :accept="['png', 'svg', 'jpg', 'jpeg', 'gif']"
                v-model:value="formData.iconFe"
                :limit="1"
                auto-upload
                list-type="picture-card"
              />
            </AFormItem>
          </ACol>
          <ACol :span="12">
            <AFormItem label="后台图标" name="iconBe" extra="支持 png, svg, jpg 格式">
              <EUpload
                :accept="['png', 'svg', 'jpg', 'jpeg', 'gif']"
                v-model:value="formData.iconBe"
                :limit="1"
                auto-upload
                list-type="picture-card"
              />
            </AFormItem>
          </ACol>
        </ARow>
      </AForm>
    </ASpin>
  </AModal>
</template>

<script lang="ts" setup>
import { ref, computed, type PropType } from 'vue'
import useDict from '@/hooks/use-dict'
import { getDeptTree, type DeptTreeVO } from '@/api/system/dept'
import {
  addApplication,
  updateApplication,
  getApplicationDetail,
  type ApplicationVO
} from '@/api/application'
import { message, type FormInstance, type FormProps } from 'ant-design-vue'

const rules: FormProps['rules'] = {
  name: [{ required: true, message: '请填写应用名称' }],
  type: [{ required: true, message: '请选择应用类型' }],
  userType: [{ required: true, message: '请选择用户类型' }]
}

const props = defineProps({
  record: {
    type: Object as PropType<ApplicationVO>
  }
})

const emit = defineEmits(['success', 'close'])

const [appTypeOpts] = useDict('system_application_type')

const formRef = ref<FormInstance>()
const loading = ref(false)
const open = ref(true)
const formData = ref<Partial<ApplicationVO>>({
  published: 0
})
const deptOpts = ref<DeptTreeVO>()

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

getDeptTree().then((res) => {
  deptOpts.value = res
})

if (props.record?.id) {
  loading.value = true
  getApplicationDetail(props.record.id).then((res) => {
    formData.value = res
    loading.value = false
  })
}
</script>
