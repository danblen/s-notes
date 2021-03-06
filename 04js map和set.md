## Map相关

使用 `Map`：

- 储存的键不是字符串/数字/或者 `Symbol` 时，选择 `Map`，因为 `Object` 并不支持
- 储存大量的数据时，选择 `Map`，因为它占用的内存更小
- 需要进行许多新增/删除元素的操作时，选择 `Map`，因为速度更快
- 需要保持插入时的顺序的话，选择 `Map`，因为 `Object` 会改变排序
- 需要迭代/遍历的话，选择 `Map`，因为它默认是可迭代对象，迭代更为便捷

使用 `Object`：

- 只是简单的数据结构时，选择 `Object`，因为它在数据少的时候占用内存更少，且新建时更为高效
- 需要用到 `JSON` 进行文件传输时，选择 `Object`，因为 `JSON` 不默认支持 `Map`
- 需要对多个键值进行运算时，选择 `Object`，因为句法更为简洁
- 需要覆盖原型上的键时，选择 Object，prototype、

与常规对象和数组不同的是，它们是“键控集合（[keyed collections](https://www.zhihu.com/search?q=keyed+collections&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"article"%2C"sourceId"%3A"77897608"})）”。这就是说它们的行为有稍许不同，并且在特定的上下文中使用，它们可以提供相当大的[性能优势](https://www.zhihu.com/search?q=性能优势&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"article"%2C"sourceId"%3A"77897608"})。 

### 1.无限制的键（Key）

常规JavaScript对象的键必须是`String`或`Symbol`

`Map`允许你使用函数、对象和其它简单的类型（包括NaN）作为键，在链接不同数据类型时，这个特性提供了极大的灵活性。

### 2.直接遍历

在常规对象中，为了遍历keys、values和entries，你必须将它们转换为数组，如使用`Object.keys()`、`Object.values()`和`Object.entries()`，或者使用`for ... in`循环，因为常规对象不能直接遍历，另外`for ... in`循环还有一些限制：它仅仅遍历可枚举属性、非Symbol属性，并且遍历的顺序是任意的。

而`Map`可以直接遍历，并且由于它是键控集合，遍历的顺序和插入键值的顺序是一致的。你可以使用`for ... of`循环或`forEach`方法来遍历`Map`的entries，如下代码：

```js
for (let [key, value] of map) {
};
map.forEach((value,) => {
});
```

还有一个好处就是，你可以调用`map.size`属性来获取键值数量，而对于常规对象，为了做到这样你必须先转换为数组，然后获取数组长度，如：`Object.keys({}).length`。

## `Map`和`Set`有何不同

`Map`的行为和`Set`非常相似，并且它们都包含一些相同的方法，包括：has、get、set、delete。它们两者都是键控集合，就是说你可以使用像`forEach`的方法来遍历元素，顺序是按照插入键值排列的。

最大的不同是`Map`通过键值（key/value）成对出现，就像你可以把一个数组转换为`Set`，你也可以把二维数组转换为`Map`：

```js
const set = new Set([1, 2, 3, 4]);
const map = new Map([['one', 1], ['two', 2], ['three', 3], ['four', 4]]);
```

## 类型转换

要将`Map`切换回数组，你可以使用ES6的结构语法：

```js
const map = new Map([['one', 1], ['two', 2]]);
const arr = [...map];
```

在八月份ES2019的首次展示中，我们看见了`Object`引入了2个新方法：`Object.entries()`和`Object.fromEntries()`，这可以使上述方法简化许多：

```js
const obj2 = Object.fromEntries(map);
const map2 = new Map(Object.entries(obj));
```

在你使用`Object.fromEntries`转换map为object之前，确保map的key在转换为字符串时会产生唯一的结果，否则你将面临数据丢失的风险。

## 性能测试

为了准备测试，我会创建一个对象和一个map，它们都有1000000个相同的键值。

```js
let obj = {}, map = new Map(), n = 1000000;
for (let i = 0; i < n; i++) {
  obj[i] = i;
  map.set(i, i);
}
```

然后我使用`console.time()`来衡量测试，由于我特定的系统和Node.js版本的原因，时间精度可能会有波动。测试结果展示了使用`Map`的性能收益，尤其是添加和删除键值的时。

**查询**

```js
let result;
console.time('Object');
result = obj.hasOwnProperty('999999');
console.timeEnd('Object');
// Object: 0.250ms

console.time('Map');
result = map.has(999999);
console.timeEnd('Map');
// Map: 0.095ms (2.6 times faster)
```

**添加**

```js
console.time('Object');
obj[n] = n;
console.timeEnd('Object');
// Object: 0.229ms

console.time('Map');
map.set(n, n);
console.timeEnd('Map');
// Map: 0.005ms (45.8 times faster!)
```

**删除**

```js
console.time('Object');
delete obj[n];
console.timeEnd('Object');
// Object: 0.376ms

console.time('Map');
map.delete(n);
console.timeEnd('Map');
// Map: 0.012ms (31 times faster!)
```

### `Map`在什么情况下更慢

在测试中，我发现一种情况常规对象的性能更好：使用`for`循环去创建常规对象和map。这个结果着实令人震惊，但是没有`for`循环，map添加属性的性能胜过常规对象。

```js
console.time('Object');
for (let i = 0; i < n; i++) {
  obj[i] = i;
}
console.timeEnd('Object');
// Object: 32.143ms

let obj = {}, map = new Map(), n = 1000000;
console.time('Map');
for (let i = 0; i < n; i++) {
  map.set(i, i);
}
console.timeEnd('Map');
// Map: 163.828ms (5 times slower)
```

## 举个例子

最后，让我们看一个`Map`比常规对象更合适的例子，比如说我们想写一个函数去检查2个字符串是否由相同的字符串随机排序。

```js
console.log(isAnagram('anagram', 'gramana')); // Should return true
console.log(isAnagram('anagram', 'margnna')); // Should return false
```

有许多方法可以做到，但是这里，map可以帮忙我们创建一个最简单、最快速的解决方案：

```js
const isAnagram = (str1, str2) => {
  if (str1.length !== str2.length) {
    return false;
  }
  const map = new Map();
  for (let char of str1) {
    const count = map.has(char) ? map.get(char) + 1 : 1;
    map.set(char, count);
  }
  for (let char of str2) {
    if (!map.has(char)) {
      return false;
    }
    const count = map.get(char) - 1;
    if (count === 0) {
      map.delete(char);
      continue;
    }
    map.set(char, count);
  }
  return map.size === 0;
};
```

在这个例子中，当涉及到动态添加和删除键值，无法提前确认数据结构（或者说键值的数量）时，map比object更合适。

------

我希望这篇文章对你有所帮助，如果你之前没有使用过`Map`，不妨开阔你的眼界，衡量现代JavaScript的价值体现。

>  译者注：我个人不太同意作者的观点，从以上的描述来看，Map更像是以空间为代价，换取速度上的提升。那么对于空间和速度的衡量，必然存在一个阈值。在数据量比较少时，相比与速度的提升，其牺牲的空间代价更大，此时显然是不适合使用Map；当数据量足够大时，此时空间的代价影响更小。所以，看开发者如何衡量两者之间的关系，选择最优解。