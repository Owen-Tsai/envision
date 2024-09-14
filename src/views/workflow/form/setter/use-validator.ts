import { reactive, ref, computed, type Ref } from 'vue'
import dayjs from 'dayjs'
import type { SelectProps, FormItemProps } from 'ant-design-vue'
import type { FormWidget } from '@/types/workflow'

const useValidator = (selectedWidet: Ref<FormWidget | undefined>) => {
  const validateTypeOpts: SelectProps['options'] = [
    {
      label: '常用规则',
      options: [
        { label: '身份证号', value: 'idCard' },
        { label: '电子邮箱', value: 'email' },
        { label: '手机号', value: 'mobile' },
        { label: '网址', value: 'url' }
      ]
    },
    {
      label: '时间',
      options: [
        { label: '已满1年', value: 'year>1' },
        { label: '已满3年', value: 'year>3' },
        { label: '已满5年', value: 'year>5' }
      ]
    },
    {
      label: '自定义',
      options: [{ label: '自定义', value: 'custom' }]
    }
  ]

  const state = reactive({
    editorVisible: false,
    validateType: ''
  })

  const onTypeChange = (v?: string) => {
    if (v === 'custom') {
      state.editorVisible = true
    } else {
      state.editorVisible = false
    }

    if (v === 'email' || v === 'url') {
      selectedWidet.value!.props.field.rules = JSON.stringify([
        {
          type: v,
          message: `请输入正确的${v === 'email' ? '电子邮箱' : '网址'}`
        }
      ])
    }

    if (v === 'idCard') {
      selectedWidet.value!.props.field.rules = JSON.stringify([
        {
          pattern:
            '^[1-9]\\d{5}(18|19|([23]\\d))\\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]$',
          message: '请输入正确的身份证号'
        }
      ])
    }

    if (v === 'mobile') {
      selectedWidet.value!.props.field.rules = JSON.stringify([
        {
          pattern: '^1[3456789]\\d{9}$',
          message: '请输入正确的手机号'
        }
      ])
    }

    if (v?.includes('year')) {
      const target = parseInt(v.split('>')[1])

      selectedWidet.value!.props.field.rules = JSON.stringify([
        {
          validator(rule, value, callback) {
            const today = dayjs()
            const val = dayjs(value)

            if (val.isBefore(today.subtract(target, 'year'))) {
              callback(`填写的指未满${target}年`)
            } else {
              callback()
            }
          }
        }
      ] as FormItemProps['rules'])
    }
  }

  return {
    validateTypeOpts,
    state,
    onTypeChange
  }
}

export default useValidator
