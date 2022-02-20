## 前言 🤔

- `React` 是单向数据流，数据通过 `props` 从父节点传递到子节点。如果顶层的某个 `props` 改变了， `React` 会重新渲染所有的子节点。注意⚠️：`props` 是只读的（即不可以使用 `this.props` 直接修改 `props`），它是用于在整个组件树中传递数据和配置。
- 每个组件都有属于自己的 `state`，`state` 和 `props` 的区别在于 `state` 只存在于组件内部。注意 ⚠️：只能从当前组件调用 `this.setState` 方法修改 `state` 值（不可以直接修改 `this.state`）。
- 可见，更新子组件有两种方式，一种是改变子组件自身的 `state` 值，另一种则是更新子组件从父组件接收到的 `this.props`值从而达到更新。
- 在 `React` 项目开发过程中，我们大多时候需要让组件共享某些数据。一般来说，我们可以通过在组件间传递数据（通过 `props` ）的方式实现数据共享，然而，当数据需要在非父子关系的组件间传递时操作起来则变得十分麻烦，而且容易让代码的可读性降低，这时候我们就需要使用 `state`（状态）管理工具。
- 常见的状态管理工具有 `redux`，`mobx`。由于 `redux` 提供了状态管理的整个架构，并有着清晰的约束规则，适合在大型多人开发的应用中使用。本文介绍的是如何在 `React` 项目中使用 `redux` 进行状态管理。

## 进入正题 🥰

- 本节主要介绍 `redux` 和 `react-router` 相关的基础知识 📖和相关配置 👩🏾‍💻。

### redux

#### 基本概念

- ```
  redux
  ```

   适用于多交互、多数据源的场景。从组件角度看，如果我们的应用有以下场景，则可以考虑在项目中使用 

  ```
  redux
  ```

  ：

  > - 某个组件的状态，需要共享
  > - 某个状态需要在任何地方都可以拿到
  > - 一个组件需要改变全局状态
  > - 一个组件需要改变另一个组件的状态

- 当我们的应用符合以上提到的场景时，若不使用 `redux` 或者其他状态管理工具，不按照一定规律处理状态的读写，项目代码的可读性将大大降低，不利于团队开发效率的提升。

- 如上图所示，`redux` 通过将所有的 `state` 集中到组件顶部，能够灵活的将所有 `state` 各取所需地分发给所有的组件。

- ```
  redux
  ```

   的三大原则：

  - 整个应用的 `state` 都被存储在一棵 `object tree` 中，并且 `object tree` 只存在于唯一的 `store` 中（这并不意味使用 `redux` 就需要将所有的 `state` 存到 `redux` 上，组件还是可以维护自身的 `state` ）。
  - `state` 是只读的。`state` 的变化，会导致视图（`view`）的变化。用户接触不到 `state`，只能接触到视图，唯一改变 `state` 的方式则是在视图中触发`action`。`action`是一个用于描述已发生事件的普通对象。
  - 使用 `reducers` 来执行 `state` 的更新。 `reducers` 是一个纯函数，它接受 `action` 和当前  `state` 作为参数，通过计算返回一个新的 `state` ，从而实现视图的更新。

![redux工作流程](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/13/16e638d85c974466~tplv-t2oaga2asx-watermark.awebp)

- 如上图所示，

  ```
  redux
  ```

   的工作流程大致如下：

  - 首先，用户在视图中通过 `store.dispatch` 方法发出 `action`。
  - 然后，`store` 自动调用 `reducers`，并且传入两个参数：当前 `state` 和收到的 `action`。`reducers` 会返回新的 `state` 。
  - 最后，当`store` 监听到 `state` 的变化，就会调用监听函数，触发视图的重新渲染。


#### API

##### store

- `store` 就是保存数据的地方，整个应用只能有一个 `store`。
- `redux` 提供 `createStore` 这个函数，用来创建一个 `store` 以存放整个应用的 `state`：

```
import { createStore } from 'redux';
const store = createStore(reducer, [preloadedState], enhancer);
复制代码
```

- 可以看到，`createStore` 接受 `reducer`、初始 `state`（可选）和增强器作为参数，返回一个新的 `store` 对象。

##### state

- `store` 对象包含所有数据。如果想得到某个时点的数据，就要对 `store` 生成快照。这种时点的数据集合，就叫做 `state`。
- 如果要获取当前时刻的 `state`，可以通过 `store.getState()` 方法拿到：

```
import { createStore } from 'redux';
const store = createStore(reducer, [preloadedState], enhancer);

const state = store.getState();
复制代码
```

##### action

- `state` 的变化，会导致视图的变化。但是，用户接触不到 `state`，只能接触到视图。所以，`state` 的变化必须是由视图发起的。
- `action` 就是视图发出的通知，通知`store`此时的 `state` 应该要发生变化了。
- `action` 是一个对象。其中的 `type` 属性是必须的，表示 `action` 的名称。其他属性可以自由设置，社区有一个规范可以参考：

```
const action = {
  type: 'ADD_TODO',
  payload: 'Learn Redux' // 可选属性
};
复制代码
```

- 上面代码定义了一个名称为 `ADD_TODO` 的 `action`，它携带的数据信息是 `Learn Redux`。

##### Action Creator

- `view` 要发送多少种消息，就会有多少种 `action`，如果都手写，会很麻烦。
- 可以定义一个函数来生成 `action`，这个函数就称作 `Action Creator`，如下面代码中的 `addTodo` 函数：

```
const ADD_TODO = '添加 TODO';

function addTodo(text) {
  return {
    type: ADD_TODO,
    text
  }
}

const action = addTodo('Learn Redux');
复制代码
```

- `redux-actions` 是一个实用的库，让编写 `redux` 状态管理变得简单起来。该库提供了 `createAction` 方法用于创建动作创建器：

```
import { createAction } from "redux-actions"

export const INCREMENT = 'INCREMENT'
export const increment = createAction(INCREMENT)
复制代码
```

- 上边代码定义一个动作 

  ```
  INCREMENT
  ```

  , 然后通过 

  ```
  createAction
  ```

   创建了对应 

  ```
  Action Creator
  ```

  ：

  - 调用 `increment()` 时就会返回 `{ type: 'INCREMENT' }`
  - 调用`increment(10)`返回 `{ type: 'INCREMENT', payload: 10 }`

##### store.dispatch()

- `store.dispatch()` 是视图发出 `action` 的唯一方法，该方法接受一个 `action` 对象作为参数：

```
import { createStore } from 'redux';
const store = createStore(reducer, [preloadedState], enhancer);

store.dispatch({
  type: 'ADD_TODO',
  payload: 'Learn Redux'
});
复制代码
```

- 结合 `Action Creator`，这段代码可以改写如下：

```
import { createStore } from 'redux';
import { createAction } from "redux-actions"
const store = createStore(reducer, [preloadedState], enhancer);

const ADD_TODO = 'ADD_TODO';
const add_todo = createAction('ADD_TODO'); // 创建 Action Creator

store.dispatch(add_todo('Learn Redux'));
复制代码
```

##### reducer

- `store` 收到 `action` 以后，必须给出一个新的 `state`，这样视图才会进行更新。`state` 的计算（更新）过程则是通过 `reducer` 实现。
- `reducer` 是一个函数，它接受 `action` 和当前 `state` 作为参数，返回一个新的 `state`：

```
const reducer = function (state, action) {
  // ...
  return new_state;
};
复制代码
```

- 为了实现调用 `store.dispatch` 方法时自动执行 `reducer` 函数，需要在创建 `store` 时将将 `reducer` 传入 `createStore` 方法：

```
import { createStore } from 'redux';
const reducer = function (state, action) {
  // ...
  return new_state;
};
const store = createStore(reducer);
复制代码
```

- 上面代码中，`createStore` 方法接受 `reducer` 作为参数，生成一个新的 `store`。以后每当视图使用 `store.dispatch` 发送给 `store` 一个新的 `action`，就会自动调用 `reducer`函数，得到更新的 `state`。
- `redux-actions` 提供了 `handleActions` 方法用于处理多个 `action`：

```
// 使用方法：
// handleActions(reducerMap, defaultState)

import { handleActions } from 'redux-actions';
const initialState = { 
  counter: 0 
};

const reducer = handleActions(
  {
    INCREMENT: (state, action) => ({
      counter: state.counter + action.payload
    }),
    DECREMENT: (state, action) => ({
      counter: state.counter - action.payload
    })
  },
  initialState,
);
复制代码
```

#### 拆分、合并 reducer

- 前面提到，在一个 `react` 应用中只能有一个 `store` 用于存放应用的 `state`。组件通过调用 `action` 函数，传递数据到 `reducer`，`reducer` 根据数据更新对应的 `state`。
- 对于大型应用来说，应用的 `state` 必然十分庞大，导致 `reducer` 的复杂度也随着变大。

> 拆分

- 在这个时候，就可以考虑将 `reducer` 拆分成多个单独的函数，让每个函数负责独立管理 `state` 的一部分。

> 合并

- `redux` 提供了 `combineReducers` 辅助函数，可将独立分散的 `reducer` 合并成一个最终的 `reducer` 函数，然后在创建 `store` 时作为 `createStore` 的参数传入。
- 我们可以根据业务需要，把所有子 `reducer` 放在不同的目录下，然后在在一个文件里面统一引入，最后将合并后的 `reducer` 导出：

```
// src/model/reducers.ts
import { combineReducers } from 'redux';
import UI from './UI/reducers';
import user from './user/reducers';
import content from './content/reducers';

const rootReducer = combineReducers({
  UI,
  user,
  content,
});

export default rootReducer;
复制代码
```

#### 中间件及异步操作

- 对 `redux` 而言，同步指的是当视图发出 `action` 以后，`reducer` 立即算出 `state`（原始的`redux`工作流程），而异步指的是在 `action` 发出以后，过一段时间再执行 `reducer`。

- 同步通常发生在原生 `redux` 的工作流程中，而在大多数实际场景中，更多的是需要异步操作：`action` 发出以后，在进入 `reducer` 之前需要先完成一个异步任务，比如发送 `ajax` 请求后拿到数据后，再进入 `reducer` 执行计算并对 `state` 进行更新。

- 显然原生的 `redux` 是不支持异步操作的，这就要用到新的工具——中间件（middleware）来处理这种业务场景。从本质上来讲中间件是对 `store.dispatch` 方法进行了拓展。

- 中间件提供位于 

  ```
  action
  ```

   发起之后，到达 

  ```
  reducer
  ```

   之前的扩展点：即通过 

  ```
  store.dispatch
  ```

   方法发出的 

  ```
  action
  ```

   会依次经过各个中间件，最终到达 

  ```
  reducer
  ```

  。

  ![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/15/16e6e6ec9807208b~tplv-t2oaga2asx-watermark.awebp)

- 我们可以利用中间件来进行日志记录（`redux-logger`）、创建崩溃报告（自己写`crashReporter`）、调用异步接口（`redux-saga`）或者路由（`connected-react-router`）等操作。

- `redux` 提供了一个原生的 `applyMiddleware` 方法，它的作用是将所有中间件组成一个数组，依次执行。假如要使用 `redux-logger` 来实现日志记录功能，用法如下：

```
import { applyMiddleware, createStore } from 'redux';
import createLogger from 'redux-logger';
const logger = createLogger();

const store = createStore(
  reducer,
  applyMiddleware(logger)
);
复制代码
```

- 如果有多个中间件，则将中间件依次作为参数传入 `applyMiddleware` 方法中：

```
import { applyMiddleware, createStore } from 'redux';
import createLogger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';

const logger = createLogger(); // 日志记录
const sagaMiddleware = createSagaMiddleware(); // 调用异步接口

let middleware = [sagaMiddleware];
middleware.push(logger);

const store = createStore(
  reducer,
  // 可传initial_state
  applyMiddleware(...middleware)
);
复制代码
```

- 需要注意⚠️的是：
  - `createStore` 方法可以接受整个应用的初始状态作为参数（可选），若传入初始状态，`applyMiddleware` 则需要作为第三个参数。
  - 有的中间件有次序要求，使用前要查一下文档（如 `redux-logger`一定要放在最后，否则输出结果会不正确）。

### react-redux

#### 概念介绍

- 前面小节介绍的 `redux` 本身是一个可以结合 `react`，`vue`，`angular` 甚至是原生 `javaScript` 应用使用的状态库。

- 为了让 `redux` 帮我们管理 `react` 应用的状态，需要把 `redux` 与 `react` 连接，官方提供了[ react-redux](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Freduxjs%2Freact-redux)库（这个库是可以选用的，也可以只用`redux`）。

- ```
  react-redux
  ```

   将所有组件分成 UI 组件和容器组件两大类：

  -  UI 组件只负责 UI 的呈现，不含有状态（`this.state`），所有数据都由 `this.props` 提供，且不使用任何 `redux` 的 API。
  - 容器组件负责管理数据和业务逻辑，含有状态（`this.state`），可使用 `redux` 的 API。

- 简而言之，容器组件作为  UI 组件的父组件，负责与外部进行通信，将数据通过 `props` 传给  UI 组件渲染出视图。

- `react-redux` 规定，所有的 UI 组件都由用户提供，容器组件则是由 `react-redux` 自动生成。也就是说，用户负责视觉层，状态管理则是全部交给 `react-redux`。

#### API

##### connect 方法

- `react-redux` 提供了 `connect` 方法，用于将 UI 组件生成容器组件：

```
import { connect } from 'react-redux'

class Dashboard extends React.Component {
    ...
    // 组件内部可以获取 this.props.loading 的值
}

const mapStateToProps = (state) => {
  return {
    loading: state.loading,
  }
}

// 将通过 connect 方法自动生成的容器组件导出
export default connect(
  mapStateToProps, // 可选
  // mapDispatchToProps, // 可选
)(Dashboard)
复制代码
```

- 从上面代码可以看到，

  ```
  connect
  ```

  方法接受两个可选参数用于定义容器组件的业务逻辑：

  - `mapStateToProps` 负责输入逻辑，即将 `state` 映射成传入 UI 组件的参数（`props`）
  - `mapDispatchToProps` 负责输出逻辑，即将用户对 UI 组件的操作映射成 `action`

- 注意⚠️：当

  ```
  connect
  ```

  方法不传入任何参数时，生成的容器组件只可以看作是对 UI 组件做了一个单纯的包装，不含有任何的业务逻辑：

  - 省略 `mapStateToProps` 参数， UI 组件就不会订阅 `store`，即 `store` 的更新不会引起 UI 组件的更新。
  - 省略 `mapDispatchToProps` 参数， UI 组件就不会将用户的操作当作 `action` 发送数据给 `store`，需要在组件中手动调用 `store.dispatch` 方法。

> mapStateToProps

- `mapStateToProps` 是一个函数，它的作用就是建立一个从 `state`对象（外部）到 UI 组件 `props`对象的映射关系。该函数会订阅 整个应用的 `store`，每当 `state` 更新的时候，就会自动执行，重新计算 UI 组件的参数，从而触发 UI 组件的重新渲染。
- `mapStateToProps` 的第一个参数总是 `state` 对象，还可以使用第二个参数（可选），代表容器组件的 `props` 对象：

```
// 容器组件的代码
//    <Dashboard showType="SHOW_ALL">
//      All
//    </Dashboard>
const mapStateToProps = (state, ownProps) => {
  return {
    active: ownProps.showType === "SHOW_ALL",
    loading: state.loading,
  }
}
复制代码
```

- 使用 `ownProps` 作为参数后，如果容器组件的参数发生变化，也会引发 UI 组件重新渲染。

> mapDispatchToProps

- `mapDispatchToProps` 是 `connect` 函数的第二个参数，用来建立 UI 组件的参数到 `store.dispatch` 方法的映射。
- 由于在项目中大多使用 `mapDispatchToProps` 比较少，这里不进行细讲。关于`mapStateToProps`、`mapDispatchToProps` 和 `connect` 的更详细用法说明可以查看[文档](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Freduxjs%2Freact-redux)。

##### Provider 组件

- 使用 `connect` 方法生成容器组件以后，需要让容器组件拿到 `state` 对象，才能生成  UI 组件 的参数。
- `react-redux` 提供了 `Provider` 组件，可以让容器组件拿到 `state`，具体用法是需要用 `Provider` 组件包裹项目的根组件（如App），使得根组件所有的子组件都可以默认获取到 `state` 对象：

```
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './store/configureStore';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
复制代码
```

### react-router

- `react-router` 是完整的 `react` 的路由解决方案，它保持 `UI` 与 `URL` 的同步。在项目中我们使用的是最新的 `v4` 版。

- 需要注意⚠️的是，在开发中不应该直接安装 

  ```
  react-router
  ```

  ，因为👉：在 

  ```
  v4
  ```

   版中 

  ```
  react-router
  ```

    被划分为三个包：

  ```
  react-router
  ```

   ，

  ```
  react-router-dom
  ```

   和 

  ```
  react-router-native
  ```

  ，它们的区别如下：

  - `react-router`：提供核心的路由组件和函数。
  - `react-router-dom`：提供浏览器使用的路由组件和函数。
  - `react-router-native`：提供 `react-native` 对应平台使用的路由组件和函数。

- 当我们的 

  ```
  react
  ```

   应用同时使用了 

  ```
  react-router
  ```

   和 

  ```
  redux
  ```

  ，则可以将两者进行更深度的整合，实现：

  - 将 `router` 的数据与 `store` 进行同步，并且可以从 `store`  访问 `router` 数据，可使用 `this.props.dispatch` 方法发送 `action`。
  - 通过 `dispatch actions` 导航，个人理解是可使用 `store.dispatch(push('routerName'))` 切换路由。
  - 在 `redux devtools` 中支持路由改变的时间旅行调试。

- 想要实现以上的目标，则可以通过 

  ```
  connected-react-router
  ```

   和 

  ```
  history
  ```

   两个库进行实现，步骤如下：

  - 在创建 `store` 的文件添加配置，包括创建 `history` 对象、使用 `connected-react-router` 提供的 `connectRouter` 方法和 `history` 对象创建 `root reducer`、使用 `connected-react-router`  提供的 `routerMiddleware` 中间件和 `history` 对象实现 `dispatch actions` 导航。

  ```
  import { connectRouter, routerMiddleware } from 'connected-react-router';
  import createHistory from 'history/createBrowserHistory';
  import { createStore, applyMiddleware } from 'redux';
  import { createLogger } from 'redux-logger';
  import createSagaMiddleware from 'redux-saga';
  import reducer from '../model/reducers';
  
  export const history = createHistory();
  
  const sagaMiddleware = createSagaMiddleware(); // 调用异步接口
  let middleware = [sagaMiddleware, routerMiddleware(history)];
  const logger = createLogger(); // 日志记录
  middleware.push(logger);
  
  const initialState = {};
  
  const store = createStore(
    connectRouter(history)(reducer),
    initialState,
    applyMiddleware(...middleware)
  );
  复制代码
  ```

  - 在项目入口文件 `index.js` 中为根组件中添加配置，包括使用 `connected-react-router` 提供的 `ConnectedRouter` 组件包裹路由，将`ConnectedRouter` 组件作为`Provider`的子组，并且将在 `store` 中创建的 `history` 对象引入，将其作为 `props` 属性 传入`ConnectedRouter` 组件：

  ```
  import * as React from 'react';
  import * as ReactDOM from 'react-dom';
  import { Provider } from 'react-redux'
  import { ConnectedRouter } from 'connected-react-router'
  import App from './App'
  import rootSaga from './model/sagas';
  import { store, history } from './store/configureStore';
  
  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </Provider>,
    document.getElementById('root'),
  );
  复制代码
  ```

- 以上则完成了 `react-router` 和 `redux`的深度整合 ✌️。

## 总结 👀

- 本文介绍的是如何在 `React` 项目中使用 `redux` 进行状态管理，并对相关基础知识进行介绍和展示了完整的代码。
- 在进行业务代码开发前通常会对项目进行的一些特殊配置，有利于后期的工程开发，具体内容可参考 👉：[react + typescript 项目的定制化过程](https://juejin.cn/post/6844903922100862989#comment)。 

### 一、什么是Redux的中间件？

所谓中间件，一定是处于两个事物的中间，那么什么是Redux中间件呢？

回顾一下Redux的工作流程:

 Redux的中间件，处于Action和Reducer之间，将中间某个过程拦截一下，进行一些处理再继续正常执行，这就是中间件的功能。



那为什么要用到Redux中间件呢？

对于异步请求的代码，我们最好将它们放到Redux中间件里面。

当项目复杂到一定规模的时候，我们希望让各个模块尽可能的实行单一职责，比如React作为一个视图层的框架就只负责渲染，数据的事情统统交给Redux来处理，此时，相对于把异步请求的Ajax代码放到写到组件的componentDidMount生命周期钩子函数，其实交给Redux是一种更好的选择。另外，交给Redux,一方面能够做到不同组件的接口复用，另一方面方便于测试，单纯去测试一些异步代码比测试一个React组件的生命周期函数会更加容易。 然而Redux里面dispatch的过程中只允许传递对象，而不允许传递函数。于是，redux-thunk便应运而生。

### 二、Redux-thunk实现异步更新state

```
npm install redux-thunk --save
复制代码

```

首先在项目中启用redux-thunk

```
//src/store/index.js
import {createStore, applyMiddleware, compose} from 'redux';
import reducer from './reducer';
import thunk from 'redux-thunk'
import TodoSagas from './sagas'

//需要同时激活redux-devtools的chrome插件，下面是激活代码
//兼容代码在redux-devtools的文档下拿过来照着用即可
const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?   
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;

const enhancer = composeEnhancers(applyMiddleware(thunk))
//创建store
const store = createStore(
  reducer,
  enhancer
)

export default store;
复制代码
//src/store/actionCreators.js
//以下为getTodoList部分
export const getTodoList = () => {
  return (dispatch) => {
    axios.get('xxx').then((res) => {
      const data = res.data.list
      //创建action
      const action = initListAction(data)
      //相当于store.dispatch
      //其实redux-thunk给当前返回函数中添加的第一个默认参数就是store的dispatch方法
      dispatch(action)
    })
  }
}
复制代码
  //App.js
  componentDidMount() {
    // axios.get('xxx').then((res) => {
    //   const data = res.data.data
    //   const action = initListAction(data)
    //   store.dispatch(action)
    // })
    //将以上代码放进Redux，效果相同
    const action = getTodoList()
    store.dispatch(action)
  }
复制代码

```

因此，redux-thunk其实是拦截了store的dispatch方法，Redux中store.dispatch原本是不能传一个函数进去的，但是redux-thunk让dispatch拥有的接受函数参数的能力。具体来说，如果dispatch方法中传递的是一个对象，那么直接按照正常的Redux工作流来运行，但如果是一个函数，那么直接执行它，并把store.dispatch这个方法当作第一个参数传进这个函数。

### 三、Redux-saga实现异步更新state

redux-saga也是Redux中处理异步函数的中间件。

```
npm install redux-saga --save
复制代码

```

首先在项目中启动redux-saga:

```
//src/store/index.js
import {createStore, applyMiddleware, compose} from 'redux';
import reducer from './reducer';
import createSagaMiddleware from 'redux-saga'
import TodoSagas from './sagas'
//创建中间件
const sagaMiddleware = createSagaMiddleware()
//需要同时激活redux-devtools的chrome插件，下面是激活代码
const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?   
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;

const enhancer = composeEnhancers(applyMiddleware(sagaMiddleware))
//创建store
const store = createStore(
  reducer,
  enhancer
)
//启动中间件
sagaMiddleware.run(TodoSagas)

export default store;
复制代码
//sagas.js
import { takeEvery, put } from 'redux-saga/effects'
import { GET_INIT_LIST } from './actionTypes';
import { initListAction } from './actionCreators';
import axios from 'axios'
function* getInitList() {
  try {
    const res = yield axios.get('xxx')
    //拿到Ajax数据后，通过initListAction创建action对象
    //注意: 这是另一个action:INIT_LIST_ACTION，直接改变state中的list的值
    const action = initListAction(res.data.list)
    //put相当于dispatch这个新的action
    yield put(action)
  }catch(e) {
    console.log('网络请求失败')
  }
}
//导出的mySaga需要写成一个Generator函数，异步处理函数getInitList也应是Generator函数
function* mySaga() {
  //拦截GET_INIT_LIST这个action
  yield takeEvery(GET_INIT_LIST, getInitList);
}

export default mySaga
复制代码
  //App.js
  componentDidMount() {
    const action = getInitList()
    store.dispatch(action)
  }
复制代码

```

所以你能够看到，在redux-saga当中的处理思路是: 先抛出一个类似于信号灯的action，redux-saga看到了这个信号灯，拦截下来，然后执行响应的异步函数，在这个异步函数拿到数据后，执行真正要更新state的action。在这个过程中，作为信号灯的action在reducer中并没有具体关于state的逻辑编写，而仅仅是给redux-saga发一个信号而已。 

