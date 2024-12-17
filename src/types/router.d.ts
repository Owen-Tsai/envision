// This can be directly added to any of your `.ts` files like `router.ts`
// It can also be added to a `.d.ts` file. Make sure it's included in
// project's tsconfig.json "files"
import 'vue-router'

// To ensure it is treated as a module, add at least one `export` statement
export {}

declare module 'vue-router' {
  interface RouteMeta {
    id?: number
    parentId?: number | null
    /**
     * 启用路由缓存策略，在切换至其他路由时维持状态
     */
    keepAlive?: boolean
    /**
     * 该路由所对应的浏览器标签页名称
     */
    title?: string
    /**
     * 菜单图标。建议仅在一级菜单/目录中设置
     */
    icon?: string | null
    /**
     * 是否在左侧菜单中展示该菜单项
     */
    visible?: boolean
    /**
     * 在菜单中，当某路由是其父级路由的唯一子路由时，是否依然以嵌套目录的形式显示而非直接显示该子路由
     */
    alwaysShow?: boolean
    /**
     * 采用非默认布局时的布局组件路径。非默认布局模式下，将打开新窗口、在本字段指定的组件内渲染子组件
     */
    customLayout?: string | null
    /**
     * 当访问该路由时，应当激活的菜单项
     */
    activeMenuKey?: string
    /**
     * 当访问该路由时，跳过激活菜单项
     */
    ignoreActiveMenu?: boolean
  }
}
