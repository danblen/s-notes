**1-**  **仿微信读书：**基于Vue + Axios + Epub.js + Mock.js + Nginx + Express的移动端读书应用

(1)  首页主要有热门推荐，分类推荐，全部分类，随机推荐通过弹出卡片和动画随机推荐一本书，搜索页面实现了书籍搜索功能。

(2)  书架页面完成图书列表展示，根据屏幕大小动态计算图书封面的高度，开发了书架编辑模式，通过vue-create-api插件实现footer编辑组件弹出框，完成了书架分组功能。使用IndexedDB数据库对电子书进行离线缓存。

(3)  通过动态路由动态的向阅读器组件传入电子书路径，通过Epubjs对电子书的解析，通过theme对象切换主题，运用了localStorage缓存阅读器的字体和字号等配置，通过mixin和vuex机制抽离公共代码，对组件进行解耦。

(4)  阅读进度控制使用了html5的range控件，通过Epubjs的locations对象实现了定位和阅读百分比的显示，添加了阅读器的目录功能。完成了书签功能，通过绝对定位和动态加载transition实现了添加书签的动画效果，添加了对鼠标事件的支持。

**2-**  **图书管理平台：**基于Vue + Element-UI + Axios + Multer + Epub.js + Express的PC端SPA应用

(1)  使用jwt生成token，通过Axios请求拦截器添加token，路由导航守卫实现路由过滤，配置路由重定向，实现了权限校验和登录功能。通过multer实现电子书上传，完成了图书增删改查，通过权限控制模块控制不同用户可以进行的操作。

(2)  通过vue.config,js修改webpack默认配置，为开发模式和生产模式指定不同的打包入口，配置路由懒加载，图片懒加载，其他功能组件预加载来提高性能。

(3)  对第三方库配置加载外部CDN资源，优化Element-UI打包，减少了chunk-vendor打包文件大小。

**3-**  **公共博客平台：**基于Vue + Element-UI + Lodash + SpringBoot + MySQL 

(1)  主要功能首页完成文章列表、最新文章，导航栏根据分类、标签、文章归档查看文章。

(2)  完成了用户登录、注册、退出，基于token进行权限控制，文章作者具有编辑、删除功能，添加了对文章评论功能。

优化了部分样式，通过提取公共组件、webpack代码分块对打包后的js文件进行优化等方法提高性能









# 项目总结

net::ERR_CERT_COMMON_NAME_INVALID

### 阅读器开发过程

#### 动态路由

通过动态路由动态的向EbookReader组件传入电子书路径

掌握了动态路由的配置方式

#### 阅读器解析

在EbookReader组建中实现了阅读器的解析和渲染

```js
// 阅读器解析
initEpub () {...}
```

了解了Epubjs的解析方式

#### 环境变量

通过 vue-cli 3.0 新建.env.development文件，管理引入环境变量

```js
.env.development
VUE_APP_RES_URL=http://192.168.0.156:9000/
```

掌握了vue-cli 3.0 的环境变量配置

#### 手势操作翻页

通过手势操作实现了电子书的翻页，主要通过rendition.on方法绑定了touchstart和touchend事件对手势进行识别

```js
this.rendition.on('touchstart', event => {
    ...
})
this.rendition.on('touchend', event => {
    ...
})
```

掌握了手势操作的识别

#### mixin、vuex机制

集成了阅读器的标题和菜单组件，集成了mixin和vuex机制对组件进行解耦

```js
mixin.js
book.js
actions.js
getters.js
index.js
```

了解了与之前不同的架构方式，正在运用中... 待掌握

#### 字体风格字号设置

```
this.rendition.hooks.content.register(contents => {
          Promise.all([
```

实现了字体风格和字号设置，运用了localstorage缓存阅读器的配置，引入了vue-i18n国际化插件实现了中英文两种语言的切换

了解了vue-i18n国际化的运用和Epubjs的字体设置

#### 全局主题设置

```
this.themeList.forEach(theme => {
          this.rendition.themes.register(theme.name, theme.style)
        })
        this.rendition.themes.select(defaultTheme)
```

实现了主题设置功能，分为两部分：

1. 阅读器的主题：阅读器的主题主要是通过Epubjs实现。核心方法是通过theme对象的register方法注册主题，select方法切换主题。
2. App界面的主题：App界面的主题主要是通过动态添加删除css实现的

了解了Epubjs的主题样式设置

#### 阅读器进度

阅读进度的实现，使用了html5的range控件，通过Epubjs的locations对象实现了定位和阅读百分比的显示，还实现了上一章下一章以及获取当前名称还有阅读时间统计的功能

```js
// 拖动进度条过程
onProgressInput (progress) {
	this.setProgress(progress).then(() => {
	this.updateProgressBackground()
   })
}
  
// 进度条拖动结束松手
onProgressChange (progress) {
	this.setProgress(progress).then(() => {
      this.displayProgress()
      this.updateProgressBackground()
    })
 }
 
// 展示当前进度所在的页面
displayProgress () {
  const cfi = this.currentBook.locations.cfiFromPercentage(this.progress / 100)
  this.display(cfi)
}

// 进度条左键头点击翻页
prevSection () {
  if (this.section > 0 && this.bookAvailable) {
    this.setSection(this.section - 1).then(() => {
      this.displaySection()
    })
  }
}

// 进度条右键头点击翻页
nextSection () {
  if (this.section < this.currentBook.spine.length - 1 && this.bookAvailable) {
    this.setSection(this.section + 1).then(() => {
      this.displaySection() 
    })
  }
}
```

运用了HTML5的range控件，了解了Epubjs的locations对象

#### 阅读器目录功能

实现了阅读器的目录功能，值得一提的是封装了一个flatten方法，flatten方法运用了ES6的新特性，将一个树状结构转变为了一维数组，并封装一个find方法判断出了每一个对象所属的层级，实现了多级目录的缩进展示。

```js
// flatten方法
export function flatten (arr) {
  return [].concat(...arr.map(item => [].concat(item, ...flatten(item.subitems))))
}

// flatten方法结合find方法实现目录缩进
this.book.loaded.navigation.then(nav => {
  const navItem = flatten(nav.toc)
  function find(item, level = 0) {
    return !item.parent ? level : find(navItem.filter(parentItem =>
       parentItem.id === item.parent)[0], ++level)
  }
  navItem.forEach(item => {
    item.level = find(item)
  })
})
```

了解了如何解析电子书的内容，获取了电子书封面、作者、标题等信息。

学习到了将树状结构转变成一维数组，实现出多级目录缩进显示

#### 全文搜索

通过官方搜索算法实现了全文搜索功能，搜索关键字的高亮显示，以及精确跳转关键字的位置和阅读器中的文字高亮显示，重点研究了如何通过ES6将二维数组转变为一维数组。

```js
//全局搜索功能
search () {
  if (this.searchText && this.searchText.length > 0) {
    this.doSearch(this.searchText).then(list => {
      this.searchList = list
        // 二维数组转一维数组
      this.searchList.map(item => {
        item.excerpt = item.excerpt = item.excerpt.replace(this.searchText, `<span 			class="content-search-text">${this.searchText}</span>`)
        return item
      })
    })
  }
}
```

了解了官方搜索算法

重点学习到了如何将二维数组转成一维数组

#### 阅读器书签功能

实现了书签功能，主要是通过touchmove和touchend事件实现了复杂的手势交互

手势操作的要点：

1. 通过绝对定位改变top值的方法实现了整个界面的下拉效果

   ```js
   // 下拉设置top值
   move (v) {
     this.$refs.ebook.style.top = v + 'px'
   }
   ```

2. 通过动态加载transition实现了界面的回弹动画

   ```js
   // 回弹动画设置
   restore () { ... }
   ```

3. 通过css绘制了一个底部透明三角的书签

   ```css
   .bookmark {
     width: 0;
     height: 0;
     border-width: px2rem(36) px2rem(10) px2rem(10) px2rem(10);
     border-style: solid;
     border-color: white white transparent white;
   }
   ```

4. 设置了不同的状态来区分手势操作的不同阶段，触发不同的操作

   ```js
   // 状态1：未超过书签的高度
   beforeHeight () { ... }
   
   //  状态2：未到达临界状态
   beforeThreshold (v) { ... }
   
   // 状态3： 超越临界状态
   afterThreshold (v) { ... }
   
   // 状态4：书签归位
   restore () { ... }
   ```

学习到了如何通过绝对行为改变top值实现整个界面的下拉，通过css绘制一个书签

研究了利用不同的四种状态来区分手势操作的不同阶段而触发不同的操作

#### 添加删除书签

实现了添加书签的功能，比较重点的是如何获取当前书签所在页的文本内容。之后实现了书签删除的功能，主要是运用了ES6的filter方法做数组删除操作

```js
// 添加书签
addBookmark () { ... }

// 删除书签
removeBookmark () { ... }
```

了解了如何获取当前书签所在页的文本内容

重温了ES6的 filter 方法

#### 微信端适配

#### 兼容PC端鼠标事件

添加了页眉和页脚，如何通过滚动模式阅读电子书，对微信端做了一些适配，同时兼容了PC端。兼容PC端的时候对css进行了一些优化，

添加了对鼠标事件的支持，通过@mousedown、@mousemove、@mouseup完成对书签下拉动画的支持。鼠标事件比手势事件更加复杂一点，通过四种状态来解决开发鼠标事件中的问题。

```js
// 鼠标事件的四种状态
// 1. 鼠标进入
// 2. 鼠标进入后的移动
// 3. 鼠标从移动状态松手
// 4. 鼠标还原

// 鼠标左键点击
onMouseEnter (e) {
  this.mouseState = 1
  this.mouseStartTime = e.timeStamp
  e.preventDefault()
  e.stopPropagation()
}

// 鼠标左键下拉
onMouseMove (e) {
  if (this.mouseState === 1) {
    this.mouseState = 2
  } else if (this.mouseState === 2) {
    let offsetY = 0
    if (this.firstOffsetY) {
      offsetY = e.clientY - this.firstOffsetY
      this.setOffsetY(offsetY)
    } else {
      this.firstOffsetY = e.clientY
    }
  }
  e.preventDefault()
  e.stopPropagation()
}

// 鼠标左键下拉松开还原
onMouseEnd (e) {
  if (this.mouseState === 2) {
    this.setOffsetY(0)
    this.firstOffsetY = null
    this.mouseState = 3
    e.preventDefault()
    e.stopPropagation()
  } else {
    this.mouseState = 4
  }
  const time = e.timeStamp - this.mouseStartTime
  if (time < 100) {
    this.mouseState = 4
  }
  e.preventDefault()
  e.stopPropagation()
}
```

重点学习了如何兼容PC端的鼠标事件

#### 阅读器分页算法

实现了阅读器的分页算法

```js
// 阅读器的分页
this.book.ready.then(() => { ... })
```

了解了Epubjs的阅读器分页算法













### 书城开发

#### 需求分析

标题 + 搜索 → 随机推荐 → 猜你喜欢 → 热门推荐 → 精选 → 分类推荐 → 全部分类 → 分类列表 → 搜索列表 → 详情页

#### 难点

标题搜索页和随机推荐的交互实现

标题搜索框滑动的交互难点：搜索框向上移动的过程中逐渐变窄，左边的返回按钮在搜索框上移的时候会有一个轻微的移动动画

#### 标题搜索页交互细节

1. 向下滑动时标题文本和右侧的图标有一个向下的渐影并且消失的过程
2. 搜索框向上移动到标题的位置
3. 搜索框向上移动的过程中会逐渐的变窄 （难点）
4. 左侧的返回按钮会向下微微的移动
5. 没有移动之前下方没有阴影，移动之后下方会产生阴影，复原之后阴影消失

#### 推荐交互逻辑

1. 弹出卡片
2. 卡片翻转动画 （难点）
3. 烟花动画
4. 弹出推荐图书

#### 基础布局

flex布局

#### 搜索实现

input绑定keyup事件，回车触发搜索

















### 书架开发

#### 书架标题组件

组件基本架子、基础样式

#### 

#### 书架标题组件交互

主要逻辑：点击编辑按钮出现取消按钮，标题下的文本随着书籍的数量改变，如果不在编辑状态标题下的文本隐藏，取消按钮切换成编辑按钮

#### 书架搜索框布局

运用了基础的flex布局

#### 书架搜索框的交互

主要逻辑：当进入书架的时候滑动页面，搜索框会跟着图书列表一起移动，点击搜索框之后出现tab，搜索框会向上移动并且有过度动画，当tab出现之后滑动页面之后，搜索框和tab固定住，列表进行滑动

#### 标题搜索框样式优化

优化了过度动画不流畅，添加了滚动阴影

#### 数据获取

使用了axios的常用api获取到了电子书的全部数据

#### 书架图书列表展示

获取数据之后对数据进行了展示

#### 书架图书列表布局

根据屏幕的不同大小动态计算了图书封面的高度，使用了基本的flex布局

#### 书架添加书籍开发

基础样式开发

主要逻辑：点击添加图标的时候跳转到首页，选择图书添加到书架

#### 书架编辑模式开发

主要逻辑：点击编辑按钮的时候，封面右下角出现多选图标，页面底部出现footer组件并且含有过渡动画。当没有选中多选图标的时候，footer组件的透明度为0.5，当选中多选图标的时候，标题下的文本会根据书籍的数量而改变字段，footer组件透明度为1

#### Footer组件弹出框

通过vue-create-api插件实现

#### 弹出框功能实现

主要逻辑：在选中图书后，点击footer中的按钮的时候，根据不同的状态显示不同的内容并且具有不同的功能

#### 电子书离线缓存

主要知识点：IndexedDB数据库

IndexedDB数据库特点：存储容量大一般不少于250M，甚至没有上限 、异步 、支持二进制存储等等，不仅可以存储字符串，还可以存储二进制文件（ArrayBuffer对象和blob对象），这里电子书就是blob对象。

#### Localforage库

通过npm下载 localforage库

localforage库是开源的可以对indexedDB数据库操作的库

基于localforage的简单封装

```js
// 全部都是异步，通过回调操作

// 因为是本地数据库，所以提供了key，data   cb：成功的回调  cb2：失败的回调
export function setLocalFroage (key, data, cb, cb2) {
    // setItem设置完成之后返回一个promise对象
    localForage.setItem(key, data).then((value) => {
        if (cb) cb(value)
    }).catch(function(err) {
        if (cb2) cb2(err)
    })
}

// 与set类似
export function getLocalForage (key, cb) {
    localForage.getItem(key, (err, value) => {
        cb(err, value)
    })
}

// 根据key删除指定数据
export function removeLocalForage (key, cb, cb2) {
    localForage.removeItem(key).then(function() {
        cb()
    }).catch(function(err) {
        cb2(err)
    })
}

// 清空所有数据
export function clearLocalForage (cb, cb2) {
    localForage.clear().then(function() {
        if (cb) cb()
    }).catch(function(err) {
        if (cb2) cb2(err)
    })
}

// 获取indexedDB中一共有多少key
export function lengthLocalForage (cb) {
    localForage.length().then(
        numberOfKeys => {
            if(cb) cb(numberOfKeys)
        }).catch(function(err) {
        console.log(err)
    })
}

// 遍历key、value
export function iteratorLocalForage () {
    localForage.iterate(function(value, key, iterationNumber) {
        console.log([key, value])
    }).then(function() {
        console.log('Iteration has completed')
    }).catch(function(err) {
        console.log(err)
    })
}

// 判断当前浏览器是否支持indexedDB
export function support () {
    const indexedDB = window.indexedDB || window.webkitIndexedDB || 		window.mozIndexedDB || null
    if (indexedDB) {
        return true
    } else {
        return fasle
    }
}
```

#### 书架分组功能开发

主要逻辑：弹出对话框，选择书籍移动到某个分组。

弹出框实现思路：定义一个dialog，根据dialog定义里面不同的样式（把dialog做成一个通用组件），通过 vue-create-api 来做显示隐藏。

加入分组实现思路：获取到选中书籍，根据dialog弹框的按钮选中某个分组，然后把书籍添加到选中分组中。添加完毕之后会有一个布局变动的动画。

#### 书架分类开发

主要逻辑：点击某个分组进入当前分组页，选中一本或多本书籍可以移除分类、创建分类、删除分类，左上角有修改按钮，点击之后可以编辑修改当前分类名称。

### 听书页面开发

#### 听书功能总结

基本没有什么难点，主要是audio的三个事件，canplay事件timeupdate事件和ended事件

获取语音合成的API

重点需要注意两个主要状态，一个是当前是否播放，一个是当期播放的状态









### 总结

学习到了vue-cli 3.0的搭建，以及一些基本的配置

学习到了与之前开发不同的动态路由配置

学习到了Nginx的使用

重温了vuex的运用

学习到了mixin、vuex机制的架构方式

重温了ES6的一些方法，能在各种场景更加灵活的运用

重温了flex布局和touch事件

了解了Epubjs阅读器基本API的使用方法

了解了vue-i18n国际化和vue-create-api的使用

学习到了数组降维，树状结构转变一维数组，实现多级目录缩进显示

学习到了移动端touch事件如何兼容PC端的mouse事件

学习到了浏览器indexedDB数据库的使用

了解了基于indexedDB的操作库 localForage

学习了H5的audio控件的常用方法和状态控制

了解了科大讯飞在线语音合成API

[学习了Node.je](http://xn--node-9m5fzh073f.je/) + express 编写API

【非常深刻的体会到这种架构方式的优势：大大降低组件之间的耦合度，大幅度提高代码的可维护性可扩展性】

#### 跨域

应该是浏览器允许发出跨域请求（原本以为浏览器直接限制了，不让发），然后服务器会把特殊信息`Access-Control-Allow-Origin`等附在headers上，再然后浏览器根据这些信息进行放行或阻断



`static file`

http 

`home page`

img https://47.99.166.157/book/img

jpg https://47.99.166.157/book/res/home_banner.jpg

数据xhr https://47.99.166.157:18081/book/home2

js css http

`detail page`

xhr opf ncx css https://47.99.166.157:18081/book/detail?

`ebook`

https://47.99.166.157/epub2/

VUE_APP_RES_URL=https://47.99.166.157 用到了ebook
VUE_APP_EPUB_URL=https://47.99.166.157/epub
VUE_APP_BASE_URL=https://47.99.166.157:18081
VUE_APP_BOOK_URL=//47.99.166.157:3000
VUE_APP_EPUB_OPF_URL=https://47.99.166.157/epub2
VUE_APP_VOICE_URL=https://47.99.166.157:3000



https://book.youbaobao.xyz:18081/book/home2

GET /book/home2 HTTP/1.1
Host: book.youbaobao.xyz:18081
Connection: keep-alive
Pragma: no-cache
Cache-Control: no-cache
Accept: application/json, text/plain, */*
User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1
Origin: http://www.youbaobao.xyz
Sec-Fetch-Site: cross-site
Sec-Fetch-Mode: cors
Sec-Fetch-Dest: empty
Referer: http://www.youbaobao.xyz/book/
Accept-Encoding: gzip, deflate, br
Accept-Language: en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7



HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 30499
ETag: W/"7723-EZR80kegp8MX+PY27bL3+Hb/JXg"
Date: Sat, 09 May 2020 06:54:01 GMT
Connection: keep-alive

















# 图书管理平台

vue-element-admin创建	element-UI	

jwt 登录认证	epub电子书解析	multer文件上传	xml2js xml解析	adm自定义的电子书解析

![image-20200529115043544](C:\Users\19206\AppData\Roaming\Typora\typora-user-images\image-20200529115043544.png)

动态路由 

router.beforeEach()路由的全局守卫，所有的路由都会经过这个方法处理

router.afterEach() nprogress.done，路由访问成功之后

meta 下定义哪些权限，哪些角色可以访问这个路径、菜单（admin）

async路由 ，匹配 * , 若上面都匹配不到，返回404页面 （小技巧）







### 五、使用JWT完成认证授权

JWT(即Json Web Token)目前最流行的跨域身份验证解决方案之一。它的工作流程是这样的：

1.前端向后端传递用户名和密码

2.用户名和密码在后端核实成功后，返回前端一个token(或存在cookie中)

3.前端拿到token并进行保存

4.前端访问后端接口时先进行token认证，认证通过才能访问接口。

那么在koa中我们需要做哪些事情？

在生成token阶段：首先是验证账户，然后生成token令牌，传给前端。

在认证token阶段: 完成认证中间件的编写，对前端的访问做一层拦截，token认证过后才能访问后面的接口。

#### 1.生成token

先安装两个包:

npm install jsonwebtoken basic-auth --save



#### 前端项目初始化步骤

1. 安装 Vue 脚手架
2. 通过 Vue-Cli 创建项目
3. 配置 Vue-router
4. 配置 Element-UI 组件库
5. 配置 Axios 库
6. 初始化 git 远程仓库

##### 相关依赖-按需导入

![img](https://gitee.com/wBekvam/vue-shop-admin/raw/master/image/mall_desc03.png)

#### 后端项目的环境安装配置

1. 安装MySQL数据库
2. 安装Node.js环境
3. 配置项目相关信息
4. 启动项目
   1. 使用phpstudy导入数据库并运行
   2. npm init 后端项目
   3. node ./app.js
5. 使用Postman测试后台项目接口是否正常

### 登录概述

#### 登录业务流程

1. 在登录页面输入用户名和密码
2. 调用后台接口进行验证
3. 通过验证之后,根据后台的响应状态跳转到项目主页

#### 登录业务相关技术点

1. http是无状态的
2. 通过cookie在客户端记录状态
3. 通过sesion在服务器端记录状态
4. 通过token维持状态(不允许跨域使用)

#### 登录业务流程

##### 登录页面的布局

通过Element-UI组件实现布局

- el-form
- el-form-item
- el-input
- el-button
- 字体图标

##### 创建git分支

```
// 创建并切换登录分支
git checkout -b login

// login分支合并到主分支
// 1.切换到master分支
git checkout master
// 2.合并分支到master
git merge login

// 将本地login子分支推送到github
git push -u origin login
```

##### 路由导航守卫控制访问权限

> 如果用户没有登录,但是直接通过URL访问特定页面,需要重新导航到登录页面

```js
//为路由对象,添加beforeEach导航守卫
router.beforeEach((to,from,next) => {
    //如果用户访问的登录页,直接放行
    if (to.path === 'login') return next()
    //从sessionStorage中获取到保存的token值
    const tokenStr = window.sessionStorage.getItem('token')
    //如果么有token,强制跳转到登录页
    if(!tokenStr) return next('/login')
    next()
})
```

### 主页布局

#### 通过接口获取菜单数据

> 通过axios请求拦截器添加token,保证拥有获取数据的权限

```js
// axios请求拦截
axios.interceptors.request.use(config => {
    // 为请求头对象,添加token验证的Authorization字段
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
})
```









### 权限管理

#### 权限管理业务分析

> 通过权限管理模块控制不同的用户可以进行哪些操作,具体可以通过角色的方式进行控制,即每个用户分配一个特定的角色,角色包括不同的功能权限

### 分类管理

#### 商品分类概述

> 商品分类用于在购物时,快速找到需要购买的商品,进行直观显示

### 参数管理

#### 参数管理概述

> 商品参数用于显示商品的特征信息,可以通过电商平台详情页面直观的看到

### 项目所用依赖(vue全家桶不描述)

1. 运行依赖

- axios => 发送请求
- echarts => 图表
- element-ui => element ui组件
- lodash => js工具库,该项目用到深拷贝与对象合并，是一个一致性、模块化、高性能的 JavaScript 实用工具库。
- moment => 时间处理工具库
- nprogress => 进度条库
- v-viewer => 图片预览工具库
- vue-quill-editor => 富文本编辑器
- vue-table-with-tree-grid => 树形菜单/表格

1. 开发依赖

- babel => es6+语法转换
- eslint/babel-eslint => 语法检查
- less/less-loader => less语法
- babel-plugin-transform-remove-console => 移除console插件









### 项目优化

### 项目优化策略

- 生成打包报告

  - 通过命令行参数形式生成报告=>vue-cli-service build --report
  - 通过可视化ui面板直接查看报告(通过控制台和分析面板)

- 通过vue.config.js修改webpack的默认配置

  > 通过vue-cli 3.0工具生成的项目,默认隐藏了所有webpack的配置项,目的是为了屏蔽项目的配置过程,让开发人员把工作的 重心,放在具体功能和业务逻辑的实现上

- 为开发模式与发布模式指定不同的打包入口

  > 默认情况下,vue项目的开发与发布模式,共用同一个打包的入口文件(即src/main.js),为了将项目的开发过程与发布过程分离,可以为两种模式,各自指定打包的入口文件,即:
  >
  > 1. 开发模式入口文件 src/main-dev.js
  > 2. 发布模式入口文件 src/main-prod.js
  >
  > 方案：configureWebpack(通过链式编程形式)和chainWebpack(通过操作对象形式)
  >
  > 在vue.config.js导出的配置文件中,新增configureWebpack或chainWebpack节点,来自定义webpack的打包配置

  ```js
  // 代码示例
  module.exports = {
      chainWebpack: config => {
          // 发布模式
          config.when(process.env.NODE_ENV === 'production', config => {
              config.entry('app').clear().add('./src/main-prod.js')
          })
          // 开发模式
          config.when(process.env.NODE_ENV === 'development', config => {
              config.entry('app').clear().add('./src/main-dev.js')
          })
      }
  }
  ```

- 第三方库启用CDN

  - 通过externals加载外部cdn资源

  > 默认情况下,通过import语法导入的第三方依赖包,最终会打包合并到同一个文件中,从而导致打包成功后,单文件体积过大的问题 => **chunk-vendors**体积过大
  >
  > 为了解决上述问题,可以通过webpack的externals节点,来配置加载外部的cdn资源,凡是声明在externals中的第三方依赖包,都不会被打包

  1. 步骤1

  ```js
  module.exports = {
      chainWebpack: config => {
          config.when(process.env.NODE_ENV === 'production', config => {
              config.entry('app').clear().add('./src/main-prod.js')
              // 在vue.config.js如下配置
              config.set('externals', {
                  vue: 'Vue',
                  'vue-router': 'VueRouter',
                  axios: 'axios',
                  lodash: '_',
                  echarts: 'echarts',
                  nporgress: 'NProgress',
                  'vue-quill-editor': 'VueQuillEditor'
              })
          })
          config.when(process.env.NODE_ENV === 'development', config => {
              config.entry('app').clear().add('./src/main-dev.js')
          })
      }
  }
  ```

  1. 步骤2

  > 在public/index.html文件头部,将main-prod中的已经进行配置的import(`样式表`)删除替换为cdn引入

  1. 步骤3

  > 在public/index.html文件头部,将main-prod中的已经进行配置的import(`js文件`)删除替换为cdn引入

  1. cdn加速前后对比( **chunk-vendors**打包文件)

  > Parsed大小 2.6m=> **596.9kB**

  - 使用cdn优化elementui打包

    > 具体操作流程
    >
    > 1. 在main-prod.js中,注释掉element-ui按需加载的代码
    > 2. 在index.html头部区域中,通过cdn加载element-ui的js和css样式

- 首页内容定制

  > 不同打包环境下,首页内容可能会有所不同,通过插件方式定制

  - vue.config.js配置

  ```js
  config.plugin('html').tap(args => {
      args[0].isProd = true或false
      return args
  })
  ```

  - index.html修改

  ```html
  <!-- 开发模式:使用import,发布模式:使用cdn -->
  <title><%= htmlWebpackPlugin.options.isProd ? '' : 'dev-' %>vue-mall</title>
  <% if(htmlWebpackPlugin.options.isProd) { %>
      css | js放在这儿
  <% } %>
  ```

- Element-UI组件按需加载

- 路由懒加载

  > 在打包构建项目时,javascript包会变得特别大,影响页面加载,如果我们能把不同路由对应的组件分隔成不同的代码块,然后当路由被访问的时候才加载对应组件,这样更加高效

  - 安装@babel/plugin-syntax-dynamic-import包
  - 在babel.config.js配置文件声明该插件
  - 将路由改为按需加载形式

  ```js
  // 示例:
  const Foo = () => import(/* webpackChunkName: "group-foo" */ './Foo.vue')
  const Bar = () => import(/* webpackChunkName: "group-foo" */ './Bar.vue')
  const Baz = () => import(/* webpackChunkName: "group-foo" */ './Baz.vue')
  
  // import Login from '../components/Login.vue'
  const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Login.vue')
  // import Home from '../components/Home.vue'
  const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Home.vue')
  // import Welcome from '../components/Welcome.vue'
  const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Welcome.vue')
  ...
  ```

  `具体内容参考文章底部链接`

































前端很有经验，没时间复习，有些细节记不清楚

学院，专业电子，对互联网，前后端，也上过编程课，c语言，数据结构，自学前端，会一点安卓和后端，和老师做过一个二维码有关的安卓应用，以后想深入领域，所以我来面试前端

































