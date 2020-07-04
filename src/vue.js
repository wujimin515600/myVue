class Vue {
    constructor(options) {
        // 1、通过属性保存选项数据
        this.$options = options || {}
        this.$data = options.data || {}
        this.$el = typeof options.el === "string" ? document.querySelector(options.el) : options.el
            // 2、把data中的数据转成getter和setter注入到vue实例中
        this._proxyData(this.$data)
            // 3、调用observe对象监听数据变化
        new Observe(this.$data)
            // 4、调用complier对象，解析模板指令和编译 
        new Compiler(this)


    }
    _proxyData(data) {
        // 遍历data中的所有属性
        Object.keys(data).forEach(key => {
            // 把data的属性注入到vue实例中
            Object.defineProperty(this, key, {
                enumerable: true,
                configurable: true,
                get() {
                    return data[key]
                },
                set(newval) {
                    if (newval === data[key]) return
                    data[key] = newval
                }
            })
        })

    }
}