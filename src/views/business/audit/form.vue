<template>
  <div class="view">
    <ACard title="申请信息">
      <div class="aspinDiv" v-show="formRendering">
        <a-spin />
      </div>
      <FormRenderer
        ref="formRenderer"
        v-if="appSchema"
        :schema="appSchema as Schema"
        :key="appSchema"
        disabled
      />
    </ACard>
    <ACard title="审批任务" style="margin-top: 20px">
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
            <a-button block @click="backModalShow = true">退回</a-button>
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

    <!--    <ACard title="审批记录" style="margin-top: 20px">-->
    <!--      <a-steps-->
    <!--          direction="vertical"-->
    <!--          :current="1"-->
    <!--          :items="approvalRecord"-->
    <!--      ></a-steps>-->
    <!--    </ACard>-->
  </div>
</template>

<script setup lang="ts">
import FormRenderer from '@/components/form-renderer/index.vue'
import { ref, onMounted, nextTick, toRefs } from 'vue'
import { useRoute } from 'vue-router'
import {
  approveTask,
  rejectTask,
  backTask,
  getProcessInstance,
  getEchoData,
  getBackOptions,
  getTaskListByProcessInstanceId
} from '@/api/business/audit'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { createVNode } from 'vue'
import { Modal } from 'ant-design-vue'
import { Schema } from '@/types/workflow'
import type { SelectProps } from 'ant-design-vue'
const route = useRoute()
import useTabsStore from '@/stores/tabs'
const tabsView = useTabsStore()
const { fullPath } = toRefs(useRoute())
const appSchema = ref()
const formRenderer = ref()
const formRendering = ref<boolean>(true)
const backModalShow = ref<boolean>(false)
const backValue = ref<string>()
const backModal = ref<SelectProps['options']>([])
onMounted(() => {
  // get(<string>route.query.appId)
  getProcessInstanceMethod(route.query.parentProcessInstanceId as string)
  getEchoDataMethod(route.query.appId as string, route.query.applyId)
  getBackOptionsMethod(route.query.taskId as string)
})
const basicInfo = ref({
  title: '',
  name: ''
})
const idea = ref('')
const getProcessInstanceMethod = async (parentProcessInstanceId: string) => {
  const data = await getProcessInstance(parentProcessInstanceId)
  basicInfo.value.title = data.name
  basicInfo.value.name = data.startUser.nickname
}
const getEchoDataMethod = async (appId: string, applyId: string) => {
  const res = await getEchoData(appId, applyId)
  console.log('echo', res)
  const { data, schema } = res
  appSchema.value = JSON.parse(schema)
  const keys = Object.keys(data)
  const ret: any = {}
  keys.forEach((key) => {
    // 主表
    if (data[key] && !Array.isArray(data[key])) {
      const fields = Object.keys(data[key])
      if (appSchema.value.info.paginated) {
        // ignore for now
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
  })
  formRendering.value = false
}
const getBackOptionsMethod = async (parentProcessInstanceId: string) => {
  const data = await getBackOptions(parentProcessInstanceId)
  // let options: any = []
  // data.forEach((item) => {
  //   let option = {
  //     label: item.name,
  //     value: item.taskDefinitionKey
  //   }
  //   options.pop(option)
  // })
  backModal.value = data
  console.log(backModal.value)
}
const approvalRecord = ref([
  {
    title: '第一步审核',
    description: '审核通过，审核意见：经考查****，予以通过。'
  },
  {
    title: '第二步审核',
    description: '待审核'
  },
  {
    title: '第三步审核',
    description: '待审核'
  }
])
const operation = async (flag: number) => {
  let taskId = route.query.taskId
  let data = {
    id: taskId,
    reason: idea.value
  }
  if (flag == 1) {
    const modal = Modal.confirm({
      title: '确定通过吗?',
      icon: createVNode(ExclamationCircleOutlined),
      content: createVNode('div', { style: 'color:red;' }, '请确认是否通过！'),
      async onOk() {
        try {
          return await new Promise((resolve, reject) => {
            approveTask(data).then(() => {
              Modal.info({
                title: '审批成功！',
                content: '',
                onOk() {
                  tabsView.removeTab(
                    fullPath.value,
                    '/business/' + route.query.appId + '/audit?userTaskId=' + route.query.taskId
                  )
                  modal.destroy()
                }
              })
            })
          })
        } catch {
          return console.log('审批失败!')
        }
      },
      onCancel() {
        console.log('Cancel')
      },
      class: 'test'
    })
  } else if (flag == 2) {
    const modal = Modal.confirm({
      title: '确定不通过吗?',
      icon: createVNode(ExclamationCircleOutlined),
      content: createVNode('div', { style: 'color:red;' }, '请确认是否不通过！'),
      async onOk() {
        try {
          return await new Promise((resolve, reject) => {
            rejectTask(data).then(() => {
              Modal.info({
                title: '审批成功！',
                content: '',
                onOk() {
                  tabsView.removeTab(
                    fullPath.value,
                    '/business/' + route.query.appId + '/audit?userTaskId=' + route.query.taskId
                  )
                  modal.destroy()
                }
              })
            })
          })
        } catch {
          return console.log('审批失败!')
        }
      },
      onCancel() {
        console.log('Cancel')
      },
      class: 'test'
    })
  } else if (flag == 3) {
    data = {
      id: route.query.taskId,
      targetTaskDefinitionKey: backValue.value,
      reason: idea.value
    }
    const modal = Modal.confirm({
      title: '确定退回吗?',
      icon: createVNode(ExclamationCircleOutlined),
      content: createVNode('div', { style: 'color:red;' }, '请确认是否退回！'),
      async onOk() {
        try {
          return await new Promise((resolve, reject) => {
            backTask(data).then(() => {
              Modal.info({
                title: '审批成功！',
                content: '',
                onOk() {
                  backModalShow.value = false
                  tabsView.removeTab(
                    fullPath.value,
                    '/business/' + route.query.appId + '/audit?userTaskId=' + route.query.taskId
                  )
                  modal.destroy()
                }
              })
            })
          })
        } catch {
          return console.log('审批失败!')
        }
      },
      onCancel() {
        console.log('Cancel')
      },
      class: 'test'
    })
  }
}
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
