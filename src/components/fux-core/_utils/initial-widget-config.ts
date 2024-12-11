import { camelCase } from 'lodash-es'
import defaultIcon from '@/components/fux-core/_icons/custom.vue'
import dayjs from 'dayjs'
import type { WidgetMap, WidgetType } from '@/types/fux-core/form'

const icons = import.meta.glob('@/components/fux-core/_icons/*.vue', {
  eager: true,
  import: 'default'
})

const getIcon = (widgetType: WidgetType) => {
  const keys = Object.keys(icons)
  const key = keys.find((k) => camelCase(k.split('/').pop()?.replace('.vue', '')) === widgetType)
  return key ? (icons[key] as any) : defaultIcon
}

const initWidgetConfig: Partial<WidgetMap> = {
  input: {
    class: 'form',
    type: 'input',
    uid: '',
    name: '输入框',
    props: {
      field: {
        label: '输入框'
      },
      prefix: {
        type: 'text'
      },
      suffix: {
        type: 'text'
      }
    },
    icon: getIcon('input')
  },
  inputNumber: {
    class: 'form',
    type: 'inputNumber',
    uid: '',
    name: '数字输入框',
    props: {
      field: {
        label: '数字输入框'
      },
      prefix: {
        type: 'text'
      }
    },
    icon: getIcon('inputNumber')
  },
  textarea: {
    class: 'form',
    type: 'textarea',
    uid: '',
    name: '文本域',
    props: {
      field: {
        label: '文本域'
      }
    },
    icon: getIcon('textarea')
  },
  select: {
    class: 'form',
    type: 'select',
    uid: '',
    name: '选择框',
    props: {
      field: {
        label: '选择框'
      },
      options: {
        type: 'static',
        value: [
          { label: '选项1', value: '1' },
          { label: '选项2', value: '2' }
        ]
      }
    },
    icon: getIcon('select')
  },
  checkbox: {
    class: 'form',
    type: 'checkbox',
    uid: '',
    name: '多选框',
    props: {
      field: {
        label: '多选框'
      },
      options: {
        type: 'static',
        value: [
          { label: '选项1', value: '1' },
          { label: '选项2', value: '2' }
        ]
      }
    },
    icon: getIcon('checkbox')
  },
  radio: {
    class: 'form',
    type: 'radio',
    name: '单选框',
    uid: '',
    props: {
      field: {
        label: '单选框'
      },
      options: {
        type: 'static',
        value: [
          { label: '选项1', value: '1' },
          { label: '选项2', value: '2' }
        ]
      }
    },
    icon: getIcon('radio')
  },
  rate: {
    class: 'form',
    type: 'rate',
    uid: '',
    name: '评分',
    props: {
      field: {
        label: '评分'
      }
    },
    icon: getIcon('rate')
  },
  slider: {
    class: 'form',
    type: 'slider',
    uid: '',
    name: '滑动输入条',
    props: {
      field: {
        label: '滑动输入条'
      }
    },
    icon: getIcon('slider')
  },
  switch: {
    class: 'form',
    type: 'switch',
    uid: '',
    name: '开关',
    props: {
      field: {
        label: '开关'
      }
    },
    icon: getIcon('switch')
  },
  cascader: {
    class: 'form',
    type: 'cascader',
    uid: '',
    name: '级联选择器',
    props: {
      field: {
        label: '级联选择器'
      },
      options: {
        type: 'static',
        value: `[{"label":"山东省","value":"37","children":[{"label":"济南市","value":"3701","children":[{"label":"市中区","value":"370101"},{"label":"历下区","value":"370102"}]},{"label":"青岛市","value":"3702","children":[{"label":"市北区","value":"370203"},{"label":"市南区","value":"370202"}]}]},{"label":"北京市","value":"11","children":[{"label":"东城区","value":"110101"},{"label":"西城区","value":"110102"}]}]`
      }
    },
    icon: getIcon('cascader')
  },
  treeSelect: {
    class: 'form',
    type: 'treeSelect',
    uid: '',
    name: '树形选择器',
    props: {
      field: {
        label: '树形选择器'
      },
      options: {
        type: 'static',
        value: `[{"label":"山东省","value":"37","children":[{"label":"济南市","value":"3701","children":[{"label":"市中区","value":"370101"},{"label":"历下区","value":"370102"}]},{"label":"青岛市","value":"3702","children":[{"label":"市北区","value":"370203"},{"label":"市南区","value":"370202"}]}]},{"label":"北京市","value":"11","children":[{"label":"东城区","value":"110101"},{"label":"西城区","value":"110102"}]}]`
      }
    },
    icon: getIcon('treeSelect')
  },
  datePicker: {
    class: 'form',
    type: 'datePicker',
    uid: '',
    name: '日期选择器',
    props: {
      field: {
        label: '日期选择器'
      },
      picker: 'date'
    },
    icon: getIcon('datePicker')
  },
  timePicker: {
    class: 'form',
    type: 'timePicker',
    uid: '',
    name: '时间选择器',
    props: {
      field: {
        label: '时间选择器'
      }
    },
    icon: getIcon('timePicker')
  },
  dateRangePicker: {
    class: 'form',
    type: 'dateRangePicker',
    uid: '',
    name: '日期范围选择器',
    props: {
      field: {
        label: '日期范围'
      },
      picker: 'date',
      defaultValue: [dayjs(), dayjs().add(1, 'day')],
      placeholder: ['开始日期', '结束日期']
    },
    icon: getIcon('datePicker')
  },
  timeRangePicker: {
    class: 'form',
    type: 'timeRangePicker',
    uid: '',
    name: '时间范围选择器',
    props: {
      field: {
        label: '时间范围'
      },
      defaultValue: [dayjs(), dayjs().add(1, 'hour')],
      placeholder: ['开始时间', '结束时间']
    },
    icon: getIcon('timePicker')
  },
  grid: {
    class: 'layout',
    type: 'grid',
    uid: '',
    name: '栅格布局',
    props: {
      field: {},
      children: [
        { widgets: [], span: 12 },
        { widgets: [], span: 12 }
      ],
      gutter: 24
    },
    icon: getIcon('grid')
  },
  tabs: {
    class: 'layout',
    type: 'tabs',
    uid: '',
    name: '标签页',
    props: {
      field: {},
      children: [
        { widgets: [], title: '标签页1' },
        { widgets: [], title: '标签页2' }
      ],
      state: {
        current: 0
      }
    },
    icon: getIcon('tabs')
  },
  steps: {
    class: 'layout',
    type: 'steps',
    uid: '',
    name: '步骤条',
    props: {
      field: {},
      children: [
        { widgets: [], title: '步骤1' },
        { widgets: [], title: '步骤2' }
      ],
      state: {
        current: 0
      }
    },
    icon: getIcon('steps')
  },
  subForm: {
    class: 'layout',
    type: 'subForm',
    uid: '',
    name: '子表单',
    props: {
      field: {
        label: '子表单'
      },
      children: []
    },
    icon: getIcon('subForm')
  },
  dataTable: {
    class: 'layout',
    type: 'dataTable',
    uid: '',
    name: '数据表格',
    props: {
      field: {
        label: '数据表格'
      },
      widgets: [],
      pagination: {},
      state: {
        mode: 'table'
      }
    },
    icon: getIcon('dataTable')
  },
  upload: {
    class: 'form',
    type: 'upload',
    uid: '',
    name: '文件上传',
    props: {
      field: {
        label: '文件上传'
      }
    },
    icon: getIcon('upload')
  }
}

export default initWidgetConfig
