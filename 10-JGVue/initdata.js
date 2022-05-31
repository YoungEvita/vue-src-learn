// 数组响应式
let ARRAY_METHOD = [
    'push',
    'pop',
    'shift',
    'unshift',
    'reverse',
    'sort',
    'splice'
]
let array_methods = Object.create(Array.prototype)
ARRAY_METHOD.forEach(method => {
    array_methods[method] = function() {
        console.log('调用拦截的方法')
            // 将数据响应式化,把新增加的数据进行响应式化
        for (let i = 0; i < arguments.length; i++) {
            observe(arguments[i]) // 这里还是有个bug ，引入watcher以后解决
        }
        // 调用原来的方法
        let res = Array.prototype[method].apply(this, arguments)
        return res
    }
})

function defineReactive(target, key, value, enumerable) {
    // 函数内部就是一个局部作用域，这个value 就只在函数内部使用的变量
    let that = this
    if (typeof value === 'object' && value !== null) {
        // 非数组的引用类型
        observe(value)
    }

    let dep = new Dep()
    dep.__propName__ = key //  方便查看当前dep 是哪个key对应的
    Object.defineProperty(target, key, {
        configurable: true,
        enumerable: !!enumerable,
        get() {
            console.log(`读取o的${key}属性`)

            // 依赖收集（暂时略）
            dep.depend()
            return value
        },
        set(newVal) {
            console.log(`设置o的${key}属性`)
            if (value === newVal) return
                // value = newVal
                // 数据发生变化页面发生变化，只需要在这里模板刷新
                // 获取vue的实例 watcher 不会存在这个问题
                // 在调用observe(data, this) ,传一个this
                //  目的
                // 将重新赋值的数据编程响应式的，因此如果传入的是对象类型，那么就需要使用observe 将其转换为响应式
                // 临时判断
            if (typeof newVal === 'object' && newVal !== null) {
                observe(newVal)
            }
            value = newVal

            // 派发更新， 找到全局的watcher ，调用update
            dep.notify()

        }
    })
}

// 将对象obj自身响应化, vm 就是vue实例，为了调用时处理上下文
function observe(obj) {
    //之前没有对obj本身操作，此时直接对obj进行判断
    if (Array.isArray(obj)) {
        // 对其每一个元素处理
        obj.__proto__ = array_methods
        for (let i = 0; i < obj.length; i++) {
            observe(obj[i])
        }
    } else {
        // 对其成员进行处理
        let keys = Object.keys(obj)
        for (let i = 0; i < keys.length; i++) {
            let prop = keys[i]
            defineReactive(obj, prop, obj[prop], true)
        }
    }
}

function proxy(target, prop, key) { // app, _data|properties, name|age
    Object.defineProperty(target, key, {
        enumerable: true,
        configurable: true,
        get() {
            return target[prop][key]
        },
        set(newVal) {
            target[prop][key] = newVal
        }
    })
}

JGVue.prototype.initData = function() {
    // 遍历this._data的成员，将属性转化为响应式，将直接属性代理到实例上
    let keys = Object.keys(this._data)

    observe(this._data)

    // 代理
    for (let i = 0; i < keys.length; i++) {
        // 将 this._data[keys[i]] 映射到 this[keys[i]]上
        // 就是要让this提供keys[i] 这个属性
        // 在访问这个属性的时候，相当于在访问this._data 这个属性
        proxy(this, '_data', keys[i])
    }
}