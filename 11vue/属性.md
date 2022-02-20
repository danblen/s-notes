# vue相关属性

## v-model双向绑定原理

v-model本质上是语法糖，v-model 在内部为不同的输入元素使用不同的属性并抛出不同的事件。

- text 和 textarea 元素使用 value 属性和 input 事件
- checkbox 和 radio 使用 checked 属性和 change 事件
- select 字段将 value 作为 prop 并将 change 作为事件

所以我们可以v-model进行如下改写： 

```
<input v-model="sth" />
//  等同于
<input :value="sth" @input="sth = $event.target.value" /> 
```

这个语法糖必须是固定的，也就是说属性必须为value，方法名必须为：input。

知道了v-model的原理，我们可以在自定义组件上实现v-model。

```js
//Parent
<template>
    {{num}}
    <Child v-model="num">
</template>
export default {
    data(){
        return {
            num: 0
        }
    }
}

//Child
<template>
    <div @click="add">Add</div>
</template>
export default {
    props: ['value'],
    methods:{
        add(){
            this.$emit('input', this.value + 1)
        }
    }
} 
```

```js
//parent
<template>
	{{num}}
	<Child v-model="num"/>
</template>
export default {
	data(){
		return {
			num:0
		}
	}
}

//child
<template>
	<input type="text"
		:value="text1"
		@input="$emit('change', $event.target.value)"
	>
</template>
export default {
	model: {
		prop: 'text1'
		event: change
	}
	props: {
	  text1: String
	  default() {
	  	return ''
	  }
	}
}
	
```



## key的作用

1. 让vue精准的追踪到每一个元素，`高效的更新虚拟DOM`。
2. 触发过渡

```
<transition>
  <span :key="text">{{ text }}</span>
</transition> 
```

当text改变时，这个元素的key属性就发生了改变，在渲染更新时，Vue会认为这里新产生了一个元素，而老的元素由于key不存在了，所以会被删除，从而触发了过渡。

## scoped属性作用

> 在Vue文件中的style标签上有一个特殊的属性，scoped。当一个style标签拥有scoped属性时候，它的css样式只能用于当前的Vue组件，可以使组件的样式不相互污染。如果一个项目的所有style标签都加上了scoped属性，相当于实现了样式的模块化。

scoped属性的实现原理是给每一个dom元素添加了一个独一无二的动态属性，给css选择器额外添加一个对应的属性选择器，来选择组件中的dom。

```
<template>
    <div class="box">dom</div>
</template>
<style lang="scss" scoped>
.box{
    background:red;
}
</style> 
```

vue将代码转译成如下：

```
.box[data-v-11c6864c]{//属性选择器
    background:red;
}
<template>
    <div class="box" data-v-11c6864c>dom</div>
</template> 
```

## scoped样式穿透

scoped虽然避免了组件间样式污染，但是很多时候我们需要修改组件中的某个样式，但是又不想去除scoped属性。

1. 使用/deep/

```html
//Parent
<template>
<div class="wrap">
    <Child />
</div>
</template>

<style lang="scss" scoped>
.wrap /deep/ .box{
    background: red;
}
</style>

//Child
<template>
    <div class="box"></div>
</template> 
```

1. 使用两个style标签

```html
//Parent
<template>
<div class="wrap">
    <Child />
</div>
</template>

<style lang="scss" scoped>
//其他样式
</style>
<style lang="scss">
.wrap .box{
    background: red;
}
</style>

//Child
<template>
    <div class="box"></div>
</template> 
```

## ref的作用

1. 获取dom元素`this.$refs.box`
2. 获取子组件中的data`this.$refs.box.msg`
3. 调用子组件中的方法`this.$refs.box.open()`

### v-show 和 v-if 有哪些区别？

`v-if` 会在切换过程中对条件块的事件监听器和子组件进行销毁和重建，如果初始条件是false，则什么都不做，直到条件第一次为true时才开始渲染模块。
 `v-show` 只是基于css进行切换，不管初始条件是什么，都会渲染。
 所以，`v-if` 切换的开销更大，而 `v-show` 初始化渲染开销更大，在需要频繁切换，或者切换的部分dom很复杂时，使用 `v-show` 更合适。渲染后很少切换的则使用 `v-if` 更合适。

### computed 和 watch 有什么区别？

`computed` 计算属性，是依赖其他属性的计算值，并且有缓存，只有当依赖的值变化时才会更新。
`watch` 是在监听的属性发生变化时，在回调中执行一些逻辑。
所以，`computed` 适合在模板渲染中，某个值是依赖了其他的响应式对象甚至是计算属性计算而来，而 `watch` 适合监听某个值的变化去完成一段复杂的业务逻辑。

watch可以获取值类型的oldvalue，不能获取引用类型的oldvalue

- computed 就是简单计算一下，适用于渲染页面。watch 适合做一些复杂业务逻辑
- 前者有依赖两个 watcher，computed watcher 和渲染 watcher。判断计算出的值变化后渲染 watcher 派发更新触发渲染

### computed vs methods

计算属性是基于他们的响应式依赖进行缓存的，只有在依赖发生变化时，才会计算求值，而使用 `methods`，每次都会执行相应的方法。

### keep-alive 的作用

`keep-alive` 可以在组件切换时，保存其包裹的组件的状态，使其不被销毁，防止多次渲染。
其拥有两个独立的生命周期钩子函数 actived 和 deactived，使用 `keep-alive` 包裹的组件在切换时不会被销毁，而是缓存到内存中并执行 deactived 钩子函数，命中缓存渲染后会执行 actived 钩子函数。

### v-html 会导致什么问题

在网站上动态渲染任意 HTML，很容易导致 XSS 攻击。所以只能在可信内容上使用 v-html，且永远不能用于用户提交的内容上。

### Vue 双向绑定

- 在初始化 data props 时，递归对象，给每一个属性双向绑定，对于数组而言，会拿到原型重写函数，实现手动派发更新。因为函数不能监听到数据的变动，和 proxy 比较一下。
- 除了以上数组函数，通过索引改变数组数据或者给对象添加新属性也不能触发，需要使用自带的set 函数，这个函数内部也是手动派发更新
- 在组件挂载时，会实例化渲染观察者，传入组件更新的回调。在实例化过程中，会对模板中的值对象进行求值，触发依赖收集。在触发依赖之前，会保存当前的渲染观察者，用于组件含有子组件的时候，恢复父组件的观察者。触发依赖收集后，会清理掉不需要的依赖，性能优化，防止不需要的地方去重复渲染。
- 改变值会触发依赖更新，会将收集到的所有依赖全部拿出来，放入 nextTick 中统一执行。执行过程中，会先对观察者进行排序，渲染的最后执行。先执行 beforeupdate 钩子函数，然后执行观察者的回调。在执行回调的过程中，可能 watch 会再次 push 进来，因为存在在回调中再次赋值，判断无限循环。

### v-model原理

- v:model 在模板编译的时候转换代码
- v-model 本质是 :value 和 v-on，但是略微有点区别。在输入控件下，有两个事件监听，输入中文时只有当输出中文才触发数据赋值
- v-model 和:bind 同时使用，前者优先级更高，如果 :value 会出现冲突
- v-model 因为语法糖的原因，还可以用于父子通信 





