### 观察者模式和发布订阅模式

发布订阅模式是最常用的一种观察者模式的实现，并且从解耦和重用角度来看，更优于典型的观察者模式

在观察者模式中，观察者需要直接订阅目标事件；在目标发出内容改变的事件后，直接接收事件并作出响应

在发布订阅模式中，发布者和订阅者之间多了一个发布通道；一方面从发布者接收事件，另一方面向订阅者发布事件；订阅者需要从事件通道订阅事件

以此避免发布者和订阅者之间产生依赖关系

很多人把观察者模式和订阅模式混淆一谈，其实订阅模式有一个调度中心，对订阅事件进行统一管理。而观察者模式可以随意注册事件，调用事件，虽然实现原理都雷同，设计模式上有一定的差别，实际代码运用中差别在于：订阅模式中，可以抽离出调度中心单独成一个文件，可以对一系列的订阅事件进行统一管理。这样和观察者模式中的事件漫天飞就有千差万别了，在开发大型项目的时候，订阅/发布模式会让业务更清晰 

### 观察者模式

> 观察者模式，它定义了一个一对多的依赖关系，让一个或多个观察者对象监听一个主题对象。当被观察者状态发生改变时，需要通知相应的观察者，使这些观察者对象能够自动更新。

#### 主题

主题必须具备下面三个特征。

- 持有监听的观察者的引用
- 支持增加和删除观察者
- 主题状态改变，主动通知观察者

#### 观察者

当主题发生变化，收到通知后进行具体的处理

根据上面的说明，我们可以简单实现一个被观察者：

```
class Subject {
  constructor() {
    this.observerCollection = [];
  }

  registerObserver(observer){
    this.observerCollection.push(observer)
  }
  unRegisterObserver(observer){
    this.observerCollection.splice(this.observer.findIndex(observer), 1)
  }

  notifyObservers(message){
    this.observerCollection.forEach(observer => {
      observer.notify(message);
    })
  }
}
```

### 松耦合

- 观察者增加或删除无需修改主题的代码，只需调用主题对应的增加或者删除的方法即可。
- 主题只负责通知观察者，但无需了解观察者如何处理通知。
- 观察者只需等待主题通知，无需观察主题相关的细节。



## 迭代器模式（Iterator Pattern）

迭代器模式（Iterator）提供了一种方法顺序访问一个集合对象中各个元素，而又不暴露该对象的内部表示，迭代器模式可以把迭代的过程从业务逻辑中分离出来，在使用迭代器模式之后，即使不关心对象的内部构造，也可以按顺序访问其中的每个元素。

`Iterator` 的遍历过程是这样的：

1. 创建一个指针对象，指向当前数据结构的起始位置。也就是说，遍历器对象本质上，就是一个指针对象。
2. 第一次调用指针对象的`next`方法，可以将指针指向数据结构的第一个成员。
3. 第二次调用指针对象的`next`方法，指针就指向数据结构的第二个成员。
4. 不断调用指针对象的`next`方法，直到它指向数据结构的结束位置。

可参考[ES6系列--7. 可迭代协议和迭代器协议](https://juejin.im/post/6844903630802255885)中关于迭代器的介绍。

`JavaScript` 中像 `Array、Set、Map` 等都属于内置的可迭代类型, 可以通过 `iterator`方法来获取一个迭代对象，调用迭代对象的 `next` 方法将获取一个元素对象，如下示例：

```
var arr = [1, 2, 3];

var iterator = arr[Symbol.iterator]();

iterator.next();
// { value: 1, done: false }
iterator.next();
// { value: 2, done: false }
iterator.next();
// { value: 3, done: false }
iterator.next();
// { value: undefined, done: true }
```

遍历迭代器可以使用下面的方法。

```
while(true) {
  let result;
  try {
    result = iterator.next();
  } catch (error) {
    handleError(error); // 错误处理
  }
  if (result.done) {
    handleCompleted(); // 已完成之后的处理
  }
  doSomething(result.value);
}
```

上面的代码主要对应三种情况：

- 获取下一个值（next）：调用`next`方法可以将元素一个个的返回，这样就支持了返回多次值。
- 已完成（complete）：当没有更多值时，next返回元素中的`done`为`true`。
- 错误处理（error）：当 `next` 方法执行时报错，则会抛出 `error` 事件，所以可以用 `try catch` 包裹 `next` 方法处理可能出现的错误。 

Angular 使用可观察对象作为处理各种常用异步操作的接口。比如：

- `EventEmitter` 类派生自 `Observable`。
- HTTP 模块使用可观察对象来处理 AJAX 请求和响应。
- 路由器和表单模块使用可观察对象来监听对用户输入事件的响应。

Angular 的 `HttpClient` 从 HTTP 方法调用中返回了可观察对象。例如，`http.get(‘/api’)` 就会返回可观察对象。相对于基于承诺（Promise）的 HTTP API，它有一系列优点：

- 可观察对象不会修改服务器的响应（和在承诺上串联起来的 `.then()` 调用一样）。反之，你可以使用一系列操作符来按需转换这些值。
- HTTP 请求是可以通过 `unsubscribe()` 方法来取消的。
- 请求可以进行配置，以获取进度事的变化。
- 失败的请求很容易重试。  





ReactiveX combines the `Observer pattern` with the `Iterator pattern` and `functional programming` with collections to fill the need for an ideal way of managing sequences of events.

### 函数式编程

一种编程范式(`programming paradigm`)，就像`Object-oriented Programming(OOP)`

函数式编程关心数据的映射，命令式编程关心解决问题的步骤

核心思想就是做运算处理，并用function 来思考问题

#### 函式为一等公民(First Class)

所谓一等公民是指跟其它对象具有同等的地位，也就是说函数能够被赋值给变量，也能够被当作参数传入另一个函数，也可当作一个函数的返回值。

```
// 函数能够被赋值给变量
var hello = function() {}

// 函数当作参数传入另一个函数
fetch('www.google.com')
.then(function(response) {}) // 匿名 function 被傳入 then()

// 当作一个函数的返回值
var a = function(a) {
	return function(b) {
	  return a + b;
	}; 
}
复制代码
```

#### Expression, no Statement

都是表达式(`Expression`)不会是语句(Statement)。 基本区分表达式与语句：

- 表达式是一个运算过程，一定会有返回值，例如执行一个`function`, 声明一个变量。
- 语句则是表现某个行为，例如赋值给一个变量， for循环，if判断

#### 纯函数（Pure Function）

相同的输入，永远会得到相同的输出，没有可观察的副作用 

`slice`和`splice`

`Functional Programming` 强调没有副作用，也就是`function` 要保持纯粹，只做运算并返回一个值，没有其他额外的行为。

常见的副作用：

- 更改文件系统
- 发送一个 http 请求
- 可变数据（random）
- 打印/log
- 获取用户输入
- DOM 查询

概括来讲，只要是跟函数外部环境发生的交互就都是副作用——这一点可能会让你怀疑无副作用编程的可行性。函数式编程的哲学就是假定副作用是造成不正当行为的主要原因, 这并不是说，要禁止使用一切副作用，而是说，要让它们在可控的范围内发生。

### 函数式编程优势

- 可读性高:  代码简洁
- 可维护性高: 执行结果不依赖外部状态，这使得单元测试和调试都更容易
- 易于并行处理: 由于不共享外部状态，不会造成资源争用

