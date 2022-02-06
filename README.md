
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


# 发布订阅模式