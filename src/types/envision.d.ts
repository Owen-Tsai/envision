export {}

declare module 'vue' {
  export interface GlobalComponents {
    EScrollbar: typeof import('custom-vue-scrollbar').default
    EDictTag: typeof import('@/components/dict-tag/index.vue').default
  }
}
