// watcher 观察这，用来发射更新的行为

let watcherid = 0
class Watcher {
    constructor(vm, expOrFn, cb) {
            // vm - JGvue 实例
            // expOrFn {String | Function}， 如果是渲染watcher，传入的就是渲染函数，如果是计算watcher，传入的是路径表达式，暂时只考虑为函数的情况
            this.vm = vm
            this.getter = expOrFn

            this.id = watcherid++ // 用来区分是否是同一个watcher

                this.deps = [] // 依赖项
            this.depIds = {} // 是一个Set类型，用户保证依赖项的唯一性

            // 一开始需要渲染，真实vue 中 this.lazy? undefined: this.get()
            this.get()

        }
        // 计算触发getter
    get() {
            pushTarget(this)
            this.getter.call(this.vm, this.vm)
            popTarget()
        }
        // 执行，病判断是否懒加载，还是同步执行，还是异步执行
        // 这里只考虑异步执行
    run() {
            this.get() // 在vue 中调用queueWatcher 来处罚nextTick 进行异步的执行
        }
        // 对外公开的函数，用于在属性发生变化的时触发的接口
    update() {
            this.run()
        }
        // 清空队列
    cleanupDep() {

    }

    // 将当前的dep 与当前的watcher 关联
    addDep(dep) {
        this.deps.push(dep)
    }

}