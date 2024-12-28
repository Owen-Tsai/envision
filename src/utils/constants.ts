export const menuTypes = [
  { label: '目录', value: 1 },
  { label: '菜单', value: 2 },
  { label: '操作', value: 3 },
]

export const DICT_SYSTEM_DATA_SCOPE = {
  all: 1,
  custom: 2,
  deptOnly: 3,
  deptAndChildren: 4,
  self: 5,
}

export const HEADER_HEIGHT = import.meta.env.VITE_DEFAULT_LAYOUT === 'default' ? 56 : 0
