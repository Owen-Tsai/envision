import useRequest from '@/hooks/use-request'
import { getApplicationDetail } from '@/api/application'

const useAppInfo = () => {
  const { params } = useRoute()
  const appId = params.appId as string

  const { data, pending } = useRequest(() => getApplicationDetail(appId), {
    immediate: true,
  })

  return {
    appInfo: data,
    appInfoLoading: pending,
  }
}

export default useAppInfo
