###  webpack 是什么

现代 `JavaScript` 应用程序的静态模块打包器，会递归构建一个依赖关系图，其中包含应用程序需要的每个模块，然后将这些模块打包成一个或多个 `bundle`。

###  webpack 的核心概念

- entry: 入口
- output: 输出
- loader: 模块转换器，用于把模块原内容按照需求转换成新内容
- plugins: 扩展插件，在webpack构建流程中的特定时机注入扩展逻辑来改变构建结果或做你想要做的事情

###  初始化项目

新建一个文件夹，如: `webpack-first` (当然，你可以使用任意一个你喜欢的项目名)。推荐大家参考本文一步一步进行配置，不要总是在网上找什么最佳配置，你掌握了`webpack`之后，根据自己的需求配置出来的，就是最佳配置。

本篇文章对应的项目地址(编写本文时使用): [github.com/YvetteLau/w…](https://github.com/YvetteLau/webpack/tree/master/webpack-first)

使用 `npm init -y` 进行初始化(也可以使用 `yarn`)。

要使用 `webpack`，那么必然需要安装 `webpack`、`webpack-cli`:

```
npm install webpack webpack-cli -D 
```

鉴于前端技术变更迅速，祭出本篇文章基于 `webpack` 的版本号:

```
├── webpack@4.41.5 
└── webpack-cli@3.3.10  
```

从 `wepack V4.0.0` 开始， `webpack` 是开箱即用的，在不引入任何配置文件的情况下就可以使用。

新建 `src/index.js` 文件，我们在文件中随便写点什么:

```
//index.js
class Animal {
    constructor(name) {
        this.name = name;
    }
    getName() {
        return this.name;
    }
}

const dog = new Animal('dog'); 
```

使用 `npx webpack --mode=development` 进行构建，默认是 `production` 模式，我们为了更清楚得查看打包后的代码，使用 `development` 模式。

可以看到项目下多了个 `dist` 目录，里面有一个打包出来的文件 `main.js`。

`webpack` 有默认的配置，如默认的入口文件是 `./src`，默认打包到`dist/main.js`。更多的默认配置可以查看: `node_modules/webpack/lib/WebpackOptionsDefaulter.js`。

查看 `dist/main.js` 文件，可以看到，`src/index.js` 并没有被转义为低版本的代码，这显然不是我们想要的。

```
{
    "./src/index.js":
        (function (module, exports) {

            eval("class Animal {\n    constructor(name) {\n        this.name = name;\n    }\n    getName() {\n        return this.name;\n    }\n}\n\nconst dog = new Animal('dog');\n\n//# sourceURL=webpack:///./src/index.js?");

        })
} 
```

## babel相关

###  将JS转义为低版本

前面我们说了 `webpack` 的四个核心概念，其中之一就是 `loader`，`loader` 用于对源代码进行转换，这正是我们现在所需要的。把js代码转化成AST抽象语法树，然后将它编译出新的语法出来

将JS代码向低版本转换，我们需要使用 `babel-loader`。

#### babel-loader

首先安装一下 `babel-loader`

```
npm install babel-loader -D 
```

此外，我们还需要配置 `babel`，为此我们安装一下以下依赖:

```
npm install @babel/core @babel/preset-env @babel/plugin-transform-runtime -D

npm install @babel/runtime @babel/runtime-corejs3 
```

对babel7配置不熟悉的小伙伴，可以阅读一下这篇文章: [不可错过的 Babel7 知识](https://juejin.im/post/5ddff3abe51d4502d56bd143)

新建 `webpack.config.js`，如下:

```
//webpack.config.js
module.exports = {
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: ['babel-loader'],
                exclude: /node_modules/ //排除 node_modules 目录
            }
        ]
    }
} 
```

建议给 `loader` 指定 `include` 或是 `exclude`，指定其中一个即可，因为 `node_modules` 目录通常不需要我们去编译，排除后，有效提升编译效率。

这里，我们可以在 `.babelrc` 中编写 `babel` 的配置，也可以在 `webpack.config.js` 中进行配置。

#### 创建一个 .babelrc

配置如下：

```
{
    "presets": ["@babel/preset-env"],
    "plugins": [
        [
            "@babel/plugin-transform-runtime",
            {
                "corejs": 3
            }
        ]
    ]
}  
```

现在，我们重新执行  `npx webpack --mode=development`，查看 `dist/main.js`，会发现已经被编译成了低版本的JS代码。

#### 在webpack中配置 babel

```
//webpack.config.js
module.exports = {
    // mode: 'development',
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ["@babel/preset-env"],
                        plugins: [
                            [
                                "@babel/plugin-transform-runtime",
                                {
                                    "corejs": 3
                                }
                            ]
                        ]
                    }
                },
                exclude: /node_modules/
            }
        ]
    }
} 
```

这里有几点需要说明：

- `loader` 需要配置在 `module.rules` 中，`rules` 是一个数组。
- `loader` 的格式为:

```
{
    test: /\.jsx?$/,//匹配规则
    use: 'babel-loader'
}  
```

或者也可以像下面这样:

```
//适用于只有一个 loader 的情况
{
    test: /\.jsx?$/,
    loader: 'babel-loader',
    options: {
        //...
    }
}  
```

`test` 字段是匹配规则，针对符合规则的文件进行处理。

`use` 字段有几种写法

- 可以是一个字符串，例如上面的 `use: 'babel-loader'`
- `use` 字段可以是一个数组，例如处理CSS文件是，`use: ['style-loader', 'css-loader']`
- `use` 数组的每一项既可以是字符串也可以是一个对象，当我们需要在`webpack` 的配置文件中对 `loader` 进行配置，就需要将其编写为一个对象，并且在此对象的 `options` 字段中进行配置，如：

```
rules: [
    {
        test: /\.jsx?$/,
        use: {
            loader: 'babel-loader',//webpack与babel桥梁
            options: {
                presets: [["@babel/preset-env",//babel主要模块，定义各种转化规则
                    targets: {
                      edge: "17",
                      chrome: "67",
                    }
                    useBuiltIns: 'usage'	//减少不必要的引入
                ]]
            }
        },
        exclude: /node_modules/
    }
]  
```

上面我们说了如何将JS的代码编译成向下兼容的代码，当然你可以还需要一些其它的 `babel` 的插件和预设，例如 `@babel/preset-react`，`@babel/plugin-proposal-optional-chaining` 等

1 业务代码中 `@babel/poly-fill` 引入更低版本的库 promise实现，map实现

减少打包体积useBuiltIns: 'usage' 设置之后不需要在业务代码里import  @babel/poly-fill

2 生成第三方库 @babel/plugin-transform-runtime 不污染全局环境 减少打包体积

`@babel/preset-react`打包react 代码

``` 
{
    presets: [
    	["@babel/preset-env",
           	targets: {
          	edge: "17",
         	chrome: "67",
         	}
         useBuiltIns: 'usage'	//减少不必要的引入
         ],
          "@babel/preset-react"
    ]
}  
```



## dev-server

### 如何在浏览器中实时展示效果

说了这么多，到现在还没能在浏览器中实时查看效果，是不是已经有点捉急了，先看一下如何实时查看效果吧，不然都不知道自己配得对不对。

话不多说，先装依赖:

```
npm install webpack-dev-server -D  
```

修改下咱们的 `package.json` 文件的 `scripts`：

```js
"scripts": {
    "dev": "cross-env NODE_ENV=development webpack-dev-server",
    "build": "cross-env NODE_ENV=production webpack"
}, 
```

在控制台执行 `npm run dev`，启动正常，页面上啥也没有，修改下我们的JS代码，往页面中增加点内容，正常刷新(也就是说不需要进行任何配置就可以使用了)。

Excuse me。怪我平时不认真咯，每次都乖乖的配个 `contentBase`，原来根本不需要配，带着疑问，我又去搜寻了一番。

原来在配置了 `html-webpack-plugin` 的情况下， `contentBase` 不会起任何作用，也就是说我以前都是白配了，这是一个悲伤的故事。

不过呢，我们还是可以在 `webpack.config.js` 中进行 `webpack-dev-server` 的其它配置，例如指定端口号，设置浏览器控制台消息，是否压缩等等:

```
//webpack.config.js
module.exports = {
    //...
    devServer: {
        contentBase: './dist',//在哪个目录下启动服务器
        open: true,//打开网页
        port: '3000', //默认是8080
        quiet: false, //默认不启用
        inline: true, //默认开启 inline 模式，如果设置为false,开启 iframe 模式
        stats: "errors-only", //终端仅打印 error
        overlay: false, //默认不启用
        clientLogLevel: "silent", //日志等级
        compress: true //是否启用 gzip 压缩
    }
}  
```

- 启用 `quiet` 后，除了初始启动信息之外的任何内容都不会被打印到控制台。这也意味着来自 `webpack` 的错误或警告在控制台不可见 ———— 我是不会开启这个的，看不到错误日志，还搞个锤子
- `stats`: "errors-only" ， 终端中仅打印出 `error`，注意当启用了 `quiet` 或者是 `noInfo` 时，此属性不起作用。 ————— 这个属性个人觉得很有用，尤其是我们启用了 `eslint` 或者使用 `TS`进行开发的时候，太多的编译信息在终端中，会干扰到我们。
- 启用 `overlay` 后，当编译出错时，会在浏览器窗口全屏输出错误，默认是关闭的。 

- `clientLogLevel`: 当使用内联模式时，在浏览器的控制台将显示消息，如：在重新加载之前，在一个错误之前，或者模块热替换启用时。如果你不喜欢看这些信息，可以将其设置为 `silent` (`none` 即将被移除)。

 

本篇文章不是为了细说 `webpack-dev-server` 的配置，所以这里就不多说了。关于 `webpack-dev-server` 更多的配置可以[点击查看](https://webpack.js.org/configuration/dev-server/)。

细心的小伙伴可能发现了一个小问题，我们在`src/index.js`中增加一句 `console.log('aaa')`：

```
class Animal {
    constructor(name) {
        this.name = name;
    }
    getName() {
        return this.name;
    }
}

const dog = new Animal('dog');
console.log('aaa');  
```

然后通过 `npm run dev` 查看效果，会发现： 

这显然不是我们源码中对应的行号，点进去的话，会发现代码是被编译后的，我当前的代码非常简单，还能看出来，项目代码复杂后，“亲妈”看编译后都费劲，这不利于我们开发调试，不是我们想要的，我们肯定还是希望能够直接对应到源码的。

###  热更新

1. 首先配置 `devServer` 的 `hot` 为 `true`
2. 并且在 `plugins` 中增加 `new webpack.HotModuleReplacementPlugin()`

```
//webpack.config.js
const webpack = require('webpack');
module.exports = {
    //....
    devServer: {
        hot: true//HMR
        hotOnly: true//即使不支持hmr或出问题也不更新浏览器
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin() //热更新插件
    ]
} 
```

我们配置了 `HotModuleReplacementPlugin` 之后，会发现，此时我们修改代码，仍然是整个页面都会刷新。不希望整个页面都刷新，还需要修改入口文件：

1. 在入口文件中新增:

```
if(module && module.hot) {
    module.hot.accept()
} 
```

此时，再修改代码，不会造成整个页面的刷新。

###  devtool

`devtool` 中的一些设置，可以帮助我们将编译后的代码映射回原始源代码。不同的值会明显影响到构建和重新构建的速度。

对我而言，能够定位到源码的行即可，因此，综合构建速度，在开发模式下，我设置的 `devtool` 的值是 `cheap-module-eval-source-map`。

```
//webpack.config.js
module.exports = {
	//cheap 只带行信息，不带列、module里的。module定位到ts文件而不是编译后的js
    devtool: 'cheap-module-eval-source-map' //开发环境下使用
}  
```

生产环境可以使用 `none` 或者是 `source-map`，使用 `source-map` 最终会单独打包出一个 `.map` 文件，我们可以根据报错信息和此 `map` 文件，进行错误解析，定位到源代码。

`source-map` 和 `hidden-source-map` 都会打包生成单独的 `.map` 文件，区别在于，`source-map` 会在打包出的js文件中增加一个引用注释，以便开发工具知道在哪里可以找到它。`hidden-source-map` 则不会在打包的js中增加引用注释。

但是我们一般不会直接将 `.map` 文件部署到CDN，因为会直接映射到源码，更希望将`.map` 文件传到错误解析系统，然后根据上报的错误信息，直接解析到出错的源码位置。

还可以设置其他的[devtool值](http://webpack.html.cn/configuration/devtool.html)，你可以使用不同的值，构建对比差异。

现在我们已经说了 `html`、`js` 了，并且也可以在浏览器中实时看到效果了，现在就不得不说页面开发三巨头之一的 `css` 。