type PaginatedList<T> = {
  total: number
  list: Array<T>
}

type TableScope<T> =
  | {
      column: import('ant-design-vue').TableColumnType<T> & {
        key?: import('type-fest').LiteralUnion<keyof T, string> | number
      }
      record: Partial<T>
      index: number
      text: T<keyof T>
      value: any
    }
  | undefined
