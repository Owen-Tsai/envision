<template>
  <ACard title="附件材料">
    <ATable :columns="cols" :data-source="fileList">
      <template #bodyCell="{ record, column }">
        <template v-if="column.key === 'uploadedFile'">
          {{ record.attachDO ? record.attachDO.uploadname : '' }}
        </template>
        <template v-if="column.key === 'action'">
          <ATypographyLink @click="viewFile(record.attachDO)">
            <EyeOutlined />
            查看
          </ATypographyLink>
        </template>
      </template>
    </ATable>
  </ACard>
</template>

<script setup lang="ts">
import { getAttachView, getUploadList, type UploadListType } from '@/api/attach'
import type { TableProps } from 'ant-design-vue'

const { planId } = defineProps<{ planId?: string }>()

const fileList = ref<UploadListType>([])

const { query } = useRoute()

const applyId = query.applyId as string
const appId = query.appId as string

const cols: TableProps['columns'] = [
  {
    title: '附件名称',
    dataIndex: 'name',
    key: 'name',
    width: 200,
    ellipsis: true,
  },
  { title: '已上传文件', key: 'uploadedFile' },
  { title: '操作', key: 'action' },
]

const loadFiles = async () => {
  fileList.value = await getUploadList(planId!, applyId, appId)
}

const viewFile = async (attachDO: UploadListType[number]['attachDO']) => {
  const data = await getAttachView(attachDO.id, attachDO.modeName)
  const url = URL.createObjectURL(data)
  window.open(url)
}

watchOnce(
  () => planId,
  (val) => {
    if (!val) return
    loadFiles()
  },
)
</script>
