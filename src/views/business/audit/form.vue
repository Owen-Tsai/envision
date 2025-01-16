<template>
  <div class="view">
    <ACard title="申请信息" style="margin-bottom: 20px">
      <div class="aspinDiv" v-show="formRendering">
        <a-spin />
      </div>
      <div class="audit-view">
        <FormRenderer
          ref="formRenderer"
          v-if="appSchema"
          :key="appSchema"
          disabled
          :schema="appSchema"
          :taskDefKey="taskDefKey"
          mode="audit"
        />
      </div>
    </ACard>
    <AttachClass
      ref="attachClass"
      :app-id="appId"
      :apply-id="applyId"
      :plan-id="planId"
      :current-audit-process="'0'"
    ></AttachClass>
    <ACard title="审批记录" style="margin-top: 20px">
      <a-steps direction="horizontal" :items="auditProcessDetailsList"></a-steps>
    </ACard>
    <ACard title="审批任务" v-if="taskDefKey != 'All'" style="margin-top: 20px">
      <a-form>
        <a-form-item label="流程名">
          <span>{{ basicInfo.title }}</span>
        </a-form-item>
        <a-form-item label="流程发起人">
          <span>{{ basicInfo.name }}</span>
        </a-form-item>
        <a-form-item label="审核意见">
          <a-textarea v-model:value="idea" placeholder="请输入审核意见" :showCount="true" />
        </a-form-item>
        <a-form-item>
          <a-space wrap>
            <a-button type="primary" block @click="operation(1)">通过</a-button>
            <a-button block @click="backAuditUser()">退回到审核人</a-button>
            <a-button block @click="backStartUser()">退回到申请人</a-button>
            <a-button danger block @click="operation(2)">不通过</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </ACard>
    <a-modal v-model:open="backModalShow" title="退回到" @ok="operation(3)">
      <a-select
        ref="backModalSelect"
        v-model:value="backValue"
        style="width: 120px"
        :field-names="{ label: 'name', value: 'taskDefinitionKey' }"
        :options="backModal"
      ></a-select>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import AttachClass from '@/components/attach/attach-class/index.vue'
import FormRenderer from '@/components/fux-core/form-renderer/index.vue'
import { createVNode, nextTick, onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  approveTask,
  type AuditProcessDetailsListType,
  returnTaskToStart,
  returnTask,
  getAuditProcessDetail,
  getTaskReturnOptions,
  getEchoData,
  getProcessInstance,
  rejectTask,
} from '@/api/business/audit'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import type { SelectProps } from 'ant-design-vue'
import { message, Modal } from 'ant-design-vue'
import { set } from 'lodash-es'
import useTabsStore from '@/stores/tabs'
import MultiButton from './multiButton.vue'
import { provideLocal } from '@vueuse/core'

const route = useRoute()
const tabsView = useTabsStore()
const appSchema = ref()
const formRenderer = ref()
const formRendering = ref<boolean>(true)
const backModalShow = ref<boolean>(false)
const backValue = ref<string>()
const backModal = ref<SelectProps['options']>([])
const attachClass = ref()

const appId = route.query.appId as string
const applyId = route.query.applyId as string
const taskId = route.query.taskId as string
const processInstanceId = route.query.processInstanceId as string
const taskDefKey = route.query.taskDefKey as string
const planId = ref<string>('')
// 定义此申报中所有组件均可访问的参数
const appParamsCtx = ref<Record<string, any>>({})
appParamsCtx.value.applyId = applyId

onMounted(() => {
  // get(<string>appId)
  getEchoDataMethod(appId, applyId)
  getAuditProcessDetailMethod(processInstanceId)
  if (taskDefKey != 'All') {
    getProcessInstanceMethod(processInstanceId, taskId)
    getTaskReturnOptionsMethod(taskId)
  }
})
const basicInfo = ref({
  title: '',
  name: '',
})
const idea = ref('')
const getProcessInstanceMethod = async (parentProcessInstanceId: string, taskId: string) => {
  const data = await getProcessInstance(parentProcessInstanceId, taskId)
  basicInfo.value.title = data.name
  basicInfo.value.name = data.starter
}
const getEchoDataMethod = async (appId: string, applyId: string) => {
  const res = await getEchoData(appId, applyId)
  console.log('echo', res)
  const { data, schema, plan } = res
  planId.value = plan.id
  appSchema.value = JSON.parse(schema)
  const keys = Object.keys(data)
  const ret: any = {}
  keys.forEach((key) => {
    // 主表
    if (data[key] && !Array.isArray(data[key])) {
      const fields = Object.keys(data[key])
      if (appSchema.value.info.paginated) {
        const findIndex = appSchema.value.info.tables.findIndex((table) => table.name == key)
        fields.forEach((field) => {
          set(ret, `${findIndex}.${key}:${field}`, data[key][field])
        })
      } else {
        fields.forEach((field) => {
          ret[`${key}:${field}`] = data[key][field]
        })
      }
    }
  })

  console.log(ret)
  nextTick(() => {
    formRenderer.value.setFormData(ret)
    // 拿到planid之后去查询申报计划附件列表
    attachClass.value.refreshList()
  })
  formRendering.value = false
}
const getTaskReturnOptionsMethod = async (parentProcessInstanceId: string) => {
  const data = await getTaskReturnOptions(parentProcessInstanceId)
  backModal.value = data
  console.log(backModal.value)
}
const getAuditProcessDetailMethod = async (parentProcessInstanceId: string) => {
  auditProcessDetailsList.value = await getAuditProcessDetail(parentProcessInstanceId)
}

const auditProcessDetailsList = ref<AuditProcessDetailsListType>([])

// 退回到发起人方法
const backStartUser = async () => {
  if (idea.value == '') {
    message.warning('请填写审核意见！')
    return
  }
  const backVo = {
    id: applyId,
    reason: idea.value,
    fields: getFields(),
  }
  const modal = Modal.confirm({
    title: '确定退回到发起人吗?',
    icon: createVNode(ExclamationCircleOutlined),
    async onOk() {
      try {
        return await new Promise((resolve, reject) => {
          returnTaskToStart(backVo).then(() => {
            modal.destroy()
            message.success('审批成功！')
            tabsView.removeAndOpenTab(`/business/${appId}/audit?taskDefKey=${taskDefKey}`)
          })
        })
      } catch {
        return console.log('审批失败!')
      }
    },
    onCancel() {
      console.log('Cancel')
    },
    class: 'test',
  })
}

const operation = async (flag: number) => {
  if (idea.value == '') {
    message.warning('请填写审核意见！')
    return
  }
  const data = {
    id: taskId,
    reason: idea.value,
    fields: getFields(),
  }
  if (flag == 1) {
    const modal = Modal.confirm({
      title: '确定通过吗?',
      icon: createVNode(ExclamationCircleOutlined),
      content: createVNode('div', { style: 'color:red;' }, '请确认是否通过！'),
      async onOk() {
        try {
          return await new Promise((resolve, reject) => {
            approveTask(data)
              .then(() => {
                message.success('审核成功！')
                modal.destroy()
                tabsView.removeAndOpenTab(`/business/${appId}/audit?taskDefKey=${taskDefKey}`)
              })
              .catch(() => {
                modal.destroy()
              })
          })
        } catch {
          return console.log('审批失败!')
        }
      },
      onCancel() {
        console.log('Cancel')
      },
      class: 'test',
    })
  } else if (flag == 2) {
    const modal = Modal.confirm({
      title: '确定不通过吗?',
      icon: createVNode(ExclamationCircleOutlined),
      content: createVNode('div', { style: 'color:red;' }, '请确认是否不通过！'),
      async onOk() {
        try {
          return await new Promise((resolve, reject) => {
            rejectTask(data)
              .then(() => {
                message.success('审核成功！')
                modal.destroy()
                tabsView.removeAndOpenTab(`/business/${appId}/audit?taskDefKey=${taskDefKey}`)
              })
              .catch(() => {
                modal.destroy()
              })
          })
        } catch {
          return console.log('审批失败!')
        }
      },
      onCancel() {
        console.log('Cancel')
      },
      class: 'test',
    })
  } else if (flag == 3) {
    const returnTaskData = {
      id: taskId,
      targetTaskDefinitionKey: backValue.value,
      reason: idea.value,
      fields: getFields(),
    }
    const modal = Modal.confirm({
      title: '确定退回吗?',
      icon: createVNode(ExclamationCircleOutlined),
      content: createVNode('div', { style: 'color:red;' }, '请确认是否退回！'),
      async onOk() {
        try {
          return await new Promise((resolve, reject) => {
            returnTask(returnTaskData)
              .then(() => {
                message.success('审核成功！')
                modal.destroy()
                tabsView.removeAndOpenTab(`/business/${appId}/audit?taskDefKey=${taskDefKey}`)
              })
              .catch(() => {
                modal.destroy()
              })
          })
        } catch {
          return console.log('审批失败!')
        }
      },
      onCancel() {
        console.log('Cancel')
      },
      class: 'test',
    })
  }
}

// 退回到审核人 方法
const backAuditUser = () => {
  if (idea.value == '') {
    message.warning('请填写审核意见！')
    return
  } else {
    backModalShow.value = true
  }
}

const getFields = () => {
  const allFields = appSchema.value?.flow.nodes.find((node) => node.uid == taskDefKey)?.props.fields
  // console.log(allFields)
  const editFields = allFields.filter((field) => field.config == 'edit')
  // console.log(editFields)
  const fieldNameArr = [] as Array<string>
  editFields.forEach((field) => {
    fieldNameArr.push(field.name as string)
  })
  const fields = {}
  if (fieldNameArr.length > 0) {
    console.log(formRenderer.value.getFormData())
    const originFormData = formRenderer.value.getFormData().value
    const tablesLength = appSchema.value.info.tables.length
    const formData = {}
    if (tablesLength > 1) {
      const tabs = formRenderer.value.getStepWidget()
      for (let i = 0; i < tablesLength; i++) {
        if (!tabs.props.children[i].widgets.some((e) => e.type == 'dataTable')) {
          const datakeys = Object.keys(originFormData[i])
          datakeys.forEach((keyName) => {
            set(formData, keyName, originFormData[i][keyName])
          })
        }
      }
    } else {
      const datakeys = Object.keys(originFormData)
      datakeys.forEach((keyName) => {
        set(formData, keyName, originFormData[keyName])
      })
    }
    // console.log(formData)
    fieldNameArr.forEach((fieldName) => {
      const tableNameId = fieldName.split(':')[0] + ':id'
      // console.log(tableNameId)
      if (!fields.hasOwnProperty(tableNameId)) {
        set(fields, tableNameId, formData[tableNameId])
      }
      set(fields, fieldName, formData[fieldName])
    })
    // console.log(fields)
    return fields
  }
  return fields
}
provideLocal('appParamsCtx', appParamsCtx)
</script>
<style>
.aspinDiv {
  text-align: center;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  margin-bottom: 20px;
  padding: 30px 50px;
}
</style>
