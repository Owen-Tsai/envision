/**
 * Contains workflow related utils
 */
import { type StepsProps } from 'ant-design-vue'
import type { WPropsStep } from '@/types/workflow/form'

export const constructStepItems = (steps: WPropsStep[]): StepsProps['items'] => {
  return steps.map((e) => ({
    title: e.title,
    description: e.desc,
  }))
}
