### DOM Tree与Render Tree

呈现器是和 DOM 元素相对应的，但并非一一对应。非可视化的 DOM 元素不会插入呈现树中，例如“head”元素。如果元素的 display 属性值为“none”，那么也不会显示在呈现树中（但是 visibility 属性值为“hidden”的元素仍会显示）。

有一些 DOM 元素对应多个可视化对象。它们往往是具有复杂结构的元素，无法用单一的矩形来描述。例如，“select”元素有 3 个呈现器：一个用于显示区域，一个用于下拉列表框，还有一个用于按钮。如果由于宽度不够，文本无法在一行中显示而分为多行，那么新的行也会作为新的呈现器而添加。
另一个关于多呈现器的例子是格式无效的 HTML。根据 CSS 规范，inline 元素只能包含 block 元素或 inline 元素中的一种。如果出现了混合内容，则应创建匿名的 block 呈现器，以包裹 inline 元素。

有一些呈现对象对应于 DOM 节点，但在树中所在的位置与 DOM 节点不同。浮动定位和绝对定位的元素就是这样，它们处于正常的流程之外，放置在树中的其他地方，并映射到真正的框架，而放在原位的是占位框架。

Dom Tree 包含了所有的HTMl标签，包括display：none ，JS动态添加的元素等。

Dom Tree 和样式结构体结合后构建呈现Render Tree。Render Tree 能识别样式，每个node都有自己的style，且不包含隐藏的节点（比如display : none的节点）。

DOM树是包含了所有html节点的树，渲染树是DOM树和CSSOM树组合而成的，最终渲染在页面上的树。DOM树和渲染树都是浏览器生成的

# 语义化

`header元素`：header 元素代表“网页”或“section”的页眉。

`footer元素`：footer元素代表“网页”或“section”的页脚，通常含有该节的一些基本信息，譬如：作者，相关文档链接，版权资料。

`hgroup元素`：

`nav元素`：nav元素代表页面的导航链接区域。用于定义页面的主要导航部分。

`aside元素`：aside元素被包含在article元素中作为主要内容的附属信息部分，其中的内容可以是与当前文章有关的相关资料、标签、名次解释等。（特殊的section）

`section元素`：section元素代表文档中的“节”或“段”，“段”可以是指一篇文章里按照主题的分段；“节”可以是指一个页面里的分组。section通常还带标题，虽然html5中section会自动给标题h1-h6降级，但是最好手动给他们降级。

`article元素`：article元素最容易跟section和div容易混淆，其实article代表一个在文档，页面或者网站中自成一体的内容，其目的是为了让开发者独立开发或重用。譬如论坛的帖子，博客上的文章，一篇用户的评论，一个互动的widget小工具。（特殊的section）除了它的内容，article会有一个标题（通常会在header里），会有一个footer页脚。


 尽可能少的使用无语义的标签div和span；在语义不明显时，既可以使用div或者p时，尽量用p, 因为p在默认情况下有上下间距，对兼容特殊终端有利；

不要使用纯样式标签，如：b、font、u等，改用css设置。 

表单域要用fieldset标签包起来，并用legend标签说明表单的用途；每个input标签对应的说明文本都需要使用label标签，并且通过为input设置id属性，在lable标签中设置for=someld来让说明文本和相对应的input关联起来。

 

## CSS选择器及其优先级

- !important
- 内联样式style=""
- ID选择器#id
- 类选择器/属性选择器/伪类选择器 .class.active[href=""]
- 元素选择器/关系选择器/伪元素选择器 html+div>span::after
- 通配符选择器*  

### CSS引入的方式有哪些？使用Link和@import有什么区别？

  答：内联，内嵌，外链，导入

（1）link 属于 XHTML 标签，除了加载 CSS 外，还能用于定义RSS，定义 rel 连接属性等作用，无兼容性，支持使用javascript改变样式；而@import是CSS提供的，只能用于加载CSS，不支持使用 javascript 改变样式；

（2）页面被加载的时，link 会被同时加载，而@import 引用的CSS会等到页面加载完再加载；

（3）import是CSS2.1 提出的，CSS2.1以下浏览器不支持，只在IE5以上才能被识别，而link是XHTML标签，无兼容问题。 

## 盒模型 

content-box（W3C盒模型，又名标准盒模型），border-box（IE盒模型8以下，8以上标准 ），背景会延伸到边框的外沿。 css3 为border-box

#### 获得宽高的方式

- `dom.getBoundingClientRect().width/height` 根据元素在视窗中的绝对位置(`left/right`外边距)
- `dom.offsetWidth/offsetHeight`这个就没什么好说的了，最常用的，也是兼容最好的。

- `dom.style.width/height`  这种方式只能取到dom元素内联样式所设置的宽高，也就是说如果该节点的样式是在style标签中或外联的CSS文件中设置的话，通过这种方法是获取不到dom的宽高的。
- `dom.currentStyle.width/height ` 这种方式获取的是在页面渲染完成后的结果，就是说不管是哪种方式设置的样式，都能获取到。但这种方式只有IE浏览器支持。
- `window.getComputedStyle(dom).width/height ` 这种方式的原理和2是一样的，这个可以兼容更多的浏览器，通用性好一些。

- 网页可见区域的高度和宽度（不加边线）： document.body.clientHeight/clientWidth
- 网页可见区域的高度和宽度（加边线）： document.body.offsetHeight/offsetWidth

- 网页全文的高度和宽度： document.body.scrollHeight/Width
- 滚动条卷上去的高度和向右卷的宽度： document.body.scrollTop/scrollLeft

- 获取屏幕的高度和宽度（屏幕分辨率）： window.screen.height/width
- 获取屏幕工作区域的高度和宽度（去掉状态栏）： window.screen.availHeight/availWidth

边距重叠解决方案(BFC) BFC原理

- 内部的box会在垂直方向，一个接一个的放置 每个元素的margin box的左边，与包含块border box的左边相接触（对于从做往右的格式化，否则相反）
- box垂直方向的距离由margin决定，属于同一个bfc的两个相邻box的margin会发生重叠
- bfc的区域不会与浮动区域的box重叠
- bfc是一个页面上的独立的容器，外面的元素不会影响bfc里的元素，反过来，里面的也不会影响外面的
- 计算bfc高度的时候，浮动元素也会参与计算 创建bfc
- float属性不为none（脱离文档流）
- position为absolute或fixed
- display为inline-block,table-cell,table-caption,flex,inine-flex
- overflow不为visible
- 根元素 demo

```
<section class="top">
	<h1>上</h1>
	这块margin-bottom:30px;
</section>
<!-- 给下面这个块添加一个父元素，在父元素上创建bfc -->
<div style="overflow:hidden">
	<section class="bottom">
	<h1>下</h1>
	这块margin-top:50px;
	</section>
</div> 
```

## CSS3的新特性

- `word-wrap` 文字换行
- `text-overflow` 超过指定容器的边界时如何显示
- `text-decoration` 文字渲染
- `text-shadow`文字阴影
- `gradient`渐变效果
- `transition`过渡效果 transition-duration：过渡的持续时间
- `transform`拉伸，压缩，旋转，偏移等变换
- `animation`动画

`transition`和`animation`的区别：

Animation和transition大部分属性是相同的，他们都是随时间改变元素的属性值，他们的主要区别是transition需要触发一个事件才能改变属性，而animation不需要触发任何事件的情况下才会随时间改变属性值，并且transition为2帧，从from .... to，而animation可以一帧一帧的。

CSS3新增属性用法整理：

1、box-shadow（阴影效果）

2、border-color（为边框设置多种颜色）

3、border-image（图片边框）

4、text-shadow（文本阴影）

5、text-overflow（文本截断）

6、word-wrap（自动换行）

7、border-radius（圆角边框）

8、opacity（透明度）

9、box-sizing（控制盒模型的组成模式）

10、resize（元素缩放）

11、outline（外边框）

12、background-size（指定背景图片尺寸）

13、background-origin（指定背景图片从哪里开始显示）

14、background-clip（指定背景图片从什么位置开始裁剪）

15、background（为一个元素指定多个背景）

16、hsl（通过色调、饱和度、亮度来指定颜色颜色值）

17、hsla（在hsl的基础上增加透明度设置）

18、rgba（基于rgb设置颜色，a设置透明度）

## BFC

BFC（Block Formatting Context）格式化上下文，是Web页面中盒模型布局的CSS渲染模式，指一个独立的渲染区域或者说是一个隔离的独立容器。 

### BFC应用

- 防止margin重叠
- 清除内部浮动
- 自适应两（多）栏布局
- 防止字体环绕

### 触发BFC条件

- 根元素
- float的值不为none
- overflow的值不为visible
- display的值为inline-block、table-cell、table-caption
- position的值为absolute、fixed

### BFC的特性

- 内部的Box会在垂直方向上一个接一个的放置。
- 垂直方向上的距离由margin决定
- bfc的区域不会与float的元素区域重叠。
- 计算bfc的高度时，浮动元素也参与计算
- bfc就是页面上的一个独立容器，容器里面的子元素不会影响外面元素。

## div水平居中

行内元素

```
.parent {
    text-align: center;
} 
```

块级元素

```
.son {
    margin: 0 auto;
} 
```

绝对定位left/right: 0

```
.son {
    position: absolute;
    width: 宽度;
    left: 0;
    right: 0;
    margin: 0 auto;
} 
```

绝对定位定宽

```
.son {
    position: absolute;
    width: 宽度;
    left: 50%;
    margin-left: -0.5*宽度
} 
```

绝对定位不定宽 

```
.son {
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
} 
```

flex布局

```
.parent {
    display: flex;
    justify-content: center;
} 
```

## div垂直居中

行内元素

```
.parent {
    height: 高度;
}
.son {
    line-height: 高度;
} 
```

table

```
.parent {
  display: table;
}
.son {
  display: table-cell;
  vertical-align: middle;
} 
```

绝对定位top/bottom: 0;

```
.son {
    position: absolute;
    height: 高度;
    top: 0;
    bottom: 0;
    margin: auto 0;
} 
```

绝对定位定高

```
.son {
    position: absolute;
    top: 50%;
    height: 高度;
    margin-top: -0.5高度;
} 
```

绝对定位不定高

```
.son {
    position: absolute;
    top: 50%;
    transform: translate( 0, -50%);
} 
```

flex

```
.parent {
    display: flex;
    align-items: center;
} 
```

### 伪类

伪类存在的意义是为了通过选择器找到那些不存在DOM树中的信息以及不能被常规CSS选择器获取到的信息。

1. 获取不存在与DOM树中的信息。比如a标签的:link :visited :first-child :visitive  :hover  :active  :focus  :lang等，这些信息不存在与DOM树结构中，只能通过CSS选择器来获取；
2. 获取不能被常规CSS选择器获取的信息。比如：要获取第一个子元素，我们无法用常规的CSS选择器获取，但可以通过 :first-child 来获取到。  

### 伪元素

伪元素用于创建一些不在文档树中的元素，并为其添加样式。比如说，我们可以通过::before来在一个元素前增加一些文本，并为这些文本添加样式。

虽然用户可以看到这些文本，但是这些文本实际上不在文档树中。常见的伪元素有：`::before`，`::after`，`::first-line`，`::first-letter`，`::selection`、`::placeholder`等

> 因此，伪类与伪元素的区别在于：有没有创建一个文档树之外的元素。

### ::after伪元素和:after的区别

在实际的开发工作中，我们会看到有人把伪元素写成`:after`，这实际是 CSS2 与 CSS3新旧标准的规定不同而导致的。

CSS2 中的伪元素使用1个冒号，在 CSS3 中，为了区分伪类和伪元素，规定伪元素使用2个冒号。所以，对于 CSS2 标准的老伪元素，比如`:first-line`，`:first-letter`，`:before`，`:after`，写一个冒号浏览器也能识别，但对于 CSS3 标准的新伪元素，比如::selection，就必须写2个冒号了。 

## calc函数

calc函数是css3新增的功能，可以使用calc()计算border、margin、padding、font-size和width等属性设置动态值。

```css
#div1 {
    position: absolute;
    left: 50px;
    width: calc( 100% / (100px * 2) );
    //兼容写法
    width: -moz-calc( 100% / (100px * 2) );
    width: -webkit-calc( 100% / (100px * 2) );
    border: 1px solid black;
} 
```

注意点：

- 需要注意的是，运算符前后都需要保留一个空格，例如：width: calc(100% - 10px);
- calc()函数支持 "+", "-", "*", "/" 运算;
- 对于不支持 calc() 的浏览器，整个属性值表达式将被忽略。不过我们可以对那些不支持 calc()的浏览器，使用一个固定值作为回退。

```
1.<img src="#" alt="alt信息" />
//1.当图片不输出信息的时候，会显示alt信息 鼠标放上去没有信息，当图片正常读取，不会出现alt信息
2.<img src="#" alt="alt信息" title="title信息" />
// 2.当图片不输出信息的时候，会显示alt信息 鼠标放上去会出现title信息
//当图片正常输出的时候，不会出现alt信息，鼠标放上去会出现title信息
```



在用HTML5开发Web App时，检测浏览器是否支持HTML5功能是个必须的步骤。

检测浏览器是否支持HTML5功能，可归结为以下四种方式：

- 在全局对象上检测属性；
- 在创建的元素上检测属性；
- 检测一个方法是否返回期望值；
- 检测元素是否能保留值。

**1. 在全局对象上检测属性**

比如，检测离线功能的代码：

```html
<!doctype html>``<``html` `lang``=``"cn"``>``<``head``>``  ``<``meta` `charset``=``"UTF-8"``>``  ``<``title``>applicationCache Test</``title``>``  ``<``script``>``    ``window.onload = function() {``      ``if (window.applicationCache) {``        ``document.write("Yes, your browser can use offline web applications.");``      ``} else {``        ``document.write("No, your browser cannot use offline web applications.");``      ``}``    ``}``  ``</``script``>``</``head``>``<``body``>` `</``body``>``</``html``>
```

**2. 在创建的元素上检测属性**

首先要创建一个元素，再检测其能否为DOM识别。比如，通过测试canvas元素的context属性，检测浏览器是否支持canvas元素：

```
<!doctype html>``<``html` `lang``=``"cn"``>``<``head``>``  ``<``meta` `charset``=``"UTF-8"``>``  ``<``title``>Simple Square</``title``>``  ``<``script` `type``=``"text/javascript"``>``    ``window.onload = drawSquare;` `    ``function drawSquare () {``      ``var canvas = document.getElementById('Simple.Square');``      ``if (canvas.getContext) {``        ``var context = canvas.getContext('2d');` `        ``context.fillStyle = "rgb(13, 118, 208)";``        ``context.fillRect(2, 2, 98, 98);``      ``} else {``        ``alert("Canvas API requires an HTML5 compliant browser.");``      ``}``    ``}``  ``</``script``>``</``head``>``<``body``>``  ``<``canvas` `id``=``"Simple.Square"` `width``=``"100"` `height``=``"100"``></``canvas``>``</``body``>``</``html``>
```

**3. 检测一个方法是否返回期望值**

我们知道，浏览器对WebM、H.264的支持是不尽相同的。如何检测浏览器支持哪种编解码器？首先要像前面“2. 在创建的元素上检测属性”所述那样，先检测是否支持该元素（比如video），再检测方法是否返回期望值：

```
<!doctype html>``<``html` `lang``=``"cn"``>``<``head``>``  ``<``meta` `charset``=``"UTF-8"``>``  ``<``title``>Video Test</``title``>``  ``<``script``>``    ``function videoCheck() {``      ``return !!document.createElement("video").canPlayType;``    ``}` `    ``function h264Check() {``      ``if (!videoCheck) {``      ``document.write("not");``      ``return;``      ``}` `      ``var video = document.createElement("video");``      ``if (!video.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"')) {``        ``document.write("not");``      ``}``      ``return;``    ``}` `    ``document.write("Your browser does ");``    ``h264Check();``    ``document.write(" support H.264 video.");``  ``</``script``>``</``head``>``<``body``>` `</``body``>``</``html``>
```

**4. 检测元素是否能保留值**

HTML5表单元素的检测只能用这种方法，比如input的range类型，如果浏览器不支持，则会显示一个普通的文本框，具体检测方法如下所示：

```
<!doctype html>``<``html` `lang``=``"cn"``>``<``head``>``  ``<``meta` `charset``=``"UTF-8"``>``  ``<``title``>Range Input Test</``title``>``  ``<``script``>``    ``function rangeCheck() {``      ``var i = document.createElement("input");``      ``i.setAttribute("type", "range");``      ``if (i.type == "text") {``        ``document.write("not");``      ``}``      ``return;``    ``}` `    ``document.write("Your browser does ");``    ``rangeCheck();``    ``document.write(" support the <``code``><``input` `type``=``range``></``code``> input type.");``  ``</``script``>``</``head``>``<``body``>` `</``body``>``</``html``>
```