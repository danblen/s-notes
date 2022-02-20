setState() does not always immediately update the component. It may batch or defer the update until later. This makes reading this.state right after calling setState()a potential pitfall. 

准确的用词是 **batch later** 或者 **defer**, 这种表达和我们传统上所谓的“异步”不尽相同。另外，人家用词明显是 **may**，因此我们知道这种所谓的“延迟更新”并不 cover 100% cases。换句话说，某些情况下，它也是能够马上或者“同步”完成更新的。 

setState 方法与包含在其中的执行是一个很复杂的过程，从 React 最初的版本到现在，也有无数次的修改。它的工作除了要改变 state 之外，还要负责触发重新渲染，这里面要经过 React 核心 diff 算法，最终才能决定是否要进行重渲染，以及如何渲染。而且为了批次与效能的理由，多个 setState 操作有可能在执行过程中还需要被合并，所以它被设计以延后的来进行执行是相当合理的。  

<img src="https://pic2.zhimg.com/50/v2-fa6a58770b478806afec2ac7f3230050_720w.jpg?source=1940ef5c" alt="img" style="zoom: 80%;" />

在 React 的 setState 函数实现中，会根据一个变量 isBatchingUpdates 判断是直接更新 this.state 还是放到队列中延后处理，而 isBatchingUpdates 默认是 false，也就表示 setState 会同步更新 this.state，但是，有一个函数 batchedUpdates，这个函数会把 isBatchingUpdates 修改为 true，而当 React 在调用事件处理函数之前就会调用这个 batchedUpdates。 

**由 React 控制的事件处理过程 setState 不会同步更新 this.state！**

在 **React 控制之外的情况， setState 会同步更新 this.state！**

但大部分的使用情况下，我们都是使用了 React 库中的表单组件，例如 select、input、button 等等，它们都是 React 库中人造的组件与事件，是处于 React 库的控制之下，比如组件原色 onClick 都是经过 React 包装。在这个情况下，setState 就会以异步的方式执行。 ajax的回调中执行setState也是同步的

曾经有人突发奇想，把 setState 函数 promise 风格化，全部异步执行，并返回一个 promise。这是很有意思的，并给 React 提了 PR