<template>
  <div class="view">
    <ACard :title="pageTitle">
      <template #extra>
        <AFlex :gap="8">
          <ATooltip title="重新载入">
            <AButton type="text" :loading="pending" @click="execute">
              <template #icon>
                <ReloadOutlined />
              </template>
            </AButton>
          </ATooltip>
        </AFlex>
      </template>

      <ASpin :spinning="pending">
        <ATabs v-model:active-key="activeTab">
          <ATabPane :key="0" tab="基本信息">
            <BaseInfoForm ref="baseInfoFormRef" :model="data?.table" />
          </ATabPane>
          <ATabPane :key="1" tab="字段信息">
            <ColumnInfoForm :model="data?.columns" />
          </ATabPane>
          <ATabPane :key="2" tab="生成信息">
            <GenerationInfoForm
              ref="generationInfoFormRef"
              :model="data?.table"
              :columns="data?.columns"
            />
          </ATabPane>
        </ATabs>

        <AFlex :gap="16" justify="end" class="mt-4">
          <AButton @click="onReturn">返回</AButton>
          <AButton type="primary" @click="onSubmit">确定</AButton>
        </AFlex>
      </ASpin>
    </ACard>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import { ReloadOutlined } from '@ant-design/icons-vue'
import useRequest from '@/hooks/use-request'
import useTabsStore from '@/stores/tabs'
import { getCodeGenConfigDetail, updateCodeGenConfig } from '@/api/infra/code-gen'
import BaseInfoForm from './base.vue'
import GenerationInfoForm from './generation.vue'
import ColumnInfoForm from './columns.vue'

const { removeAndOpenTab } = useTabsStore()

const { query } = useRoute()
const id = parseInt(query.id as string)

const activeTab = ref(0)
const pageTitle = ref('')

const baseInfoFormRef = ref<InstanceType<typeof BaseInfoForm>>()
const generationInfoFormRef = ref<InstanceType<typeof GenerationInfoForm>>()

const { data, execute, pending } = useRequest(() => getCodeGenConfigDetail(id), {
  immediate: true,
  onSuccess() {
    pageTitle.value = `${data.value?.table.tableName} ${data.value?.table.tableComment}`
  },
})

const onReturn = () => {
  removeAndOpenTab('/infra/code-gen')
}

const onSubmit = async () => {
  try {
    console.log(baseInfoFormRef.value?.formRef)
    await baseInfoFormRef.value?.formRef?.validate()
    await generationInfoFormRef.value?.formRef?.validate()
    await updateCodeGenConfig(data.value!)
    message.success('保存成功')
    execute()
  } catch (err) {
    console.log(err)
    message.error(err.errorFields[0].errors[0])
  }
}
</script>
