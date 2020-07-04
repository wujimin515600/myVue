class Compiler {
    constructor(vm) {
            this.vm = vm
            this.el = vm.$el
            this.compile(this.el)
        }
        // 编译模板，处理文本节点和元素节点
    compile(el) {
            // 遍历第一层节点
            let childNodes = el.childNodes
            Array.from(childNodes).forEach(node => {
                if (this.isTextNode(node)) {
                    this.compileTextNode(node)
                }
                if (this.isElementNode(node)) {
                    this.compileElement(node)
                }
                // 判断节点是否有子节点，有子节点，递归调用compile
                if (node.childNodes && node.childNodes.length) {
                    this.compile(node)
                }
            })
        }
        // 编译元素节点，指令
    compileElement(node) {
        // console.log(node.attributes)
        // 遍历所有属性节点 判断是否是指令
        Array.from(node.attributes).forEach(attr => {
            let attrName = attr.name
            if (this.isDirective(attrName)) {
                // v-text || v-model 
                attrName = attrName.substr(2)
                let key = attr.value
                this.update(node, key, attrName)
            }
        })
    }
    update(node, key, attrName) {
            let updateFn = this[attrName + 'Updater']
            updateFn && updateFn.call(this, node, this.vm[key], key)
        }
        // 处理v-text指令
    textUpdater(node, value, key) {
        node.textContent = value
            // 创建wathcer对象
        new Watcher(this.vm, key, newValue => {
            node.textContent = newValue
        })
    }
    modelUpdater(node, value, key) {
            node.value = value
                // 创建wathcer对象
            new Watcher(this.vm, key, newValue => {
                    node.value = newValue
                })
                // 双向绑定
            node.addEventListener('input', () => {
                this.vm[key] = node.value
            })
        }
        // 编译文本节点处理指令
    compileTextNode(node) {
            // console.dir(node)
            // {{ msg }}
            let reg = /\{\{(.+?)\}\}/
            let value = node.textContent
            if (reg.test(value)) {
                let key = RegExp.$1.trim()
                node.textContent = value.replace(reg, this.vm[key])
                    // 创建wathcer对象
                new Watcher(this.vm, key, newValue => {
                    node.textContent = newValue
                })
            }
        }
        // 判断元素是否是v-指令
    isDirective(attrName) {
            return attrName.startsWith('v-')
        }
        // 判断节点是否是文本节点
    isTextNode(node) {
            return node.nodeType === 3
        }
        // 判断节点是否是元素节点
    isElementNode(node) {
        return node.nodeType === 1
    }

}