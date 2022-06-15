import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'
import type { GlobalAPI } from 'types/global-api'
//  vue的构造函数
function Vue(options) {
  if (__DEV__ && !(this instanceof Vue)) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
   // 初始化
  this._init(options)
}

//@ts-expect-error Vue has function type
initMixin(Vue)  // 挂载初始化方法
//@ts-expect-error Vue has function type
stateMixin(Vue)   // 挂载状态处理方法
//@ts-expect-error Vue has function type
eventsMixin(Vue)  // 挂载事件的方法
//@ts-expect-error Vue has function type
lifecycleMixin(Vue)   // 挂载生命周期的方法
//@ts-expect-error Vue has function type
renderMixin(Vue)   // 挂载与渲染有关的方法
export default Vue as unknown as GlobalAPI
