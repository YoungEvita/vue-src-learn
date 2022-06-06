
# 记录vue源码学习笔记
[vue源码分析视频](https://www.bilibili.com/video/BV1LE411e7HE?p=6&spm_id_from=pageDriver)

# vue 与模板

### 1、编写页面模板

  ① 直接在HTML标签中写

  ②使用template

  ③使用单文件（ template）

### 2、创建Vue实例
  
   ① 在Vue的构造函数中提供 data， methods， computed， watcher ，props...

### 3、将Vue实例挂载到页面中（mount）

# 数据驱动

1、获得模板： 模板中有“坑”（{{}}）

2、利用Vue构造函数中提供的数据填“坑“，可以在页面中显示的“标签”

3、将标签替换页面中原来有坑的标签（整个元素全部替换）

# 简单的模板渲染

# 虚拟DOM

1、怎么将真正的DOM转换成虚拟DOM

2、怎么将虚拟DOM转换为真正的DOM

思路：与深拷贝类似

# 函数柯里化

1、 函数式编程

2、 柯里化

3、概念： 

① 柯里化： 一个函数原本有多个参数，只传入一个参数，生成一个新函数，又新函数来接收剩下的参数来运行得到结果

② 偏函数： 一个函数原本有多个参数，只传入一部分参数，生成一个新函数，又新函数来接收剩下的参数来运行得到结果

③ 高阶函数： 一个函数参数是一个函数，该函数对对数这个函数进行加工，得到一个函数，这个加工用的函数就是高阶函数

4、 为什么要使用柯里化函数？

- 为了提升性能，使用柯里化可以缓存一部分能力。

    - 案例：

        ①： 判断元素

        ②： 虚拟DOM的render 方法

- vue 本质上是用HTML的字符串作为模板的，字符串的模板 => AST => vnode

    - 字符串模板 => AST : 此阶段最消耗性能，需要对字符串进行解析

    - AST => Vnode

    - Vnode => DOM

- 例1： let s = '1  + 2 * (3 + 4)', 写一个程序，解析这个表达式，得到结果

    思路： 一般把表达式转换为 ”波兰式“表达式， 然后使用栈结构来运算

- vue中每一个标签时可以真正的HTML标签，也可以是自定义组件，怎么区分？

    思路：在VUE源码中其实将所有可以用的HTML标签以及存起来了

- vue 项目模板转换为抽象语法树需要执行几次

    1、 页面一开始加载需要渲染

    2、每一个属性数据在发生变化的时候需要渲染

    3、 watcher ，computed 等等

    render作用将虚拟DOM转换为真正的DOM加到页面中
    - 虚拟DOM可以降级理解为AST
    - 一个项目在运行的时候，模板是不会变的，就表示AST不会变
    - 将虚拟DOM缓存起来，生个一个函数，函数只要传入数据，就可以得到真正的DOM

# 响应式原理

- 在使用vue的时候，赋值属性，货代属性都是使用的vue实例

- 在设置属性值的时候，页面的数据需要更新

```
Object.defineProperty(obj, prop, {
    writalbe
    configurable
    enumerable
    value
    set () {}
    get () {}
})
```

- 一般属性都是多层级的，使用递归来响应式化，对数组进行处理

- push，pop， shift， unshift， reverse， sort， splice

1、在改变数组的数据的时候要发出通知

2、vue2 中，数组发生变化，设置length 没法通知，vue 3使用proxy解决了此问题

3、加进来的元素也要变成程响应式的

技巧： 如果一个函数已经定义了，需要扩展其功能一般处理方法

- 使用临时的函数名来存储函数
- 重新定义原来的函数
- 定义扩展的功能
- 调用临时的那个函数

扩展数组的push和pop? 修改原型链

- 直接修改prototype 不可

- 修改要进行响应式化的数组的原型（_proto_）

已经将对象响应式化，如果直接给对象赋值另一个对象，此时不是响应式（vue依旧可以响应式）

# 发布订阅模式
- 代理方法 （app.name, app._data.name）
- 事件模型 （node： event模块）
- vue 中observe 与watcher 和Dep

代理方法： 就是要讲app._data 中的成员映射到app 上

由于需要在更新数据的时候，更新页面的内容，所以app._data 访问的成员与app 访问的成员应该是同一个

由于app._data 已经是响应式的对象了，所以只需要让app访问的成员去访问app._data的对应成员就可以了

例如：
```
app.name => app._data.name
app.xx => app._data.xx
```
vue中引入函数proxy(target, src, prop), 这里是因为当时没有Proxy语法 

## 发布订阅模式目的

目标： 解耦，让各个模块之间没有紧密的联系

问题： 现在demo 中mountComponent 更新的是什么？现在demo 中用更新的是全部的页面，整个DOM替换（当前虚拟DOM对应的页面DOM）

Vue中，整个更新是按照组件为单位进行判断，以节点为单位进行更新

- 如果代码中没有自定义组件，在比较算法的时候，我们会将全部的模板对应的虚拟DOM进行比较
- 如果代码中含有自定义组件，那么在比较算法的时候，就会判断更新的是哪一个组件中的属性，只会判断更新数据的组件，其他组件不会更新

复杂的页面是由很多组件构成的，每一个属性要更新的时候都要调用更新的方法

目标，如果修改了什么属性，就尽可能只更新这些属性对应的页面DOM

例子：
买东西，如果到货了，请通知我

发布者： 卖家 - 需要公布有什么东西可以订阅
可以订阅的东西（媒介）
订阅者： 买家

1. 卖家提供账簿（数组，有什么东西可以卖）
2. 买家根据需求订阅商品，卖家记录订单（数组）
3. 买家等待
4. 商品到货，卖家根据账簿通知买家（遍历数组，取出数组中的元素来使用）

## 事件模型

1. 有一个event 对象
2. 提供方法 on， off， emit

实现事件模型

1. event 是一个全局对象
2. event.on('事件名', 处理函数) ， 订阅事件
    - 事件可以连续订阅
    - 可以移除 event.off()
        - 移除所有
        - 移除某一个类型的事件
        - 移除某一个类型的某一个处理函数
3. 写别的代码
4. evnet.emit('事件名', 参数) ，先前注册的事件处理函数会依次调用

## 发布订阅模式（形式不局限于函数，形式可以是对象等）
1. 中间的全**局的容器（target）**，用来**存储**可以被触发的东西（函数，对象（watcher））
2. 一个方法（depend），可以往容器中**传入**东西（函数，对象）
3. 一个方法，可以将容器中的东西取出来**使用**（函数调用，对象的方法调用）

Vue模型
 
 页面中的变更（diff）是以组件为单位
 - 如果页面中只有一个组件（Vue实例） ，不会有性能损失
 - 但是如果页面中有多个组件（多watcher的一种情况），第一次会有多个组件的wathcerCyrus到去全局watcher中
    - 如果修改了局部的数据（例如其中一个组件的数据）
    - 表示只会对改组件进行diif 算法，也就是只会重新生成改组件的抽象语法树，
    - 只会访问改组件的watcher
    - 表示再次往全局存储的只有改组件的wather
    - 页面更新的时候也就更新一部分


# 改写observe

rectify缺陷： 
    - 无法处理数组
    - 响应式无法在中间集成watcher处理
    - 我们实现的rectify需要和我们的实例仅仅绑定在一起，分离 解耦
# 引入watcher

问题：
- 模型（图）
- 关于this的问题

实现：
分成两步：
1. 只考虑修改后刷新（响应式）
2. 在考虑依赖手机（优化）

在vue 中提供一个构造函Watcher

Wather会提供一些方法“
- get()用来计算或执行处理函数
- update() 公共的外部方法，该方法会处罚内部的run 方法
- run()，用来判断内部是使用异步运行还是同步运行等（二次提交，脏数据），这个方法会最终调用内部的get方法
- cleanupDep()，清除队列

我们的页面渲染是上面哪一个方法执行的？ - get

watcher实例属性vm，表示当前的vue 实例

# 引入 Dep对象

该对象提供依赖收集（depend）的功能和派发更新（notify）的功能

在notify中去调用watcher的update方法

# Watcher 与Dep

之前渲染watcher 放在全局作用域上会有问题
 
- vue 项目中包含很多组件，各个组件自治
    
        - watcher 就可能有多个
        - 每个watcher 用于描述一个渲染行为或计算行为
        - 子组件发生一个数据的更新，页面需要重新渲染（真正的vue中是局部渲染）
        - vue中推荐是使用计算属性来代替插值表达式
            - 计算属性是会伴随其使用的属性的变化而变化的

在访问的是后就会进行收集，再修改的时候就会更新，那么收集到什么就更新什么

依赖收集就是告诉当前的watcher 什么属性被访问了，那么在这个watcher计算或渲染页面的时候就会将这些收集到的属性进行更新 （局部更新）

如何将属性与当前watcher关联起来
    - 在全局准备一个targetStatck（watcher栈）
    - 在Watcher调用get方法的时候，将当前watcher放到全局，在get执行结束的时候，将全局watcher移除。提供 pushTarget， popTarget
    - 在每一个属性中都有一个Dep对象
    - 在访问对象属性的时候（get）， 渲染watcher 就在全局中
    - 将属性与watcher相关联，把渲染watcher存储到属性相关的dep中，同时将dep存储到全局watcher中（互相引用的关系）
   -- 渲染watcher - 》 dep  -》全局watcher


# Watcher 与Dep 与属性的关系

假设页面有三个属性 name ， age， gender
# Observer对象

# vue源代码
1. 各个文件夹的作用
2. vue的初始化流程

# 各个文件夹的作用
1. compilier 编译用的
     - vue 使用**字符串**作为模板
    - 在编译文件夹中存放对模板字符串的解析的算法（AST，优化等）
2. core核心，vue 构造函数，以及声明周期等方法
3. platforms
    - 针对运行的环境，有不同的实现
    - 也是vue 的入口
4. server 服务端，主要是将vue 用在服务端的代理代码
5. sfc ，单文件组件
6. shared， 公共工具