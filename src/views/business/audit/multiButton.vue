<script setup lang="ts">
import {
  LoadingOutlined,
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons-vue'

const formFooterCardBodyStyle = {
  display: 'flex',
  justifyContent: 'center',
}

const props = defineProps({
  currentStep: {
    type: Number,
  },
  isEnd: {
    type: Boolean,
  },
  prevStep: {
    type: Function,
  },
  nextStep: {
    type: Function,
  },
})
</script>

<template>
  <a-card class="formFooterCard" :bodyStyle="formFooterCardBodyStyle">
    <a-space wrap>
      <a-button class="operationButton" :disabled="props.currentStep == 0" @click="props.prevStep">
        <LeftOutlined />
        上一步
      </a-button>
      <a-button
        class="operationButton"
        type="primary"
        :disabled="props.isEnd"
        @click="props.nextStep"
      >
        下一步
        <RightOutlined />
      </a-button>
    </a-space>
  </a-card>
</template>

<style scoped lang="scss"></style>
