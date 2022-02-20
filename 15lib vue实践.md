## 模板

### v-if 条件渲染

有时候页面上初次渲染时不要把所有组件都渲染，有些看不到的组件或不怎么使用的页面组件初次渲染时可以排除在dom树之外，在需要的时候动态去创建，这也是懒加载的思想。

v-show 则适用于需要非常频繁切换条件的场景。

### 优化无限列表性能

如果页面存在非常长或者无限滚动的列表，那么需要采用窗口化的技术来优化性能，只需要渲染少部分区域的内容，减少重新渲染组件和创建 dom 节点的时间。可以参考使用vue-virtual-scroll-list和 vue-virtual-scroller 来优化 

### 模板表达式

```
{{
  fullName.split(' ').map(function (word) {
    return word[0].toUpperCase() + word.slice(1)
  }).join(' ')
}}
```

模板中的内容应直观明了，可以将复杂的表达式重构为适当命名的组件选项，分离复杂表达式的另一个好处是可以重用这些值。

```
{{ normalizedFullName }}

computed: {
  normalizedFullName: function () {
    return this.fullName.split(' ').map(function (word) {
      return word[0].toUpperCase() + word.slice(1)
    }).join(' ')
  }
}
```

vue模板需要编译成render函数(createElement函数) ，在模板中使用比较新的js语法可能不支持

以前html和js文件是分开的，现在框架都实现了组件化，组件应做到高内聚低耦合，遵循UI = f(props)

使用模板不能定义中间变量，必须写在computed，如果使用jsx能够做到更高的内聚，使用指令大多数时候够用，但有少数情况下使用jsx更方便。模板上限是v-for、v-if各种指令，而jsx上限是js语言

### 动态指令和参数

```js
<template>
    <aButton @[someEvent]="handleSomeEvent()" :[someProps]="1000" />
</template>
<script>
  data(){
    return{
      someEvent: someCondition ? "click" : "dbclick",
      someProps: someCondition ? "num" : "price"
    }
  },
  methods: {
    handleSomeEvent(){
      // handle some event
    }
  }  
</script>
```

### 页面更新

Vue 由于采用依赖追踪，默认就是优化状态，不需要重新渲染整个组件树，你动了多少数据，就触发多少更新，不多也不少。

beforeUpdate

运行中钩子函数beforeUpdate默认是不会执行的，当数据更改的时候，才会执行。数据更新的时候，先调用beforeUpdate，然后数据更新引发视图渲染完成之后，再会执行updated。运行时beforeUpdate这个钩子函数获取的数据还是更新之前的数据（获取的是更新前的dom内容），在这个钩子函数里面，不能对数据进行更改，会造成死循环。

updated

这个钩子函数获取的数据是更新后的数据，生成新的虚拟dom，跟上一次的虚拟dom结构进行比较，比较出来差异（diff算法）后再渲染真实dom，当数据引发dom重新渲染的时候，在updated钩子函数里面就可以获取最新的真实dom了。 

$refs

关于ref注册时间的重要说明: 因为ref本身是作为渲染结果被创建的，在初始渲染的时候你不能访问它们 - 它们还不存在！**`$refs` 也不是响应式的**，因此你不应该试图用它在模版中做数据绑定。

### 状态管理

Vue2 会通过 Object.defineProperty 对数据进行劫持，来实现视图响应数据的变化。然而有些时候不需要数据是响应式，比如纯展示数据，通过 Object.freeze 冻结一个对象，在大数据量的展示时会有不少性能提升，一旦被冻结就不能被修改了。

```
export default {
  data: () => ({
    users: {}
  }),
  async created() {
    const users = await axios.get("/api/users");
    this.users = Object.freeze(users);
  }
};
```

对于响应式数据变更，属于哪个组件的响应式数据就应由哪个组件来变更，避免改变父组件传过来的props，如果想要改变父组件传过来的，使用事件触发由父组件监听并修改。在有大量响应式数据变更的场景下比较重要，试想如果使用传递一些响应式参数给某一个不熟悉的组件，只是想展示一下，结果这个组件把数据改了，可能会造成一些问题，所以对props的直接更改也不利于组件的复用。

展示型组件可通过标记functional：true使组件无状态 (没有 `data`) 和无实例 (没有 `this` 上下文)。他们用一个简单的 `render` 函数返回虚拟节点使它们渲染的代价更小。

响应式数据应尽可能少，当组件比较大响应式数据比较多的时候，如果能从源对象上取，从源对象上去可能更清晰，如果新声明一个变量可能导致变量太多，分不清是什么变量

如果子组件依赖父组件异步获取的数据，注意在子组件的特定时期、生命周期能不能拿的到，可通过v-if控制子组件的初始化时机

#### 集中/统一的状态管理

许多大型应用程序使用 Redux 或 Vuex 等状态管理工具（或者具有类似 React 中的 Context API 状态共享设置）。这意味着他们从 store 获得 props 而不是通过父级传递。在考虑组件的可重用性时，你不仅要考虑直接的父级中传递而来的 props，还要考虑 从 store 中获取到的 props。如果你在另一个项目中使用该组件，则需要在 store 中使用这些值。或许其他项目根本不使用集中存储工具，你必须将其转换为从父级中进行 props 传递 的形式。

由于将组件挂接到 store（或上下文）很容易并且无论组件的层次结构位置如何都可以完成，因此很容易在 store 和 web 应用的组件之间快速创建大量紧密耦合（不关心组件所处的层级）。通常将组件与 store 进行关联只需简单几行代码。但是请注意一点，虽然这种连接（耦合）更方便，但它的含义并没有什么不同，你也需要考虑尽量符合如同在使用父级传递方式时的要点。 

### 获取data中某一个数据的初始状态

在beforeCreate的时候就同步去拿data里的值的话，可以从this.$options.data里去拿。

有时候需要拿初始状态去计算。例如

```js
data() {
    return {
      num: 10
  },
mounted() {
    this.num = 1000
  },
methods: {
    howMuch() {
        // 计算出num增加了多少，那就是1000 - 初始值
        // 可以通过this.$options.data().xxx来获取初始值
        console.log(1000 - this.$options.data().num)
    }
  }
```

### 自定义v-model

默认情况下，v-model 是 @input 事件侦听器和 :value 属性上的语法糖。但是，你可以在你的Vue组件中指定一个模型属性来定义使用什么事件和value属性

```js
export default: {
  model: {
    event: 'change',
    prop: 'checked'  
  }
}
```

通常不建议双向绑定是因为真正的双向绑定会带来维护上的问题，因为子组件可以变更父组件，且在父组件和子组件两侧都没有明显的变更来源。

### computed 和 watch 

**computed：** 依赖其它属性值，并且有缓存，只有它依赖的属性值发生改变，下一次获取才会重新计算，所以在计算变量时使用computed比使用methods更好。可以把一个computed拆分多个方便维护。在computed中应避免改变响应式数据

**watch：** 每当监听的数据变化时都会执行回调。watch应尽量使用事件代替，少使用watch监听变量，如果一个组件watch的变量太多，不能很清楚的知道改变一个响应式数据时会执行多少代码。watch滥用会产生很多低质量代码。如果使用deep来watch一个绑定到页面上的大对象可能造成回调不必要的执行。使用immediate时，如果created等生命周期中有相同逻辑，可以考虑能不能放到watch的回调函数中

###  computed实现传参

```js
<div>{{ total(3) }}<div/>

computed: {
    total() {
      return function(n) {
          return n * this.num
         }
    },
  }
```

### watch监听一个对象部分属性

只想要a，b改变时监听到，c，d改变时不触发watch事件

```js
mounted() {
    Object.keys(this.params)
      .filter((_) => !["c", "d"].includes(_)) // 排除对c，d属性的监听
      .forEach((_) => {
        this.$watch((vm) => vm.params[_], handler, {
          deep: true,
        });
      });
  },
data() {
    return {
      params: {
        a: 1,
        b: 2,
        c: 3,
        d: 4
      },
    };
  },
watch: {
    params: {
      deep: true,
      handler() {
        this.getList;
      },
    },
  }
```

### vue生命周期hook的使用

使用定时器时一般在created中开启并在beforeDestory时清理，但是要全局声明一个变量。如果使用hook可以这样

```js
export default{
  methods:{
    fn(){
      let timer = setInterval(()=>{
        //具体执行代码
        console.log('1');
      },1000);
      this.$once('hook:beforeDestroy',()=>{
        clearInterval(timer);
        timer = null;
      })
    }
  }
}
```

父子组件使用

> 如果子组件需要在mounted时触发父组件的某一个函数，平时都会这么写：

```js
//父组件
<rl-child @childMounted="childMountedHandle"/>
method () {
  childMountedHandle() {
  	// do something...
  }
},

// 子组件
mounted () {
  this.$emit('childMounted')
},
```

> 使用hook的话可以更方便：

```js
//父组件
<rl-child @hook:mounted="childMountedHandle"/>
method () {
  childMountedHandle() {
  // do something...
  }
},
```

### 事件的销毁

Vue 组件销毁时，会自动清理它与其它实例的连接，解绑它的全部指令及事件监听器，但是仅限于组件本身的事件。 如果在 js 内使用 addEventListener 等方式是不会自动销毁的，需要在组件销毁时手动移除这些事件的监听，以免造成内存泄露

```
created() {
  addEventListener('click', this.click, false)
},
beforeDestroy() {
  removeEventListener('click', this.click, false)
}
```

### 相同的路由组件如何重新渲染

开发人员经常遇到的情况是，多个路由解析为同一个Vue组件。问题是，Vue出于性能原因，默认情况下共享组件将不会重新渲染，如果你尝试在使用相同组件的路由之间进行切换，则不会发生任何变化。

```js
const routes = [
  {
    path: "/a",
    component: MyComponent
  },
  {
    path: "/b",
    component: MyComponent
  },
];
```

如果依然想重新渲染，可以使用`key`

```js
<template>
    <router-view :key="$route.path"></router-view>
</template>
```









