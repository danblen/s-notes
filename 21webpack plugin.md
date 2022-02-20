###  在浏览器中查看页面 

查看页面，难免就需要 `html` 文件，有小伙伴可能知道，有时我们会指定打包文件中带有 `hash`，那么每次生成的 `js` 文件名会有所不同，总不能让我们每次都人工去修改 `html`，这样不是显得我们很蠢嘛~

我们可以使用 `html-webpack-plugin` 插件来帮助我们完成这些事情。

首先，安装一下插件:

```
npm install html-webpack-plugin -D   
```

新建 `public` 目录，并在其中新建一个 `index.html` 文件( 文件内容使用 `html:5` 快捷生成即可)

修改 `webpack.config.js` 文件。

```
//首先引入插件
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    //...
    plugins: [
        //数组 放着所有的webpack插件
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: 'index.html', //打包后的文件名
            minify: {
                removeAttributeQuotes: false, //是否删除属性的双引号
                collapseWhitespace: false, //是否折叠空白
            },
            // hash: true //是否加上hash，默认是 false
        })
    ]
} 

```

此时执行 `npx webpack`，可以看到 `dist` 目录下新增了 `index.html` 文件，并且其中自动插入了 `` 脚本，引入的是我们打包之后的 js 文件。

这里要多说一点点东西，`HtmlWebpackPlugin` 还为我们提供了一个 `config` 的配置，这个配置可以说是非常有用了。

#### html-webpack-plugin 的 config 的妙用

有时候，我们的脚手架不仅仅给自己使用，也许还提供给其它业务使用，`html` 文件的可配置性可能很重要，比如：你公司有专门的部门提供M页的公共头部/公共尾部，埋点jssdk以及分享的jssdk等等，但是不是每个业务都需要这些内容。

一个功能可能对应多个 `js` 或者是 `css` 文件，如果每次都是业务自行修改 `public/index.html` 文件，也挺麻烦的。首先他们得搞清楚每个功能需要引入的文件，然后才能对 `index.html` 进行修改。

此时我们可以增加一个配置文件，业务通过设置 `true` 或 `false` 来选出自己需要的功能，我们再根据配置文件的内容，为每个业务生成相应的 `html` 文件，岂不是美美的。

Let's Go!

首先，我们在 `public` 目录下新增一个 `config.js` ( 文件名你喜欢叫什么就叫什么 )，将其内容设置为:

```
//public/config.js 除了以下的配置之外，这里面还可以有许多其他配置，例如,pulicPath 的路径等等
module.exports = {
    dev: {
        template: {
            title: '你好',
            header: false,
            footer: false
        }
    },
    build: {
        template: {
            title: '你好才怪',
            header: true,
            footer: false
        }
    }
} 

```

现在，我们修改下我们的 `webpack.config.js`:

```
//webpack.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const isDev = process.env.NODE_ENV === 'development';
const config = require('./public/config')[isDev ? 'dev' : 'build'];

modue.exports = {
    //...
    mode: isDev ? 'development' : 'production'
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: 'index.html', //打包后的文件名
            config: config.template
        })
    ]
} 

```

相应的，我们需要修改下我们的 `public/index.html` 文件(嵌入的js和css并不存在，仅作为示意)：

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <% if(htmlWebpackPlugin.options.config.header) { %>
    <link rel="stylesheet" type="text/css" href="//common/css/header.css">
    <% } %>
    <title><%= (htmlWebpackPlugin.options.config.title) %></title>
</head>

<body>
</body> 
<% if(htmlWebpackPlugin.options.config.header) { %>
<script src="//common/header.min.js" type="text/javascript"></script> 
<% } %>
</html> 

```

`process.env` 中默认并没有 `NODE_ENV`，这里配置下我们的 `package.json` 的 `scripts`.

为了兼容Windows和Mac，我们先安装一下 `cross-env`:

```
npm install cross-env -D
 
{
    "scripts": {
        "dev": "cross-env NODE_ENV=development webpack",
        "build": "cross-env NODE_ENV=production webpack"
    }
}  
```

然后我们运行 `npm run dev` 和 运行 `npm run build` ，对比下 `dist/index.html` ，可以看到 `npm run build`，生成的 `index.html` 文件中引入了对应的 `css` 和 `js`。并且对应的 `title` 内容也不一样。

你说这里是不是非得是用 `NODE_ENV` 去判断？当然不是咯，你写 `aaa=1` ，`aaa=2` 都行（当然啦，`webpack.config.js` 和 `scripts` 都需要进行相应修改），但是可能会被后面接手的人打死。

更多[html-webpack-plugin配置项]

### 13.每次打包前清空dist目录

反正我是懒得手动去清理的，只要你足够懒，你总是会找到好办法的，懒人推动科技进步。这里，我们需要插件: `clean-webpack-plugin`

安装依赖:

```
npm install clean-webpack-plugin -D 
```

以前，`clean-webpack-plugin` 是默认导出的，现在不是，所以引用的时候，需要注意一下。另外，现在构造函数接受的参数是一个对象，可缺省。

```
//webpack.config.js
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    //...
    plugins: [
        //不需要传参数喔，它可以找到 outputPath
        new CleanWebpackPlugin() 
    ]
}  
```

现在你再修改文件，重现构建，生成的hash值和之前dist中的不一样，但是因为每次 `clean-webpack-plugin` 都会帮我们先清空一波 `dist` 目录，所以不会出现太多文件，傻傻分不清楚究竟哪个是新生成文件的情况。

#### 希望dist目录下某个文件夹不被清空

不过呢，有些时候，我们并不希望整个 `dist` 目录都被清空，比如，我们不希望，每次打包的时候，都删除 `dll` 目录，以及 `dll` 目录下的文件或子目录，该怎么办呢？

`clean-webpack-plugin` 为我们提供了参数 `cleanOnceBeforeBuildPatterns`。

```
//webpack.config.js
module.exports = {
    //...
    plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns:['**/*', '!dll', '!dll/**'] //不删除dll目录下的文件
        })
    ]
}  
```

此外，`clean-webpack-plugin` 还有一些其它的配置，不过我使用的不多，大家可以查看[clean-webpack-plugin](