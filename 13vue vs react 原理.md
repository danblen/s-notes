因为 JSX 的表达能力比 template 更强。JSX 表达能力的上限是 JS 语言本身，而 template 表达能力的上限是 Vue 的各种指令如 v-if v-for v-bind ..

如果用 template 要怎么做呢？只能用 slot。然后在 slot 里面使用 v-if v-for，想声明个[中间变量](https://www.zhihu.com/search?q=中间变量&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A"1840709783"})都难，既然这样的话，为什么我不直接用 JS 的 if 和 for 呢？至少还有[语法检查](https://www.zhihu.com/search?q=语法检查&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A"1840709783"})和类型提示（虽然 template 说也会做这样的提示，但始终没有 JS 的提示完备） 

JSX 的好处之一就是可以把组件/标签当做普通属性传来传去，而 template 只能使用 slot  

## 核心差异

- **Vue 和 React 的核心差异，以及核心差异对后续设计产生的“不可逆”影响**
- **Vue 和 React 在 API 设计风格和哲学理念上的不同**
- **Vue 和 React 在工程化预编译构建阶段，AOT 和 JIT 优化的本质差异和设计**

React是用来解决一个大型应用的数据变更的问题。里面有可能有大量的交互与状态管理，层次结构有可能也很深，样式可能与逻辑有着千丝万缕的关系（比如动画与手势），使用模版的思路就会有大量的绑定，这是很难维护的。所以react 跳出来说，模版与逻辑的分离未必分离了关注点，而很可能只是分离了技术，然后尝试着用 js 解决一切，做到视图组件的高内聚。 

react函数式的组件不需要每个组件都需要暴露出去，在一个文件里可以创建多个子组件，加上函数式组件这样很容易的把一些小的组件单独抽出来，在编写大的业务组件的时候方便管理，有些组件可能并不需要暴露出来，只需export出外面需要的主组件，这样可以减少文件数量，当文件多的时候构建工具需要监听更多的文件，更多的性能消耗，页面的构建速度会减慢

**双向绑定是对表单来说的，表单的双向绑定，说到底不过是 value 的单向绑定 + onChange** 事件侦听的一个语法糖。

**单向数据流不是 Vue 或者 React 的差别，而是 Vue 和 React 的共同**默契**选择。**单向数据流核心是考虑组件的未来可复用性，它强调把 state hoist 出来进行集中管理。

**真正我认为 React 和 Vue 在理念上的差别，且对后续设计实现产生不可逆影响的是：**Vue 进行数据拦截/代理，它对侦测数据的变化更敏感、更精确，也间接对一些后续实现（比如 hooks，function based API）提供了很大的便利。这个我们后面会提到；React 推崇函数式，它直接进行**局部重新刷新（或者重新渲染）**，这样更粗暴，但是更简单。**但是 React 并不知道什么时候“应该去刷新”，触发局部重新变化是由开发者手动调用 setState** **完成。**

#### 更新dom

React setState 引起局部重新刷新。为了达到更好的性能，React 暴漏给开发者 shouldComponentUpdate 这个生命周期 hook，来避免不需要的重新渲染。可以创·建一个继承React.PureComponent的React组件，它自带`shouldComponentUpdate`，但只能对props进行浅比较。需要进行深拷贝，创建一个新的对象或数组，将原对象的各项属性的"值"（数组的所有元素）拷贝过来，是"值"而不仅仅是"引用地址"。我们可以使用slice()方法：

```text
ew_state.todos = new_state.todos.slice();
```

或者引入immutable库来实现数据不可变。

**React 对数据变化毫无感知，它就提供 React.createElement 调用已生成 virtual dom**）。

**React 为了弥补不必要的更新，会对 setState** **的行为进行合并操作**。**因此 setState 有时候会是异步更新，但并不是总是“异步”。** Vue 的响应式理念，进行数据拦截和代理中不存在类似问题（当然也有 batch 的操作）。

**Vue 由于采用依赖追踪，默认就是优化状态：你动了多少数据，就触发多少更新，不多也不少**。但是当数据特别多的时候vue中的watcher也会特别多，从而造成页面卡顿。

**这个设计上的差别，直接影响了 hooks 的实现和表现。**

#### Hooks

React hook 底层是基于链表（Array）实现，每次组件被 render 的时候都会顺序执行所有的 hooks，因为底层是链表，每一个 hook 的 next 是指向下一个 hook 的，所以要求开发者不能在不同 hooks 调用中使用判断条件，因为 if 会导致顺序不正确，从而导致报错。 

相反，vue hook 只会被注册调用一次**，vue 之所以能避开这些麻烦的问题，根本原因在于它对数据的管理是基于响应式的，是对数据进行了代理的。他不需要链表进行 hooks 记录，它对数据直接代理观察。**

**但是 Vue 这种响应式的方案，也有自己的困扰。**比如 useState() （实际上 evan 命名为 value()）返回的是一个 value wrapper （包装对象）。一个包装对象只有一个属性：.value ，该属性指向内部被包装的值。**我们知道在 JavaScript 中，原始值类型如 string 和 number 是只有值，没有引用的。不管是使用 Object.defineProperty 还是 Proxy，我们无法追踪原始变量后续的变化。**因此 Vue 不得不返回一个包装对象，不然对于基本类型，它无法做到数据的代理和拦截 。

#### 设计理念

React 事件系统庞大而复杂。其中，它暴漏给开发者的事件不是原生事件，是 React 包装过合成事件，并且**非常重要的一点是，合成事件是池化**的。也就是说不同的事件，可能会共享一个合成事件对象。另外一个细节是，React 对所有事件都进行了代理，将所有事件都绑定 document 上。

- React 中事件处理函数中**的 this 默认不指向组件实例。**Vue 相反
- vue事件系统（.stop .prevent ...)

**从事件 API** **上我们就能看出前端框架在设计的一个不同思路： React 设计是改变开发者，提供强大而复杂的机制，开发者按照react来；Vue 是适应开发者，让开发者怎么爽怎么来。**

#### 预编译优化问题 

Vue3.0 提出的动静结合的 DOM diff 思想，**我个人认为是 Vue 近几年在“创新”上的一个很好体现。**之所以能够做到动静结合的 DOM diff，或者把这个问题放的更大：之所以能够做到预编译优化，是因为 Vue core 可以静态分析 template，在解析模版时，整个 parse 的过程是利用正则表达式顺序解析模板，当解析到开始标签、闭合标签、文本的时候都会分别执行对应的回调函数，来达到构造 AST 树的目的。 

Vue 需要做数据双向绑定，需要进行数据拦截或代理，那它就需要在预编译阶段静态分析模版，分析出视图依赖了哪些数据，进行响应式处理。

而 React 就是局部重新渲染，React 拿到的或者说掌管的，**所负责的就是一堆递归 React.createElement** **的执行调用，它无法从模版层面进行静态分析。 **因此 React JSX 过度的灵活性导致运行时可以用于优化的信息不足。

但是，**在 React 框架之外，我们作为开发者还是可以通过工程化手段达到类似的目的，**因为我们能够接触到 JSX 编译成 React.createElement 的整个过程。开发者在项目中开发 babel 插件，实现 JSX 编译成 React.createElement，那么优化手段就是是从编写 babel 插件开始。

**prepack, fiber 时间分片, concurrentMode**: 尤雨溪说过（可能也是玩笑，说者无意，也可能是我没有幽默感，认真解读了）：“**React 是伤害已经造成，无法自身在预编译阶段做到更多，时间分片这样的优化只是在弥补伤害**”。







在快速占山头的那个阶段，vue确实快，轻巧，很多项目上手就干，浮浮沉沉两三个月就下线。但是现在互联网泡沫该挤的挤，都不是以前那样追求快就是好了，你会发现现在很多产品维护周期变长了，更多需要关注持续迭代复杂度的上涨的管理，以及调试的时候更加方便溯源，在这一点上，折腾过react的人不知不觉也会有所成长，天生的不可变数据的思路也更加容易追踪错误，反过来vue的数据操作太过灵活，怎么搞都行，这就导致团队的增长必然会使代码各式各样，改动起来非常痛苦，没怎么关注规范这一块，一味地图快持续性就糟糕了一些啊。加上有一些开发，他只关注能不能实现需求，压根不考虑团队协作，这就使得灵活的vue变成了一种屎山生成器，不开玩笑，我真的怕了

vue的语法使用上符合国人习惯，使用门槛低一些，在国内用的多。引入一个script就可以使用了

Vue 在 update 性能优化方面需要的心智负担可能少那么一点 —— React 如果不注意，容易导致过多的组件无用 diff，但是实际上真正会遇到性能瓶颈的应用也是少数

Vue 3 会比 Vue 2 快不少，加上模版编译还有一些可进一步发掘的优化空间

Facebook这样的体量的公司，在 infrastructure 层面获得质的提升，收益是巨大的，而且 Facebook 的工程师们能力很强，改变他/她们的习惯并不是什么问题。而对外推广，则是一种大公司才有的 “改变业界” 的底气。

.sync： 在有些情况下，我们可能需要对一个 prop 进行“双向绑定”。不幸的是，真正的双向绑定会带来维护上的问题，因为子组件可以变更父组件，且在父组件和子组件两侧都没有明显的变更来源。大型应用中使用单向绑定让数据流易于理解

JSX语法：因为是真正的JavaScript，拥有这个语言本身的所有的能力，可以进行复杂的逻辑判断，进行选择性的返回最终要返回的DOM结构，能够实现一些在模板的语法限制下，很难做到的一些事情。

vue得利于其 template 模版语法，可以在编译时做很多 React 要花很大力气才能做到的事情，比如：

> 在 React 应用中，当某个组件的状态发生变化时，它会以该组件为根，重新渲染整个组件子树。如要避免不必要的子组件的重渲染，你需要在所有可能的地方使用 `PureComponent`，或是手动实现 `shouldComponentUpdate` 方法。同时你可能会需要使用不可变的数据结构来使得你的组件更容易被优化。然而，使用 `PureComponent` 和 `shouldComponentUpdate` 时，需要保证该组件的整个子树的渲染输出都是由该组件的 props 所决定的。如果不符合这个情况，那么此类优化就会导致难以察觉的渲染结果不一致。这使得 React 中的组件优化伴随着相当的心智负担。在 Vue 应用中，组件的依赖是在渲染过程中自动追踪的，所以系统能精确知晓哪个组件确实需要被重渲染。你可以理解为每一个组件都已经自动获得了 `shouldComponentUpdate`，并且没有上述的子树问题限制。Vue 的这个特点使得开发者不再需要考虑此类优化，从而能够更好地专注于应用本身。

在 Vue3 中，`Block Tree` 和 `PatchFlags` 便是充分利用编译信息并在 `Diff` 阶段所做的优化。诸如此类，Vue 很轻松的降低使用者门槛。React 虽不可否认提供了很多很前言的创造性思想，比如 Time Slicing、Fiber、Hooks 等等... 对于新手来说，确实理解成本上会有一定限制



**错误地把制约性能的地方定位在diff而不是patch**

React的reconciliation（调和）是一个过程，描述的是React如何将virtual dom转化成actual dom的实现，为甚么要用virtual dom？因为document.createElement方法有性能损失（浏览器机制）。

局限在React框架下的朋友，很容易就得出结论——

**document.createElement有性能损失，所以肯定要做virtual dom到actual dom之间的变更检测，并使得变更的部分能够被识别出来，然后用create和delete的api修改真实DOM。**

实现的结果是这样的：

1. 首先setState函数告诉组件我要更新了，这个方法会把state放入状态队列中，如果一个事件循环状态队列没有更新，则视为不会更新，否者，更新组件（virtaul dom），并标记为脏（这部分不是reconciliation）。
2. 当前virtual dom有脏节点，怎么办？react从当前节点出发，**向下遍历所有子节点和子组件。**找到变更的部分，patch（conmmit）也就是调用createElement或者removeElement或者重新赋值。当然这个遍历过程是有算法优化的，也就是diff算法，优化有：比较同级节点，比较节点类型——比如component编程了string，比较空和非空等等，将O(n3)的问题优化为近似O(n)的问题。（这就是reconciliation）

这样做有什么好处？

1. 你自己随意书写变量，函数，等编程元素，只要在需要变更视图的时候，setState就可以了
2. 你可以有更多方式声明组件和节点，什么hoc啊，pure啊之类的，能够有更加灵活的编程体验，适合更多的编程范式。

这样做有什么坏处？

1. 直接setInterval(()=>{setState(...)},1)，就能发现——如果我不停地将节点标记为脏，不停地运行那个diff过程，**导致不停重绘**，当前事件循环会被阻塞——也就是卡。
2. setState导致你在编程过程中，虽然不用考虑类似getElement，removeElement之类的操作，但是setState无形之中还是用两个”树“制约了你的思想，也就是React惯性思维的一种——一定要等数据都变更完成了再渲染啊？
3. 脏节点以下所有子组件都要渲染，如果页面大了，顶层数据一改变，diff的工作量就会变大，也会导致大量重绘，同样也会出现阻塞。

接下来，React想到一种方式优化这个操作，这个方式就是——**requestAnimationFrame**。

用过requestAnimationFrame的同学应该也深有体会，一旦将setTimeout的动画用requestAnimationFrame写，就可以很顺畅了，为什么？

因为底层逻辑不同：

1. setTimeout是将函数绑定到事件循环的底部，导致一旦线程阻塞，运行会被推迟：

![img](https://pic1.zhimg.com/50/v2-69abc306dd88cb3b6e806696707d3dae_720w.jpg?source=1940ef5c)![img](https://pic1.zhimg.com/80/v2-69abc306dd88cb3b6e806696707d3dae_1440w.jpg?source=1940ef5c)

2.而requestAnimationFrame是将帧暴露给你，当前帧内浏览器空闲就执行你的代码。

**而这个requestAnimationFrame，就是浏览器的时间分片**，有没有办法让React容易阻塞的diff过程在这种机制下运行呢？

于是有了fiber这样的数据结构：

1. 将单纯的diff算法中每层的比较记录下来——以前是只标记改变的值：

```js
function FiberNode(
  tag: WorkTag,
  pendingProps: mixed,
  key: null | string,
  mode: TypeOfMode,
) {
  // Instance
  this.tag = tag;
  this.key = key;
  this.elementType = null;
  this.type = null;
  this.stateNode = null;

  // Fiber
  this.return = null;
  this.child = null;
  this.sibling = null;
  this.index = 0;

  this.ref = null;
  this.mode = mode;

  // Effects
  this.effectTag = NoEffect;
  this.nextEffect = null;

  this.firstEffect = null;
  this.lastEffect = null;
}
```

将Effect标记在fiber这样的结构中，并且他的child和sibling都已经被记录，这样变更和位于virtual dom中的位置都会被记录。

\2. 然后，用workInPregress封装fiberNode

```text
// This is used to create an alternate fiber to do work on.
export function createWorkInProgress(
  current: Fiber,
  pendingProps: any,
  expirationTime: ExpirationTime,
): Fiber {
  let workInProgress = current.alternate;
  if (workInProgress === null) {
    // We use a double buffering pooling technique because we know that we'll
    // only ever need at most two versions of a tree. We pool the "other" unused
    // node that we're free to reuse. This is lazily created to avoid allocating
    // extra objects for things that are never updated. It also allow us to
    // reclaim the extra memory if needed.
    workInProgress = createFiber(
      current.tag,
      pendingProps,
      current.key,
      current.mode,
    );
    workInProgress.elementType = current.elementType;
    workInProgress.type = current.type;
    workInProgress.stateNode = current.stateNode;
}
```

3.scheduler中实现了requestAnimationFrame一样的机制，并做了个响应式的tracing（目前他的说明是希望做平台无关的，但是源码中有浏览器相关api）。

4.在enableSchedulerTracing为真的时候，开始workingPregress的处理。

另外[ReactFiberBeginWork](https://link.zhihu.com/?target=https%3A//github.com/facebook/react/blob/master/packages/react-reconciler/src/ReactFiberBeginWork.js)，[ReactFiberCompleteWork](https://link.zhihu.com/?target=https%3A//github.com/facebook/react/blob/master/packages/react-reconciler/src/ReactFiberCompleteWork.js)，[ReactFiberCommitWork](https://link.zhihu.com/?target=https%3A//github.com/facebook/react/blob/master/packages/react-reconciler/src/ReactFiberCommitWork.js)封装了重diff到patch的全过程，使得patch的过程依然异步化。

这样就保证了React的渲染virtual dom总是能够异步地进行，将那些React的setState带来的坏处降低到用户感知不到的程度。（不过造成了新的问题，那是后话）

------

但是**肯定要做virtual dom到actual dom之间的变更检测么？**

相继出现的Vue找到了另一种优化方法——**组件响应式**。

原理是，**我为什么要把setState这样会引起性能开销的api交给用户呢**？即——为什么要用户setState的时候再进行diff呢？并且，如果我准确知道了哪一个组件会变更，我直接修改这个组件就行了，为什么还要遍历所有子组件树？

![img](https://pic1.zhimg.com/50/v2-fd0bcd12895c7aa156baf46d41121066_720w.jpg?source=1940ef5c)![img](https://pic1.zhimg.com/80/v2-fd0bcd12895c7aa156baf46d41121066_1440w.jpg?source=1940ef5c)

很快Vue给出了解决方案：

1. **不进行组件间的diff递归**，只在组件内进行diff，摒弃掉函数式组件等其他的方式，规定统一api——vue.component。
2. 用**代理模式**，将data中的值用getter和setter绑定起来，并设置响应式watcher，压入队列。如果watcher发现了变更，**启动组件内的diff**，直接将新的组件patch到dom。

![img](https://pic2.zhimg.com/50/v2-7c55b2cf9a4da86ed027d2aba61bbb40_720w.jpg?source=1940ef5c)![img](https://pic2.zhimg.com/80/v2-7c55b2cf9a4da86ed027d2aba61bbb40_1440w.jpg?source=1940ef5c)

这里的watcher回调就是**有数据变更组件的变更后virtual dom,粒度大小与优化后的一个React fiber相同**。

这样做的优点是：

1. 不需要在思维上想象diff过程，因为我修改一个组件，diff被限制在了组件内，用户的使用过程中不需要思考性能优化的问题。
2. 组建内的diff可以直接使用jsx，vue的vnode也支持了jsx的编译，可以利用React的生态。

这样做的缺点是：

1. 灵活度下降，不能支持很多编程范式（给出了强制api）。
2. 组件相关变量被限制在了data中，setState的问题相对容易察觉，但是循环修改data值虽然性能开销小得多，但是更加难以发现。但是**patch带来的性能开销依然存在**，下一步的优化方向，也有考虑使用requestAnimationFrame的方式优化watcher的绑定和组件的patch。  然后有些自以为是的React平台内的朋友，觉得Vue就该学fiber，两个问题

1. fiber是个数据结构，描述的是一次统计diff节点操作的快照。
2. 就算你说的是时间分片，你也要说时间分片，不是什么fiber！fiber不代表时间分片。

fiber是个数据结构不假，你甚至可以说fiber架构代表了用时间分片异步化diff流程以及patch流程的一种实现方式，你说fiber代表了时间分片？乖乖……

这暴露了一个问题，React社区很容易形成以自我为中心的思考方式，总结以下思维误区以供参考：

1. 一定需要virsual dom到actual dom的diffing 过程（全局的）
2. fiber和轮询调用是同义词
3. fiber和时间切片是同义词
4. 类型声明或者class就是面向对象
5. template一定要写在js中
6. shadow dom是react实现的
7. react的某些优化可以加速浏览器渲染
8. redux就是函数式
9. 数据驱动是前端的发展趋势