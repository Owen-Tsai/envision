<template>
  <AModal
    v-model:open="isOpen"
    :title="isAdd ? '新增文件配置' : '编辑文件配置'"
    :confirm-loading="loading"
    @ok="submit"
  >
    <ASpin :spinning="loading">
      <AForm
        ref="formRef"
        :label-col="{ style: { width: '100px' } }"
        :model="formData"
        :rules="rules"
        class="mt-4"
      >
        <AFormItem label="配置名" name="name">
          <AInput v-model:value="formData.name" placeholder="如：私有云存储" />
        </AFormItem>
        <AFormItem label="备注" name="remark">
          <AInput v-model:value="formData.remark" placeholder="请输入备注信息" />
        </AFormItem>
        <AFormItem label="存储器" name="storage">
          <ASelect
            v-model:value="formData.storage"
            :options="infraFileStorage"
            placeholder="请选择存储器"
          />
        </AFormItem>
        <template
          v-if="
            formData.storage &&
            formData.storage !== storageType.database &&
            formData.storage !== storageType.oss
          "
        >
          <AFormItem
            label="基础路径"
            :name="['config', 'basePath']"
            :rules="[{ required: true, message: '请输入基础路径' }]"
          >
            <AInput v-model:value="formData.config!.basePath" placeholder="请输入基础路径" />
          </AFormItem>
        </template>
        <template
          v-if="formData.storage === storageType.ftp || formData.storage === storageType.sftp"
        >
          <AFormItem
            label="主机地址"
            :name="['config', 'host']"
            :rules="[{ required: true, message: '请输入主机地址' }]"
          >
            <AInput v-model:value="formData.config!.host" placeholder="请输入主机地址" />
          </AFormItem>
          <AFormItem
            label="主机端口"
            :name="['config', 'port']"
            :rules="[{ required: true, message: '请输入主机端口' }]"
          >
            <AInputNumber v-model:value="formData.config!.port" placeholder="请输入主机端口" />
          </AFormItem>
          <AFormItem
            label="用户名"
            :name="['config', 'username']"
            :rules="[{ required: true, message: '请输入用户名' }]"
          >
            <AInput v-model:value="formData.config!.username" placeholder="请输入用户名" />
          </AFormItem>
          <AFormItem
            label="密码"
            :name="['config', 'password']"
            :rules="[{ required: true, message: '请输入密码' }]"
          >
            <AInputPassword v-model:value="formData.config!.password" placeholder="请输入密码" />
          </AFormItem>
        </template>
        <template v-if="formData.storage === storageType.ftp">
          <AFormItem
            label="连接模式"
            :name="['config', 'mode']"
            :rules="[{ required: true, message: '请选择连接模式' }]"
          >
            <ARadioGroup v-model:value="formData.config!.mode">
              <ARadio value="Active">主动模式</ARadio>
              <ARadio value="Passive">被动模式</ARadio>
            </ARadioGroup>
          </AFormItem>
        </template>
        <template v-if="formData.storage === storageType.oss">
          <AFormItem
            label="节点地址"
            :name="['config', 'endpoint']"
            :rules="[{ required: true, message: '请输入节点地址' }]"
          >
            <AInput v-model:value="formData.config!.endpoint" placeholder="请输入节点地址" />
          </AFormItem>
          <AFormItem
            label="存储桶"
            :name="['config', 'bucket']"
            :rules="[{ required: true, message: '请输入存储桶' }]"
          >
            <AInput v-model:value="formData.config!.bucket" placeholder="请输入存储桶" />
          </AFormItem>
          <AFormItem
            label="Access Key"
            :name="['config', 'accessKey']"
            :rules="[{ required: true, message: '请输入 Access Key' }]"
          >
            <AInput v-model:value="formData.config!.accessKey" placeholder="请输入 Access Key" />
          </AFormItem>
          <AFormItem
            label="Access Secret"
            :name="['config', 'accessSecret']"
            :rules="[{ required: true, message: '请输入 Access Secret' }]"
          >
            <AInputPassword
              v-model:value="formData.config!.accessSecret"
              placeholder="请输入 Access Secret"
            />
          </AFormItem>
        </template>
        <AFormItem
          v-if="formData.storage"
          label="自定义域名"
          :name="formData.storage === storageType.oss ? undefined : 'domain'"
        >
          <AInput v-model:value="formData.config!.domain" placeholder="请输入自定义域名" />
        </AFormItem>
      </AForm>
    </ASpin>
  </AModal>
</template>

<script lang="ts" setup>
import useDict from '@/hooks/use-dict'
import { addConfig, updateConfig, getDetail, type FileConfigVO } from '@/api/infra/file/config'
import useModalOpen from '@/hooks/use-modal'
import { message, type FormInstance, type FormProps } from 'ant-design-vue'

const storageType = {
  database: 1,
  disk: 10,
  ftp: 11,
  sftp: 12,
  oss: 20,
}

const rules: FormProps['rules'] = {
  name: [{ required: true, message: '请填写配置名称' }],
  storage: [{ required: true, message: '请选择存储器' }],
  domain: [{ required: true, message: '请填写自定义域名' }],
}

const props = defineProps<{
  record?: FileConfigVO
  open?: boolean
}>()

const emit = defineEmits(['success', 'update:open'])

const formRef = ref<FormInstance>()
const loading = ref(false)

const isOpen = useModalOpen(props, emit, formRef)
const formData = ref<FileConfigVO>({
  config: {},
})

const [infraFileStorage] = useDict('infra_file_storage')

const isAdd = computed(() => props.record === undefined)

const submit = async () => {
  try {
    loading.value = true
    await formRef.value?.validate()

    if (isAdd.value) {
      await addConfig(formData.value)
      message.success('创建成功')
    } else {
      await updateConfig(formData.value)
      message.success('保存成功')
    }

    emit('success')
  } catch (e) {
    //
  } finally {
    loading.value = false
  }
}

watch(
  () => props.record?.id,
  (val) => {
    if (val) {
      loading.value = true
      getDetail(val).then((res) => {
        formData.value = res
        loading.value = false
      })
    }
  },
)
</script>
