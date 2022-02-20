# Virtual DOM？

### 一、vdom是什么？

vdom是虚拟DOM(Virtual DOM)的简称，指的是用JS模拟的DOM结构，将DOM变化的对比放在JS层来做。换而言之，vdom就是JS对象。

如下DOM结构:

```
<ul id="list">
    <li class="item">Item1</li>
    <li class="item">Item2</li>
</ul>
```

映射成虚拟DOM就是这样:

```
{
    tag: "ul",
    attrs: {
        id:&emsp;"list"
    },
    children: [
        {
            tag: "li",
            attrs: { className: "item" },
            children: ["Item1"]
        }, {
            tag: "li",
            attrs: { className: "item" },
            children: ["Item2"]
        }
    ]
} 
```

### 二、为什么要用vdom?

现在有一个场景，实现以下需求:

```
[
    {
        name: "张三",
        age: "20",
        address: "北京"
    },
    {
        name: "李四",
        age: "21",
        address: "武汉"
    },
    {
        name: "王五",
        age: "22",
        address: "杭州"
    },
]
```

将该数据展示成一个表格，并且随便修改一个信息，表格也跟着修改。 用jQuery实现如下:

```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>

<body>
  <div id="container"></div>
  <button id="btn-change">改变</button>

  <script src="https://cdn.bootcss.com/jquery/3.2.0/jquery.js"></script>
  <script>
    const data = [{
        name: "张三",
        age: "20",
        address: "北京"
      },
      {
        name: "李四",
        age: "21",
        address: "武汉"
      },
      {
        name: "王五",
        age: "22",
        address: "杭州"
      },
    ];
    //渲染函数
    function render(data) {
      const $container = $('#container');
      $container.html('');
      const $table = $('<table>');
      // 重绘一次
      $table.append($('<tr><td>name</td><td>age</td><td>address</td></tr>'));
      data.forEach(item => {
        //每次进入都重绘
        $table.append($(`<tr><td>${item.name}</td><td>${item.age}</td><td>${item.address}</td></tr>`))
      })
      $container.append($table);
    }
    
    $('#btn-change').click(function () {
      data[1].age = 30;
      data[2].address = '深圳';
      render(data);
    });
  </script>
</body>
</html>

复制代码

```

这样点击按钮，会有相应的视图变化，但是你审查以下元素，每次改动之后，table标签都得重新创建，也就是说table下面的每一个栏目，不管是数据是否和原来一样，都得重新渲染，这并不是理想中的情况，当其中的一栏数据和原来一样，我们希望这一栏不要重新渲染，因为DOM重绘相当消耗浏览器性能。

因此我们采用JS对象模拟的方法，将DOM的比对操作放在JS层，减少浏览器不必要的重绘，提高效率。

当然有人说虚拟DOM并不比真实的DOM快，其实也是有道理的。当上述table中的每一条数据都改变时，显然真实的DOM操作更快，因为虚拟DOM还存在js中diff算法的比对过程。所以，上述性能优势仅仅适用于大量数据的渲染并且改变的数据只是一小部分的情况。

虚拟DOM更加优秀的地方在于:

1、它打开了函数式的UI编程的大门，即UI = f(data)这种构建UI的方式。

2、可以将JS对象渲染到浏览器DOM以外的环境中，也就是支持了跨平台开发，比如ReactNative。

另外大家可以参考尤大的一些回答: [www.zhihu.com/question/31…](https://www.zhihu.com/question/31809713/answer/53544875)

### 三、使用snabbdom实现vdom

snabbdom地址:[github.com/snabbdom/sn…](https://github.com/snabbdom/snabbdom)

这是一个简易的实现vdom功能的库，相比vue、react，对于vdom这块更加简易，适合我们学习vdom。vdom里面有两个核心的api，一个是h函数，一个是patch函数，前者用来生成vdom对象，后者的功能在于做虚拟dom的比对和将vdom挂载到真实DOM上。

简单介绍一下这两个函数的用法:

- h('标签名', {属性}, [子元素])
- h('标签名', {属性}, [文本])
- patch(container, vnode) container为容器DOM元素
- patch(vnode, newVnode)

现在我们就来用snabbdom重写一下刚才的例子:

```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<body>
  <div id="container"></div>
  <button id="btn-change">改变</button>
  <script src="https://cdn.bootcss.com/snabbdom/0.7.3/snabbdom.js"></script>
  <script src="https://cdn.bootcss.com/snabbdom/0.7.3/snabbdom-class.js"></script>
  <script src="https://cdn.bootcss.com/snabbdom/0.7.3/snabbdom-props.js"></script>
  <script src="https://cdn.bootcss.com/snabbdom/0.7.3/snabbdom-style.js"></script>
  <script src="https://cdn.bootcss.com/snabbdom/0.7.3/snabbdom-eventlisteners.min.js"></script>
  <script src="https://cdn.bootcss.com/snabbdom/0.7.3/h.js"></script>
  <script>
    let snabbdom = window.snabbdom;

    // 定义patch
    let patch = snabbdom.init([
      snabbdom_class,
      snabbdom_props,
      snabbdom_style,
      snabbdom_eventlisteners
    ]);

    //定义h
    let h = snabbdom.h;

    const data = [{
        name: "张三",
        age: "20",
        address: "北京"
      },
      {
        name: "李四",
        age: "21",
        address: "武汉"
      },
      {
        name: "王五",
        age: "22",
        address: "杭州"
      },
    ];
    data.unshift({name: "姓名", age: "年龄", address: "地址"});

    let container = document.getElementById('container');
    let vnode;
    const render = (data) => {
      let newVnode = h('table', {}, data.map(item => { 
        let tds = [];
        for(let i in item) {
          if(item.hasOwnProperty(i)) {
            tds.push(h('td', {}, item[i] + ''));
          }
        }
        return h('tr', {}, tds);
      }));

      if(vnode) {
          patch(vnode, newVnode);
      } else {
          patch(container, newVnode);
      }
      vnode = newVnode;
    }

    render(data);

    let btnChnage = document.getElementById('btn-change');
    btnChnage.addEventListener('click', function() {
      data[1].age = 30;
      data[2].address = "深圳";
      //re-render
      render(data);
    })
  </script>
</body>
</html>
复制代码

```

再进入页面:



![img](https://user-gold-cdn.xitu.io/2019/8/22/16cb6a6528a91c5e?imageslim)

你会发现，只有改变的栏目才闪烁，也就是进行重绘，数据没有改变的栏目还是保持原样，这样就大大节省了浏览器重新渲染的开销。



### 四、diff算法

#### 2、vdom为什么用diff算法

DOM操作是非常昂贵的，因此我们需要尽量地减少DOM操作。这就需要找出本次DOM必须更新的节点来更新，其他的不更新，这个找出的过程，就需要应用diff算法。

#### 3、vdom中diff算法的简易实现

以下代码只是帮助大家理解diff算法的原理和流程，不可用于生产环境。

将vdom转化为真实dom：

```
const createElement = (vnode) => {
  let tag = vnode.tag;
  let attrs = vnode.attrs || {};
  let children = vnode.children || [];
  if(!tag) {
    return null;
  }
  //创建元素
  let elem = document.createElement(tag);
  //属性
  let attrName;
  for (attrName in attrs) {
    if(attrs.hasOwnProperty(attrName)) {
      elem.setAttribute(attrName, attrs[attrName]);
    }
  }
  //子元素
  children.forEach(childVnode => {
    //给elem添加子元素
    elem.appendChild(createElement(childVnode));
  })

  //返回真实的dom元素
  return elem;
}
复制代码

```

用简易diff算法做更新操作:

```
function updateChildren(vnode, newVnode) {
  let children = vnode.children || [];
  let newChildren = newVnode.children || [];

  children.forEach((childVnode, index) => {
    let newChildVNode = newChildren[index];
    if(childVnode.tag === newChildVNode.tag) {
      //深层次对比, 递归过程
      updateChildren(childVnode, newChildVNode);
    } else {
      //替换
      replaceNode(childVnode, newChildVNode);
    }
  })
}

```

### 初次渲染过程 

1.解析模板为render函数（或在开发环境已完成，vue-loader，webpack）

2.触发响应式，监听data属性的getter，setter函数

3.执行render函数，生成vnode，patch(elem, vnode)

### 更新过程

1.修改data，触发setter（此前在getter中已经被监听）

2.重新执行render，生成newVnode

3.patch(vnode, newVnode)







## styled-components:前端组件拆分新思路

一直在思考React组件如何拆分的问题，直到接触到styled-components，让我有一种如鱼得水的感觉，今天我就给大家分享一下这个库如何让我们的前端组件开发的更优雅，如何保持更合适的组件拆分粒度从而更容易维护。

### 一、使用方法

styled-components是给React量身定制的一个库，奉行React中all in js的设计理念，并将这个理念进一步发挥到极致，让CSS也能够成为一个个的JS模块。

使用起来也相当方便，首先安装这个库

```
npm install styled-components --save
复制代码

```

然后在style.js中使用(注意这里不是style.css，样式文件全部是JS文件)

```
import styled from 'styled-components';
//styled.xxx表示创建xxx这个h5标签,
//后面紧接的字符串里面写的是CSS代码
export const HeaderWrapper = styled.div`
  z-index: 1;
  position: relative;
  height: 56px;
  border-bottom: 1px solid #f0f0f0;
`;
复制代码

```

之后再React中使用它:

```
import React, {Component} from 'react';
import { HeaderWrapper } from './style.js';

class App extend Component{
    render() {
        return (
            <HeaderWrapper></HeaderWrapper>
        )
    }
}
export default App;
复制代码

```

Ok!这就是它的日常使用方式。如果有兴趣可以去github的相应仓库打开更多使用姿势:)

### 二、使用styled-component解决了哪些痛点

可能你还会有疑惑：这么做有什么好处呢？

#### 1.CSS模块化

尽量降低模块之间的耦合度，利于项目的进一步维护。比起用原生的CSS，这是它首当其冲的优势。

#### 2.支持预处理器嵌套语法

如:

```
export const SearchWrapper = styled.div`
  position: relative;
  float: left;
  .zoom {
    right: 5px;
    &.focused {
      background: #777;
      color: #fff;
    }
  }
`;
复制代码

```

可以采用sass,less的嵌套语法，开发更加流畅。

#### 3.让CSS代码能够处理逻辑

不仅仅是因为里面的模板字符串可以写JS表达式，更重要的是能够拿到组件的上下文信息(state、props)

比如,在React组件中的JSX代码中写了这样一段：

```
<RecommendItem imgUrl={'xxx'}/>
复制代码

```

在相应的style.js中就能够接受相应的参数:

```
export const RecommendItem = styled.div`
  width: 280px;
  height: 50px;
  background: url(${(props) => props.imgUrl});
  background-size: contain;
`;
复制代码

```

CSS能够拿到props中的内容，进行相应的渲染，是不是非常酷炫？

#### 4.语义化

如果以上几点还不能体现它的优势，那这一点就是对于前端开发者的毒药。

现在很多人对标签语义化的概念趋之若鹜，但其实大多数开发者都还是div+class一把撸的模式。难道是因为语义化不好吗？能够让标签更容易理解当然是件好事情，但是对于html5规范推出的标签来说，一方面对于开发者来说略显繁琐，还是div、span、h1之类更加简洁和亲切，另一方面标准毕竟是标准，它并不能代表业务，因此并不具有足够的表达力来描述纷繁的业务，甚至这种语义化有时候是可有可无的。我觉得这两点是开发者更喜欢div+class一把撸的根本原因。

那好，照着这个思路，拿React组件开发而言，如果要想获得更好的表达力，尽可能的语义化，那怎么办？可能你会暗笑：这还用说，拆组件啊！但组件真的是拆的越细越好吗？

有人曾经说过:当你组件拆的越来越细的时候，你会发现每一个组件就是一个标签。但是这会造成一些更加严重的问题。假设我们拆的都是UI组件，当我们为了语义化连一个button都要封装成一个组件的时候，代码会臃肿不堪，因为会出现数量过于庞大的组件，非常不利于维护。

那，有没有一个折中的方案呢？既能提高标签语义化，又能控制JS文件的数量。 没错，这个方案就是styled-components。

以首页的导航为例, 取出逻辑后JSX是这样：

```
<HeaderWrapper>
    <Logo/>
    <Nav>
        <NavItem className='left active'>首页</NavItem>
        <NavItem className='left'>下载App</NavItem>
        <NavItem className='right'>
            <i className="iconfont">&#xe636;</i>
    	</NavItem>
        <SearchWrapper>
            <NavSearch></NavSearch>
            <i className='iconfont'>&#xe614;</i>
        </SearchWrapper>
    </Nav>
    <Addition>
        <Button className='writting'>
    	  <i className="iconfont">&#xe615;</i>
    	  来参加
    	</Button>
    	<Button className='reg'>注册</Button>
    </Addition>
</HeaderWrapper>
复制代码
//style.js
import styled from 'styled-components';

export const HeaderWrapper = styled.div`
    z-index: 1;
    position: relative;
    height: 56px;
    border-bottom: 1px solid #f0f0f0;
`;

export const Logo = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 100px;
    height: 56px;
    background: url(${logoPic});
    background-size: contain;
`;

export const Nav = styled.div`
    width: 960px;
    height: 100%;
    padding-right: 70px;
    box-sizing: border-box;
    margin: 0 auto;
`;
//......
复制代码

```

拆分后的标签基本是在style.js里面导出的变量名，完全自定义，这个时候CSS都成为了一个个JS模块，每一个模块相当于一个标签(如：styled.div已经帮我们创建好了标签)，在模块下面完全可以再写h5标签。这样的开发方式其实是非常灵活的。

### 三、开发过程中遇到的坑以及目前缺点

坑: 以前的injectGlobal已经被弃用，因此对于全局的样式文件需要使用createGlobalStyle来进行引入。

```
//iconfont.js
//全局样式同理
import {createGlobalStyle} from 'styled-components'

export const IconStyle = createGlobalStyle`
@font-face {
  font-family: "iconfont";
  src: url('./iconfont.eot?t=1561883078042'); /* IE9 */
  src: url('./iconfont.eot?t=1561883078042#iefix') format('embedded-opentype'), /* IE6-IE8 
  //...
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
`
```

然后在全局的根组件App.js里面:

```
import { IconStyle } from './statics/iconfont/iconfont'
import { GlobalStyle } from  './style'
//import ...

function App() {
  return (
    <Provider store={store}>
      <div>
        {/* 通过标签形式引入这些样式 */}
        <GlobalStyle></GlobalStyle>
        <IconStyle></IconStyle>
        <Header />
        <BrowserRouter>
        <div>
          <Route path='/' exact component={Home}></Route>
          <Route path='/detail' exact component={Detail}></Route>
        </div>
        </BrowserRouter>
      </div>
    </Provider>
  );
}

export default App;
```

对于styled-components缺点而言，我认为目前唯一的不足在于模板字符串里面没有CSS语法，写起来没有自动提示，对于用惯IDE提示的人来说还是有美中不足的。不过也并不是什么太大的问题，如果有相应的插件或工具欢迎在评论区分享。