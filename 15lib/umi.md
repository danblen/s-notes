一个工程是怎么从入口加载到所有文件的

一个目录下不要放太多子文件或文件夹，如果一个文件（接口文件）代码很长且被很多文件引用，这个文件就不能随意修改、移动位置，代码依赖性问题比较多，耦合太多，不如按业务把这个文件拆分，放在承载相同业务目录下

## Duck Directory

大家都说命名是编程中最难的事情之一，我觉得目录结构组织也差不了多少。

Duck Directory 可以看下图理解下，是指按功能/页面维护进行目录组织，与之相对的是一种扁平的目录组织形式。

dva 项目之前通常都是这种扁平的组织方式，

```
+ models
  - global.js
  - a1.js
  - a2.js
  - b.js
+ services
  - a.js
  - b.js
+ routes
  - PageA.js
  - PageB.js
```

用了 umi 后，可以按页面维度进行组织，

```
+ models/global.js
+ pages
  + a
    - index.js
    + models
      - a1.js
      - a2.js
    + services
      - a.js
  + b
    - index.js
    - model.js
    - service.js
```

好处是更加结构更加清晰了，减少耦合，一删全删，方便 copy 和共享。

## 自动注册 models

详见 [umijs/umi#171](https://github.com/umijs/umi/issues/171)

```
+ src
  + models
    - g.js
  + pages
    + a
      + models
        - a.js
        - b.js
        + ss
          - s.js
      - page.js
    + c
      - model.js
      + d
        + models
          - d.js
        - page.js
      - page.js
```

如上目录：

- global model 为 `src/models/g.js`
- `/a` 的 page model 为 `src/pages/a/models/{a,b,ss/s}.js`
- `/c` 的 page model 为 `src/pages/c/model.js`
- `/c/d` 的 page model 为 `src/pages/c/model.js, src/pages/c/d/models/d.js`

## 再见！router.js

改造前，

- https://github.com/zuiidea/antd-admin/blob/9a4c633/src/router.js
- https://github.com/ant-design/ant-design-pro/blob/645f7da/src/common/router.js

改造后， 

## 再见！query-string

umi 内置的 history 是处理了 location.query 的，所以大家可以回到 dva@1 的时代，无需手动同 query-string 进行编码和解码了。

## 再见！配置文件

首先，我们的 package.json 里会少很多依赖，

- dva-loading
- dva-hmr
- dva
- react
- react-dom

如果你用了 antd，那么还可以省掉

- antd
- antd-mobile
- babel-plugin-import

然后，webpack.config.js、原 .roadhogrc.js、原 .roadhogrc.mock.js 也能大幅省略

### 如何配置 onError、initialState 等 hook？

新建 src/dva.js，通过导出的 config 方法来返回额外配置项，比如：

```
import { message } from 'antd';

export function config() {
  return {
    onError(err) {
      err.preventDefault();
      message.error(err.message);
    },
    initialState: {
      global: {
        text: 'hi umi + dva',
      },
    },
  };
}
```

### url 变化了，但页面组件也刷新，是什么原因？

`layouts/index.js` 里如果用了 connect 传数据，需要用 `umi/withRouter` 高阶一下。

```
import withRouter from 'umi/withRouter';

export default withRouter(connect(mapStateToProps)(LayoutComponent));
```

### 如何访问到 store 或 dispatch 方法？

```
window.g_app._store
window.g_app._store.dispatch
```

### 如何禁用包括 component 和 models 的按需加载？

在 .umirc.js 里配置：

```
export default {
  disableDynamicImport: true,
};
```

> 一个页面可能有好几块数据

可以把一个页面当成一个模块去处理，pages里service可以放好几块调用的声明

> 一块数据也可能分散到好多个页面

可以public，services下建文件夹或者放global.js

> 它后期的变化可能会很大，以它为维度是难以维护的。

页面按模块组织，页面增减直接增删文件夹，public的部分视情况增减就ok

总体来说，考虑到了灵活性和颗粒度





可扩展的企业级前端应用框架。Umi 以路由为基础的，同时支持配置式路由和约定式路由，保证路由的功能完备，并以此进行功能扩展。然后配以生命周期完善的插件体系，覆盖从源码到构建产物的每个生命周期，支持各种功能扩展和业务需求。

它主要具备以下功能：

- 🎉 **可扩展**，Umi 实现了完整的生命周期，并使其插件化，Umi 内部功能也全由插件完成。此外还支持插件和插件集，以满足功能和垂直域的分层需求。
- 📦 **开箱即用**，Umi 内置了路由、构建、部署、测试等，仅需一个依赖即可上手开发。并且还提供针对 React 的集成插件集，内涵丰富的功能，可满足日常 80% 的开发需求。
- 🐠 **企业级**，经蚂蚁内部 3000+ 项目以及阿里、优酷、网易、飞猪、口碑等公司项目的验证，值得信赖。
- 🚀 **大量自研**，包含微前端、组件打包、文档工具、请求库、hooks 库、数据流等，满足日常项目的周边需求。
- 🌴 **完备路由**，同时支持配置式路由和约定式路由，同时保持功能的完备性，比如动态路由、嵌套路由、权限路由等等。
- 🚄 **面向未来**，在满足需求的同时，我们也不会停止对新技术的探索。比如 dll 提速、modern mode、webpack@5、自动化 external、bundler less 等等。

## 什么时候不用 umi？

如果你，

- 需要支持 IE 8 或更低版本的浏览器
- 需要支持 React 16.8.0 以下的 React
- 需要跑在 Node 10 以下的环境中
- 有很强的 webpack 自定义需求和主观意愿
- 需要选择不同的路由方案

Umi 可能不适合你。

## 为什么不是？

### [create-react-app](https://github.com/facebook/create-react-app)

create-react-app 是基于 webpack 的打包层方案，包含 build、dev、lint 等，他在打包层把体验做到了极致，但是不包含路由，不是框架，也不支持配置。所以，如果大家想基于他修改部分配置，或者希望在打包层之外也做技术收敛时，就会遇到困难。

### [next.js](https://github.com/zeit/next.js)

next.js 是个很好的选择，Umi 很多功能是参考 next.js 做的。要说有哪些地方不如 Umi，我觉得可能是不够贴近业务，不够接地气。比如 antd、dva 的深度整合，比如国际化、权限、数据流、配置式路由、补丁方案、自动化 external 方面等等一线开发者才会遇到的问题。

umi 首先会加载用户的配置和插件，然后基于配置或者目录，生成一份路由配置，再基于此路由配置，把 JS/CSS 源码和 HTML 完整地串联起来。用户配置的参数和插件会影响流程里的每个环节。

## 他和 dva、roadhog 是什么关系？

简单来说，

- roadhog 是基于 webpack 的封装工具，目的是简化 webpack 的配置
- umi 可以简单地理解为 roadhog + 路由，思路类似 next.js/nuxt.js，辅以一套插件机制，目的是通过框架的方式简化 React 开发
- dva 目前是纯粹的数据流，和 umi 以及 roadhog 之间并没有相互的依赖关系，可以分开使用也可以一起使用，个人觉得 [umi + dva 是比较搭的](https://github.com/sorrycc/blog/issues/66)

## 为什么不是为什么不是...?

### next.js

next.js 的功能相对比较简单，比如他的路由配置并不支持一些高级的用法，比如布局、嵌套路由、权限路由等等，而这些在企业级的应用中是很常见的。相比 next.js，umi 在约定式路由的功能层面会更像 nuxt.js 一些。

### roadhog

roadhog 是比较纯粹的 webpack 封装工具，作为一个工具，他能做的就比较有限（限于 webpack 层）。而 umi 则等于 roadhog + 路由 + HTML 生成 + 完善的插件机制，所以能在提升开发者效率方面发挥出更大的价值。