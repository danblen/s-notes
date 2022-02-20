## 1、Node模块机制

### 1.1 请介绍一下node里的模块是什么

Node中，每个文件模块都是一个对象，它的定义如下：

```
function Module(id, parent) {
  this.id = id;
  this.exports = {};
  this.parent = parent;
  this.filename = null;
  this.loaded = false;
  this.children = [];
}

module.exports = Module;

var module = new Module(filename, parent);
复制代码
```

所有的模块都是 Module 的实例。可以看到，当前模块（module.js）也是 Module 的一个实例。

### 1.2 请介绍一下require的模块加载机制

这道题基本上就可以了解到面试者对Node模块机制的了解程度 基本上面试提到

- 1、先计算模块路径
- 2、如果模块在缓存里面，取出缓存
- 3、加载模块
- 4、的输出模块的exports属性即可

```
// require 其实内部调用 Module._load 方法
Module._load = function(request, parent, isMain) {
  //  计算绝对路径
  var filename = Module._resolveFilename(request, parent);

  //  第一步：如果有缓存，取出缓存
  var cachedModule = Module._cache[filename];
  if (cachedModule) {
    return cachedModule.exports;

  // 第二步：是否为内置模块
  if (NativeModule.exists(filename)) {
    return NativeModule.require(filename);
  }
  
  /********************************这里注意了**************************/
  // 第三步：生成模块实例，存入缓存
  // 这里的Module就是我们上面的1.1定义的Module
  var module = new Module(filename, parent);
  Module._cache[filename] = module;

  /********************************这里注意了**************************/
  // 第四步：加载模块
  // 下面的module.load实际上是Module原型上有一个方法叫Module.prototype.load
  try {
    module.load(filename);
    hadException = false;
  } finally {
    if (hadException) {
      delete Module._cache[filename];
    }
  }

  // 第五步：输出模块的exports属性
  return module.exports;
};
复制代码
```

接着上一题继续发问

### 1.3 加载模块时，为什么每个模块都有__dirname,__filename属性呢，new Module的时候我们看到1.1部分没有这两个属性的，那么这两个属性是从哪里来的

```
// 上面(1.2部分)的第四步module.load(filename)
// 这一步，module模块相当于被包装了，包装形式如下
// 加载js模块，相当于下面的代码（加载node模块和json模块逻辑不一样）
(function (exports, require, module, __filename, __dirname) {
  // 模块源码
  // 假如模块代码如下
  var math = require('math');
  exports.area = function(radius){
      return Math.PI * radius * radius
  }
});

复制代码
```

也就是说，每个module里面都会传入__filename, __dirname参数，这两个参数并不是module本身就有的，是外界传入的

### 1.4 我们知道node导出模块有两种方式，一种是exports.xxx=xxx和Module.exports={}有什么区别吗

- exports其实就是module.exports
- 其实1.3问题的代码已经说明问题了，接着我引用廖雪峰大神的讲解，希望能讲的更清楚

```
module.exports vs exports
很多时候，你会看到，在Node环境中，有两种方法可以在一个模块中输出变量：

方法一：对module.exports赋值：

// hello.js

function hello() {
    console.log('Hello, world!');
}

function greet(name) {
    console.log('Hello, ' + name + '!');
}

module.exports = {
    hello: hello,
    greet: greet
};
方法二：直接使用exports：

// hello.js

function hello() {
    console.log('Hello, world!');
}

function greet(name) {
    console.log('Hello, ' + name + '!');
}

function hello() {
    console.log('Hello, world!');
}

exports.hello = hello;
exports.greet = greet;
但是你不可以直接对exports赋值：

// 代码可以执行，但是模块并没有输出任何变量:
exports = {
    hello: hello,
    greet: greet
};
如果你对上面的写法感到十分困惑，不要着急，我们来分析Node的加载机制：

首先，Node会把整个待加载的hello.js文件放入一个包装函数load中执行。在执行这个load()函数前，Node准备好了module变量：

var module = {
    id: 'hello',
    exports: {}
};
load()函数最终返回module.exports：

var load = function (exports, module) {
    // hello.js的文件内容
    ...
    // load函数返回:
    return module.exports;
};

var exportes = load(module.exports, module);
也就是说，默认情况下，Node准备的exports变量和module.exports变量实际上是同一个变量，并且初始化为空对象{}，于是，我们可以写：

exports.foo = function () { return 'foo'; };
exports.bar = function () { return 'bar'; };
也可以写：

module.exports.foo = function () { return 'foo'; };
module.exports.bar = function () { return 'bar'; };
换句话说，Node默认给你准备了一个空对象{}，这样你可以直接往里面加东西。

但是，如果我们要输出的是一个函数或数组，那么，只能给module.exports赋值：

module.exports = function () { return 'foo'; };
给exports赋值是无效的，因为赋值后，module.exports仍然是空对象{}。

结论
如果要输出一个键值对象{}，可以利用exports这个已存在的空对象{}，并继续在上面添加新的键值；

如果要输出一个函数或数组，必须直接对module.exports对象赋值。

所以我们可以得出结论：直接对module.exports赋值，可以应对任何情况：

module.exports = {
    foo: function () { return 'foo'; }
};
或者：

module.exports = function () { return 'foo'; };
最终，我们强烈建议使用module.exports = xxx的方式来输出模块变量，这样，你只需要记忆一种方法。
复制代码
```

## 2、Node的异步I/O

本章的答题思路大多借鉴于朴灵大神的《深入浅出的NodeJS》

### 2.1 请介绍一下Node事件循环的流程

- 在进程启动时，Node便会创建一个类似于while(true)的循环，每执行一次循环体的过程我们成为Tick。
- 每个Tick的过程就是查看是否有事件待处理。如果有就取出事件及其相关的回调函数。然后进入下一个循环，如果不再有事件处理，就退出进程。



### 2.2 在每个tick的过程中，如何判断是否有事件需要处理呢？

- 每个事件循环中有一个或者多个观察者，而判断是否有事件需要处理的过程就是向这些观察者询问是否有要处理的事件。
- 在Node中，事件主要来源于网络请求、文件的I/O等，这些事件对应的观察者有文件I/O观察者，网络I/O的观察者。
- 事件循环是一个典型的生产者/消费者模型。异步I/O，网络请求等则是事件的生产者，源源不断为Node提供不同类型的事件，这些事件被传递到对应的观察者那里，事件循环则从观察者那里取出事件并处理。
- 在windows下，这个循环基于IOCP创建，在*nix下则基于多线程创建

### 2.3 请描述一下整个异步I/O的流程



![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/7/19/16c091766912eef7~tplv-t2oaga2asx-watermark.awebp)



## 3、V8的垃圾回收机制

### 3.1 如何查看V8的内存使用情况

使用process.memoryUsage(),返回如下

```
{
  rss: 4935680,
  heapTotal: 1826816,
  heapUsed: 650472,
  external: 49879
}
复制代码
```

heapTotal 和 heapUsed 代表V8的内存使用情况。 external代表V8管理的，绑定到Javascript的C++对象的内存使用情况。 rss, 驻留集大小, 是给这个进程分配了多少物理内存(占总分配内存的一部分) 这些物理内存中包含堆，栈，和代码段。

### 3.2 V8的内存限制是多少，为什么V8这样设计

64位系统下是1.4GB， 32位系统下是0.7GB。因为1.5GB的垃圾回收堆内存，V8需要花费50毫秒以上，做一次非增量式的垃圾回收甚至要1秒以上。这是垃圾回收中引起Javascript线程暂停执行的事件，在这样的花销下，应用的性能和影响力都会直线下降。

### 3.3 V8的内存分代和回收算法请简单讲一讲

在V8中，主要将内存分为新生代和老生代两代。新生代中的对象存活时间较短的对象，老生代中的对象存活时间较长，或常驻内存的对象。



![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/7/22/16c17670e2c0fcbd~tplv-t2oaga2asx-watermark.awebp)



#### 3.3.1 新生代

新生代中的对象主要通过Scavenge算法进行垃圾回收。这是一种采用复制的方式实现的垃圾回收算法。它将堆内存一份为二，每一部分空间成为semispace。在这两个semispace空间中，只有一个处于使用中，另一个处于闲置状态。处于使用状态的semispace空间称为From空间，处于闲置状态的空间称为To空间。



![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/7/22/16c176726dc85756~tplv-t2oaga2asx-watermark.awebp)



- 当开始垃圾回收的时候，会检查From空间中的存活对象，这些存活对象将被复制到To空间中，而非存活对象占用的空间将会被释放。完成复制后，From空间和To空间发生角色对换。
- 应为新生代中对象的生命周期比较短，就比较适合这个算法。
- 当一个对象经过多次复制依然存活，它将会被认为是生命周期较长的对象。这种新生代中生命周期较长的对象随后会被移到老生代中。

#### 3.3.2 老生代

老生代主要采取的是标记清除的垃圾回收算法。与Scavenge复制活着的对象不同，标记清除算法在标记阶段遍历堆中的所有对象，并标记活着的对象，只清理死亡对象。活对象在新生代中只占叫小部分，死对象在老生代中只占较小部分，这是为什么采用标记清除算法的原因。

#### 3.3.3 标记清楚算法的问题

主要问题是每一次进行标记清除回收后，内存空间会出现不连续的状态



![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/7/22/16c176daf6c88bc8~tplv-t2oaga2asx-watermark.awebp)



- 这种内存碎片会对后续内存分配造成问题，很可能出现需要分配一个大对象的情况，这时所有的碎片空间都无法完成此次分配，就会提前触发垃圾回收，而这次回收是不必要的。
- 为了解决碎片问题，标记整理被提出来。就是在对象被标记死亡后，在整理的过程中，将活着的对象往一端移动，移动完成后，直接清理掉边界外的内存。

#### 3.3.4 哪些情况会造成V8无法立即回收内存

闭包和全局变量

#### 3.3.5 请谈一下内存泄漏是什么，以及常见内存泄漏的原因，和排查的方法

**什么是内存泄漏**

- 内存泄漏(Memory Leak)指由于疏忽或错误造成程序未能释放已经不再使用的内存的情况。
- 如果内存泄漏的位置比较关键，那么随着处理的进行可能持有越来越多的无用内存，这些无用的内存变多会引起服务器响应速度变慢。
- 严重的情况下导致内存达到某个极限(可能是进程的上限，如 v8 的上限;也可能是系统可提供的内存上限)会使得应用程序崩溃。 常见内存泄漏的原因 内存泄漏的几种情况:

**一、全局变量**

```
a = 10;  
//未声明对象。  
global.b = 11;  
//全局变量引用 
这种比较简单的原因，全局变量直接挂在 root 对象上，不会被清除掉。
复制代码
```

**二、闭包**

```
function out() {  
    const bigData = new Buffer(100);  
    inner = function () {  
        
    }  
} 
复制代码
```

闭包会引用到父级函数中的变量，如果闭包未释放，就会导致内存泄漏。上面例子是 inner 直接挂在了 root 上，那么每次执行 out 函数所产生的 bigData 都不会释放，从而导致内存泄漏。

需要注意的是，这里举得例子只是简单的将引用挂在全局对象上，实际的业务情况可能是挂在某个可以从 root 追溯到的对象上导致的。

**三、事件监听**

Node.js 的事件监听也可能出现的内存泄漏。例如对同一个事件重复监听，忘记移除(removeListener)，将造成内存泄漏。这种情况很容易在复用对象上添加事件时出现，所以事件重复监听可能收到如下警告：

```
emitter.setMaxListeners() to increase limit 
复制代码
```

例如，Node.js 中 Agent 的 keepAlive 为 true 时，可能造成的内存泄漏。当 Agent keepAlive 为 true 的时候，将会复用之前使用过的 socket，如果在 socket 上添加事件监听，忘记清除的话，因为 socket 的复用，将导致事件重复监听从而产生内存泄漏。

原理上与前一个添加事件监听的时候忘了清除是一样的。在使用 Node.js 的 http 模块时，不通过 keepAlive 复用是没有问题的，复用了以后就会可能产生内存泄漏。所以，你需要了解添加事件监听的对象的生命周期，并注意自行移除。

**排查方法**

想要定位内存泄漏，通常会有两种情况：

- 对于只要正常使用就可以重现的内存泄漏，这是很简单的情况只要在测试环境模拟就可以排查了。
- 对于偶然的内存泄漏，一般会与特殊的输入有关系。想稳定重现这种输入是很耗时的过程。如果不能通过代码的日志定位到这个特殊的输入，那么推荐去生产环境打印内存快照了。
- 需要注意的是，打印内存快照是很耗 CPU 的操作，可能会对线上业务造成影响。 快照工具推荐使用 heapdump 用来保存内存快照，使用 devtool 来查看内存快照。
- 使用 heapdump 保存内存快照时，只会有 Node.js 环境中的对象，不会受到干扰(如果使用 node-inspector 的话，快照中会有前端的变量干扰)。
- PS：安装 heapdump 在某些 Node.js 版本上可能出错，建议使用 npm install heapdump -target=Node.js 版本来安装。

## 4、Buffer模块

### 4.1 新建Buffer会占用V8分配的内存吗

不会，Buffer属于堆外内存，不是V8分配的。

### 4.2 Buffer.alloc和Buffer.allocUnsafe的区别

Buffer.allocUnsafe创建的 Buffer 实例的底层内存是未初始化的。 新创建的 Buffer 的内容是未知的，可能包含敏感数据。 使用 Buffer.alloc() 可以创建以零初始化的 Buffer 实例。

### 4.3 Buffer的内存分配机制

为了高效的使用申请来的内存，Node采用了slab分配机制。slab是一种动态的内存管理机制。 Node以8kb为界限来来区分Buffer为大对象还是小对象，如果是小于8kb就是小Buffer，大于8kb就是大Buffer。

例如第一次分配一个1024字节的Buffer，Buffer.alloc(1024),那么这次分配就会用到一个slab，接着如果继续Buffer.alloc(1024),那么上一次用的slab的空间还没有用完，因为总共是8kb，1024+1024 = 2048个字节，没有8kb，所以就继续用这个slab给Buffer分配空间。

如果超过8kb，那么直接用C++底层地宫的SlowBuffer来给Buffer对象提供空间。

### 4.4 Buffer乱码问题

例如一个份文件test.md里的内容如下：

```
床前明月光，疑是地上霜，举头望明月，低头思故乡
复制代码
```

我们这样读取就会出现乱码：

```
var rs = require('fs').createReadStream('test.md', {highWaterMark: 11});
// 床前明???光，疑???地上霜，举头???明月，???头思故乡
复制代码
```

一般情况下，只需要设置rs.setEncoding('utf8')即可解决乱码问题

## 5、webSocket

### 5.1 webSocket与传统的http有什么优势

- 客户端与服务器只需要一个TCP连接，比http长轮询使用更少的连接
- webSocket服务端可以推送数据到客户端
- 更轻量的协议头，减少数据传输量

### 5.2 webSocket协议升级时什么，能简述一下吗？

首先，WebSocket连接必须由浏览器发起，因为请求协议是一个标准的HTTP请求，格式如下：

```
GET ws://localhost:3000/ws/chat HTTP/1.1
Host: localhost
Upgrade: websocket
Connection: Upgrade
Origin: http://localhost:3000
Sec-WebSocket-Key: client-random-string
Sec-WebSocket-Version: 13
复制代码
```

该请求和普通的HTTP请求有几点不同：

- GET请求的地址不是类似/path/，而是以ws://开头的地址；
- 请求头Upgrade: websocket和Connection: Upgrade表示这个连接将要被转换为WebSocket连接；
- Sec-WebSocket-Key是用于标识这个连接，并非用于加密数据；
- Sec-WebSocket-Version指定了WebSocket的协议版本。

随后，服务器如果接受该请求，就会返回如下响应：

```
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: server-random-string
复制代码
```

该响应代码101表示本次连接的HTTP协议即将被更改，更改后的协议就是Upgrade: websocket指定的WebSocket协议。

## 6、https

### 6.1 https用哪些端口进行通信，这些端口分别有什么用

- 443端口用来验证服务器端和客户端的身份，比如验证证书的合法性
- 80端口用来传输数据（在验证身份合法的情况下，用来数据传输）

### 6.2 身份验证过程中会涉及到密钥， 对称加密，非对称加密，摘要的概念，请解释一下

- 密钥：密钥是一种参数，它是在明文转换为密文或将密文转换为明文的算法中输入的参数。密钥分为对称密钥与非对称密钥，分别应用在对称加密和非对称加密上。
- 对称加密：对称加密又叫做私钥加密，即信息的发送方和接收方使用同一个密钥去加密和解密数据。对称加密的特点是算法公开、加密和解密速度快，适合于对大数据量进行加密，常见的对称加密算法有DES、3DES、TDEA、Blowfish、RC5和IDEA。
- 非对称加密：非对称加密也叫做公钥加密。非对称加密与对称加密相比，其安全性更好。对称加密的通信双方使用相同的密钥，如果一方的密钥遭泄露，那么整个通信就会被破解。而非对称加密使用一对密钥，即公钥和私钥，且二者成对出现。私钥被自己保存，不能对外泄露。公钥指的是公共的密钥，任何人都可以获得该密钥。用公钥或私钥中的任何一个进行加密，用另一个进行解密。
- 摘要： 摘要算法又称哈希/散列算法。它通过一个函数，把任意长度的数据转换为一个长度固定的数据串（通常用16进制的字符串表示）。算法不可逆。

### 6.3 为什么需要CA机构对证书签名

如果不签名会存在中间人攻击的风险，签名之后保证了证书里的信息，比如公钥、服务器信息、企业信息等不被篡改，能够验证客户端和服务器端的“合法性”。

### 6.4 https验证身份也就是TSL/SSL身份验证的过程

简要图解如下

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/8/15/16c9306c20ab2b9b~tplv-t2oaga2asx-watermark.awebp)



## 7、进程通信

### 7.1 请简述一下node的多进程架构

面对node单线程对多核CPU使用不足的情况，Node提供了child_process模块，来实现进程的复制，node的多进程架构是主从模式，如下所示：

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/8/21/16cb28a827528118~tplv-t2oaga2asx-watermark.awebp)



```
var fork = require('child_process').fork;
var cpus = require('os').cpus();
for(var i = 0; i < cpus.length; i++){
    fork('./worker.js');
}
复制代码
```

在linux中，我们通过ps aux | grep worker.js查看进程

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/8/21/16cb28906902daf2~tplv-t2oaga2asx-watermark.awebp)

这就是著名的主从模式，Master-Worker



### 7.2 请问创建子进程的方法有哪些，简单说一下它们的区别

创建子进程的方法大致有：

- spawn()： 启动一个子进程来执行命令
- exec(): 启动一个子进程来执行命令，与spawn()不同的是其接口不同，它有一个回调函数获知子进程的状况
- execFlie(): 启动一个子进程来执行可执行文件
- fork(): 与spawn()类似，不同电在于它创建Node子进程需要执行js文件
- spawn()与exec()、execFile()不同的是，后两者创建时可以指定timeout属性设置超时时间，一旦创建的进程超过设定的时间就会被杀死
- exec()与execFile()不同的是，exec()适合执行已有命令，execFile()适合执行文件。

### 7.3 请问你知道spawn在创建子进程的时候，第三个参数有一个stdio选项吗，这个选项的作用是什么，默认的值是什么。

- 选项用于配置在父进程和子进程之间建立的管道。
- 默认情况下，子进程的 stdin、 stdout 和 stderr 会被重定向到 ChildProcess 对象上相应的 subprocess.stdin、subprocess.stdout 和 subprocess.stderr 流。
- 这相当于将 options.stdio 设置为 ['pipe', 'pipe', 'pipe']。

### 7.4 请问实现一个node子进程被杀死，然后自动重启代码的思路

- 在创建子进程的时候就让子进程监听exit事件，如果被杀死就重新fork一下

```
var createWorker = function(){
    var worker = fork(__dirname + 'worker.js')
    worker.on('exit', function(){
        console.log('Worker' + worker.pid + 'exited');
        // 如果退出就创建新的worker
        createWorker()
    })
}
复制代码
```

### 7.5 在7.4的基础上，实现限量重启，比如我最多让其在1分钟内重启5次，超过了就报警给运维

- 思路大概是在创建worker的时候，就判断创建的这个worker是否在1分钟内重启次数超过5次
- 所以每一次创建worker的时候都要记录这个worker 创建时间，放入一个数组队列里面，每次创建worker都去取队列里前5条记录
- 如果这5条记录的时间间隔小于1分钟，就说明到了报警的时候了

### 7.6 如何实现进程间的状态共享，或者数据共享

我自己没用过Kafka这类消息队列工具，问了java,可以用类似工具来实现进程间通信，更好的方法欢迎留言

## 8、中间件

### 8.1 如果使用过koa、egg这两个Node框架，请简述其中的中间件原理，最好用代码表示一下



![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/8/20/16cae0e64433e9b2~tplv-t2oaga2asx-watermark.awebp)



- 上面是在网上找的一个示意图，就是说中间件执行就像洋葱一样，最早use的中间件，就放在最外层。处理顺序从左到右，左边接收一个request，右边输出返回response
- 一般的中间件都会执行两次，调用next之前为第一次，调用next时把控制传递给下游的下一个中间件。当下游不再有中间件或者没有执行next函数时，就将依次恢复上游中间件的行为，让上游中间件执行next之后的代码
- 例如下面这段代码

```
const Koa = require('koa')
const app = new Koa()
app.use((ctx, next) => {
    console.log(1)
    next()
    console.log(3)
})
app.use((ctx) => {
    console.log(2)
})
app.listen(3001)
执行结果是1=>2=>3
复制代码
```

koa中间件实现源码大致思路如下：

```
// 注意其中的compose函数，这个函数是实现中间件洋葱模型的关键
// 场景模拟
// 异步 promise 模拟
const delay = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 2000);
  });
}
// 中间间模拟
const fn1 = async (ctx, next) => {
  console.log(1);
  await next();
  console.log(2);
}
const fn2 = async (ctx, next) => {
  console.log(3);
  await delay();
  await next();
  console.log(4);
}
const fn3 = async (ctx, next) => {
  console.log(5);
}

const middlewares = [fn1, fn2, fn3];

// compose 实现洋葱模型
const compose = (middlewares, ctx) => {
  const dispatch = (i) => {
    let fn = middlewares[i];
    if(!fn){ return Promise.resolve() }
    return Promise.resolve(fn(ctx, () => {
      return dispatch(i+1);
    }));
  }
  return dispatch(0);
}

compose(middlewares, 1);
复制代码
```

## 9、其它

现在在重新过一遍node 12版本的主要API，有很多新发现，比如说

- fs.watch这个模块，事件的回调函数有一个参数是触发的事件名称，但是呢，无论我增删改，都是触发rename事件（如果更改是update事件，删除delete事件，重命名是rename事件，这样语义明晰该多好）。后来网上找到一个node-watch模块，此模块增删改都有对应的事件， 并且还高效的支持递归watch 文件。
- util模块有个promisify方法，可以让一个遵循异常优先的回调风格的函数，即 (err, value) => ... 回调函数是最后一个参数，返回一个返回值是一个 promise 版本的函数。

```
const util = require('util');
const fs = require('fs');

const stat = util.promisify(fs.stat);
stat('.').then((stats) => {
  // 处理 `stats`。
}).catch((error) => {
  // 处理错误。
});
复制代码
```

#### 9.1 杂想

- crypto模块，可以考察基础的加密学知识，比如摘要算法有哪些（md5, sha1, sha256，加盐的md5,sha256等等）,接着可以问如何用md5自己模拟一个加盐的md5算法， 接着可以问加密算法（crypto.createCiphe）中的aes,eds算法的区别，分组加密模式有哪些（比如ECB,CBC,为什么ECB不推荐），node里的分组加密模式是哪种（CMM），这些加密算法里的填充和向量是什么意思，接着可以问数字签名和https的流程（为什么需要CA，为什么要对称加密来加密公钥等等）
- tcp/ip，可以问很多基础问题，比如链路层通过什么协议根据IP地址获取物理地址（arp），网关是什么，ip里的ICMP协议有什么用，tcp的三次握手，四次分手的过程是什么，tcp如何控制重发，网络堵塞TCP会怎么办等等，udp和tcp的区别，udp里的广播和组播是什么，组播在node里通过什么模块实现。
- os，操作系统相关基础，io的流程是什么（从硬盘里读取数据到内核的内存中，然后内核的内存将数据传入到调用io的应用程序的进程内存中），冯诺依曼体系是什么，进程和线程的区别等等（我最近在看马哥linux教程，因为自己不是科班出身，听了很多基础的计算机知识，受益匪浅，建议去bilibili看）
- linux相关操作知识（node涉及到后台，虽然是做中台，不涉及数据库，但是基本的linux操作还是要会的）
- node性能监控（自己也正在学习中）
- 测试，因为用的egg框架，有很完善的学习单元测试的文档，省略这部分
- 数据库可以问一些比如事务的等级有哪些，mysql默认的事务等级是什么，会产生什么问题，然后考一些mysql查询的笔试题。。。和常用优化技巧，node的mysql的orm工具使用过没有。。。（比如我自己是看的尚硅谷mysql初级+高级视频，书是看的mysql必知必会，我自己出于爱好学习一下。。。没有实战过） 