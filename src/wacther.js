/**
 * 当数据变化时触发依赖 dep通知所有的watcher实例更新视图
 * 自身实例发送变化时往dep对象中添加自己
 * 
 * */
class Watcher {
    constructor(vm, key, cb) {
            this.vm = vm
            this.key = key
                // 回调函数更新视图
            this.cb = cb
                // 当前对象记录到dep的静态属性target中
            Dep.target = this
                // 触发get 调用addSub
            this.oldValue = vm[key]
            Dep.target = null

        }
        // 数据变化更新视图
    update() {
        let newValue = this.vm[this.key]
        if (this.oldValue === newValue) return
        this.cb(newValue)
    }
}