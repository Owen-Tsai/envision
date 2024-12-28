<template>
  <div class="view">
    <ARow :gutter="24">
      <ACol :span="24" :lg="7">
        <ACard>
          <template v-if="pending">
            <div class="flex flex-col items-center justify-center gap-4">
              <ASkeletonAvatar active :size="80" />
              <ASkeleton active />
            </div>
          </template>
          <template v-else>
            <div class="flex flex-col items-center justify-center gap-4">
              <div class="relative">
                <AAvatar :src="data?.avatar" :size="80" />
                <ATooltip placement="right" title="更换头像">
                  <AButton
                    shape="circle"
                    size="small"
                    type="primary"
                    class="absolute bottom-0 right-0"
                    @click="chooseAvatar"
                  >
                    <template #icon>
                      <CameraOutlined />
                    </template>
                  </AButton>
                </ATooltip>
              </div>
              <div class="text-lg">{{ data?.nickname }}</div>
            </div>
            <div class="sub-info mt-6">
              <div>
                <ApartmentOutlined />
                <span>部门：{{ data?.dept?.name || '暂无部门' }}</span>
              </div>
              <div>
                <MobileOutlined />
                <span>手机：{{ data?.mobile || '未绑定手机号' }}</span>
              </div>
              <div>
                <MailOutlined />
                <span>邮箱：{{ data?.email || '未绑定邮箱地址' }}</span>
              </div>
            </div>

            <ADivider />

            <div>
              <span class="font-bold">其他信息</span>
              <div class="sub-info mt-4">
                <div>账号：{{ data?.username }}</div>
                <div>上次登录时间：{{ dayjs(data?.loginDate).format('YYYY-MM-DD HH:mm:ss') }}</div>
                <div>上次登录地点：{{ data?.loginIp }}</div>
                <div>注册时间：{{ dayjs(data?.createTime).format('YYYY-MM-DD HH:mm:ss') }}</div>
              </div>
            </div>
          </template>
        </ACard>
      </ACol>
      <ACol :span="24" :lg="17">
        <ACard>
          <ATabs :tab-bar-style="{ marginTop: '-12px' }">
            <ATabPane key="info" tab="个人信息">
              <ASpin :spinning="pending">
                <InfoForm :profile="data" />
              </ASpin>
            </ATabPane>
            <ATabPane key="password" tab="修改密码">
              <PasswordForm />
            </ATabPane>
          </ATabs>
        </ACard>
      </ACol>
    </ARow>

    <input ref="uploadEl" type="file" class="hidden" @change="onFileChange" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import dayjs from 'dayjs'
import {
  CameraOutlined,
  MobileOutlined,
  ApartmentOutlined,
  MailOutlined,
} from '@ant-design/icons-vue'
import useUserStore from '@/stores/user'
import { getProfile, updateAvatar, updateProfile } from '@/api/system/user/profile'
import useRequest from '@/hooks/use-request'
import InfoForm from './info.vue'
import PasswordForm from './password.vue'

const uploadEl = ref<HTMLInputElement>()
const { user } = storeToRefs(useUserStore())

const { data, pending, execute } = useRequest(getProfile, {
  immediate: true,
})

const chooseAvatar = () => {
  uploadEl.value?.click()
}

const onFileChange = () => {
  const file = uploadEl.value?.files?.[0]
  if (file) {
    updateAvatar(file).then(async (res) => {
      message.success('保存成功')
      await updateProfile({
        ...data.value,
        avatar: res,
      })
      user.value!.avatar = res
      execute()
    })
  }
}

defineOptions({ name: 'UserConfig' })
</script>

<style lang="scss" scoped>
.sub-info {
  color: var(--color-text-secondary);
  div {
    @apply flex items-center gap-2 py-1;
  }
}
</style>
