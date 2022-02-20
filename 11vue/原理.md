### MVVM

MVVM 由以下三个内容组成

- View：界面
- Model：数据模型
- ViewModel：作为桥梁负责沟通 View 和 Model

在 JQuery 时期，如果需要刷新 UI 时，需要先取到对应的 DOM 再更新 UI，这样数据和业务的逻辑就和页面有强耦合。

在 MVVM 中，UI 是通过数据驱动的，数据一旦改变就会相应的刷新对应的 UI，UI 如果改变，也会改变对应的数据。这种方式就可以在业务处理中只关心数据的流转，而无需直接和页面打交道。ViewModel 只关心数据和业务的处理，不关心 View 如何处理数据，在这种情况下，View 和 Model 都可以独立出来，任何一方改变了也不一定需要改变另一方，并且可以将一些可复用的逻辑放在一个 ViewModel 中，让多个 View 复用这个 ViewModel。

在 MVVM 中，最核心的也就是数据双向绑定，例如 Angluar 的脏数据检测，Vue 中的数据劫持。

#### 脏数据检测

当触发了指定事件后会进入脏数据检测，这时会调用 `$digest` 循环遍历所有的数据观察者，判断当前值是否和先前的值有区别，如果检测到变化的话，会调用 `$watch` 函数，然后再次调用 `$digest` 循环直到发现没有变化。循环至少为二次 ，至多为十次。

脏数据检测虽然存在低效的问题，但是不关心数据是通过什么方式改变的，都可以完成任务，但是这在 Vue 中的双向绑定是存在问题的。并且脏数据检测可以实现批量检测出更新的值，再去统一更新 UI，大大减少了操作 DOM 的次数。所以低效也是相对的，这就仁者见仁智者见智了。



### virtual dom

小编在网上查了大量文章，得出一个结论，react中数据发生变化（调用setstate时），render函数就会执行，重新生成一个新的虚拟dom，这个虚拟dom和旧的虚拟dom做比较，得出差异然后渲染。

而vue组件中数据发生变化，由于数据变化会触发setter，由于vue组件中数据的getter的作用，收集了依赖，setter触发会根据这些依赖，**生成新的虚拟dom**，然后对比新旧虚拟dom进行渲染。

比较疑惑的是两种渲染看起来好似没什么差别，总感觉我描述的两个流程有问题，没有体现出差异，万望解惑，小编看好多大厂面试题都会提出这个问题，而网上大部分文章感觉总是读的一头雾水

是用JS对象来模拟真实DOM中的节点，该对象包含了真实DOM的结构及其属性，用于对比虚拟DOM和真实DOM的差异，从而进行局部渲染来达到优化性能的目的。

Virtual DOM只有在重复渲染的时候才可能提高性能，毕竟要多一个运算步骤，也要消耗更多的内存，只渲染一次，不会获得任何性能的好处。

浏览器传统的渲染方式有两种：

1. 给一个HTML字符串，解析，变成DOM Tree，画出来；
2. 对一个或者一组选中的DOM进行操作。

virtual dom，做的就是让浏览器在一个事件周期里尽量减少修改dom树的操作，减少频繁操作DOM而引起回流重绘所引发的性能问题的！

### 虚拟DOM的作用是什么？

1. 兼容性好。因为Vnode本质是JS对象，所以不管Node还是浏览器环境，都可以操作；
2. 减少了对Dom的操作。页面中的数据和状态变化，都通过Vnode对比，只需要在比对完之后更新DOM，不需要频繁操作，提高了页面性能；

### 虚拟DOM和真实DOM的区别？

说到这里，那么虚拟DOM和真实DOM的区别是什么呢？总结大概如下：

- 虚拟DOM不会进行回流和重绘；
- 真实DOM在频繁操作时引发的回流重绘导致性能很低；

- 虚拟DOM频繁修改，然后一次性对比差异并修改真实DOM，最后进行依次回流重绘，减少了真实DOM中多次回流重绘引起的性能损耗；
- 虚拟DOM有效降低大面积的重绘与排版，因为是和真实DOM对比，更新差异部分，所以只渲染局部；

总损耗 = 真实DOM增删改 + (多节点)回流/重绘;   //计算使用真实DOM的损耗
总损耗 = 虚拟DOM增删改 + (diff对比)真实DOM差异化增删改 + (较少节点)回流/重绘;  //计算使用虚拟DOM的损耗
复制代码

可以发现，都是围绕频繁操作真实DOM引起回流重绘，导致页面性能损耗来说的。不过框架也不一定非要使用虚拟DOM，关键在于看是否频繁操作会引起大面积的DOM操作。

那么虚拟DOM究竟通过什么方式来减少了页面中频繁操作DOM呢？这就不得不去了解DOM Diff算法了。

## 虚拟dom

#### dom-diff

1. 用JS对象模拟DOM（虚拟DOM）
2. 把此虚拟DOM转成真实DOM并插入页面中（render）
3. 如果有事件发生修改了虚拟DOM，比较两棵虚拟DOM树的差异，得到差异对象（diff）
4. 把差异对象应用到真正的DOM树上（patch）

## 响应原理

vue采用数据劫持结合发布者-订阅者模式的方式，通过`Object.defineProperty`劫持data属性的setter，getter，在数据变动时发布消息给订阅者，触发相应的监听回调。 

## 组件data为什么返回函数

组件中的data写成一个函数，数据以函数返回值形式定义，这样每复用一次组件，就会返回一份新的data。如果单纯的写成对象形式，就使得所有组件实例共用了一份data，造成了数据污染。

## vue给对象新增属性页面没有响应

由于Vue会在初始化实例时对属性执行`getter/setter`转化，所以属性必须在`data`对象上存在才能让Vue将它转换为响应式的。Vue提供了$set方法用来触发视图更新。

```
export default {
    data(){
        return {
            obj: {
                name: 'fei'
            }
        }
    },
    mounted(){
        this.$set(this.obj, 'sex', 'man')
    } 
} 

```

#### 数据劫持

Vue 内部使用了 `Object.defineProperty()` 来实现双向绑定，通过这个函数可以监听到 `set` 和 `get` 的事件。

```js
var data = { 
  name: 'yck' 
  obj: {}
}
observe(data)
let name = data.name // -> get value
data.name = 'yyy' // -> change value

//对数组进行监听要单独处理
const oldArrayProperty = Array.prototype
const arrProto = Object.create(oldArrayProperty)
['push', 'pop', 'shift', 'unshift', 'splice'].forEach(methodName => {
	arrProto[methodName] = function() {
		updateView()
		oldArrayProperty[methodName].call(this, ...arguments)
	} 
})


function observe(obj) {
  // 判断类型
  if (!obj || typeof obj !== 'object') {
    return
  }
  if(Array.isArray(obj)){
    obj.__proto__ = arrProto
  }
  Object.keys(obj).forEach(key => {
    defineReactive(obj, key, obj[key])
  })
}

function defineReactive(obj, key, val) {
  // 递归子属性
  observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      console.log('get value')
      return val
    },
    set: function reactiveSetter(newVal) {
      console.log('change value')
      //对属性进行新增属性，如data.obj.a = 'a'
      observe(newVal)
      val = newVal
    }
  })
} 

```

以上代码简单的实现了如何监听数据的 `set` 和 `get` 的事件，但是仅仅如此是不够的，还需要在适当的时候给属性添加发布订阅

```
<div>
    {{name}}
</div> 

```

在解析如上模板代码时，遇到 `{{name}}` 就会给属性 `name` 添加发布订阅。

```js
// 通过 Dep 解耦
class Dep {
  constructor() {
    this.subs = []
  }
  addSub(sub) {
    // sub 是 Watcher 实例
    this.subs.push(sub)
  }
  notify() {
    this.subs.forEach(sub => {
      sub.update()
    })
  }
}
// 全局属性，通过该属性配置 Watcher
Dep.target = null

function update(value) {
  document.querySelector('div').innerText = value
}

class Watcher {
  constructor(obj, key, cb) {
    // 将 Dep.target 指向自己
    // 然后触发属性的 getter 添加监听
    // 最后将 Dep.target 置空
    Dep.target = this
    this.cb = cb
    this.obj = obj
    this.key = key
    this.value = obj[key]
    Dep.target = null
  }
  update() {
    // 获得新值
    this.value = this.obj[this.key]
    // 调用 update 方法更新 Dom
    this.cb(this.value)
  }
}
var data = { name: 'yck' }
observe(data)
// 模拟解析到 `{{name}}` 触发的操作
new Watcher(data, 'name', update)
// update Dom innerText
data.name = 'yyy'  

```

接下来,对 `defineReactive` 函数进行改造

```
function defineReactive(obj, key, val) {
  // 递归子属性
  observe(val)
  let dp = new Dep()
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      console.log('get value')
      // 将 Watcher 添加到订阅
      if (Dep.target) {
        dp.addSub(Dep.target)
      }
      return val
    },
    set: function reactiveSetter(newVal) {
      console.log('change value')
      val = newVal
      // 执行 watcher 的 update 方法
      dp.notify()
    }
  })
} 

```

以上实现了一个简易的双向绑定，核心思路就是手动触发一次属性的 getter 来实现发布订阅的添加。

 

### 1. Vue 的响应式原理

如果面试被问到这个问题，又描述不清楚，可以直接画出 Vue 官方文档的这个图，对着图来解释效果会更好。 

 Vue 的响应式是通过 `Object.defineProperty Object.defineProperty``observe``getter``setter``watcher``getter``setter  watcher`



### 2. Object.defineProperty有哪些缺点？

这道题目也可以问成 “为什么vue3.0使用proxy实现响应式？” 其实都是对Object.defineProperty 和 proxy实现响应式的对比。

1. `Object.defineProperty` 只能劫持对象的属性，而 `Proxy` 是直接代理对象
   由于 `Object.defineProperty` 只能对属性进行劫持，需要遍历对象的每个属性，计算量大。而 `Proxy` 可以直接代理对象。
2. `Object.defineProperty` 对新增属性需要手动进行 `Observe`， 由于 `Object.defineProperty` 劫持的是对象的属性，所以新增属性时，需要重新遍历对象，对其新增属性再使用 `Object.defineProperty` 进行劫持。 也正是因为这个原因，使用 Vue 给 `data` 中的数组或对象新增属性时，需要使用 `vm.$set` 才能保证新增的属性也是响应式的。Vue.set
3. `Proxy` 支持13种拦截操作，这是 `defineProperty` 所不具有的。
4. 新标准性能红利
   `Proxy` 作为新标准，长远来看，JS引擎会继续优化 `Proxy` ，但 `getter` 和 `setter` 基本不会再有针对性优化。
5. `Proxy` 兼容性差 目前并没有一个完整支持 `Proxy` 所有拦截方法的Polyfill方案 

### 3. Vue中如何检测数组变化？

Vue 的 `Observer` 对数组做了单独的处理，对数组的方法进行编译，并赋值给数组属性的 `__proto__` 属性上，因为原型链的机制，找到对应的方法就不会继续往上找了。编译方法中会对一些会增加索引的方法（`push`，`unshift`，`splice`）进行手动 observe。  

```
const oldArrayProperty = Array.prototype
const arrObject = Object.create(oldArrayProperty)
['push', 'pop', 'shift', 'unshift', 'splice'].forEach(methodName => {
	arrObject[methodName] = function() {
		updateView()
		oldArrayProperty[methodName].call(this, ...arguments)
	} 
})

```

### 5. nextTick是做什么用的，其原理是什么?

能回答清楚这道问题的前提，是清楚 EventLoop 过程。
 在下次 DOM 更新循环结束后执行延迟回调，在修改数据之后立即使用 `nextTick` 来获取更新后的 DOM。
 `nextTick` 对于 micro task 的实现，会先检测是否支持 `Promise`，不支持的话，直接指向 macro task，而 macro task 的实现，优先检测是否支持 `setImmediate`（高版本IE和Etage支持），不支持的再去检测是否支持 MessageChannel，如果仍不支持，最终降级为 `setTimeout` 0；
 默认的情况，会先以 `micro task` 方式执行，因为 micro task 可以在一次 tick 中全部执行完毕，在一些有重绘和动画的场景有更好的性能。
 但是由于 micro task 优先级较高，在某些情况下，可能会在事件冒泡过程中触发，导致一些问题(可以参考 Vue 这个 issue：[github.com/vuejs/vue/i…](https://github.com/vuejs/vue/issues/6556))，所以有些地方会强制使用 macro task （如 `v-on`）。

> 注意：之所以将 `nextTick` 的回调函数放入到数组中一次性执行，而不是直接在 `nextTick` 中执行回调函数，是为了保证在同一个tick内多次执行了 `nextTcik`，不会开启多个异步任务，而是把这些异步任务都压成一个同步任务，在下一个tick内执行完毕。

### 6. Vue 的模板编译原理

vue模板的编译过程分为3个阶段：

1. 第一步：解析
   将模板字符串解析生成 AST，生成的AST 元素节点总共有 3 种类型，1 为普通元素， 2 为表达式，3为纯文本。
2. 第二步：优化语法树
   Vue 模板中并不是所有数据都是响应式的，有很多数据是首次渲染后就永远不会变化的，那么这部分数据生成的 DOM 也不会变化，我们可以在 patch 的过程跳过对他们的比对。此阶段会深度遍历生成的 AST 树，检测它的每一颗子树是不是静态节点，这对运行时对模板的更新起到极大的优化作用。
3. 生成代码

```
const code = generate(ast, options)  
```

通过 `generate` 方法，将ast生成 `render` 函数。 更多关于 AST，Vue 模板编译原理，以及和 AST 相关的 Babel 工作原理等，我在 [掌握了AST，再也不怕被问babel，vue编译，Prettier等原理](https://mp.weixin.qq.com/s?__biz=Mzg2NTA4NTIwNA==&mid=2247485010&idx=1&sn=8a5a46a10f7ea706ef41592359a646a4&chksm=ce5e3429f929bd3f48fc6f6c85226aac672dd8236a203ec97977fbc0330a39c7f0883b634cc0&token=1424393752&lang=zh_CN#rd) 中做了详细介绍。

### 7. v-for 中 key 的作用是什么？

清晰回答这道问题，需要先清楚 Vue 的 diff 过程 

`key` 是给每个 `vnode` 指定的唯一 `id`，在同级的 `vnode`  diff 过程中，可以根据 `key` 快速的对比，来判断是否为相同节点

利用 `key` 的唯一性可以生成 `map` 来更快的获取相应的节点。

另外指定 `key` 后，就不再采用“就地复用”策略了，可以保证渲染的准确性。

### 8. 为什么 v-for 和 v-if 不建议用在一起

`v-for` 的优先级比 `v-if` 更高，这意味着 `v-if` 将分别重复运行于每个 `v-for` 循环中。如果要遍历的数组很大，而真正要展示的数据很少时，这将造成很大的性能浪费。
 这种场景建议使用 `computed`，先对数据进行过滤。 

## mixin

#### 问题

变量来源不明确，不利于阅读。多mixin可能造成命名冲突，生命周期函数不会冲突，数据同名会冲突。mixin和组件可能出现多对多的关系，复杂度高 。存在新开组件的开销。

