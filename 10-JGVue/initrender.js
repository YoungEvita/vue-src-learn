JGVue.prototype.mount = function() {
    // 需要提供一个render方法， 生成虚拟DOM
    // vue 中可以自定义render 函数
    if (typeof this._options.render !== 'function') {
        this.render = this.createRenderFn() // 缓存虚拟DOM
    }

    this.mountComponent()
}


JGVue.prototype.mountComponent = function() {
    // 执行 mount() 函数
    let mount = () => {
        this.update(this.render())
    }

    // 这个watcher 是全局的，在任何一个位置都可以访问
    new Watcher(this, mount) // 相当于调用了mount
}

/**
 *  在真正的vue 中使用了二次提交的设计结构
 *  1、在页面中的DOM和虚拟DOM是一一对应的关系
 *  2、缓存的是AST
 *  3、先有AST和数据生成新的vnode
 *  4、只要数据发生变化都会生成新的Vnode，新的vnode会和页面真正的vnode作比较（diif算法）
 *  
 * 
 */
// 生成render函数，我们模拟来缓存虚拟DOM（vue实际缓存的AST）
JGVue.prototype.createRenderFn = function(realHTMLDOM) {
    let ast = generateVnode(this._template)
        // vue: ast + data => vnode
        // 我们模拟： 带有”坑“的vnode + data =》 函数数据的vnode
    return function render() {
        // 将带坑的Vnode转换为真正的带数据的vnode
        let _tmp = combine(ast, this._data)
        return _tmp
    }

}

// 将虚拟DOM元素放到页面中；（diff算法）
JGVue.prototype.update = function(vnode) {
    //  简化直接HTML生成DOM replaceChild到页面中替换
    // 父元素.replaceChilid(新元素， 旧元素)
    let realDOM = parseVNode(vnode)
    console.log(this._template) // 这里输出的是最开始带坑的html
    this._parent.replaceChild(realDOM, document.querySelector("#app")) // 这里不能用templage，在app.name=‘cc' 时会报错
    console.log(realDOM)
}