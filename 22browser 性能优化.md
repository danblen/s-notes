## 性能优化

**网络上**

http2：并发多个请求，充分高效利用网络资源，使用 code splitting 和 dynamic import (很多很小的文件)

使用更快的网络：第三方库、静态资源使用obs/cdn，也可以突破同一域名的TCP连接数限制

减小访问次数：合并代码 spa应用多个页面打包到一起，服务端渲染，http缓存

浏览器缓存

**打包上**

代码分割：剥离css文件单独打包，公共代码提取，不常改变的业务代码分离

减小资源体积：使用UglifyJsPlugin压缩代码，服务器启用gzip压缩，第三方库按需加载，tree shaking

配置：优化devtool中的source-map，开发环境与生产环境不同模式，devtool和loader

优化构建时的搜索路径 指明需要构建目录及不需要构建目录

**编码上**

编写高效的代码逻辑，某些场景下空间换时间

节流，防抖

懒加载（图片），预加载（弹出框）

css放在head，js放在body最下面

尽早的执行js，使用DomContentLoaded触发

频繁的dom操作合并到fragment，一起插入



## performance属性

FPS

衡量一个动画性能的重要指标就是FPS(每秒的帧数)。当动画以60FPS运行时，我们肉眼看上去动画是非常连贯的。

### CPU

在性能面板底部，图形图表的色彩越多，意味着CPU性能已经达到极限。当我们看到CPU长时间处于最大值状态，就需要考虑怎样去优化。

我们首先要看Summary选项卡，我们可以看到蓝色部分占用了大部分，蓝色代表Rendering,该页面大部分时间用于渲染。那我们就需要尝试去减少渲染时间。

展开main 部分。这里展示的是随时间变化主线上的火焰图。X轴表示时间，Y轴表示事件。每一个条形代表一个事件，条形越长，消耗时间越长。当看到图形堆叠，表示同一时间处理事件较高。会导致性能问题。 

我们可以看到Animation Frame Fired 右上角有红色三角形。PS:**红色三角表示可能存才与此事件相关问题的警告**，注意：只要执行requestAnimationFrame() 就会有此回调。

单击Animation Frame Fired，底部Summary 栏会显示有关该事件信息，并附带链接。单击链接会跳转到源码相关行。 



## treeshaking

把没有导出的去掉,只支持es module（静态导入jsonp形式），不支持commonjs（动态导入）

```
optimization: {
	usedExports: true
}
```

配置不去掉 package.json中"sideEffects": ["*.css"]

## codespliting

1 同步代码（import _ from 'lodash' 文件顶部） 只需webpack.config.js配置optimization 

2 异步代码（函数里import）无需配置 @babel-plugin-dynamic-import-webpack

@babel/plugin-syntax-dynamic-webpack(官方) 

魔法注释改变打包后文件名 /* webpackChunkName: "Lodash"

splitChunksPlugin

```
optimization : {
	chunks: 'all'//async initial
	minSize: 30000,		//大于则做代码分割
	maxSize: 0,
	minChunk: 1,	//在被打包后的chunks中依赖这个依赖这个包的chunk数大于1做代码分割
	maxAsyncRequests:5,		//最大打包出来的chunks个数超过就不代码分割
	minInitialRequests : 3,		//最小入口文件引入包个数大于就不代码分割
	automaticNameDelimiter: '~',
	name: true,		//表示用下面的名字
	cacheGroups: {
		venders: {
			test: /[\\/]node_modules[\\/]/,	//在这个文件下的模块
			priority: -10,
			filename: 'venders.js',
		},
		default: {
			priority: -20,
			reuseExistingChunk: true,	//在另一个文件中已经引入就不再引入
			filename: 'commom.js'
		}
	}
}
```

###  按需加载

很多时候我们不需要一次性加载所有的JS文件，而应该在不同阶段去加载所需要的代码。`webpack`内置了强大的分割代码的功能可以实现按需加载。

比如，我们在点击了某个按钮之后，才需要使用使用对应的JS文件中的代码，需要使用 `import()` 语法：

```
document.getElementById('btn').onclick = function() {
    import('./handle').then(fn => fn.default());
} 
```

要支持 `import()` 语法，需要增加 `babel` 的配置，安装依赖:

```
npm install @babel/plugin-syntax-dynamic-import -D 
```

修改`.babelrc` 的配置

```
{
    "presets": ["@babel/preset-env"],
    "plugins": [
        [
            "@babel/plugin-transform-runtime",
            {
                "corejs": 3
            }
        ],
        "@babel/plugin-syntax-dynamic-import"
    ]
} 
```

`npm run build` 进行构建，构建结果如下： 

`webpack` 遇到 `import(****)` 这样的语法的时候，会这样处理：

- 以**** 为入口新生成一个 `Chunk`
- 当代码执行到 `import` 所在的语句时，才会加载该 `Chunk` 所对应的文件（如这里的1.bundle.8bf4dc.js）

大家可以在浏览器中的控制台中，在 `Network` 的 `Tab页` 查看文件加载的情况，只有点击之后，才会加载对应的 `JS` 。 

###  抽离CSS

CSS打包我们前面已经说过了，不过呢，有些时候，我们可能会有抽离CSS的需求，即将CSS文件单独打包，这可能是因为打包成一个JS文件太大，影响加载速度，也有可能是为了缓存(例如，只有JS部分有改动)  

首先，安装 `loader`:

```
npm install mini-css-extract-plugin -D 
```

> `mini-css-extract-plugin` 和 `extract-text-webpack-plugin` 相比:

1. 异步加载
2. 不会重复编译(性能更好)
3. 更容易使用
4. 只适用CSS

修改我们的配置文件：

```
//webpack.config.js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/[name].css' //个人习惯将css文件放在单独目录下
        })
    ],
    module: {
        rules: [
            {
                test: /\.(le|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader, //替换之前的 style-loader
                    'css-loader', {
                        loader: 'postcss-loader',
                        options: {
                            plugins: function () {
                                return [
                                    require('autoprefixer')({
                                        "overrideBrowserslist": [
                                            "defaults"
                                        ]
                                    })
                                ]
                            }
                        }
                    }, 'less-loader'
                ],
                exclude: /node_modules/
            }
        ]
    }
} 
```

现在，我们重新编译：`npm run build`，目录结构如下所示:

```
.
├── dist
│   ├── assets
│   │   ├── alita_e09b5c.jpg
│   │   └── thor_e09b5c.jpeg
│   ├── css
│   │   ├── index.css
│   │   └── index.css.map
│   ├── bundle.fb6d0c.js
│   ├── bundle.fb6d0c.js.map
│   └── index.html 
```

前面说了最好新建一个 `.browserslistrc` 文件，这样可以多个 `loader` 共享配置，所以，动手在根目录下新建文件 (`.browserslistrc`)，内容如下（你可以根据自己项目需求，修改为其它的配置）:

```
last 2 version
> 0.25%
not dead 
```

修改 `webpack.config.js`：

```
//webpack.config.js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
    //...
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/[name].css' 
        })
    ],
    module: {
        rules: [
            {
                test: /\.(c|le)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader', {
                        loader: 'postcss-loader',
                        options: {
                            plugins: function () {
                                return [
                                    require('autoprefixer')()
                                ]
                            }
                        }
                    }, 'less-loader'
                ],
                exclude: /node_modules/
            },
        ]
    }
} 
```

要测试自己的 `.browserlistrc` 有没有生效也很简单，直接将文件内容修改为 `last 1 Chrome versions` ，然后对比修改前后的构建出的结果，就能看出来啦。

可以查看更多[browserslistrc]配置项([github.com/browserslis…](https://github.com/browserslist/browserslist))

更多配置项，可以查看[mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin)

#### 将抽离出来的css文件进行压缩

使用 `mini-css-extract-plugin`，`CSS` 文件默认不会被压缩，如果想要压缩，需要配置 `optimization`，首先安装 `optimize-css-assets-webpack-plugin`.

```
npm install optimize-css-assets-webpack-plugin -D 
```

修改webpack配置：

```
//webpack.config.js
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    //....
    plugins: [
        new OptimizeCssPlugin()
    ],
} 
```

注意，这里将 `OptimizeCssPlugin` 直接配置在 `plugins` 里面，那么 `js` 和 `css` 都能够正常压缩，如果你将这个配置在 `optimization`，那么需要再配置一下 `js` 的压缩(开发环境下不需要去做CSS的压缩，因此后面记得将其放到 `webpack.config.prod.js` 中哈)。

配置完之后，测试的时候发现，抽离之后，修改 `css` 文件时，第一次页面会刷新，但是第二次页面不会刷新 —— 好嘛，我平时的业务中用不着抽离 `css`，这个问题搁置了好多天(准确来说是忘记了)。

3月8号再次修改这篇文章的时候，正好看到了 `MiniCssExtractPlugin.loader` 对应的 `option` 设置，我们再次修改下对应的 `rule`。

```
module.exports = {
    rules: [
        {
            test: /\.(c|le)ss$/,
            use: [
                {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        hmr: isDev,
                        reloadAll: true,
                    }
                },
                //...
            ],
            exclude: /node_modules/
        }
    ]
} 
```











### 11.入口配置

入口的字段为: `entry`

```
//webpack.config.js
module.exports = {
    entry: './src/index.js' //webpack的默认配置
} 

```

`entry` 的值可以是一个字符串，一个数组或是一个对象。

字符串的情况无需多说，就是以对应的文件为入口。

为数组时，表示有“多个主入口”，想要多个依赖文件一起注入时，会这样配置。例如:

```
entry: [
    './src/polyfills.js',
    './src/index.js'
] 

```

`polyfills.js` 文件中可能只是简单的引入了一些 `polyfill`，例如 `babel-polyfill`，`whatwg-fetch` 等，需要在最前面被引入（我在 webpack2 时这样配置过）。

那什么时候是对象呢？不要捉急，后面将多页配置的时候，会说到。

### 12.出口配置

配置 `output` 选项可以控制 `webpack` 如何输出编译文件。

```
const path = require('path');
module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'), //必须是绝对路径
        filename: 'bundle.js',
        publicPath: '/' //通常是CDN地址
    }
}  
```

例如，你最终编译出来的代码部署在 CDN 上，资源的地址为: 'https://AAA/BBB/YourProject/XXX'，那么可以将生产的 `publicPath` 配置为: `//AAA/BBB/`。

编译时，可以不配置，或者配置为 `/`。可以在我们之前提及的 `config.js` 中指定 `publicPath`（`config.js` 中区分了 `dev` 和 `public`）， 当然还可以区分不同的环境指定配置文件来设置，或者是根据 `isDev` 字段来设置。

除此之外呢，考虑到CDN缓存的问题，我们一般会给文件名加上 `hash`.

```
//webpack.config.js
module.exports = {
    output: {
        path: path.resolve(__dirname, 'dist'), //必须是绝对路径
        filename: 'bundle.[hash].js',
        publicPath: '/' //通常是CDN地址
    }
}  
```

如果你觉得 `hash` 串太长的话，还可以指定长度，例如 `bundle.[hash:6].js`。使用 `npm run build` 打包看看吧。

问题出现啦，每次文件修改后，重新打包，导致 `dist` 目录下的文件越来越多。要是每次打包前，都先清空一下目录就好啦。可不可以做到呢？必须可以！