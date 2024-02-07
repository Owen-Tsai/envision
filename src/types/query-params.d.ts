type CommonQueryParams = {
  pageSize?: number
  pageNum?: number
  params?: {
    beginTime?: dayjs | string
    endTime?: dayjs | string
  }
}
