import { inject } from 'vue'
import dayjs from 'dayjs'
import { camelCase, remove, cloneDeep } from 'lodash'
import { generateID } from '@/utils/fusion'
import { injectionKey } from '@/types/workflow'
import type {
  FormCreatorCtx,
  WidgetType,
  WidgetConfigMap,
  Widget,
  LayoutWidget
} from '@/types/workflow'
import defaultIcon from '@/components/efk-icons/custom.vue'

const icons = import.meta.glob('@/components/efk-icons/*.vue', { eager: true })

const getIcon = (widgetType: WidgetType) => {
  const keys = Object.keys(icons)
  const key = keys.find((k) => camelCase(k.split('/')[4].split('.vue')[0]) === widgetType)
  return key ? (icons[key] as any)['default'] : defaultIcon
}

export const isLayoutWidget = (widget: Widget) => {
  return widget.class === 'layout'
}

export const useWidget = () => {
  const { schema, selectedWidget } = inject<FormCreatorCtx>(injectionKey)!

  const deleteWidget = (uid: string, siblings?: Widget[]) => {
    const list = siblings || schema.form.widgets
    if (selectedWidget.value?.uid === uid) {
      selectedWidget.value = undefined
    }
    remove(list, (e) => e.uid === uid)
  }

  const selectWidget = (widget: Widget) => {
    selectedWidget.value = widget
  }

  const duplicateWidget = (widget: Widget, siblings?: Widget[]) => {
    const list = siblings || schema.form.widgets

    type Children = LayoutWidget['props']['children']

    const cloneChildren = (children: Children) => {
      const clone: Children = []

      children.forEach((child) => {
        const newWidgets: Widget[] = []
        const newChild: Children[number] = cloneDeep(child)

        child.widgets.forEach((widget) => {
          const newWidget: Widget = cloneDeep(widget)
          newWidget.uid = generateID()

          if (isLayoutWidget(widget)) {
            const cloned = cloneChildren((newWidget as LayoutWidget).props.children)
            ;(newWidget as LayoutWidget).props.children = cloned
          }

          newWidgets.push(newWidget)
        })

        newChild.widgets = newWidgets
        clone.push(newChild as any)
      })

      return clone
    }

    if (isLayoutWidget(widget)) {
      const children = (widget as LayoutWidget).props.children
      const clone = cloneChildren(children)

      list.push({
        ...widget,
        uid: generateID(),
        props: {
          ...cloneDeep(widget.props),
          children: clone
        }
      } as LayoutWidget)
    } else {
      list.push({
        ...widget,
        uid: generateID()
      })
    }
  }

  return {
    deleteWidget,
    selectWidget,
    duplicateWidget,
    selectedWidget
  }
}

export const widgetInitConfig: WidgetConfigMap = {
  input: {
    name: '输入框',
    class: 'form',
    type: 'input',
    props: {
      field: {
        label: '输入框'
      },
      event: {},
      prefixType: 'text',
      suffixType: 'text'
    },
    uid: '',
    icon: getIcon('input')
  },
  textarea: {
    type: 'textarea',
    class: 'form',
    name: '文本域',
    props: {
      field: {
        label: '文本域'
      },
      event: {}
    },
    uid: '',
    icon: getIcon('textarea')
  },
  inputNumber: {
    name: '数字输入框',
    class: 'form',
    type: 'inputNumber',
    props: {
      field: {
        label: '数字输入框'
      },
      event: {},
      prefixType: 'text'
    },
    uid: '',
    icon: getIcon('inputNumber')
  },
  select: {
    name: '下拉选择器',
    class: 'form',
    type: 'select',
    props: {
      field: {
        label: '下拉选择器'
      },
      event: {},
      options: {
        type: 'static',
        staticData: [
          { label: '选项一', value: 'opt1' },
          { label: '选项二', value: 'opt2' }
        ]
      },
      showSearch: true
    },
    uid: '',
    icon: getIcon('select')
  },
  checkbox: {
    name: '复选框',
    class: 'form',
    type: 'checkbox',
    props: {
      field: {
        label: '复选框'
      },
      event: {},
      options: {
        type: 'static',
        staticData: [
          { label: '选项一', value: 'opt1' },
          { label: '选项二', value: 'opt2' }
        ]
      }
    },
    uid: '',
    icon: getIcon('checkbox')
  },
  radio: {
    name: '单选框',
    class: 'form',
    type: 'radio',
    props: {
      field: {
        label: '单选框'
      },
      event: {},
      options: {
        type: 'static',
        staticData: [
          { label: '选项一', value: 'opt1' },
          { label: '选项二', value: 'opt2' }
        ]
      }
    },
    uid: '',
    icon: getIcon('radio')
  },
  cascader: {
    name: '级联选择器',
    class: 'form',
    type: 'cascader',
    icon: getIcon('cascader'),
    uid: '',
    props: {
      field: {
        label: '级联选择器'
      },
      event: {},
      options: {
        type: 'static',
        staticData: `[{"label":"山东省","value":"37","children":[{"label":"济南市","value":"3701","children":[{"label":"市中区","value":"370101"},{"label":"历下区","value":"370102"}]},{"label":"青岛市","value":"3702","children":[{"label":"市北区","value":"370203"},{"label":"市南区","value":"370202"}]}]},{"label":"北京市","value":"11","children":[{"label":"东城区","value":"110101"},{"label":"西城区","value":"110102"}]}]`
      }
    }
  },
  slider: {
    type: 'slider',
    class: 'form',
    name: '滑动输入条',
    uid: '',
    icon: getIcon('slider'),
    props: {
      field: {
        label: '滑动输入条'
      },
      event: {}
    }
  },
  rate: {
    type: 'rate',
    class: 'form',
    name: '评分',
    uid: '',
    icon: getIcon('rate'),
    props: {
      field: {
        label: '评分'
      },
      event: {},
      characterType: 'icon',
      allowClear: true
    }
  },
  switch: {
    type: 'switch',
    class: 'form',
    name: '开关',
    uid: '',
    icon: getIcon('switch'),
    props: {
      field: {
        label: '开关'
      },
      event: {}
    }
  },
  datePicker: {
    type: 'datePicker',
    class: 'form',
    name: '日期选择器',
    uid: '',
    icon: getIcon('datePicker'),
    props: {
      field: {
        label: '日期选择器'
      },
      event: {},
      picker: 'date',
      allowClear: true
    }
  },
  dateRangePicker: {
    type: 'dateRangePicker',
    class: 'form',
    name: '日期范围选择器',
    uid: '',
    icon: getIcon('datePicker'),
    props: {
      field: {
        label: '日期范围选择器'
      },
      event: {},
      picker: 'date',
      allowClear: true,
      defaultValue: [dayjs(), dayjs().add(1, 'day')],
      placeholder: ['', '']
    }
  },
  timePicker: {
    type: 'timePicker',
    class: 'form',
    name: '时间选择器',
    uid: '',
    icon: getIcon('timePicker'),
    props: {
      field: {
        label: '时间选择器'
      },
      event: {}
    }
  },
  timeRangePicker: {
    type: 'timeRangePicker',
    class: 'form',
    name: '时间范围选择器',
    uid: '',
    icon: getIcon('timePicker'),
    props: {
      field: {
        label: '时间范围选择器'
      },
      event: {},
      defaultValue: [dayjs(), dayjs().add(1, 'hour')],
      placeholder: ['', '']
    }
  },
  treeSelect: {
    type: 'treeSelect',
    class: 'form',
    name: '树形选择器',
    uid: '',
    icon: getIcon('treeSelect'),
    props: {
      field: {
        label: '树形选择器'
      },
      event: {},
      treeData: {
        type: 'static',
        staticData:
          '[{"label":"山东省","value":"37","children":[{"label":"济南市","value":"3701","children":[{"label":"市中区","value":"370101"},{"label":"历下区","value":"370102"}]},{"label":"青岛市","value":"3702","children":[{"label":"市北区","value":"370203"},{"label":"市南区","value":"370202"}]}]},{"label":"北京市","value":"11","children":[{"label":"东城区","value":"110101"},{"label":"西城区","value":"110102"}]}]'
      }
    }
  },
  upload: {
    type: 'upload',
    class: 'form',
    name: '文件上传',
    icon: getIcon('upload'),
    uid: '',
    props: {
      field: {
        label: '文件上传'
      },
      event: {}
    }
  },
  image: {
    type: 'image',
    class: 'form',
    name: '图片上传',
    uid: '',
    icon: getIcon('image'),
    props: {
      field: {
        label: '图片上传'
      },
      event: {},
      accept: 'image/*',
      type: 'grid'
    }
  },
  grid: {
    type: 'grid',
    class: 'layout',
    name: '栅格布局',
    uid: '',
    icon: getIcon('grid'),
    props: {
      field: {},
      gutter: 16,
      align: 'top',
      children: [
        { span: 12, widgets: [] },
        { span: 12, widgets: [] }
      ]
    }
  },
  tabs: {
    type: 'tabs',
    class: 'layout',
    name: '标签页',
    uid: '',
    icon: getIcon('tabs'),
    props: {
      field: {},
      children: [
        { title: '标签页1', widgets: [] },
        { title: '标签页2', widgets: [] }
      ]
    }
  },
  steps: {
    type: 'steps',
    class: 'layout',
    name: '步骤条',
    uid: '',
    icon: getIcon('steps'),
    props: {
      field: {},
      model: {
        current: 0
      },
      children: [
        { title: '第一步', widgets: [] },
        { title: '第二步', widgets: [] },
        { title: '第三步', widgets: [] }
      ]
    }
  },
  subForm: {
    class: 'layout',
    name: '子表单',
    type: 'subForm',
    uid: '',
    icon: getIcon('subForm'),
    props: {
      children: [{ widgets: [] }],
      field: {
        label: '子表单'
      }
    }
  },
  button: {
    type: 'button',
    class: 'special',
    name: '按钮',
    uid: '',
    icon: getIcon('button'),
    props: {
      field: {
        name: '',
        label: '按钮'
      },
      event: {},
      label: '按钮'
    }
  },
  dataTable: {
    type: 'dataTable',
    class: 'layout',
    name: '数据表格',
    uid: '',
    icon: getIcon('dataTable'),
    props: {
      field: {
        label: '数据表格'
      },
      pagination: {},
      children: [
        {
          widgets: []
        }
      ],
      model: {
        mode: 'table'
      }
    }
  }
}
