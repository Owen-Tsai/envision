<template>
  <ACard title="待办事项">
    <div class="overflow-x-auto">
      <ATable :columns="columns" :data-source="data" size="small">
        <template #bodyCell="scope">
          <template v-if="scope?.column.key === 'deadline'">
            <ATag v-if="scope.text" color="error">{{ dayjs().to(scope.text) }}</ATag>
            <span v-else>无办结期限</span>
          </template>
          <template v-if="scope?.column.key === 'actions'">
            <AFlex :gap="8">
              <ATypographyLink>查看详情</ATypographyLink>
            </AFlex>
          </template>
        </template>
      </ATable>
    </div>
  </ACard>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import { type TableProps } from 'ant-design-vue'

type Record = {
  title: string
  time: string
  deadline?: string
  history: Array<{
    desc: string
    time: string
  }>
}

const columns: TableProps['columns'] = [
  { title: '名称', dataIndex: 'title', key: 'title', minWidth: 200 },
  { title: '创建时间', dataIndex: 'time', key: 'time', width: 200 },
  { title: '办结期限', dataIndex: 'deadline', key: 'deadline', width: 120 },
  { title: '操作', key: 'actions', width: 140 },
]

const data: Record[] = [
  {
    title: '高层次人才分类认定',
    time: '2024-02-13 14:32',
    deadline: dayjs().add(4, 'days').toString(),
    history: [
      { desc: '申请人提交', time: '2023-12-20 08:52' },
      { desc: '区委组织部审核通过', time: '2023-12-26 14:08' },
    ],
  },
  {
    title: '高层次人才分类认定',
    time: '2024-02-13 14:32',
    history: [
      { desc: '申请人提交', time: '2023-12-20 08:52' },
      { desc: '区委组织部审核通过', time: '2023-12-26 14:08' },
    ],
  },
  {
    title: '高层次人才分类认定',
    time: '2024-02-13 14:32',
    history: [
      { desc: '申请人提交', time: '2023-12-20 08:52' },
      { desc: '区委组织部审核通过', time: '2023-12-26 14:08' },
    ],
  },
  {
    title: '高层次人才分类认定',
    time: '2024-02-13 14:32',
    deadline: dayjs().add(2, 'days').toString(),
    history: [
      { desc: '申请人提交', time: '2023-12-20 08:52' },
      { desc: '区委组织部审核通过', time: '2023-12-26 14:08' },
    ],
  },
  {
    title: '高层次人才分类认定',
    time: '2024-02-13 14:32',
    deadline: dayjs().add(1, 'month').toString(),
    history: [
      { desc: '申请人提交', time: '2023-12-20 08:52' },
      { desc: '区委组织部审核通过', time: '2023-12-26 14:08' },
    ],
  },
]
</script>

<style lang="scss" scoped></style>
