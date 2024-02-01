export {}

declare module 'vue' {
  export interface GlobalComponents {
    EScrollbar: typeof import('custom-vue-scrollbar').default
  }
}
