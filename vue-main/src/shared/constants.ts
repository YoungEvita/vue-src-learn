export const SSR_ATTR = 'data-server-rendered' // 服务端渲染

// 资源类型 每个vue组件都会挂载的成员
export const ASSET_TYPES = ['component', 'directive', 'filter'] as const  // as const 类型断言

// 生命周期，钩子函数
export const LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured',
  'serverPrefetch'
] as const
