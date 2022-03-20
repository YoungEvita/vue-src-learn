
  function JGVue(options) {
    this._options = options
    this._data = options.data 

    let elm = document.querySelector(options.el) // vue中实际是字符串，我们这里是DOM
    this._template = elm
    this._parent = elm.parentNode
    // 挂载
    this.initData() // 将data进行响应式转换，进行代理

    this.mount() // 挂载
} 