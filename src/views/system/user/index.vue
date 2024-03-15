<template>
  <div class="view">
    <ARow :gutter="24">
      <ACol :span="24" :lg="5">
        <ACard :body-style="{ padding: '16px' }" class="dept-card">
          <AInput v-model:value="searchText" class="mb-4" placeholder="输入关键字过滤部门">
            <template #suffix>
              <SearchOutlined />
            </template>
          </AInput>
          <ATree
            v-if="!deptTreeLoading"
            v-model:selected-keys="selectedKeys"
            :tree-data="filteredTreeData"
            default-expand-all
            @select="(key, { node }) => onTreeNodeSelect(node)"
          />
        </ACard>
      </ACol>
      <ACol :span="24" :lg="19">
        <AFlex vertical class="h-full">
          <ACard>
            <AForm
              ref="filterForm"
              class="dense-filter-form"
              :class="{ expanded: filterExpanded }"
              :model="queryParams"
            >
              <ARow :gutter="[8, 16]">
                <ACol :lg="8" :span="24">
                  <AFormItem label="用户账号" name="userName">
                    <AInput
                      v-model:value="queryParams.userName"
                      placeholder="请输入用户账号"
                      allow-clear
                    />
                  </AFormItem>
                </ACol>
                <ACol :lg="8" :span="24">
                  <AFormItem label="用户名称" name="nickName">
                    <AInput
                      v-model:value="queryParams.nickName"
                      placeholder="请输入用户名称"
                      allow-clear
                    />
                  </AFormItem>
                </ACol>
                <ACol v-show="filterExpanded" :lg="8" :span="24">
                  <AFormItem label="手机号码" name="mobile">
                    <AInput
                      v-model:value="queryParams.mobile"
                      placeholder="请输入手机号码"
                      allow-clear
                    />
                  </AFormItem>
                </ACol>
                <ACol v-show="filterExpanded" :lg="8" :span="24">
                  <AFormItem label="注册时间" name="createTime">
                    <ARangePicker
                      v-model:value="queryParams.createTime"
                      value-format="YYYY-MM-DD"
                    />
                  </AFormItem>
                </ACol>
                <ACol v-show="filterExpanded" :lg="8" :span="24">
                  <AFormItem label="状态" name="status">
                    <ASelect
                      v-model:value="queryParams.status"
                      placeholder="请输入用户状态"
                    ></ASelect>
                  </AFormItem>
                </ACol>
                <ACol :lg="{ span: 8 }" :span="24">
                  <AFlex justify="end" align="center" :gap="16">
                    <AButton @click="onFilterReset">重置</AButton>
                    <AButton type="primary" @click="onFilter">查询</AButton>
                    <ATypographyLink @click="toggle()">
                      {{ filterExpanded ? '收起' : '展开' }}
                      <DownOutlined :class="{ 'rotate-180': filterExpanded }" />
                    </ATypographyLink>
                  </AFlex>
                </ACol>
              </ARow>
            </AForm>
          </ACard>

          <ACard :title="`${currentDeptName}-用户列表`" class="mt-4 flex-1">
            <template #extra>
              <AFlex :gap="8">
                <AButton type="primary" :loading="pending" @click="showDialog()">
                  <template #icon>
                    <PlusOutlined />
                  </template>
                  新增
                </AButton>
                <ATooltip title="导出">
                  <AButton type="text" :loading="pending">
                    <template #icon>
                      <ExportOutlined />
                    </template>
                  </AButton>
                </ATooltip>
                <ATooltip title="重新载入">
                  <AButton type="text" :loading="pending" @click="execute">
                    <template #icon>
                      <ReloadOutlined />
                    </template>
                  </AButton>
                </ATooltip>
              </AFlex>
            </template>
            <ATable
              :columns="columns"
              :data-source="data?.list"
              :loading="pending"
              :pagination="pagination"
              @change="onChange"
            >
              <template #bodyCell="scope">
                <template v-if="scope?.column.key === 'status'">
                  <ASwitch
                    v-model:checked="scope.record.status"
                    :checked-value="0"
                    :un-checked-value="1"
                    checked-children="启用"
                    un-checked-children="停用"
                  />
                </template>
                <template v-if="scope?.column.key === 'createTime'">
                  {{ formatDate(scope.record.createTime) }}
                </template>
                <template v-if="scope?.column.key === 'actions'">
                  <AFlex :gap="16">
                    <ATypographyLink @click="showDialog(scope.record.id)">
                      <EditOutlined /> 编辑
                    </ATypographyLink>
                    <ADropdown>
                      <ATypographyLink> <DownOutlined /> 更多 </ATypographyLink>
                      <template #overlay>
                        <AMenu>
                          <AMenuItem>重置密码</AMenuItem>
                          <AMenuItem>设置角色</AMenuItem>
                          <AMenuDivider />
                          <AMenuItem danger>删除用户</AMenuItem>
                        </AMenu>
                      </template>
                    </ADropdown>
                  </AFlex>
                </template>
              </template>
            </ATable>
          </ACard>
        </AFlex>
      </ACol>
    </ARow>

    <FormModal v-model:value="formData" v-model:open="visible" :id="entryId" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import {
  SearchOutlined,
  EditOutlined,
  DownOutlined,
  PlusOutlined,
  ExportOutlined,
  ReloadOutlined
} from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import FormModal from './form.vue'
import useDeptTree from './use-dept-tree'
import { columns, useUserTable } from './use-user-table'
import type { Tree } from '@/utils/tree'
import type { UserDTO } from '@/api/system/user'

const filterForm = ref()

const { currentDeptName, deptTreeLoading, filteredTreeData, searchText, selectedKeys } =
  useDeptTree()

const {
  data,
  execute,
  filterExpanded,
  pending,
  queryParams,
  pagination,
  onChange,
  onFilter,
  onFilterReset,
  toggle
} = useUserTable(filterForm)

const formData = ref<UserDTO>({})
const visible = ref(false)
// current entry for editing
const entryId = ref<number | undefined>()

const showDialog = (id?: number) => {
  entryId.value = id
  visible.value = true
}

const onTreeNodeSelect = (node: Tree) => {
  currentDeptName.value = node.title
  queryParams.value.deptId = node.key.toString()
  execute()
}

const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD')
}
</script>

<style lang="scss" scoped>
.dept-card {
  @apply sticky;
  top: 110px;
  min-height: calc(100vh - 130px);
}
</style>
