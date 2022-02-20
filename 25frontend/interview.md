#### 换工作原因

有了清晰的目标，知道我想要什么，想要做什么

因为我觉得我有能力承担更大的责任，做更多的事情，学习更多的知识，接触更多的人

### 工作内容

云平台发布：

1. 首页节点导航
2. 发布流

3. 定时任务

4. 环境

发布部署：

1. 部署模板

2. 环境

3. 敏感信息检测

## 技术面

回答的时候慢慢讲不要快

把不知道xxx 换成 我只知道xxx，要虚心

回答技术问题结合实际项目来说

非技术问题记得要少说话，精简表达

#### 业务

熟悉业务对开发非常有帮助，可以提高对项目更整体的把握能力，更好的去设计程序组织结构，提前布局，多考量一些因素，注重程序未来的可扩展性和可维护性设计，输出高质量可维护的代码，更高效的开发。快速的熟悉业务意味着快速的上手需求，少走弯路，少写代码和修改代码。

1. 完成自己负责的工作，保证业务的高效落地，这个过程中学习知识，打好基础
2. 解决疑难问题，积累项目经验，把控项目的质量，高效地解决问题，把控风险

3. 接触新技术，预研新技术，把新技术引入到现有项目，用新技术改造旧项目，跟上前端技术的发展，让项目高效、可持续的迭代

#### 提问面试官：

我技术薄弱的地方是什么。如果我这一轮被淘汰，原因是什么。

面试过程中我有哪些答的不好的地方，或者暴露了什么问题，表现得不好的地方，怎么提高。

技术栈，新人培养方案，晋升机制，能不能介绍一下部门主要产品，介绍部门的目标，项目周期，哪些项目长期维护的

新人进去是怎么安排的

简历有哪些问题，关于项目经历的描述应该怎么优化   

## hr面

#### 问题

1. 了解消息中间件吗？
   说了redux和koa的中间件
2. 工作中有没主动做过什么事？
3. 你觉得你跟别人相比有什么优势？
4. 问了大学时的专业排名，高考生源是哪儿的

前几轮面试的感受 

为了这次面试准备了多久，怎么准备的 

聊了以往的工作经历，在团队中的定位 

工作后是怎么学习的，有没有自己的规划 

工作中遇到困难是怎么解决的 

团队协作的时候怎么沟通的 

业务繁忙时如何保障代码质量 

你会通过怎样的方式理解需求 

周围人对你的评价

完成现有的项目的前端开发，文档编写，还要维护已有项目，和其他团队对接，解决他们遇到问题，或者有些不懂 

我对技术很感兴趣，尤其是前端这一块，工作之余我也会自己学习相关的技术，最后很感谢有这次面试的机会

意见不一致

1. 原则上我会尊重和服从领导的工作安排；同 时私底下找机会以请教的口吻，婉转地表达自己的想法，看看领导是否能改变想法；
2. 如果领导没有采纳我的建议，我也同样会按领导的要求认真地去完成这项工作；

#### 优点：

喜欢做长远的考虑，对自己的水平永远不满足，总是主动去学习新的东西，我是一个比较随和的人，喜欢展现自己真实的一面，与不同的人都可以友好相处。做决定比较果断。

我是一个可以信赖的人。因为，我一旦答应别人的事情，就一定会做到。如果我做不到，我就不会轻易许诺。

虽然我不太擅长表达，但是这不影响我和他们成为很好的朋友。我是一个有责任感的人，我会完成自己的工作。

#### 缺点：

不太在意别人的感受，但是答应别人的事情一定会做到，不喜欢一成不变的工作，如果无法提出改善的时候我失去工作的动力，更适合充满挑战，变化的环境。没有领导力，但是擅长完成自己负责的工作。

概括自己：

适应能力强，有责任心和做事有始终 

#### 华为企业文化：

崇尚狼性文化，注重团队合作，以客户为中心，做世界一流的产品，产品质量非常好，对客户的需求响应非常迅速

有6万名工程师，对研发的投入非常巨大，非常注重对工程师的培养，我很佩服这一点



## 组件库

在 Angular 表单中，我们都知道有 Reactive Form 和 Template Form 这两种使用方式，组件库的开发也可以对应到这两种模式上，我们以 Select 组件为例，在 Angular 中，我们可以选择通过 *ngFor 将 option 直接放置在 template 中，最后通过 ContentChildren 获取后进行渲染，也可以将所有的 options 作为 Input 参数传入 Select 组件。

 

这两种方式都可以作为数据渲染的依据，但是当需求增加的时候，两种方式的区别就会开始显现。例如我们提出要在option上增加单击、双击响应事件，并在disabled时让用户可以自定义 option 的样式。在这个时候，如果是通过Reactive方式实现的组件库，势必要在options中添加 click,dblclick,disabledClass等新的选项。然而在 Template Driven 的组件库中，我们可以利用现有的 Angular 模板事件，而不用自己重新进行实现。

G2 的官方代码我们可以分为两个部分逻辑：创建图表实例与渲染图表内容。作为组件库要覆盖的应该是通用部分，也就是创建图表实例部分，我们创建一个 ngxG2 的 Directive，在视图渲染的钩子（ngAfterViewInit）上获取当前 Directive 的宽高以及HTMLElement，将这些值作为 G2 图表的实例创建参数，并通过 configure 的 EventEmitter output出去，这样，我们的 ngx-g2 通用组件就完成了。



## 简历



简历上看水平，无非就是两点：

第一，你做了什么牛逼的事儿。比如你简历里面写“作为主要开发人员参与web office项目，负责核心富文本编辑器开发”，那必然得让你进面试跟你讨教一下对吧？真不是开玩笑，你们看今年（19年）的D2前端大会分享嘉宾介绍，有位大佬真的就是做excel出身的。

第二，你做事儿牛不牛逼。比如你负责上家公司的前端载入性能优化，如果你是比较牛逼的前端，你的项目介绍大致应该这样——

1，业务场景，多大规模的产品，多少pv，多重要，为什么要优化性能？

2，性能度量，使用哪些指标度量载入性能，形成通用性能度量模型。

3，开发监控平台以及端侧接入库，实时监控，分析数据，发现问题。一方面是不是慢，有多慢，哪个环节慢；另一方面谁慢，慢加载的地理分布如何，终端分布如何，规律是什么？

4，引入哪些技术（比如http2或者pwa什么的），设计优化方案，并提供一键优化工具。另外这里面有没有解决什么特殊问题，或者有没有什么技术创新？

5，落地到哪些项目，平均提升载入性能百分之多少。配合同期运营手段实现了多大程度的业务增长。

看到这样的简历肯定要面试聊一聊了，哪怕不聊具体技术，我们也想看看优秀的人怎么做事儿对吧？

**普通工程师**：我熟悉 webpack 的配置与使用

**优秀工程师**：我根据团队的业务情况，沉淀了三套（前台/无线/中后台）的 webpack config ，并开发了命令行工具，对接了公司的发布系统，可以针对不同项目一键生成模板，本地调试，推送发布，打 tag。

> 前端工程化思路

**普通工程师**：我熟悉 d3.js, echart, highcharts 可以熟练的绘制图表

**优秀工程师**：在公司的大屏项目中，我发现 echarts 底层的 zrender 绘图引擎有个同层渲染的优化点，同时我还根据业务特色封装了 d3.xxx.layout 布局算法，提交给了他们仓库并合并

> 关注开源框架底层实现并可以贡献社区

**普通工程师**：我了解 react16 hooks 相关概念并在项目中使用。

**优秀工程师**：为了解决我团队一个大型项目组件 hoc 层级过多的问题，我引入了 hooks，将项目整个重构，并沉淀了10+业务通用的 usexxx hooks 。通过这次重构，开发效率提升，代码更容易复用且清爽，但是发现有时候 useEffect 的使用不好处理，因此我又...

> 关注新技术特性实际落地在项目中拿到结果，并可以判断技术的优劣

**普通工程师**：我用 express koa 和 eggjs 搭建过 nodejs 应用

**优秀工程师**：我们使用 eggjs 搭建了一个 api 网关，并对其进行了多轮压测，在并发 xxx 的情况下，qps 达到 xxx，rt 达到 xxx，并跟运维合作建立了应用的监控，可以实时查看应用指标。在压测过程中我们发现，达到 xxx 并发时，内存会爆掉，我们后面联系了 alinode 团队，对应用堆内存进行分析，发现了内存泄漏点 xxx 并修复。

> 对于后端应用，关注系统的健壮性和稳定性，能够排查问题 