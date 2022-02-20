- Vue Components：Vue 组件。HTML 页面上，负责接收用户操作等交互行为，执行 dispatch 方法触发对应 action 进行回应。
- dispatch：操作行为触发方法，是唯一能执行 action 的方法。

- actions：**操作行为处理模块,由组件中的****$store.dispatch('action 名称', data1)****来触发。然后由 commit()来触发 mutation 的调用 , 间接更新 state**。负责处理 Vue Components 接收到的所有交互行为。包含同步/异步操作，支持多个同名方法，按照注册的顺序依次触发。向后台 API 请求的操作就在这个模块中进行，包括触发其他 action 以及提交 mutation 的操作。该模块提供了 Promise 的封装，以支持 action 的链式触发。
- commit：状态改变提交操作方法。对 mutation 进行提交，是唯一能执行 mutation 的方法。

- mutations：**状态改变操作方法，由 actions 中的****commit('mutation 名称')****来触发**。是 Vuex 修改 state 的唯一推荐方法。该方法只能进行同步操作，且方法名只能全局唯一。操作之中会有一些 hook 暴露出来，以进行 state 的监控等。
- state：页面状态管理容器对象。集中存储 Vue components 中 data 对象的零散数据，全局唯一，以进行统一的状态管理。页面显示所需的数据从该对象中进行读取，利用 Vue 的细粒度数据响应机制来进行高效的状态更新。

- getters：state 对象读取方法。图中没有单独列出该模块，应该被包含在了 render 中，Vue Components 通过该方法读取全局 state 对象。

vuex 是 vue 的状态管理器，存储的数据是响应式的。但是并不会保存起来，刷新之后就回到了初始状态，**具体做法应该在 vuex 里数据改变的时候把数据拷贝一份保存到 localStorage 里面，刷新之后，如果 localStorage 里有保存的数据，取出来再替换 store 里的 state。**

#### 什么是Vuex？

<details>
    <summary>参考答案</summary>
<p>Vuex 是一个专为 Vue.js 应用程序开发的状态管理插件。它采用集中式存储管理应用的所有组件的状态，而更改状态的唯一方法是提交mutation，例<code>this.$store.commit('SET_VIDEO_PAUSE', video_pause)</code>，<code>SET_VIDEO_PAUSE</code>为mutations属性中定义的方法
。</p>
</details>

#### Vuex解决了什么问题？

<details>
    <summary>参考答案</summary>
<p>解决两个问题</p>
<ul>
<li>多个组件依赖于同一状态时，对于多层嵌套的组件的传参将会非常繁琐，并且对于兄弟组件间的状态传递无能为力。</li>
<li>来自不同组件的行为需要变更同一状态。以往采用父子组件直接引用或者通过事件来变更和同步状态的多份拷贝。以上的这些模式非常脆弱，通常会导致无法维护的代码。</li>
</ul>
</details>

#### 什么时候用Vuex？

<details>
    <summary>参考答案</summary>
<p>当项目遇到以下两种场景时</p>
<ul>
<li>多个组件依赖于同一状态时。</li>
<li>来自不同组件的行为需要变更同一状态。</li>
</ul>
</details>

#### 怎么引用Vuex？

<details>
    <summary>参考答案</summary>
<ul>
<li>先安装依赖<code>nnpm install vuex --save</code></li>
<li>在项目目录src中建立store文件夹</li>
<li>在store文件夹下新建index.js文件,写入<pre><code class="hljs bash copyable" lang="bash">import Vue from <span class="hljs-string">'vue'</span>;
import Vuex from <span class="hljs-string">'vuex'</span>;
Vue.use(Vuex);
//不是在生产环境debug为<span class="hljs-literal">true</span>
const debug = process.env.NODE_ENV !== <span class="hljs-string">'production'</span>;
//创建Vuex实例对象
const store = new Vuex.Store({
    strict:debug,//在不是生产环境下都开启严格模式
    state:{
    },
    getters:{
    },
    mutations:{
    },
    actions:{
    }
})
<span class="hljs-built_in">export</span> default store;
<span class="copy-code-btn">复制代码</span></code></pre></li>
<li>然后再main.js文件中引入Vuex,这么写<pre><code class="hljs bash copyable" lang="bash">import Vue from <span class="hljs-string">'vue'</span>;
import App from <span class="hljs-string">'./App.vue'</span>;
import store from <span class="hljs-string">'./store'</span>;
const vm = new Vue({
    store:store,
    render: h =&gt; h(App)
}).<span class="hljs-variable">$mount</span>(<span class="hljs-string">'#app'</span>)
<span class="copy-code-btn">复制代码</span></code></pre></li>
</ul>
</details>

#### Vuex的5个核心属性是什么？

<details>
    <summary>参考答案</summary>
分别是 state、getters、mutations、actions、modules 。
</details>

#### Vuex中状态储存在哪里，怎么改变它？

<details>
    <summary>参考答案</summary>
存储在state中，改变Vuex中的状态的唯一途径就是显式地提交 (commit) mutation。
</details>

#### Vuex中状态是对象时，使用时要注意什么？

<details>
    <summary>参考答案</summary>
因为对象是引用类型，复制后改变属性还是会影响原始数据，这样会改变state里面的状态，是不允许，所以先用深度克隆复制对象，再修改。
</details>

#### 怎么在组件中批量使用Vuex的state状态？

<details>
    <summary>参考答案</summary>
<p>使用mapState辅助函数, 利用对象展开运算符将state混入computed对象中</p>
<pre><code class="hljs bash copyable" lang="bash">import {mapState} from <span class="hljs-string">'vuex'</span>
<span class="hljs-built_in">export</span> default{
    computed:{
        ...mapState([<span class="hljs-string">'price'</span>,<span class="hljs-string">'number'</span>])
    }
}
<span class="copy-code-btn">复制代码</span></code></pre></details>

#### Vuex中要从state派生一些状态出来，且多个组件使用它，该怎么做，？

<details>
    <summary>参考答案</summary>
使用getter属性，相当Vue中的计算属性computed，只有原状态改变派生状态才会改变。
<p>getter接收两个参数，第一个是state，第二个是getters(可以用来访问其他getter)。</p>
<pre><code class="hljs bash copyable" lang="bash">const store = new Vuex.Store({
    state: {
        price: 10,
        number: 10,
        discount: 0.7,
    },
    getters: {
        total: state =&gt; {
            <span class="hljs-built_in">return</span> state.price * state.number
        },
        discountTotal: (state, getters) =&gt; {
            <span class="hljs-built_in">return</span> state.discount * getters.total
        }
    },
});
<span class="copy-code-btn">复制代码</span></code></pre><p>然后在组件中可以用计算属性computed通过<code>this.$store.getters.total</code>这样来访问这些派生转态。</p>
<pre><code class="hljs bash copyable" lang="bash">computed: {
    <span class="hljs-function"><span class="hljs-title">total</span></span>() {
        <span class="hljs-built_in">return</span> this.<span class="hljs-variable">$store</span>.getters.total
    },
    <span class="hljs-function"><span class="hljs-title">discountTotal</span></span>() {
        <span class="hljs-built_in">return</span> this.<span class="hljs-variable">$store</span>.getters.discountTotal
    }
}
<span class="copy-code-btn">复制代码</span></code></pre></details>

#### 怎么通过getter来实现在组件内可以通过特定条件来获取state的状态？

<details>
    <summary>参考答案</summary>
<p>通过让getter返回一个函数，来实现给getter传参。然后通过参数来进行判断从而获取state中满足要求的状态。</p>
<pre><code class="hljs bash copyable" lang="bash">const store = new Vuex.Store({
    state: {
        todos: [
            { id: 1, text: <span class="hljs-string">'...'</span>, <span class="hljs-keyword">done</span>: <span class="hljs-literal">true</span> },
            { id: 2, text: <span class="hljs-string">'...'</span>, <span class="hljs-keyword">done</span>: <span class="hljs-literal">false</span> }
        ]
    },
    getters: {
        getTodoById: (state) =&gt; (id) =&gt;{
            <span class="hljs-built_in">return</span> state.todos.find(todo =&gt; todo.id === id)
        }
    },
});
<span class="copy-code-btn">复制代码</span></code></pre><p>然后在组件中可以用计算属性computed通过<code>this.$store.getters.getTodoById(2)</code>这样来访问这些派生转态。</p>
<pre><code class="hljs bash copyable" lang="bash">computed: {
    <span class="hljs-function"><span class="hljs-title">getTodoById</span></span>() {
        <span class="hljs-built_in">return</span> this.<span class="hljs-variable">$store</span>.getters.getTodoById
    },
}
<span class="hljs-function"><span class="hljs-title">mounted</span></span>(){
    console.log(this.getTodoById(2).done)//<span class="hljs-literal">false</span>
}
<span class="copy-code-btn">复制代码</span></code></pre></details>

#### 怎么在组件中批量使用Vuex的getter属性

<details>
    <summary>参考答案</summary>
<p>使用mapGetters辅助函数, 利用对象展开运算符将getter混入computed 对象中</p>
<pre><code class="hljs bash copyable" lang="bash">import {mapGetters} from <span class="hljs-string">'vuex'</span>
<span class="hljs-built_in">export</span> default{
    computed:{
        ...mapGetters([<span class="hljs-string">'total'</span>,<span class="hljs-string">'discountTotal'</span>])
    }
}
<span class="copy-code-btn">复制代码</span></code></pre></details>

#### 怎么在组件中批量给Vuex的getter属性取别名并使用

<details>
    <summary>参考答案</summary>
<p>使用mapGetters辅助函数, 利用对象展开运算符将getter混入computed 对象中</p>
<pre><code class="hljs bash copyable" lang="bash">import {mapGetters} from <span class="hljs-string">'vuex'</span>
<span class="hljs-built_in">export</span> default{
    computed:{
        ...mapGetters({
            myTotal:<span class="hljs-string">'total'</span>,
            myDiscountTotal:<span class="hljs-string">'discountTotal'</span>,
        })
    }
}
<span class="copy-code-btn">复制代码</span></code></pre></details>

#### 在Vuex的state中有个状态number表示货物数量，在组件怎么改变它。

<details>
    <summary>参考答案</summary>
<p>首先要在mutations中注册一个mutation</p>
<pre><code class="hljs bash copyable" lang="bash">const store = new Vuex.Store({
    state: {
        number: 10,
    },
    mutations: {
        SET_NUMBER(state,data){
            state.number=data;
        }
    },
});
<span class="copy-code-btn">复制代码</span></code></pre><p>在组件中使用<code>this.$store.commit</code>提交mutation，改变number</p>
<pre><code class="hljs bash copyable" lang="bash">this.<span class="hljs-variable">$store</span>.commit(<span class="hljs-string">'SET_NUMBER'</span>,10)
<span class="copy-code-btn">复制代码</span></code></pre></details>

#### 在Vuex中使用mutation要注意什么。

<details>
    <summary>参考答案</summary>
mutation 必须是同步函数
</details>

#### 在组件中多次提交同一个mutation，怎么写使用更方便。

<details>
    <summary>参考答案</summary>
<p>使用mapMutations辅助函数,在组件中这么使用</p>
<pre><code class="hljs bash copyable" lang="bash">import { mapMutations } from <span class="hljs-string">'vuex'</span>
methods:{
    ...mapMutations({
        <span class="hljs-built_in">set</span>Number:<span class="hljs-string">'SET_NUMBER'</span>,
    })
}
<span class="copy-code-btn">复制代码</span></code></pre><p>然后调用<code>this.setNumber(10)</code>相当调用<code>this.$store.commit('SET_NUMBER',10)</code></p>
</details>

#### Vuex中action和mutation有什么区别？

<details>
    <summary>参考答案</summary>
<ul>
<li>action 提交的是 mutation，而不是直接变更状态。mutation可以直接变更状态。</li>
<li>action 可以包含任意异步操作。mutation只能是同步操作。</li>
<li>提交方式不同，action 是用<code>this.$store.dispatch('ACTION_NAME',data)</code>来提交。mutation是用<code>this.$store.commit('SET_NUMBER',10)</code>来提交。</li>
<li>接收参数不同，mutation第一个参数是state，而action第一个参数是context，其包含了<pre><code class="hljs bash copyable" lang="bash">{
    state,      // 等同于 `store.state`，若在模块中则为局部状态
    rootState,  // 等同于 `store.state`，只存在于模块中
    commit,     // 等同于 `store.commit`
    dispatch,   // 等同于 `store.dispatch`
    getters,    // 等同于 `store.getters`
    rootGetters // 等同于 `store.getters`，只存在于模块中
}
<span class="copy-code-btn">复制代码</span></code></pre></li>
</ul>
</details>

#### Vuex中action和mutation有什么相同点？

<details>
    <summary>参考答案</summary>
<p>第二参数都可以接收外部提交时传来的参数。
<code>this.$store.dispatch('ACTION_NAME',data)</code>和<code>this.$store.commit('SET_NUMBER',10)</code></p>
</details>

#### 在组件中多次提交同一个action，怎么写使用更方便。

<details>
    <summary>参考答案</summary>
<p>使用mapActions辅助函数,在组件中这么使用</p>
<pre><code class="hljs bash copyable" lang="bash">methods:{
    ...mapActions({
        <span class="hljs-built_in">set</span>Number:<span class="hljs-string">'SET_NUMBER'</span>,
    })
}
<span class="copy-code-btn">复制代码</span></code></pre><p>然后调用<code>this.setNumber(10)</code>相当调用<code>this.$store.dispatch('SET_NUMBER',10)</code></p>
</details>

#### Vuex中action通常是异步的，那么如何知道action什么时候结束呢？

<details>
    <summary>参考答案</summary>
<p>在action函数中返回Promise，然后再提交时候用then处理</p>
<pre><code class="hljs bash copyable" lang="bash">actions:{
    SET_NUMBER_A({commit},data){
        <span class="hljs-built_in">return</span> new Promise((resolve,reject) =&gt;{
            <span class="hljs-built_in">set</span>Timeout(() =&gt;{
                commit(<span class="hljs-string">'SET_NUMBER'</span>,10);
                resolve();
            },2000)
        })
    }
}
this.<span class="hljs-variable">$store</span>.dispatch(<span class="hljs-string">'SET_NUMBER_A'</span>).then(() =&gt; {
  // ...
})
<span class="copy-code-btn">复制代码</span></code></pre></details>

#### Vuex中有两个action，分别是actionA和actionB，其内都是异步操作，在actionB要提交actionA，需在actionA处理结束再处理其它操作，怎么实现？

<details>
    <summary>参考答案</summary>
<p>利用ES6的<code>async</code>和<code>await</code>来实现。</p>
<pre><code class="hljs bash copyable" lang="bash">actions:{
    async actionA({commit}){
        //...
    },
    async actionB({dispatch}){
        await dispatch (<span class="hljs-string">'actionA'</span>)//等待actionA完成
        // ... 
    }
}
<span class="copy-code-btn">复制代码</span></code></pre></details>

#### 有用过Vuex模块吗，为什么要使用，怎么使用。

<details>
    <summary>参考答案</summary>
<p>有，因为使用单一状态树，应用的所有状态会集中到一个比较大的对象。当应用变得非常复杂时，store 对象就有可能变得相当臃肿。所以将 store 分割成模块（module）。每个模块拥有自己的 state、mutations、actions、getters，甚至是嵌套子模块，从上至下进行同样方式的分割。</p>
<p>在module文件新建moduleA.js和moduleB.js文件。在文件中写入</p>
<pre><code class="hljs bash copyable" lang="bash">const state={
    //...
}
const getters={
    //...
}
const mutations={
    //...
}
const actions={
    //...
}
<span class="hljs-built_in">export</span> default{
    state,
    getters,
    mutations,
    actions
}
<span class="copy-code-btn">复制代码</span></code></pre><p>然后再index.js引入模块</p>
<pre><code class="hljs bash copyable" lang="bash">import Vue from <span class="hljs-string">'vue'</span>;
import Vuex from <span class="hljs-string">'vuex'</span>;
Vue.use(Vuex);
import moduleA from <span class="hljs-string">'./module/moduleA'</span>
import moduleB from <span class="hljs-string">'./module/moduleB'</span>
const store = new Vuex.Store({
    modules:{
        moduleA,
        moduleB
    }
})
<span class="hljs-built_in">export</span> default store
<span class="copy-code-btn">复制代码</span></code></pre></details>

#### 在模块中，getter和mutation接收的第一个参数state，是全局的还是模块的？

<details>
    <summary>参考答案</summary>
第一个参数state是模块的state，也就是局部的state。
</details>

#### 在模块中，getter和mutation和action中怎么访问全局的state和getter？

<details>
    <summary>参考答案</summary>
<ul>
<li>在getter中可以通过第三个参数rootState访问到全局的state,可以通过第四个参数rootGetters访问到全局的getter。</li>
<li>在mutation中不可以访问全局的satat和getter，只能访问到局部的state。</li>
<li>在action中第一个参数context中的<code>context.rootState</code>访问到全局的state，<code>context.rootGetters</code>访问到全局的getter。</li>
</ul>
</details>

#### 在组件中怎么访问Vuex模块中的getter和state,怎么提交mutation和action？

<details>
    <summary>参考答案</summary>
<ul>
<li>直接通过<code>this.$store.getters</code>和<code>this.$store.state</code>来访问模块中的getter和state。</li>
<li>直接通过<code>this.$store.commit('mutationA',data)</code>提交模块中的mutation。</li>
<li>直接通过<code>this.$store.dispatch('actionA,data')</code>提交模块中的action。</li>
</ul>
</details>

#### 用过Vuex模块的命名空间吗？为什么使用，怎么使用。

<details>
    <summary>参考答案</summary>
<p>默认情况下，模块内部的action、mutation和getter是注册在全局命名空间，如果多个模块中action、mutation的命名是一样的，那么提交mutation、action时，将会触发所有模块中命名相同的mutation、action。</p>
<p>这样有太多的耦合，如果要使你的模块具有更高的封装度和复用性，你可以通过添加<code>namespaced: true</code> 的方式使其成为带命名空间的模块。</p>
<pre><code class="hljs bash copyable" lang="bash"><span class="hljs-built_in">export</span> default{
    namespaced: <span class="hljs-literal">true</span>,
    state,
    getters,
    mutations,
    actions
}
<span class="copy-code-btn">复制代码</span></code></pre></details>

#### 怎么在带命名空间的模块内提交全局的mutation和action？

<details>
    <summary>参考答案</summary>
<p>将 { root: true } 作为第三参数传给 dispatch 或 commit 即可。</p>
<pre><code class="hljs bash copyable" lang="bash">this.<span class="hljs-variable">$store</span>.dispatch(<span class="hljs-string">'actionA'</span>, null, { root: <span class="hljs-literal">true</span> })
this.<span class="hljs-variable">$store</span>.commit(<span class="hljs-string">'mutationA'</span>, null, { root: <span class="hljs-literal">true</span> })
<span class="copy-code-btn">复制代码</span></code></pre></details>

#### 怎么在带命名空间的模块内注册全局的action？

<details>
    <summary>参考答案</summary>
<pre><code class="hljs bash copyable" lang="bash">actions: {
    actionA: {
        root: <span class="hljs-literal">true</span>,
        handler (context, data) { ... }
    }
  }
<span class="copy-code-btn">复制代码</span></code></pre></details>

#### 组件中怎么提交modules中的带命名空间的moduleA中的mutationA？

<details>
    <summary>参考答案</summary>
<pre><code class="hljs bash copyable" lang="bash">this.<span class="hljs-variable">$store</span>.commit(<span class="hljs-string">'moduleA/mutationA'</span>,data)
<span class="copy-code-btn">复制代码</span></code></pre></details>

#### 怎么使用mapState，mapGetters，mapActions和mapMutations这些函数来绑定带命名空间的模块？

<details>
    <summary>参考答案</summary>
<p>首先使用<code>createNamespacedHelpers</code>创建基于某个命名空间辅助函数</p>
<pre><code class="hljs bash copyable" lang="bash">import { createNamespacedHelpers } from <span class="hljs-string">'vuex'</span>;
const { mapState, mapActions } = createNamespacedHelpers(<span class="hljs-string">'moduleA'</span>);
<span class="hljs-built_in">export</span> default {
    computed: {
        // 在 `module/moduleA` 中查找
        ...mapState({
            a: state =&gt; state.a,
            b: state =&gt; state.b
        })
    },
    methods: {
        // 在 `module/moduleA` 中查找
        ...mapActions([
            <span class="hljs-string">'actionA'</span>,
            <span class="hljs-string">'actionB'</span>
        ])
    }
}
<span class="copy-code-btn">复制代码</span></code></pre></details>

#### Vuex插件有用过吗？怎么用简单介绍一下？

<details>
    <summary>参考答案</summary>
<p>Vuex插件就是一个函数，它接收 store 作为唯一参数。在Vuex.Store构造器选项plugins引入。
在store/plugin.js文件中写入</p>
<pre><code class="hljs bash copyable" lang="bash"><span class="hljs-built_in">export</span> default <span class="hljs-keyword">function</span> createPlugin(param){
    <span class="hljs-built_in">return</span> store =&gt;{
        //...
    }
}
<span class="copy-code-btn">复制代码</span></code></pre><p>然后在store/index.js文件中写入</p>
<pre><code class="hljs bash copyable" lang="bash">import createPlugin from <span class="hljs-string">'./plugin.js'</span>
const myPlugin = createPlugin()
const store = new Vuex.Store({
  // ...
  plugins: [myPlugin]
})
<span class="copy-code-btn">复制代码</span></code></pre></details>

#### 在Vuex插件中怎么监听组件中提交mutation和action？

<details>
    <summary>参考答案</summary>
<ul>
<li>用Vuex.Store的实例方法<code>subscribe</code>监听组件中提交mutation</li>
<li>用Vuex.Store的实例方法<code>subscribeAction</code>监听组件中提交action
在store/plugin.js文件中写入</li>
</ul>
<pre><code class="hljs bash copyable" lang="bash"><span class="hljs-built_in">export</span> default <span class="hljs-keyword">function</span> createPlugin(param) {
    <span class="hljs-built_in">return</span> store =&gt; {
        store.subscribe((mutation, state) =&gt; {
            console.log(mutation.type)//是那个mutation
            console.log(mutation.payload)
            console.log(state)
        })
        // store.subscribeAction((action, state) =&gt; {
        //     console.log(action.type)//是那个action
        //     console.log(action.payload)//提交action的参数
        // })
        store.subscribeAction({
            before: (action, state) =&gt; {//提交action之前
                console.log(`before action <span class="hljs-variable">${action.type}</span>`)
            },
            after: (action, state) =&gt; {//提交action之后
                console.log(`after action <span class="hljs-variable">${action.type}</span>`)
            }
        })
    }
}
<span class="copy-code-btn">复制代码</span></code></pre><p>然后在store/index.js文件中写入</p>
<pre><code class="hljs bash copyable" lang="bash">import createPlugin from <span class="hljs-string">'./plugin.js'</span>
const myPlugin = createPlugin()
const store = new Vuex.Store({
  // ...
  plugins: [myPlugin]
})
<span class="copy-code-btn">复制代码</span></code></pre></details>

#### 在v-model上怎么用Vuex中state的值？

<details>
    <summary>参考答案</summary>
<p>需要通过computed计算属性来转换。</p>
<pre><code class="hljs bash copyable" lang="bash">&lt;input v-model=<span class="hljs-string">"message"</span>&gt;
// ...
computed: {
    message: {
        <span class="hljs-function"><span class="hljs-title">get</span></span> () {
            <span class="hljs-built_in">return</span> this.<span class="hljs-variable">$store</span>.state.message
        },
        <span class="hljs-built_in">set</span> (value) {
            this.<span class="hljs-variable">$store</span>.commit(<span class="hljs-string">'updateMessage'</span>, value)
        }
    }
}
<span class="copy-code-btn">复制代码</span></code></pre></details>

#### Vuex的严格模式是什么,有什么作用,怎么开启？

<details>
    <summary>参考答案</summary>在严格模式下，无论何时发生了状态变更且不是由 mutation函数引起的，将会抛出错误。这能保证所有的状态变更都能被调试工具跟踪到。<p></p>
<p>在Vuex.Store 构造器选项中开启,如下</p>
<pre><code class="hljs bash copyable" lang="bash">const store = new Vuex.Store({
    strict:<span class="hljs-literal">true</span>,
})
<span class="copy-code-btn">复制代码</span></code></pre></details>
