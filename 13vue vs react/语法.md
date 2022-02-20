# react对比vue

1. **声明式的Vue上手更加简单（对象映射template，直观），开发效率高，但是api更多，约束也更多**。
2. **React上手偏难一点点（命令式反直觉），开发效率要低一点，但是api少，约束也少，更加灵活**。状态管理方面React要丰富一点，毕竟消息驱动是它的根，状态管理就是它的命，不可能不重视。

但是两者数据驱动实现不同，React是传统消息驱动模式，setState通知变更检测，Vue是proxy模式。

实现不同，必然导致编程风格的差异：

1. getter，setter对用户不可见，必然会隐藏很多渲染细节，好处是让用户更专注于逻辑部分，坏处是渲染时间和运算不可控。setState虽然需要用户手动进行，暴露了一些细节，但是用户权限更多，对性能的控制更强。
2. Vue的jsx只能实现模板的组装（比如你想要动态注入一段jsx，只能像iview一样写render函数了），本质和html一样，React的jsx能实现更多的技巧。既Vue结构确定，是一种声明式的v-vm映射工具，而React更偏命令式一点，是一种由vm驱动v的工具（hooks的发布更加坐实了这一点）。

react修改数据会重新创建新的数据进行赋值

vue在针对组件数据上，vue2.0通过`Object.defineProperty`对数据做到了更细致的监听，精准实现组件级别的更新。

react当组件调用setState或props变化的时候，组件内部render会重新渲染，子组件也会随之重新渲染，可以通过`shouldComponentUpdate`或者`PureComponent`可以避免不必要的重新渲染（个人感觉这一点上不如vue做的好）。

### react

react推荐使用jsx或者js文件来表示组件，react支持class组件和function组件2种形式 。

> 注意： 组件名称必须以大写字母开头。React 会将以小写字母开头的组件视为原生 DOM 标签。 

## 4.数据管理(props、data vs state)

组件数据管理通常包含2部分，来自父组件的数据props与自身的数据。

vue与react中的props都是单向数据流的，父级prop的更新会向下流动到子组件中，但是反过来则不行。prop可以是数组或对象，用于接收来自父组件的数据。

### vue

#### data

vue中使用data来管理组件的数据，vue 将会递归将 data 的属性转换为 getter/setter，从而让 data 的属性能够响应数据变化。对象必须是纯粹的对象 (含有零个或多个的 key/value 对)。一旦观察过，不需要再次在数据对象上添加响应式属性。因此推荐在创建实例之前，就声明所有的根级响应式属性。

当一个组件被定义，data必须声明为返回一个初始数据对象的函数。

```
export default {
  name: 'NewComponent',
  data() {
    return {
      name: 'xxx',
      age: 12
    }
  }
}

```

当需要在组件内部修改数据时，可以直接通过vue实例修改：

```
  methods: {
    changeName() {
      this.name = 'new Name';
    }
  }

```

### react

#### props

react中的props也与vue一样可以传递静态或动态props，静态props一般传递字符串。

函数组件和class组件都可以使用props，函数组件使用props参数获取父组件传下来的props。

函数组件获取props：

```
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

const element = <Welcome name="Sara" />;


```

class组件使用`this.props`获取组件`props`：

```
class Welcome extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { name } = this.props;
    return <div>{name}</div>;
  }
}


```

动态props：

```
<Welcome name={name} />
```

#### state

react中使用state来管理组件内的数据，hooks的出现使得`函数组件`也具备管理state的能力。

##### class组件state

class组件在构造函数（constructor）中定义组件内数据（state），修改数据必须通过setState修改，不能直接修改state，这点非常重要。

class组件使用state：

```
class Welcome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'xx'
    };
    this.changeName = this.changeName.bind(this);
  }

  changeName() {
    this.setState({
      name: 'new name'
    });
  }

  render() {
    const { name } = this.state;
    return <div onClick={this.changeName}>{name}</div>;
  }
}
```

关于class组建的setState有以下两点说明：

- 1.setState更新是异步的，但是**在setTimeout和原生事件中是同步的**。
- 2.setState更新的是组件的部分数据，react会自动将数据合并。

当需要使用上一个state值时，可以让 setState() 接收一个函数而不是一个对象。这个函数用上一个 state 作为第一个参数，将此次更新被应用时的 props 做为第二个参数：

```
this.setState((state, props) => ({
  counter: state.counter + props.increment
}));
```

##### function组件useState

react 16.0之前函数组件只是纯的渲染组件，hooks的出现赋予了函数组件管理state的能力。

useState返回一个state，以及更新state的函数。如果新的 state 需要通过使用先前的 state 计算得出，那么可以将函数传递给 setState。该函数将接收先前的 state，并返回一个更新后的值。

```
import React, { useState } from 'react';

function Counter({initialCount}) {
  const [count, setCount] = useState(initialCount);
  return (
    <>
      Count: {count}
      <button onClick={() => setCount(initialCount)}>Reset</button>
      <button onClick={() => setCount(prevCount => prevCount - 1)}>-</button>
      <button onClick={() => setCount(prevCount => prevCount + 1)}>+</button>
    </>
  );
}
```

> 关于setState有以下三点说明：
>
> - 1.与 class 组件中的 setState 方法不同，useState 不会自动合并更新对象。
> - 2.只能在函数最外层调用 Hook。不要在循环、条件判断或者子函数中调用。
> - 3.只能在 React 的函数组件或自定义hook中调用 Hook。不要在其他 JavaScript 函数中调用。

## 5.组件数据交互 

### 父子组件数据交互(props+自定义事件 vs props+回调)

对于父子组件数据交互，vue中使用prop+`$emit`自定义事件实现，react通过props+`回调`实现。

#### vue

vue中父组件通过props传递数据给子组件，子组件使用`$emit`触发自定义事件，父组件中监听子组件的自定义事件获取子组件传递来的数据。

#### react

react中父组件使用props传递数据和回调函数给子组件，子组件通过props传下来的回调函数返回数据，父组件通过回调函数获取子组件传递上来的数据。     

### 跨组件数据交互(provide/inject vs Context)

vue和react都支持跨组件传递数据，vue中主要通过`provide / inject`实现，react中主要通过`Context`实现。

#### vue

vue中通过`provide / inject`在祖先组件向所有子孙后代注入一个依赖，不论组件层次有多深，并在起上下游关系成立的时间里始终生效。

祖先组件中定义provide选项，provide选项应该是一个对象或返回一个对象的函数。

```
<template>
  <div>
    <new-component @myEvent="getName"></new-component>
  </div>
</template>

<script>
import NewComponent from './NewComponent';

export default {
  provide: { // 定义provide选项
    message: 'This is a big news'
  },
  components: {
    NewComponent
  },
  data() {
    return {}
  },
  methods: {
    getName(name) {
      console.log(name)
    }
  }
}
</script> 
```

子组件通过inject选项获取祖先组件的provide选项值，inject选项应该是一个字符串数组或者对象。

```
<template>
  <div>{{message}}</div>
</template>

<script>
export default {
  name: 'Children',
  inject: ['message'],
  data() {
    return {}
  }
}
</script> 
```

> 注意：provide 和 inject 绑定并不是可响应的。这是刻意为之的。然而，如果你传入了一个可监听的对象，那么其对象的属性还是可响应的。

#### react

Context 提供了一个无需为每层组件手动添加 props，就能在组件树间进行数据传递的方法。

在父组件创建一个Context对象，通过`Context.provider`的value属性向消费组件传值。

```
import React, { useState } from 'react';

// 创建Context对象
const MyContext = React.createContext({ theme: 'black' });

function Parent() {
  const changeName = name => {
    console.log(name);
  };
  // Context.provider向消费组件传值
  return (<MyContext.Provider value={{ theme: 'white' }}>
    <Children myEvent={changeName}></Children>;
  </MyContext.Provider>); 
} 
```

消费组件获取Context有2种方式：

（1）class组件通过contextType获取最近Context上的那个值。

```
class DeepChildren1 extends React.Component {
  constructor(props) {
    super(props);
  }

  static contextType = MyContext;

  render() {
    return <div>{this.context.theme}123</div>;
  }
} 
```

（2）函数式组件通过`Context.Consumer`订阅到Context的变更。

```
function DeepChildren(props) {
  return (<MyContext.Consumer>
    {
      (value) => (
        <div>{value.theme}</div>
      )
    }
  </MyContext.Consumer>);
} 
```

关于Context需要注意：

> 当Provider的父组件进行重渲染时，consumers组件会重新渲染，并且没有办法避免，应该尽量避免使用Context。

## 6.class与style

关于class与style处理上，vue与react也存在较大差异。

### vue

vue对class与style特意做了增强，可以传字符串、对象、数组。

#### class

（1）给class绑定字符串：

```
<div class="hello"></div> 
```

（2）给class绑定对象：

```
<div
  class="static"
  :class="{ active: isActive, 'text-danger': hasError }"
></div> 
```

data如下：

```
data: {
  isActive: true,
  hasError: false
} 
```

HTML 将被渲染为:

```
<div class="static active"></div> 
```

（3）给class绑定数组：

```
<div :class="[activeClass, errorClass]"></div> 
```

data如下：

```
data: {
  activeClass: 'active',
  errorClass: 'text-danger'
} 
```

HTML 将被渲染为:

```
<div class="active text-danger"></div> 
```

（4）class还可以直接绑定到组件上，这一点react并不支持。

声明组件如下：

```
Vue.component('my-component', {
  template: '<p class="foo bar">Hi</p>'
}) 
```

在使用它的时候添加一些 class：

```
<my-component class="baz boo"></my-component> 
```

HTML 将被渲染为:

```
<p class="foo bar baz boo">Hi</p>
```

#### style

style用来绑定内联样式，支持传对象、数组，使用需要添加浏览器引擎前缀的 CSS 属性时，如 transform，Vue.js 会自动侦测并添加相应的前缀。

（1）传对象，CSS 属性名可以用驼峰式 (camelCase) 或短横线分隔 (kebab-case，记得用引号括起来) 来命名：

```
<div :style="{ color: activeColor, fontSize: fontSize + 'px' }"></div> 

```

data如下：

```
data: {
  activeColor: 'red',
  fontSize: 20
} 
```

HTML将被渲染为：

```
<div style="color: red; font-size: 20px;"></div> 
```

（2）传数组将多个样式应用到同一个元素上

```
<div :style="[baseStyles, overridingStyles]"></div> 
```

data如下：

```
baseStyles: {
  fontSize: '20px',
  color: 'blue'
},
overridingStyles: {
  height: '80px'
} 
```

HTML将被渲染为：

```
<div style="font-size: 20px; color: blue; height: 80px;"></div> 
```

### react

react使用className用于指定css的class，react中不能直接为组件指定class。

#### className

react中className一般传值字符串常量或者字符串变量，不能传递数组或者对象语法。

（1）传字符串常量：

```
function NewComponent() {
  return <div className="container" >This is New Component.</div>;
} 
```

（2）传字符串变量：

```
function NewComponent() {
  const newClass = 'conrainer'
  return <div className={newClass}>This is New Component.</div>;
} 
```

（3）传递多个class，可以使用es6的模板字符串实现：

```
function NewComponent() {
  const newClass = 'conrainer'
  return <div className={`${newClass} new-container`}>This is New Component.</div>;
}  
```

当需要传递数组或者对象语法时，可以引入classnames库实现：

```
import classNames from 'classnnames';

function NewComponent() {
  const newClass = 'container';
  return <div className={classNames(newClass, 'newContainer', { bar: true }, ['new-class', { c: true }])}>This is New Component.</div>;
} 
```

html将被渲染为：

```
<div class="container newContainer bar new-class c">This is New Component.</div> 
```

#### style

通常不推荐将 style 属性作为设置元素样式的主要方式。在多数情况下，应使用 className 属性来引用外部 CSS 样式表中定义的 class。style 在 React 应用中多用于在渲染过程中添加动态计算的样式。

style接收一个对象

```
const divStyle = {
  color: 'blue',
  backgroundImage: 'url(' + imgUrl + ')',
};

function HelloWorldComponent() {
  return <div style={divStyle}>Hello World!</div>;
}
```

注意：样式不会自动补齐前缀。如需支持旧版浏览器，请手动补充对应的样式属性：

```
const divStyle = {
  WebkitTransition: 'all', // note the capital 'W' here
  msTransition: 'all' // 'ms' is the only lowercase vendor prefix
};

function ComponentWithTransition() {
  return <div style={divStyle}>This should work cross-browser</div>;
}
```



## 7.生命周期

组件的生命周期一般包含：初始化、挂载、更新、卸载四个大阶段

### vue

vue生命周期包含:

- beforeCreate 
  实例组件刚创建，元素DOM和数据都还没有初始化，暂时不能在这个周期里面进行任何操作。
- created 
  数据data已经初始化完成，方法也已经可以调用，但是DOM未渲染。调用后台接口获取数据可以在这个阶段完成。
- beforeMount 
  DOM未完成挂载，数据也初始化完成，但是数据的双向绑定还是显示{{}}，虚拟DOM结构已经生成。
- mounted 
  数据和DOM都完成挂载，在上一个周期占位的数据把值给渲染进去。这个周期适合执行初始化需要操作DOM的方法。
- beforeUpdate 
  页面数据改变了都会触发，在更新前触发，此时的数据还是未更新前的数据，没有数据改变则不执行。
- updated 
  页面数据改变都会触发，在更新完成之后触发，此时的数据是更新后的数据。

> 注意：在这里操作数据很容易引起卡死。

- beforeDestroy 
  组件销毁之前执行，在这个周期里仍然可以访问data和method，多组件间通信需要发布信息时可以在该阶段完成。
- destroyed 
  当离开组件对应页面时组件销毁时触发，主要用于取消一些副作用（取消事件监听、取消定时器、取消不必要的请求等）

### react 

#### 16.0之前

react16.0之前生命周期如下： 

（1）初始化

- constructor 
  是class组件的默认方法，常用来初始化state或者设置属性等。

```
class Counter extends React.component{
    constructor(props){
        super(props); // 声明constructor时必须调用super方法
        this.state = {
          count: 0
        };
        this.color = 'red';
    }
}
```

（2）挂载阶段

- componentWillMount() 
  组件挂载之前调用，并且只会调用一次。
- render 
  render是一个React组件必须定义的生命周期函数，用来渲染DOM。 并必须 return 一个React元素（描述组件，即UI），不负责组件实际渲染工作，之后由React自身根据此元素去渲染出页面DOM。

> 不要在render里面修改state,会引起死循环导致卡死。

- componentDidMount() 
  组件挂在完成之后调用，在这个阶段可以获取真实dom元素，常用来发起异步请求获取数据。

（3）更新阶段

当通过setState修改state或父组件重新render引起props更新，都会引起子组件的重新render。

- componentWillReceiveProps(nextProps) 
  props发生变化以及父组件重新渲染时都会触发该生命周期函数。在该阶段可以通过参数nextProps获取变化后的props参数， 通过this.props访问之前的props。该生命周期内可以进行setState。
- shouldComponentUpdate(nextProps,nextState) 
  组件每次setState或者父组件重新render都会引起子组件render，可以使用该钩子比较nextProps，nextState及当前组件的this.props，this.state的状态用来判断是否需要重新渲染。默认返回true，需要重新render，返回false则不触发渲染。

> 一般我们通过该钩子来优化性能，避免子组件不必要的渲染。

- componentWillUpdate(nextProps, nextState) 
  当组件收到新的 props 或 state 时，会在渲染之前调用。使用此作为在更新发生之前执行准备更新的机会。初始渲染不会调用此方法。

> 注意：不能在此方法中调用`this.setState`

- componentDidUpdate(prevProps, prevState) 此方法在组件更新后被调用。首次渲染不会执行此方法。当组件更新后，可以在此处对DOM进行操作。

> 注意：可以在`componentDidUpdate()`中直接调用`setState()`，但是它必需被包裹在一个条件语句里，否则会导致死循环。

（4）卸载阶段

- componentWillUnmount() 
  会在组件卸载及销毁之前直接调用。在此方法中执行必要的清理操作，例如，清除 timer，取消网络请求或清除在`componentDidMount()` 中创建的订阅等。

> 注意：componentWillUnmount() 中不应调用 setState()，因为该组件将永远不会重新渲染。

#### 16.0之后

react 16.0之后移除的生命周期函数：

- componentWillMount
- componentWillReceiveProps
- componentWillUpdate

但是为了向下兼容，react并未删除这三个生命周期，新增以 `UNSAFE_` 前缀为别名的三个函数 `UNSAFE_componentWillMount()`、`UNSAFE_componentWillReceiveProps()`、`UNSAFE_componentWillUpdate()`。

新增的生命周期函数：

- static getDerivedStateFromProps(nextProps, prevState)
- getSnapshotBeforeUpdate(prevProps, prevState)

生命周期如下：

> 总结： 
> （1）初始化阶段保持不变 
> （2）挂载阶段： 
> getDerivedStateFromProps => render => componentDidMount 
> （3）更新阶段 
> getDerivedStateFromProps => shoudeComponentUpdate => render => getSnapshotBeforeUpdate => componentDidUpdate 
> （4）卸载阶段保持不变

接下来重点介绍getDerivedStateFromProps、getSnapshotBeforeUpdate两个方法。

（1）static getDerivedStateFromProps(props, state)

getDerivedStateFromProps 会在调用 render 方法之前调用，并且在初始挂载及后续更新时都会被调用。它应返回一个对象来更新 state，如果返回 null 则不更新任何内容。

> 当state的值在任何时候都取决于props的时候适用该方法。

示例如下：

```
class ScrollingList extends React.Component {
  constructor(props) {
    super(props);
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.type !== prevState.type) {
        return {
            type: nextProps.type,
        };
    }
    return null;
  }
  render() {
    return (
      <div>{/* ...contents... */}</div>
    );
  }
}
```

（2）getSnapshotBeforeUpdate(prevProps, prevState)

getSnapshotBeforeUpdate() 在最近一次渲染输出（提交到 DOM 节点）之前调用。它使得组件能在发生更改之前从 DOM 中捕获一些信息（例如，滚动位置）。此生命周期的任何返回值将作为参数传递给 `componentDidUpdate()`。此用法并不常见，但它可能出现在 UI 处理中，如需要以特殊方式处理滚动位置的聊天线程等。应返回 snapshot 的值（或 null）。

示例如下：

```
class ScrollingList extends React.Component {
  constructor(props) {
    super(props);
    this.listRef = React.createRef();
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    // 我们是否在 list 中添加新的 items ？
    // 捕获滚动位置以便我们稍后调整滚动位置。
    if (prevProps.list.length < this.props.list.length) {
      const list = this.listRef.current;
      return list.scrollHeight - list.scrollTop;
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // 如果我们 snapshot 有值，说明我们刚刚添加了新的 items，
    // 调整滚动位置使得这些新 items 不会将旧的 items 推出视图。
    //（这里的 snapshot 是 getSnapshotBeforeUpdate 的返回值）
    if (snapshot !== null) {
      const list = this.listRef.current;
      list.scrollTop = list.scrollHeight - snapshot;
    }
  }

  render() {
    return (
      <div ref={this.listRef}>{/* ...contents... */}</div>
    );
  }
}
```



## 8.事件处理(@Click vs onClick)

vue与react在针对事件处理上的用法上也有较大不同。

### vue

vue中使用 v-on 指令监听 DOM 事件，并在触发时运行一些 JavaScript 代码。通常使用v-on接收一个需要调用的方法名称。

（1）直接绑定方法，不传任何参数，回调函数参数是浏览器事件event对象。

event是原生 MouseEvent

示例：

```
<div  @click="greet">Greet</div>
```

method：

```
  methods: {
    greet(event) {
      console.log(event);
    }
  }
```

（2）内联调用方法

示例：

```
<div  @click="greet('hello')">Greet</div>
```

method:

```
methods: {
  greet(message) {
    this.message = message;
  }
}
```

有时也需要在method中访问原生DOM事件，可以将$event显式传入method中。

```
<div  @click="greet('hello', $event)">Greet</div> 
```

method:

```
methods: {
  greet(message, event) {
    this.message = message;
  }
} 
```

（3）事件修饰符和按键修饰符

Vue.js为事件添加了事件修饰符和按键修饰符（个人感觉这个是vue做的很好的点，让用户更加聚焦数据逻辑，无需花费更多的精力处理DOM事件细节）。

Ⅰ. 事件修饰符

在事件处理程序中调用 event.preventDefault() 或 event.stopPropagation() 是非常常见的需求。为了解决这个问题，Vue.js 为 v-on 提供了事件修饰符，修饰符是由点开头的指令后缀来表示的。

- .stop：阻止事件继续传播
- .prevent：阻止事件默认行为
- .capture：添加事件监听器时使用事件捕获模式
- .self：当前元素触发时才触发事件处理函数
- .once：事件只触发一次
- .passive：告诉浏览器你不想阻止事件的默认行为，不能和.prevent一起使用。

示例：

```
<!-- 阻止单击事件继续传播 -->
<a v-on:click.stop="doThis"></a>

<!-- 提交事件不再重载页面 -->
<form v-on:submit.prevent="onSubmit"></form>

<!-- 修饰符可以串联 -->
<a v-on:click.stop.prevent="doThat"></a>

<!-- 只有修饰符 -->
<form v-on:submit.prevent></form>

<!-- 添加事件监听器时使用事件捕获模式 -->
<!-- 即内部元素触发的事件先在此处理，然后才交由内部元素进行处理 -->
<div v-on:click.capture="doThis">...</div>

<!-- 只当在 event.target 是当前元素自身时触发处理函数 -->
<!-- 即事件不是从内部元素触发的 -->
<div v-on:click.self="doThat">...</div>

<!-- 点击事件将只会触发一次 -->
<a v-on:click.once="doThis"></a>

<!-- 滚动事件的默认行为 (即滚动行为) 将会立即触发 -->
<!-- 而不会等待 `onScroll` 完成  -->
<!-- 这其中包含 `event.preventDefault()` 的情况 --
<div v-on:scroll.passive="onScroll">...</div> 
```

Ⅱ. 按键修饰符

在监听键盘事件时，我们经常需要检查详细的按键。Vue 允许为 v-on 在监听键盘事件时添加按键修饰符。 你可以直接将 KeyboardEvent.key 暴露的任意有效按键名转换为 kebab-case 来作为修饰符。

① 按键码 
 Vue 提供了绝大多数常用的按键码的别名

- .enter
- .tab
- .delete (捕获“删除”和“退格”键)
- .esc
- .space
- .up
- .down
- .left
- .right

使用 keyCode 特性也是允许的：

```
<input v-on:keyup.13="submit"> 
```

② 系统修饰键 
 可以用如下修饰符来实现仅在按下相应按键时才触发鼠标或键盘事件的监听器。

- .ctrl
- .alt
- .shift
- .meta

③ .exact 修饰符 
 .exact 修饰符允许你控制由精确的系统修饰符组合触发的事件。

```
<!-- 有且只有 Ctrl 被按下的时候才触发 -->
<button @click.ctrl.exact="onCtrlClick">A</button> 
```

④ 鼠标按钮修饰符 
 这些修饰符会限制处理函数仅响应特定的鼠标按钮。

- .left
- .right
- .middle

> 关于v-on处理事件的好处： 
> 1.扫一眼 HTML 模板便能轻松定位在 JavaScript 代码里对应的方法。 
> 2.因为你无须在 JavaScript 里手动绑定事件，你的 ViewModel 代码可以是非常纯粹的逻辑，和 DOM 完全解耦，更易于测试。 
> 3.当一个 ViewModel 被销毁时，所有的事件处理器都会自动被删除。你无须担心如何清理它们。

### react

React 元素的事件处理和 DOM 元素的很相似，但是有一点语法上的不同:

- React 事件的命名采用小驼峰式（camelCase），而不是纯小写。
- 使用 JSX 语法时你需要传入一个函数作为事件处理函数，而不是一个字符串。

（1）事件处理程序不传参数

在class组件中使用回调函数，需要显式绑定this或者使用箭头函数。

不传参数时，默认参数是e，这是一个合成事件。React 根据 W3C 规范来定义这些合成事件，所以你不需要担心跨浏览器的兼容性问题。

> 在React中不能通过返回false的方式阻止默认行为，你必须显式的使用preventDefault。

显示绑定this：

```
class NewComponent extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this); // 显示绑定this.handleClick
  }

  handleClick(e) {
    e.preventDefault();
    console.log(e.target);
  }

  render() {
    return <div onClick={this.handleClick}>Click me</div>;
  }
} 
```

箭头函数：

```
class NewComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  handleClick = (e) => {
    e.preventDefault();
    console.log(e.target);
  };

  render() {
    return <div onClick={this.handleClick}>Click me</div>;
  }
} 
```

（2）事件处理程序传递参数

通常我们会为事件处理函数传递额外的参数，有两种方式向事件处理函数传递参数：

Ⅰ. 箭头函数传递参数 
通过箭头函数的方式，事件对象e必需显示的进行传递。

```
class NewComponent extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e, message) {
    e.preventDefault();
    console.log(message);
  };

  render() {
    return <div onClick={(e) => this.handleClick(e, 'hello')}>Click me</div>;
  }
} 
```

Ⅱ. 通过bind形式传递参数 
 e作为第二个参数传递，事件对象以及更多的参数将会被隐式的传递。

```
class NewComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  handleClick(message, e) { // e作为第二个参数
    e.preventDefault();
    console.log(message);
  };

  render() {
    return <div onClick={this.handleClick.bind(this, 'hello')}>Click me</div>;
  }
} 
```


 Proxy 与 Object.defineProperty 对比

`Object.defineProperty` 虽然已经能够实现双向绑定了，但是他还是有缺陷的。

1. 只能对属性进行数据劫持，所以需要深度遍历整个对象
2. 对于数组不能监听到数据的变化

虽然 Vue 中确实能检测到数组数据的变化，但是其实是使用了 hack 的办法，并且也是有缺陷的。

```
const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)
// hack 以下几个函数
const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
methodsToPatch.forEach(function (method) {
  // 获得原生函数
  const original = arrayProto[method]
  def(arrayMethods, method, function mutator (...args) {
    // 调用原生函数
    const result = original.apply(this, args)
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    if (inserted) ob.observeArray(inserted)
    // 触发更新
    ob.dep.notify()
    return result
  })
}) 
```

反观 Proxy 就没以上的问题，原生支持监听数组变化，并且可以直接对整个对象进行拦截，所以 Vue 也将在下个大版本中使用 Proxy 替换 Object.defineProperty

```
let onWatch = (obj, setBind, getLogger) => {
  let handler = {
    get(target, property, receiver) {
      getLogger(target, property)
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      setBind(value);
      return Reflect.set(target, property, value);
    }
  };
  return new Proxy(obj, handler);
};

let obj = { a: 1 }
let value
let p = onWatch(obj, (v) => {
  value = v
}, (target, property) => {
  console.log(`Get '${property}' = ${target[property]}`);
})
p.a = 2 // bind `value` to `2`
p.a // -> Get 'a' = 2 
```

### 虚拟 DOM

虚拟 DOM 涉及的内容很多，具体可以参考我之前 [写的文章](https://juejin.im/post/5b10dd36e51d4506e04cf802)

### 路由鉴权

- 登录页和其他页面分开，登录以后实例化 Vue 并且初始化需要的路由
- 动态路由，通过 addRoute 实现

### Vue 和 React 区别

- Vue 表单支持双向绑定开发更方便
- 改变数据方式不同，setState 有使用坑
- props Vue 可变，React 不可变
- 判断是否需要更新 React 可以通过钩子函数判断，Vue 使用依赖追踪，修改了什么才渲染什么
- React 16以后 有些钩子函数会执行多次
- React 需要使用 JSX，需要 Babel 编译。Vue 虽然可以使用模板，但是也可以通过直接编写 render 函数不需要编译就能运行。
- 生态 React 相对较好

 React 生命周期

在 V16 版本中引入了 Fiber 机制。这个机制一定程度上的影响了部分生命周期的调用，并且也引入了新的 2 个 API 来解决问题。

在之前的版本中，如果你拥有一个很复杂的复合组件，然后改动了最上层组件的 `state`，那么调用栈可能会很长

调用栈过长，再加上中间进行了复杂的操作，就可能导致长时间阻塞主线程，带来不好的用户体验。Fiber 就是为了解决该问题而生。

Fiber 本质上是一个虚拟的堆栈帧，新的调度器会按照优先级自由调度这些帧，从而将之前的同步渲染改成了异步渲染，在不影响体验的情况下去分段计算更新。

对于如何区别优先级，React 有自己的一套逻辑。对于动画这种实时性很高的东西，也就是 16 ms 必须渲染一次保证不卡顿的情况下，React 会每 16 ms（以内） 暂停一下更新，返回来继续渲染动画。

对于异步渲染，现在渲染有两个阶段：`reconciliation` 和 `commit` 。前者过程是可以打断的，后者不能暂停，会一直更新界面直到完成。

**Reconciliation** 阶段

- `componentWillMount`
- `componentWillReceiveProps`
- `shouldComponentUpdate`
- `componentWillUpdate`

**Commit** 阶段

- `componentDidMount`
- `componentDidUpdate`
- `componentWillUnmount`

因为 `reconciliation` 阶段是可以被打断的，所以 `reconciliation` 阶段会执行的生命周期函数就可能会出现调用多次的情况，从而引起 Bug。所以对于 `reconciliation` 阶段调用的几个函数，除了 `shouldComponentUpdate` 以外，其他都应该避免去使用，并且 V16 中也引入了新的 API 来解决这个问题。

`getDerivedStateFromProps` 用于替换 `componentWillReceiveProps` ，该函数会在初始化和 `update` 时被调用

```
class ExampleComponent extends React.Component {
  // Initialize state in constructor,
  // Or with a property initializer.
  state = {};

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.someMirroredValue !== nextProps.someValue) {
      return {
        derivedData: computeDerivedState(nextProps),
        someMirroredValue: nextProps.someValue
      };
    }

    // Return null to indicate no change to state.
    return null;
  }
} 
```

`getSnapshotBeforeUpdate` 用于替换 `componentWillUpdate` ，该函数会在 `update` 后 DOM 更新前被调用，用于读取最新的 DOM 数据。

#### V16 生命周期函数用法建议

```
class ExampleComponent extends React.Component {
  // 用于初始化 state
  constructor() {}
  // 用于替换 `componentWillReceiveProps` ，该函数会在初始化和 `update` 时被调用
  // 因为该函数是静态函数，所以取不到 `this`
  // 如果需要对比 `prevProps` 需要单独在 `state` 中维护
  static getDerivedStateFromProps(nextProps, prevState) {}
  // 判断是否需要更新组件，多用于组件性能优化
  shouldComponentUpdate(nextProps, nextState) {}
  // 组件挂载后调用
  // 可以在该函数中进行请求或者订阅
  componentDidMount() {}
  // 用于获得最新的 DOM 数据
  getSnapshotBeforeUpdate() {}
  // 组件即将销毁
  // 可以在此处移除订阅，定时器等等
  componentWillUnmount() {}
  // 组件销毁后调用
  componentDidUnMount() {}
  // 组件更新后调用
  componentDidUpdate() {}
  // 渲染组件函数
  render() {}
  // 以下函数不建议使用
  UNSAFE_componentWillMount() {}
  UNSAFE_componentWillUpdate(nextProps, nextState) {}
  UNSAFE_componentWillReceiveProps(nextProps) {}
} 
```

### setState

`setState` 在 React 中是经常使用的一个 API，但是它存在一些问题，可能会导致犯错，核心原因就是因为这个 API 是异步的。

首先 `setState` 的调用并不会马上引起 `state` 的改变，并且如果你一次调用了多个 `setState` ，那么结果可能并不如你期待的一样。

```
handle() {
  // 初始化 `count` 为 0
  console.log(this.state.count) // -> 0
  this.setState({ count: this.state.count + 1 })
  this.setState({ count: this.state.count + 1 })
  this.setState({ count: this.state.count + 1 })
  console.log(this.state.count) // -> 0
} 
```

第一，两次的打印都为 0，因为 `setState` 是个异步 API，只有同步代码运行完毕才会执行。`setState` 异步的原因我认为在于，`setState` 可能会导致 DOM 的重绘，如果调用一次就马上去进行重绘，那么调用多次就会造成不必要的性能损失。设计成异步的话，就可以将多次调用放入一个队列中，在恰当的时候统一进行更新过程。

第二，虽然调用了三次 `setState` ，但是 `count` 的值还是为 1。因为多次调用会合并为一次，只有当更新结束后 `state` 才会改变，三次调用等同于如下代码

```
Object.assign(  
  {},
  { count: this.state.count + 1 },
  { count: this.state.count + 1 },
  { count: this.state.count + 1 },
) 
```

当然你也可以通过以下方式来实现调用三次 `setState` 使得 `count` 为 3

```
handle() {
  this.setState((prevState) => ({ count: prevState.count + 1 }))
  this.setState((prevState) => ({ count: prevState.count + 1 }))
  this.setState((prevState) => ({ count: prevState.count + 1 }))
} 
```

如果你想在每次调用 `setState` 后获得正确的 `state` ，可以通过如下代码实现`回调`

```
handle() {
    this.setState((prevState) => ({ count: prevState.count + 1 }), () => {
        console.log(this.state)
    })
} 
```

### Vue的 nextTick 原理

`nextTick` 可以让我们在下次 DOM 更新循环结束之后执行延迟回调，用于获得更新后的 DOM。

在 Vue 2.4 之前都是使用的 microtasks，但是 microtasks 的优先级过高，在某些情况下可能会出现比事件冒泡更快的情况，但如果都使用 macrotasks 又可能会出现渲染的性能问题。所以在新版本中，会默认使用 microtasks，但在特殊情况下会使用 macrotasks，比如 v-on。 

对于实现 macrotasks ，会先判断是否能使用 `setImmediate` ，不能的话降级为 `MessageChannel` ，以上都不行的话就使用 `setTimeout`

```
if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  macroTimerFunc = () => {
    setImmediate(flushCallbacks)
  }
} else if (
  typeof MessageChannel !== 'undefined' &&
  (isNative(MessageChannel) ||
    // PhantomJS
    MessageChannel.toString() === '[object MessageChannelConstructor]')
) {
  const channel = new MessageChannel()
  const port = channel.port2
  channel.port1.onmessage = flushCallbacks
  macroTimerFunc = () => {
    port.postMessage(1)
  }
} else {
  /* istanbul ignore next */
  macroTimerFunc = () => {
    setTimeout(flushCallbacks, 0)
  }
} 
```

`nextTick` 同时也支持 Promise 的使用，会判断是否实现了 Promise

```
export function nextTick(cb?: Function, ctx?: Object) {
  let _resolve
  // 将回调函数整合进一个数组中
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx)
      } catch (e) {
        handleError(e, ctx, 'nextTick')
      }
    } else if (_resolve) {
      _resolve(ctx)
    }
  })
  if (!pending) {
    pending = true
    if (useMacroTask) {
      macroTimerFunc()
    } else {
      microTimerFunc()
    }
  }
  // 判断是否可以使用 Promise 
  // 可以的话给 _resolve 赋值
  // 这样回调函数就能以 promise 的方式调用
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve
    })
  }
} 
```

