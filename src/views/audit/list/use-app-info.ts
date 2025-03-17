import useRequest from '@/hooks/use-request'
import { getApplicationDetailCarryAuditProcessInfo } from '@/api/application/audit'
import useTabsStore from '@/stores/tabs'

const { setTabTitle } = useTabsStore()

const useAppInfo = () => {
  const { params } = useRoute()
  const appId = params.appId as string
  const route = useRoute()
  const taskDefKey = route.query.taskDefKey as string

  const { data, pending } = useRequest(
    () => getApplicationDetailCarryAuditProcessInfo(taskDefKey, appId),
    {
      immediate: true,
      onSuccess() {
        const tabTitle = data.value?.name
        if (tabTitle) {
          setTabTitle(tabTitle)
        }
      },
    },
  )

  return {
    appInfo: data,
    appInfoLoading: pending,
  }
}

export default useAppInfo
