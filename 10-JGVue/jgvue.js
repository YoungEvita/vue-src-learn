
  function JGVue(options) {
    this._data = options.data 
    this._template = document.querySelector(options.el) // vue中实际是字符串，我们这里是DOM
    this._parent = this._template.parentNode
    // 挂载
    this.initData() // 将data进行响应式转换，进行代理

    this.mount() // 挂载
} 