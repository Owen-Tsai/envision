<template>
  <div class="view">
    <ARow :gutter="24">
      <ACol :span="24">
        <ACard class="mb-4">
          <AForm ref="filterFormRef" :model="queryParams" class="dense-form">
            <ARow :gutter="24">
              <ACol :span="24" :lg="8">
                <AFormItem label="标题" name="title">
                  <AInput v-model:value="queryParams.title" placeholder="请输入标题" />
                </AFormItem>
              </ACol>
              <ACol :span="24" :lg="8">
                <AFormItem label="资讯分类" name="infotype">
                  <ASelect
                    v-model:value="queryParams.infotype"
                    :options="commonStatus"
                    placeholder="请选择资讯分类"
                  />
                </AFormItem>
              </ACol>
              <ACol :span="24" :lg="8">
                <AFlex justify="end" align="center" :gap="16">
                  <AButton html-type="reset" @click="onFilterReset">重置</AButton>
                  <AButton html-type="submit" type="primary" @click="onFilter">查询</AButton>
                </AFlex>
              </ACol>
            </ARow>
          </AForm>
        </ACard>
      </ACol>

      <ACol :span="24">
        <ACard title="信息资讯" class="flex-1">
          <template #extra>
            <AFlex :gap="8">
              <AButton type="primary" :loading="pending" @click="createInformation">
                <template #icon>
                  <PlusOutlined />
                </template>
                新增
              </AButton>
              <ATooltip title="重新载入">
                <AButton type="text" :loading="pending" @click="execute">
                  <template #icon>
                    <ReloadOutlined />
                  </template>
                </AButton>
              </ATooltip>
            </AFlex>
          </template>

          <ATable :data-source="data?.list" :columns="columns" row-key="id" :loading="pending">
            <template #bodyCell="scope: TableScope<InformationVO>">
              <template v-if="scope?.column.key === 'title'">
                {{ scope.text.length > 15 ? scope.text.substring(0, 15) + '...' : scope.text }}
              </template>
              <template v-if="scope?.column.key === 'createTime'">
                {{ dayjs(scope.text).format('YYYY-MM-DD') }}
              </template>
              <template v-if="scope?.column.key === 'audittime'">
                {{ scope.text == null ? '' : dayjs(scope.text).format('YYYY-MM-DD') }}
              </template>
              <template v-if="scope?.column.key === 'actions'">
                <AFlex :gap="16">
                  <ATypographyLink @click="updateInformation">
                    <EditOutlined />
                    修改
                  </ATypographyLink>
                  <APopconfirm
                    title="删除该菜单项将一并删除该菜单下的所有子菜单，确定要删除吗？"
                    :overlay-inner-style="{ width: '260px' }"
                    @confirm="onDelete(scope.record!)"
                  >
                    <ATypographyLink type="danger">
                      <DeleteOutlined />
                      删除
                    </ATypographyLink>
                  </APopconfirm>
                </AFlex>
              </template>
            </template>
          </ATable>
        </ACard>
      </ACol>
    </ARow>
  </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import useDict from '@/hooks/use-dict'
import { permission } from '@/hooks/use-permission'
import type { InformationVO } from '@/api/information'
import { useTable, columns } from './use-table'
import useActions from './use-actions'

const filterFormRef = ref()

const [commonStatus] = useDict('common_status')

const { data, execute, pending, queryParams, onFilter, onFilterReset } = useTable(filterFormRef)

const { onDelete } = useActions(execute)

defineOptions({ name: 'Information' })

const createInformation = () => {}

const updateInformation = () => {}
</script>
