import type { StepsProps } from 'ant-design-vue'
import type { WPropsSteps } from '@/types/fux-core'

const constructSteps = (steps: WPropsSteps['children']): StepsProps['items'] => {
  return steps.map((e) => ({
    title: e.title,
    description: e.desc
  }))
}

export default constructSteps
