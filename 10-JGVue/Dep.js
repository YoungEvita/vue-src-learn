let depid = 0;

class Dep {
    constructor() {
        this.id = depid++; // 用来区分是否为同一个dep
        this.subs = []; // 存储的是与当前Dep关联的watcher
    }

    // 添加一个watcher
    addSub(sub) {
        this.subs.push(sub);
    }

    // 移除
    removeSub(sub) {
        for (let i = this.subs.length - 1; i >= 0; i--) {
            if (sub === this.subs[i]) {
                this.subs.splice(i, 1);
            }
        }
    }

    // 将当前Dep与当前的Watcher（暂时渲染watcher）关联
    depend() {
        if (Dep.target) {
            // Dep.target 是一个watcher 实例
            this.addSub(Dep.target); // 将当前的watcher 关联到当前的dep上
            Dep.target.addDep(this); // 将当前的dep 与当前渲染watcher关联起来
        }
    }

    // 触发阈值关联的watcher的update方法，启动更新的作用
    notify() {
        // 在vue中是一次触发this.subs中的dep，watcher的update方法
        // 将dep中的subs（要渲染什么属性的watcher）取出来，依次调用update方法
        let deps = this.subs.slice();
        deps.forEach((watcher) => {
            watcher.update();
        });
    }
}

// 全局的容器存储渲染Watcher

Dep.target = null; // 这里是全局的Watcher

let targetStack = [];

// 将当前操作的watcher存储到全局watcher中，参数target就是当前的watcher

function pushTarget(target) {
    targetStack.unshift(Dep.target); // vue源代码中使用的是push
    Dep.target = target;
}

// 将当前的watcher 踢出
function popTarget() {
    Dep.target = targetStack.shift(); // 踢到最后就是undefined
}

// 在watcher调用get方法的时候，调用pushtTarget(this)
// 在watcher 的get 方法结束的时候，调用popTarget()