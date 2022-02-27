
  // HTML DOM => vnode ,将这个函数作为compilier 函数
  function generateVnode(node) {
    let nodeType = node.nodeType
    let _vnode = null
    if (nodeType === 1) {
        // 元素
        let nodeName = node.nodeName
        let attrs = node.attributes // 返回伪数组
        let _attrObj = {}
        for (let i = 0 ; i <attrs.length; i++) { // attrs[i] 属性节点（nodeType===2）
            _attrObj[attrs[i].nodeName] = attrs[i].nodeValue
        }
        _vnode = new VNode(nodeName, _attrObj, undefined, nodeType)
        
        // 考虑node的子元素
        let childNodes = node.childNodes
        for (let i = 0 ; i < childNodes.length; i++) {
            _vnode.appendChild(generateVnode(childNodes[i])) // 递归
        }
    } else if (nodeType === 3) {
        _vnode = new VNode(undefined, undefined, node.nodeValue, nodeType)
    }
    return _vnode
}
// 虚拟dom => 真实DOM
function parseVNode(vnode) {
    // 创建真实的DOM
    let type = vnode.type
    let _node = null
    if (type === 3) { // 创建文本节点
        return document.createTextNode(vnode.value)
    } else if (type === 1){
        // 标签
        _node = document.createElement(vnode.tag)

        // 属性
        let data = vnode.data // 现在这个是data是键值对
        Object.keys(data).forEach((key) => {
            let attrName = key
            let attrValue = data[key]
            _node.setAttribute(attrName, attrValue)
        })
        // 子元素
        let children = vnode.children
        children.forEach((subvnode) => {
            _node.appendChild(parseVNode(subvnode)) // 递归转换子元素（虚拟DOM）,递归会消耗内存
        })
        return _node
    }
}

let reg = /\{\{(.+?)\}\}/g // ? 取消贪婪模式
// 使用 ‘xx.yy.zz' 格式来访问某一个对象的成员，即用字符串路径来访问对象的成员
function getValueByPath(obj, path) {
    let paths = path.split('.')
    let res = obj
    let prop
    while(prop = paths.shift()) {
        res = res[prop]
    }
    return res
}
// 将带有坑的vnode+data => 带有数据的vnode； 模拟ast=> vnode
function combine(vnode, data) {
    let _type = vnode.type
    let _data = vnode.data
    let _value = vnode.value
    let _tag = vnode.tag
    let _children = vnode.children

    let _vnode = null

    if (_type === 3) { // 文本节点
        _value = _value.replace(reg, function(_, g1) {
            return getValueByPath(data, g1.trim())
        })
        _vnode = new VNode(_tag, _data, _value, _type)
    } else if (_type === 1) { // 元素节点
        _vnode = new VNode(_tag, _data, _value, _type)
        _children.forEach(_subvnode => {
            _vnode.appendChild(combine(_subvnode, data))
        })
    }
    return _vnode

}