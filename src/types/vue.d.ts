import * as antIcons from '@ant-design/icons-vue'

declare module 'vue' {
  interface ComponentCustomProperties {
    $icons: Record<keyof antIcons, antIcons>
  }
}
