### MVC

MVC即Model View Controller，简单来说就是通过controller的控制去操作model层的数据，并且返回给view层展示。

- View 接受用户交互请求
- View 将请求转交给Controller处理
- Controller 操作Model进行数据更新保存
- 数据更新保存之后，Model会通知View更新
- View 更新变化数据使用户得到反馈

### MVVM

MVVM即Model-View-ViewModel，将其中的 View 的状态和行为抽象化，让我们可以将UI和业务逻辑分开。MVVM的优点是低耦合、可重用性、独立开发。

- View 接收用户交互请求
- View 将请求转交给ViewModel
- ViewModel 操作Model数据更新
- Model 更新完数据，通知ViewModel数据发生变化
- ViewModel 更新View数据

MVVM模式和MVC有些类似，但有以下不同

- ViewModel 替换了 Controller，·在UI层之下
- ViewModel 向 View 暴露它所需要的数据和指令对象
- ViewModel 接收来自 Model 的数据

概括起来，MVVM是由MVC发展而来，通过在`Model`之上而在`View`之下增加一个非视觉的组件将来自`Model`的数据映射到`View`中。









