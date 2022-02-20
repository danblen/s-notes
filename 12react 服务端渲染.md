# React服务端渲染

# node作中间层及请求代码优化

### 一、为什么要引入node中间层?

其实任何技术都是与它的应用场景息息相关的。这里我们反复谈的SSR，其实不到万不得已我们是用不着它的，SSR所解决的最大的痛点在于SEO，但它同时带来了更昂贵的成本。不仅因为服务端渲染需要更加复杂的处理逻辑，还因为同构的过程需要服务端和客户端都执行一遍代码，这虽然对于客户端并没有什么大碍，但对于服务端却是巨大的压力，因为数量庞大的访问量，对于每一次访问都要另外在服务器端执行一遍代码进行计算和编译，大大地消耗了服务器端的性能，成本随之增加。如果访问量足够大的时候，以前不用SSR的时候一台服务器能够承受的压力现在或许要增加到10台才能抗住。痛点在于SEO，但如果实际上对SEO要求并不高的时候，那使用SSR就大可不必了。

那同样地，为什么要引入node作为中间层呢？它是处在哪两者的中间？又是解决了什么场景下的问题？

在不用中间层的前后端分离开发模式下，前端一般直接请求后端的接口。但真实场景下，后端所给的数据格式并不是前端想要的，但处于性能原因或者其他的因素接口格式不能更改，这时候需要在前端做一些额外的数据处理操作。前端来操作数据本身无可厚非，但是当数据量变得庞大起来，那么在客户端就是产生巨大的性能损耗，甚至影响到用户体验。在这个时候，node中间层的概念便应运而生。

它最终解决的前后端协作的问题。

一般的中间层工作流是这样的:前端每次发送请求都是去请求node层的接口，然后node对于相应的前端请求做转发，用node去请求真正的后端接口获取数据，获取后再由node层做对应的数据计算等处理操作，然后返回给前端。这就相当于让node层替前端接管了对数据的操作。



### 二、SSR框架中引入中间层

在之前搭建的SSR框架中，服务端和客户端请求利用的是同一套请求后端接口的代码，但这是不科学的。

对客户端而言，最好通过node中间层。而对于这个SSR项目而言，node开启的服务器本来就是一个中间层的角色，因而对于服务器端执行数据请求而言，就可以直接请求真正的后端接口啦。

```
//actions.js
//参数server表示当前请求是否发生在node服务端
const getUrl = (server) => {
    return server ? 'xxxx(后端接口地址)' : '/api/sanyuan.json(node接口)';
}
//这个server参数是Home组件里面传过来的，
//在componentDidMount中调用这个action时传入false，
//在loadData函数中调用时传入true, 这里就不贴组件代码了
export const getHomeList = (server) => {
  return dispatch => {
    return axios.get(getUrl(server))
      .then((res) => {
        const list = res.data.data;
        dispatch(changeList(list))
      })
  }
}
```

在server/index.js应拿到前端的请求做转发，这里是直接用proxy形式来做，也可以用node单独向后端发送一次HTTP请求。

```
//增加如下代码
import proxy from 'express-http-proxy';
//相当于拦截到了前端请求地址中的/api部分，然后换成另一个地址
app.use('/api', proxy('http://xxxxxx(服务端地址)', {
  proxyReqPathResolver: function(req) {
    return '/api'+req.url;
  }
}));
```

### 三、请求代码优化

其实请求的代码还是有优化的余地的，仔细想想，上面的server参数其实是不用传递的。

现在我们利用axios的instance和thunk里面的withExtraArgument来做一些封装。

```
//新建server/request.js
import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://xxxxxx(服务端地址)'
})

export default instance


//新建client/request.js
import axios from 'axios'

const instance = axios.create({
  //即当前路径的node服务
  baseURL: '/'
})

export default instance
复制代码

```

然后对全局下store的代码做一个微调:

```
import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import { reducer as homeReducer } from '../containers/Home/store';
import clientAxios from '../client/request';
import serverAxios from '../server/request';

const reducer = combineReducers({
  home: homeReducer
})

export const getStore = () => {
  //让thunk中间件带上serverAxios
  return createStore(reducer, applyMiddleware(thunk.withExtraArgument(serverAxios)));
}
export const getClientStore = () => {
  const defaultState = window.context ? window.context.state : {};
   //让thunk中间件带上clientAxios
  return createStore(reducer, defaultState, applyMiddleware(thunk.withExtraArgument(clientAxios)));
} 
```

现在Home组件中请求数据的action无需传参，actions.js中的请求代码如下：

```
export const getHomeList = () => {
  //返回函数中的默认第三个参数是withExtraArgument传进来的axios实例
  return (dispatch, getState, axiosInstance) => {
    return axiosInstance.get('/api/sanyuan.json')
      .then((res) => {
        const list = res.data.data;
        console.log(res)
        dispatch(changeList(list))
      })
  }
}
复制代码

```

至此，代码优化就做的差不多了，这种代码封装的技巧其实可以用在其他的项目当中，其实还是比较优雅的。