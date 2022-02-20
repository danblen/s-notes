### 编写一个loader

```js
loader就是一个node模块，它输出了一个函数。当某种资源需要用这个loader转换时，这个函数会被调用。并且，这个函数可以通过提供给它的this上下文访问Loader API。
reverse-txt-loader
定义
module.exports = function(src) {
  //src是原文件内容（abcde），下面对内容进行处理，这里是反转
  var result = src.split('').reverse().join(''); 
  //返回JavaScript源码，必须是String或者Buffer
  return `module.exports = '${result}'`;
}
使用
{
	test: /\.txt$/,
	use: [
		{
			'./path/reverse-txt-loader'
		}
	]
}, 
```



###   如何处理样式文件呢

`webpack` 不能直接处理 `css`，需要借助 `loader`。如果是 `.css`，我们需要的 `loader` 通常有： `style-loader`、`css-loader`，考虑到兼容性问题，还需要 `postcss-loader`，而如果是 `less` 或者是 `sass` 的话，还需要 `less-loader` 和 `sass-loader`，这里配置一下 `less` 和 `css` 文件(`sass` 的话，使用 `sass-loader`即可):

先安装一下需要使用的依赖:

```
npm install style-loader less-loader css-loader postcss-loader autoprefixer less -D
 
//webpack.config.js
module.exports = {
    //...
    module: {
        rules: [
            {
                test: /\.(le|c)ss$/,
                use: ['style-loader', 'css-loader', {
                    loader: 'postcss-loader',
                    options: {
                        plugins: function () {
                            return [
                                require('autoprefixer')({
                                    "overrideBrowserslist": [
                                        ">0.25%",
                                        "not dead"
                                    ]
                                })
                            ]
                        }
                    }
                }, 'less-loader'],
                exclude: /node_modules/
            }
        ]
    }
} 

```

测试一下，新建一个 `less` 文件，`src/index.less`:

```
//src/index.less
@color: red;
body{
    background: @color;
    transition: all 2s;
} 

```

再在入口文件中引入此 `less`:

```
//src/index.js
import './index.less'; 

```

我们修改了配置文件，重新启动一下服务: `npm run dev`。可以看到页面的背景色变成了红色。

OK，我们简单说一下上面的配置：

- `style-loader` 动态创建 `style` 标签，将 `css` 插入到 `head` 中.
- `css-loader` 负责处理 `@import` 等语句。
- `postcss-loader` 和 `autoprefixer`，自动生成浏览器兼容性前缀 —— 2020了，应该没人去自己徒手去写浏览器前缀了吧
- `less-loader` 负责处理编译 `.less` 文件,将其转为 `css`

这里，我们之间在 `webpack.config.js` 写了 `autoprefixer` 需要兼容的浏览器，仅是为了方便展示。推荐大家在根目录下创建 `.browserslistrc`，将对应的规则写在此文件中，除了 `autoprefixer` 使用外，`@babel/preset-env`、`stylelint`、`eslint-plugin-conmpat` 等都可以共用。

**注意：**

```
loader` 的执行顺序是从右向左执行的，也就是后面的 `loader` 先执行，上面 `loader` 的执行顺序为: `less-loader` ---> `postcss-loader` ---> `css-loader` ---> `style-loader

```

当然，`loader` 其实还有一个参数，可以修改优先级，`enforce` 参数，其值可以为: `pre`(优先执行) 或 `post` (滞后执行)。

现在，我们已经可以处理 `.less` 文件啦，`.css` 文件只需要修改匹配规则，删除 `less-loader` 即可。

现在的一切看起来都很完美，但是假设我们的文件中使用了本地的图片，例如:

```
body{
    background: url('../images/thor.png');
} 

```

你就会发现，报错啦啦啦，那么我们要怎么处理图片或是本地的一些其它资源文件呢。不用想，肯定又需要 `loader` 出马了。

###  图片/字体文件处理

我们可以使用 `url-loader` 或者 `file-loader` 来处理本地的资源文件。`url-loader` 和 `file-loader` 的功能类似，但是 `url-loader` 可以指定在文件大小小于指定的限制时，返回 `DataURL`，因此，个人会优先选择使用 `url-loader`。

首先安装依赖:

```
npm install url-loader -D  
```

安装 `url-loader` 的时候，控制台会提示你，还需要安装下 `file-loader`，听人家的话安装下就行(新版 `npm` 不会自动安装 `peerDependencies`)：

```
npm install file-loader -D 
```

在 `webpack.config.js` 中进行配置：

```
//webpack.config.js
module.exports = {
    //...
    modules: {
        rules: [
            {
                test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10240, //10K
                            esModule: false 
                        }
                    }
                ],
                exclude: /node_modules/
            }
        ]
    }
} 

```

此处设置 `limit` 的值大小为 10240，即资源大小小于 `10K` 时，将资源转换为 `base64`，超过 10K，将图片拷贝到 `dist` 目录。`esModule` 设置为 `false`，否则，` 会出现 `

将资源转换为 `base64` 可以减少网络请求次数，但是 `base64` 数据较大，如果太多的资源是 `base64`，会导致加载变慢，因此设置 `limit` 值时，需要二者兼顾。

默认情况下，生成的文件的文件名就是文件内容的 `MD5` 哈希值并会保留所引用资源的原始扩展名，例如我上面的图片(thor.jpeg)对应的文件名如下： 

当然，你也可以通过 `options` 参数进行修改。

```
//....
use: [
    {
        loader: 'url-loader',
        options: {
            limit: 10240, //10K
            esModule: false,
            name: '[name]_[hash:6].[ext]'
        }
    }
] 

```

重新编译，在浏览器中审查元素，可以看到图片名变成了: `thor_a5f7c0.jpeg`。

当本地资源较多时，我们有时会希望它们能打包在一个文件夹下，这也很简单，我们只需要在 `url-loader` 的 `options` 中指定 `outpath`，如: `outputPath: 'assets'`，构建出的目录如下: 

更多的 `url-loader` 配置可以[查看](https://www.webpackjs.com/loaders/url-loader/)

到了这里，有点**岁月静好**的感觉了。 

不过还没完，如果你在 `public/index.html` 文件中，使用本地的图片，例如，我们修改一下 `public/index.html`：

```
<img src="./a.jpg" /> 

```

重启本地服务，虽然，控制台不会报错，但是你会发现，浏览器中根本加载不出这张图片，Why？因为构建之后，通过相对路径压根找不着这张图片呀。

How？怎么解决呢？

### 10.处理 html 中的本地图片

安装 `html-withimg-loader` 来解决咯。

```
npm install html-withimg-loader -D 

```

修改 `webpack.config.js`：

```
module.exports = {
    //...
    module: {
        rules: [
            {
                test: /.html$/,
                use: 'html-withimg-loader'
            }
        ]
    }
} 

```

然后在我们的 `html` 中引入一张文件测试一下（图片地址自己写咯，这里只是示意）:

```
<!-- index.html -->
<img src="./thor.jpeg" /> 

```

重启本地服务，图片并没能加载，审查元素的话，会发现图片的地址显示的是 `{"default":"assets/thor_a5f7c0.jpeg"}`。 

我当前 `file-loader` 的版本是 5.0.2，5版本之后，需要增加 `esModule` 属性：

```
//webpack.config.js
module.exports = {
    //...
    modules: {
        rules: [
            {
                test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10240, //10K
                            esModule: false
                        }
                    }
                ]
            }
        ]
    }
} 

```

再重启本地服务，就搞定啦。

话说使用 `html-withimg-loader` 处理图片之后，`html` 中就不能使用 `vm`, `ejs` 的模板了，如果想继续在 `html` 中使用 `<% if(htmlWebpackPlugin.options.config.header) { %>` 这样的语法，但是呢，又希望能使用本地图片，可不可以？鱼和熊掌都想要，虽然很多时候，能吃个鱼就不错了，但是这里是可以的哦，像下面这样编写图片的地址，并且删除`html-withimg-loader`的配置即可。

```
<!-- index.html -->
<img src="<%= require('./thor.jpeg') %>" /> 

```

图片加载OK啦，并且 `<% %>` 语法也可以正常使用，吼吼吼~~~

虽然，`webpack` 的默认配置很好用，但是有的时候，我们会有一些其它需要啦，例如，我们不止一个入口文件，这时候，该怎么办呢？

