class Observe {
    constructor(data) {
        // 负责把data中的数据转成响应式数据
        // data中的某个属性对象也装成响应式数据
        this.walk(data)
    }
    walk(data) {
        if (!data || typeof data !== 'object') {
            return
        }
        Object.keys(data).forEach(key => {
            this.defineReactive(data, key, data[key])
        })
    }
    defineReactive(obj, key, val) {
        let ts = this
            // 负责收集依赖发送通知
        let dep = new Dep()
            // 如果val是对象再次递归 给属性添加getter和setter
        this.walk(val)
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get() {
                // 收集依赖
                Dep.target && dep.addSub(Dep.target)
                return val
            },
            set(newVal) {
                if (newVal == val) return
                val = newVal
                    // 当前属性重新赋值新对象时也需要给属性添加getter和setter
                ts.walk(newVal)
                    // 发送通知
                dep.notify()
            }
        })
    }
}