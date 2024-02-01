// This can be directly added to any of your `.ts` files like `router.ts`
// It can also be added to a `.d.ts` file. Make sure it's included in
// project's tsconfig.json "files"
import 'vue-router'

// To ensure it is treated as a module, add at least one `export` statement
export {}

declare module 'vue-router' {
  interface RouteMeta {
    permissions?: string[]
    roles?: string[]
    noCache?: boolean
    title?: string
    // 菜单图标，建议仅一级菜单展示
    icon?: string
    // 访问该路由时，将对应高亮 activeMenu 设置的菜单项
    activeMenu?: string
    layout?: 'default' | 'independent'
    // 是否在菜单中隐藏该路由
    hidden?: boolean
    // 在菜单中，当某路由是其父级路由的唯一子路由时，是否依然以嵌套目录的形式显示而非直接显示该子路由
    alwaysShow?: boolean
    // 是否采用非默认路由
    isCustomLayout?: boolean
  }
}
