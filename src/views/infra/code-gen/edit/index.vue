<template>
  <div class="view">
    <ACard :title="pageTitle">
      <ASpin :spinning="pending">
        <ATabs v-model:active-key="activeTab">
          <ATabPane :key="0" tab="基本信息">
            <BaseInfoForm ref="baseInfoFormRef" :model="data?.table" />
          </ATabPane>
          <ATabPane :key="1" tab="字段信息"></ATabPane>
          <ATabPane :key="2" tab="生成信息">
            <GenerationInfoForm
              ref="generationInfoFormRef"
              :model="data?.table"
              :columns="data?.columns"
            />
          </ATabPane>
        </ATabs>

        <AFlex :gap="16" justify="end">
          <AButton @click="onReturn">返回</AButton>
          <AButton type="primary" @click="onSubmit">确定</AButton>
        </AFlex>
      </ASpin>

      <pre>{{ data }}</pre>
    </ACard>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import useRequest from '@/hooks/use-request'
import useTabsStore from '@/stores/tabs'
import {
  getCodeGenConfigDetail,
  updateCodeGenConfig,
  type ConfigDetailVO
} from '@/api/infra/code-gen'
import BaseInfoForm from './base.vue'
import GenerationInfoForm from './generation.vue'

const { removeAndOpenTab } = useTabsStore()

const { query, fullPath } = useRoute()
const id = parseInt(query.id as string)

const activeTab = ref(0)
const pageTitle = ref('')

const baseInfoFormRef = ref<InstanceType<typeof BaseInfoForm>>()

const { data, execute, pending } = useRequest(() => getCodeGenConfigDetail(id), {
  immediate: true,
  onSuccess() {
    pageTitle.value = `${data.value?.table.tableName} ${data.value?.table.tableComment}`
  }
})

const onReturn = () => {
  removeAndOpenTab('/infra/code-gen')
}

const onSubmit = async () => {
  try {
    console.log(baseInfoFormRef.value?.formRef)
    await baseInfoFormRef.value?.formRef?.validate()
    await updateCodeGenConfig(data.value!)
  } catch (err) {
    //
  }
}
</script>
