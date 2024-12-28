<template>
  <ACard title="待办事项">
    <ATable :columns="columns" :data-source="data">
      <template #bodyCell="scope">
        <template v-if="scope?.column.key === 'status'">
          <b>{{ scope.record.desc }}</b>
          <span>{{ scope.record.time }}</span>
        </template>
        <template v-if="scope?.column.key === 'actions'">
          <AFlex :gap="8">
            <ATypographyLink>查看详情</ATypographyLink>
          </AFlex>
        </template>
      </template>
    </ATable>
  </ACard>
</template>

<script lang="ts" setup>
import { type TableProps } from 'ant-design-vue'

type Record = {
  title: string
  status: {
    desc: string
    time: string
  }
  history: Array<Record['status']>
}

const columns: TableProps['columns'] = [
  { title: '名称', dataIndex: 'title', key: 'title' },
  { title: '当前状态', dataIndex: 'status', key: 'status' },
  { title: '操作', key: 'actions' },
]

const data: Record[] = [
  {
    title: '高层次人才分类认定',
    status: { desc: '等待市委组织部审核', time: '2023-12-31 12:00' },
    history: [
      { desc: '申请人提交', time: '2023-12-20 08:52' },
      { desc: '区委组织部审核通过', time: '2023-12-26 14:08' },
    ],
  },
  {
    title: '高层次人才分类认定',
    status: { desc: '等待市委组织部审核', time: '2023-12-31 12:00' },
    history: [
      { desc: '申请人提交', time: '2023-12-20 08:52' },
      { desc: '区委组织部审核通过', time: '2023-12-26 14:08' },
    ],
  },
  {
    title: '高层次人才分类认定',
    status: { desc: '等待市委组织部审核', time: '2023-12-31 12:00' },
    history: [
      { desc: '申请人提交', time: '2023-12-20 08:52' },
      { desc: '区委组织部审核通过', time: '2023-12-26 14:08' },
    ],
  },
]
</script>

<style lang="scss" scoped></style>
