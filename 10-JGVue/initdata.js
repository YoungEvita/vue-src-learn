
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
    array_methods[method] = function () {
        console.log('调用拦截的方法')
        // 将数据响应式化,把新增加的数据进行响应式化
        for (let i =0 ;i < arguments.length; i++) {
            reactify(arguments[i])
        }
        // 调用原来的方法
        let res = Array.prototype[method].apply(this, arguments)
        return res
    }
})

function defineReactive(target, key, value, enumerable) {
    // 函数内部就是一个局部作用域，这个value 就只在函数内部使用的变量
    let that = this
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
       // 非数组的引用类型
       reactify(value) 
    }
    Object.defineProperty(target, key, {
        configurable: true,
        enumerable: !!enumerable,
        get () {
            console.log(`读取o的${key}属性`)
            return value
        },
        set (newVal) {
            console.log(`设置o的${key}属性`)
            // value = newVal
            // 数据发生变化页面发生变化，只需要在这里模板刷新
            // 获取vue的实例 watcher 不会存在这个问题
            // 在调用reactify(data, this) ,传一个this

            // 临时判断
            if (typeof newVal === 'Object' && newVal !== null) {
                value = reactify(newVal)
            } else {
                value = newVal
            }
             // 数组本身不是响应式的的，无法进行直接赋值响应式化 ，其他已经处于响应式化的可以赋值
            that.mountComponent()
        }
    })
}

// 将对象响应化
function reactify(obj, vm) {
    let keys = Object.keys(obj)

    for (let i = 0; i< keys.length; i++) {
        let key = keys[i] // 属性名
        let value = obj[key]
        // 判断这个属性是不是引用类型， 是不是数组
        // 如果是引用类型要递归
        // 无论是否是引用类型与否，都需要将其响应式化
        // 如果是数字，就需要循环数组，然后讲述组里的元素进行响应式化

        if (Array.isArray(value)) {
            value.__proto__ = array_methods // 此时data.course.push()会调用拦截的方法
            // 数组
            for (let j = 0; j < value.length; j++) {
                reactify(value[j], vm)
            }
        } else {
            defineReactive.call(vm, obj, key, value, true)
        }
        // 只需要在这里添加代理即可（问题：这里写的代码会是递归的）
        // 如果在这里将属性映射到Vue实例中，那么就表示Vue实例可以使用属性key
        // {data: {name: 'jack'}, child: {name:'cc'}} 这样会带来的问题是是后面name把前面的name 覆盖
    }
}

function proxy(target, prop, key) { // app, _data|properties, name|age
    Object.defineProperty(target, key, {
            enumerable: true,
            configurable: true,
            get () {
                return target[prop][key]
            },
            set (newVal) {
                target[prop][key] = newVal
            }
        })
}

JGVue.prototype.initData = function() {
    // 遍历this._data的成员，将属性转化为响应式，将直接属性代理到实例上
    let keys = Object.keys(this._data)
     
    // x响应式化
    for (let i =0; i< keys.length; i++) {
        // 这里将对象 this._data[keys[i]] 编程响应式的
        reactify(this._data, this)
    }

    // 代理
    for(let i=0; i<keys.length; i++) {
        // 将 this._data[keys[i]] 映射到 this[keys[i]]上
        // 就是要让this提供keys[i] 这个属性
        // 在访问这个属性的时候，相当于在访问this._data 这个属性
        proxy(this, '_data', keys[i])
    }
}