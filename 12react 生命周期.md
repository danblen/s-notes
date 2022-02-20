#### 初始化

**getDefaultProps**：实例化组件之后，组件的getDefaultProps钩子函数会执行

这个钩子函数的目的是为组件的实例挂载默认的属性

这个钩子函数只会执行一次，也就是说，只在第一次实例化的时候执行，创建出所有实例共享的默认属性，后面再实例化的时候，不会执行getDefaultProps，直接使用已有的共享的默认属性

理论上来说，写成函数返回对象的方式，是为了防止实例共享，但是react专门为了让实例共享，只能让这个函数只执行一次

组件间共享默认属性会减少内存空间的浪费，而且也不需要担心某一个实例更改属性后其他的实例也会更改的问题，因为组件不能自己更改属性，而且默认属性的优先级低。

**getInitialState**：为实例挂载初始状态，且每次实例化都会执行，也就是说，每一个组件实例都拥有自己独立的状态。

#### 挂载

**componentWillMount**：执行componentWillMount，相当于Vue里的created+beforeMount，这里是在渲染之前最后一次更改数据的机会，在这里更改的话是不会触发render的重新执行。

**render**：渲染dom

`render()`方法必须是一个纯函数，他不应该改变`state`，也不能直接和浏览器进行交互，应该将事件放在其他生命周期函数中。 如果`shouldComponentUpdate()`返回`false`，`render()`不会被调用。

**componentDidMount**：相当于Vue里的mounted,多用于操作真实dom

#### 更新

当组件mount到页面中之后，就进入了运行中阶段，在这里有5个钩子函数，但是这5个函数只有在数据（属性、状态）发送改变的时候才会执行

**componentWillReceiveProps(nextProps,nextState)**

当父组件给子组件传入的属性改变的时候，子组件的这个函数才会执行。初始化props时候不会主动执行

当执行的时候，函数接收的参数是子组件接收到的新参数，这个时候，新参数还没有同步到this.props上,多用于判断新属性和原有属性的变化后更改组件的状态。

**shouldComponentUpdate(nextProps,nextState)**：当属性或状态发生改变后控制组件是否要更新，提高性能,返回true就更新，否则不更新，默认返回true。

接收nextProp、nextState，根据根据新属性状态和原属性状态作出对比、判断后控制是否更新

如果`shouldComponentUpdate()`返回`false`，`componentWillUpdate`,`render`和`componentDidUpdate`不会被调用。

**componentWillUpdate**,在这里，组件马上就要重新render了，多做一些准备工作，千万千万，不要在这里修改状态，否则会死循环 相当于Vue中的beforeUpdate

**render**，重新渲染dom

**componentDidUpdate**，在这里，新的dom结构已经诞生了,相当于Vue里的updated

#### 销毁

**componentWillUnmount**

相当于Vue里的beforeDestroy，所以说一般会做一些善后的事情，例如使定时器无效，取消网络请求或清理在`componentDidMount`中创建的任何监听。

