<template>
  <div class="view">
    <ACard title="数据源配置">
      <template #extra>
        <AFlex :gap="8">
          <AButton
            v-if="permission.has('infra:data-source-config:create')"
            type="primary"
            :loading="pending"
            @click="onEdit()"
          >
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

      <div class="overflow-x-auto">
        <ATable :columns="columns" :data-source="data" :loading="pending">
          <template #bodyCell="scope: TableScope<DataSourceVO>">
            <template v-if="scope?.column.key === 'createTime'">
              {{
                scope.record.createTime === null
                  ? '系统创建'
                  : dayjs(scope.text).format('YYYY-MM-DD HH:mm:ss')
              }}
            </template>
            <template v-if="scope?.column.title === '操作'">
              <AFlex :gap="16">
                <ATypographyLink
                  v-if="permission.has('system:dict:update')"
                  :disabled="!scope.record.id || scope.record.id <= 0"
                  @click="onEdit(scope!.record)"
                >
                  <EditOutlined />
                  编辑
                </ATypographyLink>
                <APopconfirm
                  v-if="permission.has('infra:data-source-config:create')"
                  title="该操作无法撤销，确定要删除吗？"
                  :overlay-style="{ width: '240px' }"
                  @confirm="onDelete(scope!.record)"
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
      </div>
    </ACard>

    <FormModal v-model:open="visible" :record="entry" @success="execute" />
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { permission } from '@/hooks/use-permission'
import { useTable, columns } from './use-table'
import useActions from './use-actions'
import FormModal from './form.vue'
import type { DataSourceVO } from '@/api/infra/data-source'

const { data, execute, pending } = useTable()
const { entry, visible, onDelete, onEdit } = useActions(execute)
</script>
