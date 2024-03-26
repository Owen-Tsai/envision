import { storeToRefs } from 'pinia'
import useUserStore from '@/stores/user'

export const permission = {
  has(...keys: string[]) {
    const { permissions } = storeToRefs(useUserStore())

    return keys.every((k) => permissions.value.includes(k))
  },
  hasOne(...keys: string[]) {
    const { permissions } = storeToRefs(useUserStore())

    return keys.filter((k) => permissions.value.includes(k)).length > 0
  },
  hasNone(...keys: string[]) {
    return !this.has(...keys)
  }
}

export const role = {
  has(...keys: string[]) {
    const { roles } = storeToRefs(useUserStore())

    return keys.every((k) => roles.value.includes(k))
  },
  hasOne(...keys: string[]) {
    const { roles } = storeToRefs(useUserStore())

    return keys.filter((k) => roles.value.includes(k)).length > 0
  },
  hasNone(...keys: string[]) {
    return !this.has(...keys)
  }
}
