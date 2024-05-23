<template>
  <AModal
    v-model:open="open"
    title="CRON 表达式设置"
    destroy-on-close
    width="40vw"
    @after-close="emit('close')"
    @ok="submit"
  >
    <div class="mt-4">
      <ASegmented v-model:value="activeSegment" :options="segmentOpts" block>
        <template #label="{ value, payload }: { value: string | number; payload?: any }">
          <div class="flex flex-col py-2">
            <AInput v-model:value="modelMap[value as ModelKey].value" size="small" readonly />
            <span>{{ payload.label }}</span>
          </div>
        </template>
      </ASegmented>

      <ADivider />

      <div>
        <div class="flex items-center gap-4">
          <span>类型</span>
          <ARadioGroup v-model:value="segmentData[activeSegment].type">
            <ARadioButton v-if="activeSegment === 'year'" :value="-1">忽略</ARadioButton>
            <ARadioButton :value="0">任意值</ARadioButton>
            <ARadioButton :value="1">范围</ARadioButton>
            <ARadioButton :value="2">间隔</ARadioButton>
            <ARadioButton :value="3">指定</ARadioButton>
            <ARadioButton v-if="activeSegment === 'day'" :value="4">本月最后一天</ARadioButton>
            <ARadioButton v-if="activeSegment === 'week'" :value="4">本月最后一周</ARadioButton>
            <ARadioButton :value="5">不指定</ARadioButton>
          </ARadioGroup>
        </div>

        <div class="flex items-center gap-1 mt-4">
          <!-- range -->
          <template v-if="segmentData[activeSegment].type === 1">
            范围：从
            <AInputNumber v-model:value="segmentData[activeSegment].range[0]" />
            <span>~</span>
            <AInputNumber v-model:value="segmentData[activeSegment].range[1]" />
          </template>
          <!-- loop -->
          <template v-if="segmentData[activeSegment].type === 2">
            <template v-if="activeSegment === 'week'">
              每
              <AInputNumber v-model:value="segmentData[activeSegment].range[0]" />
              周的
              <ASelect
                v-model:value="segmentData[activeSegment].range[1]"
                :options="appointOptsMap['week']"
              />
              执行一次
            </template>
            <template v-else>
              从
              <AInputNumber v-model:value="segmentData[activeSegment].range[0]" />
              {{ labelMap[activeSegment] }}开始，每
              <AInputNumber v-model:value="segmentData[activeSegment].range[1]" />
              {{ labelMap[activeSegment] }}执行一次
            </template>
          </template>
          <!-- appoint -->
          <template v-if="segmentData[activeSegment].type === 3">
            指定值：
            <ASelect
              v-if="activeSegment !== 'week'"
              v-model:value="segmentData[activeSegment].appoint"
              mode="multiple"
              :options="appointOptsMap[activeSegment].map((e) => ({ value: e, label: e }))"
              class="w-80"
            />
            <ASelect
              v-else
              v-model:value="segmentData['week'].appoint"
              mode="multiple"
              :options="appointOptsMap['week']"
              class="w-80"
            />
          </template>
          <!-- last -->
          <template v-if="segmentData[activeSegment].type === 2">
            <template v-if="activeSegment === 'week'">
              最后一周的
              <ASelect
                v-model:value="segmentData[activeSegment].last"
                :options="appointOptsMap['week']"
              />
            </template>
          </template>
        </div>
      </div>
    </div>

    <pre class="mt-2">
      {{ modelValue }}
    </pre>
  </AModal>
</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue'
import { ref, reactive, computed, type ComputedRef } from 'vue'

type Model = {
  type: number
  range: number[]
  loop: number[]
  appoint: string[]
  last?: number
}

type ModelKey = 'day' | 'hour' | 'minute' | 'month' | 'second' | 'week' | 'year'

const props = defineProps({
  value: {
    type: String
  }
})

const emit = defineEmits(['update:value', 'close'])

const yearOpts: number[] = []

const getYearOpts = () => {
  let y = new Date().getFullYear()
  for (let i = 0; i < 11; i++) {
    yearOpts.push(y + i)
  }
}

getYearOpts()

const segmentData = reactive<Record<ModelKey, Model>>({
  second: {
    type: 0,
    range: [1, 2],
    loop: [0, 1],
    appoint: [] as string[]
  },
  minute: {
    type: 0,
    range: [1, 2],
    loop: [0, 1],
    appoint: [] as string[]
  },
  hour: {
    type: 0,
    range: [1, 2],
    loop: [0, 1],
    appoint: [] as string[]
  },
  day: {
    type: 0,
    range: [1, 2],
    loop: [1, 1],
    appoint: [] as string[]
  },
  month: {
    type: 0,
    range: [1, 2],
    loop: [1, 1],
    appoint: [] as string[]
  },
  week: {
    type: 5,
    range: [2, 3],
    loop: [0, 2],
    last: 2,
    appoint: [] as string[]
  },
  year: {
    type: -1,
    range: [yearOpts[0], yearOpts[1]],
    loop: [yearOpts[0], 1],
    appoint: [] as string[]
  }
})

const getModelValue = (key: ModelKey) => {
  const val = segmentData[key]
  switch (val.type) {
    case -1:
      return ''
    case 0:
      return '*'
    case 1:
      return `${val.range[0]}-${val.range[1]}`
    case 2:
      return key === 'week' ? `${val.loop[0]}#${val.loop[1]}` : `${val.loop[0]}/${val.loop[1]}`
    case 3:
      return val.appoint.length > 0 ? val.appoint.join(',') : '*'
    case 4:
      return key === 'week' ? `${val.last}L` : 'L'
    case 5:
      return '?'
    default:
      return '*'
  }
}

const setModalValue = (arr: string[]) => {
  const keys: ModelKey[] = ['second', 'minute', 'hour', 'day', 'month', 'week', 'year']
  arr.forEach((val, idx) => {
    const key = keys[idx]
    if (val === '*') {
      segmentData[key].type = 0
    } else if (val.includes('-')) {
      // range
      const v = val.split('-')
      segmentData[key].type = 1
      segmentData[key].range = [Number(v[0]), Number(v[1])]
    } else if (val.includes('/')) {
      // loop
      const v = val.split('/')
      segmentData[key].type = 2
      segmentData[key].loop = [Number(v[0]), Number(v[1])]
    } else if (val.includes('#')) {
      // loop for week
      const v = val.split('#')
      segmentData[key].type = 2
      segmentData[key].loop = [Number(v[0]), Number(v[1])]
    } else if (val.includes('L')) {
      segmentData[key].type = 4
      if (key === 'week') {
        segmentData[key].last = Number(val.replace('L', ''))
      }
    } else if (val === '?') {
      segmentData[key].type = 5
    } else if (val === '') {
      segmentData[key].type = -1
    } else {
      segmentData[key].type = 3
      segmentData[key].appoint = val.split(',')
    }
  })
}

const labelMap: Record<ModelKey, string> = {
  second: '秒',
  minute: '分钟',
  hour: '小时',
  day: '日',
  month: '月',
  week: '周',
  year: '年'
}

const segmentOpts = Object.keys(labelMap).map((e) => ({
  value: e,
  payload: {
    label: labelMap[e as ModelKey]
  }
}))

const appointOptsMap = {
  second: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 59],
  minute: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 59],
  hour: new Array(24).fill(0).map((_, idx) => idx),
  day: new Array(31).fill(0).map((_, idx) => idx + 1),
  month: new Array(12).fill(0).map((_, idx) => idx + 1),
  week: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'].map((e, idx) => ({
    value: idx,
    label: e
  })),
  year: yearOpts
}

const valueSecond = computed(() => getModelValue('second'))
const valueMinute = computed(() => getModelValue('minute'))
const valueHour = computed(() => getModelValue('hour'))
const valueDay = computed(() => getModelValue('day'))
const valueMonth = computed(() => getModelValue('month'))
const valueWeek = computed(() => getModelValue('week'))
const valueYear = computed(() => getModelValue('year'))

const modelMap: Record<ModelKey, ComputedRef<string>> = {
  second: valueSecond,
  minute: valueMinute,
  hour: valueHour,
  day: valueDay,
  month: valueMonth,
  week: valueWeek,
  year: valueYear
}

const modelValue = computed(
  () =>
    `${valueSecond.value} ${valueMinute.value} ${valueHour.value} ${valueDay.value} ${valueMonth.value} ${valueWeek.value} ${valueYear.value}`
)

const open = ref(true)
const activeSegment = ref<ModelKey>('second')

const setDefaultValue = () => {
  let arr = props.value?.split(' ')
  if (!arr || arr.length < 6) {
    message.warning('不合法的 CRON 表达式，已替换为默认值')
    arr = '* * * * * ?'.split(' ')
  }

  setModalValue(arr)
}

const submit = () => {
  emit('update:value', modelValue.value)
  open.value = false
}

setDefaultValue()
</script>
