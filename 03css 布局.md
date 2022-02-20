## flex布局

采用 Flex 布局的元素，称为 `Flex 容器`（flex container），简称"容器"。它的所有子元素自动成为容器成员，称为 `Flex 项目`（flex item），简称“项目”。

父元素属性

| 属性名          |                            属性值                            |                             备注                             |
| --------------- | :----------------------------------------------------------: | :----------------------------------------------------------: |
| display         |                             flex                             |     定义了一个flex容器，它的直接子元素会接受这个flex环境     |
| justify-content | （flex-start,flex-end,center）, （space-between,space-around） |     设置或检索弹性盒子元素在主轴（横轴）方向上的对齐方式     |
| align-items     |     （flex-start,flex-end,center）,（baseline,stretch）      |     设置或检索弹性盒子元素在侧轴（纵轴）方向上的对齐方式     |
| align-content   | （flex-start,flex-end,center）,（stretch,space-between,space-around） |                          必须要多行                          |
| flex-direction  |            row,row-reverse,column,column-reverse             |                        决定主轴的方向                        |
| flex-wrap       |                   nowrap,wrap,wrap-reverse                   |                 如果一条轴线排不下，如何换行                 |
| flex-flow       |                [flex-direction] , [flex-wrap]                | 是`flex-direction`属性和`flex-wrap`属性的简写形式，默认值为`row nowrap` |

子元素属性

| 属性名      |                          属性值                          |                             备注                             |
| ----------- | :------------------------------------------------------: | :----------------------------------------------------------: |
| order       |                          [int]                           | 默认情况下flex order会按照书写顺序呈现，可以通过order属性改变，数值小的在前面，还可以是负数。 |
| flex-grow   |                         [number]                         | 设置或检索弹性盒的扩展比率,根据弹性盒子元素所设置的扩展因子作为比率来分配剩余空间 |
| flex-shrink |                         [number]                         | 设置或检索弹性盒的收缩比率,根据弹性盒子元素所设置的收缩因子作为比率来收缩空间 |
| flex-basis  |                      [length], auto                      |                  设置或检索弹性盒伸缩基准值                  |
| align-self  | auto,（flex-start,flex-end,center）,（baseline,stretch） | 设置或检索弹性盒子元素在侧轴（纵轴）方向上的对齐方式，可以覆盖父容器align-items的设置 |



## 清除浮动

在浮动元素后面添加 `clear:both` 的空 div 元素，

```
<div class="container">
    <div class="left"></div>
    <div class="right"></div>
    <div style="clear:both"></div>
</div> 
```

给父元素添加 `overflow:hidden` 或者 auto 样式，触发BFC。

```
<div class="container">
    <div class="left"></div>
    <div class="right"></div>
</div> 
.container{
    overflow:hidden;
} 
```

使用伪元素，也是在元素末尾添加一个点并带有 clear: both 属性的元素实现的。

```
<div class="clearfix">
    <div class="left"></div>
    <div class="right"></div>
</div> 
.clearfix:after{
    content: ".";
    height: 0;
    clear: both;
    display: block;
    visibility: hidden;
} 
```

**推荐**使用第三种方法，不会在页面新增div，文档结构更加清晰。



## 让元素消失

1. opacity：0, 该元素隐藏起来了，但不会改变页面布局，并且，如果该元素已经绑定了一些事件，如click事件也能触发
2. visibility:hidden, 该元素隐藏起来了，但不会改变页面布局，但是不会触发该元素已经绑定的事件
3. display:none,  把元素隐藏起来，并且会改变页面布局，可以理解成在页面中把该元素删掉
4. z-index=-1 置于其他元素下面

## 移动端rem

rem官方定义『The font size of the root element』，即根元素的字体大小。rem是一个相对的CSS单位，1rem等于html元素上font-size的大小。所以，我们只要设置html上font-size的大小，就可以改变1rem所代表的大小。

```
(function () {
    var html = document.documentElement;
    function onWindowResize() {
        html.style.fontSize = html.getBoundingClientRect().width / 20 + 'px';
    }
    window.addEventListener('resize', onWindowResize);
    onWindowResize();
})(); 
```

## 移动端1px

一般来说，在PC端浏览器中，设备像素比（dpr）等于1，1个css像素就代表1个物理像素；但是在retina屏幕中，dpr普遍是2或3，1个css像素不再等于1个物理像素，因此比实际设计稿看起来粗不少。

伪元素+scale

```
<style>
    .box{
        width: 100%;
        height: 1px;
        margin: 20px 0;
        position: relative;
    }
    .box::after{
        content: '';
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 1px;
        transform: scaleY(0.5);
        transform-origin: 0 0; 
        background: red;
    }
</style>

<div class="box"></div> 
```

border-image

```
div{
    border-width: 1px 0px;
    -webkit-border-image: url(border.png) 2 0 stretch;
    border-image: url(border.png) 2 0 stretch;
} 
```

## 两边固定中间自适应的三栏布局

圣杯布局和双飞翼布局是前端工程师需要日常掌握的重要布局方式。两者的功能相同，都是为了实现一个两侧宽度固定，中间宽度自适应的三栏布局。

圣杯布局

```
<style>
body{
    min-width: 550px;
}
#container{
    padding-left: 200px;
    padding-right: 150px;
}
#container .column{
    float: left;
}
#center{
    width: 100%;
}
#left{
    width: 200px;
    margin-left: -100%;
    position: relative;		//by position
    right: 200px;
}
#right{
    width: 150px;
    margin-right: -150px;
}
</style>
<div id="container">
    <div id="center" class="column">center</div>
    <div id="left" class="column">left</div>
    <div id="right" class="column">right</div>
</div> 
```

```
  <div class="container">
    <div class="mid col">mid</div>
    <div class="left col">left</div>
    <div class="right col">right12</div>
  </div>
  <style>
    body{ 
      margin: 0 ;
    }
    .container{
      /* padding-left: 100px;
      padding-right: 100px; */
    }
    .container .col{
      float: left;
    }
    .mid{
      width: 100%;
      height: 100px;
      margin-left: 100px;
      background-color: rgb(121, 75, 75);
    }
    .left{
      width: 100px;
      height: 100px;
      margin-left: -100%;
      position: relative;
      right: 100px;
      background-color: #389;
    }
    .right{
      width: 100px;
      height: 100px;
      margin-left: -200px;
      /* position: relative;
      right: 200px; */
      background-color: #334;
    }
  </style>
```

双飞翼布局

```
<style>
body {
    min-width: 500px;
}
#container {
    width: 100%;
}
.column {
    float: left;
}
#center {
    margin-left: 200px;
    margin-right: 150px;
}
#left {
    width: 200px;
    margin-left: -100%;
}
#right {
    width: 150px;
    margin-left: -150px;
}
</style>
<div id="container" class="column">
    <div id="center">center</div>
</div>
<div id="left" class="column">left</div>
<div id="right" class="column">right</div> 
```

## CSS画圆半圆扇形三角梯形

```
div{
    margin: 50px;
    width: 100px;
    height: 100px;
    background: red;
}
/* 半圆 */
.half-circle{
    height: 50px;
    border-radius: 50px 50px 0 0;
}
/* 扇形 */
.sector{
    border-radius: 100px 0 0;
}
/* 三角 */
.triangle{
    width: 0px;
    height: 0px;
    background: none;
    border: 50px solid red;
    border-color: red transparent transparent transparent;
}
/* 梯形 */
.ladder{
    width: 50px;
    height: 0px;
    background: none;
    border: 50px solid red;
    border-color: red transparent transparent transparent;
}
```

 ```
<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="UTF-8">
<title>Document</title>
<style>
.div {
position: relative;
width: 300px;
background: rgba(0, 140, 255, 0.616);
padding: 50px;
color: #fff;
border-radius: 15px;
text-align:center;
vertical-align:middle;
display: table-cell;
background: linear-gradient(210deg, transparent 1.5em, rgba(0, 140, 255, 0.616) 0);
}
.div::before {
content: '';
position: absolute;
top: 0;
right: 0;
width: 1.73em;
height: 3em;
background: linear-gradient(240deg, transparent 50%, rgba(0, 140, 255, 0.616) 0);
transform: translateY(-1.3em) rotate(-30deg);
transform-origin: bottom right;
border-bottom-left-radius: inherit;
box-shadow: -0.2em 0.2em 0.3em -0.1em rgba(25, 0, 255, 0.226);
}
</style>
</head>

<body>
<div class='div'> 春花秋月何时了？ 往事知多少？小楼昨夜又东风，故国不堪回首月明中。 雕栏玉砌应犹在，只是朱颜改。 问君能有几多愁？恰似一江春水向东流。</div>
</body>
</html>
 ```

