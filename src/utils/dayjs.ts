import dayjs from 'dayjs'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')
dayjs.extend(isSameOrBefore)
