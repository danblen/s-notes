#### 避免魔法数字

```js
setTimeout(blastOff, 86400000)
```

使用常量命名

```
const MILLISECONDS_IN_A_DAY = 86400000
setTimeout(blastOff, MILLISECONDS_IN_A_DAY)
```

#### 使用变量表示

 ```
 if (
 	people.age < 20 ||
 	people.weight < 100 ||
 	(people.age > 20 && people.weight < 200)
 ) {
 	// other code
 }
 ```

用变量来表示if里是判断什么

```
const isQuliafiedPeople =
	people.age < 20 ||
	people.weight < 100 ||
	(people.age > 20 && people.weight < 200);
if (isQuliafiedPeople) {
	// other code
}
```

#### 使用对象组合一类变量：

```
let loadingTable = false;
let loadingTree = false;
let loadingConfirm = false;
```

使用对象

```
const loading = {
	table: false,
	tree: false,
	confirm: false,
};
```

#### 函数传参使用解构设置默认值

```
function handleData({ name, age, grade = 3 }, isStudent) {
	// other code
}
handleData(studentInfo, true);
```

#### 展开运算符

```
let obj = { grade: 3 };
let objA = { name: 'lee', age: 12 };
let objB = { name: 'li' };
let objC = { age: 13 };
Object.assign(obj, objA, objB, objC);
```

和Object.assign一样，只能展开对象第一层，如果第一层属性是一个对象还将引用这个对象

```
let objA = { name: 'lee', age: 12 };
let objB = { name: 'li' };
let objC = { age: 13 };
let obj = { grade: 3, ...objA, ...objB, ...objC };
```

数组使用展开

```
let arr = [...arr1, ...arr2, ...['abc', 'efg']];
```

### 使用可选链式操作符和 Nullish 运算符合并

```text
const isManufacturerFromUSA = () => {
  if (
    car &&
    car.manufacturer &&
    car.manufacturer.address &&
    car.manufacturer.address.state === "USA"
  ) {
    console.log("true");
  }
};

checkCarManufacturerState(); // 'true'
```

使用链式操作符 '.?' 和nullish '??'

```text
// to get the car model
const model = car?.model ?? "default model";

// to get the manufacturer street
const street = car?.manufacturer?.address?.street ?? "default street";

// to check if the car manufacturer is from the USA
const isManufacturerFromUSA = () => {
  if (car?.manufacturer?.address?.state === "USA") {
    console.log("true");
  }
};
```

### 使用数组方法 

```text
const fruits = [
  { name: "apple", color: "red" },
  { name: "banana", color: "yellow" },
  { name: "grape", color: "purple" },
];

function test() {
  // condition: short way, all fruits must be red
  const isAllRed = fruits.every((f) => f.color == "red");

  console.log(isAllRed); // false
}
```

如果我们想要测试任何一个水果是否是红色的，我们可以使用 Array.some：

```text
const fruits = [
  { name: "apple", color: "red" },
  { name: "banana", color: "yellow" },
  { name: "grape", color: "purple" },
];

function test() {
  // condition: if any fruit is red
  const isAnyRed = fruits.some((f) => f.color == "red");

  console.log(isAnyRed); // true
}
```

可以使用Array.includes来重写条件语句

```text
function printAnimals(animal) {
  const animals = ["dog", "cat", "hamster", "turtle"];

  if (animals.includes(animal)) {
    console.log(`I have a ${animal}`);
  }
}

console.log(printAnimals("hamster")); // I have a hamster
```

#### 使用对象或map映射

```text
function handleOperate(type) {
	switch (type) {
		case 'click':
			handleClick();
		case 'hover':
			handleHover();
		case 'move':
			handleMove();
		default:
			return;
	}
}
```

使用映射

```text
const handlerMap = {
	click: handleClick,
	hover: handleHover,
	move: handleMove,
	default: () => {},
};
function handleOperate(type) {
	const handler = handlerMap[type] || handlerMap['default'];
	handler();
}
```

### 减少嵌套层级

```
form.validate((valid) => {
	if (valid) {
		// other code
	}
});
```

使用卫语句

```
let isValid = false;
form.validate((valid) => {
	isValid = valid;
});
if (!isValid) return;
// other code
```


#### 使用Async/Await 

回调不够整洁，并会造成大量的嵌套，ES6 内嵌了 Promises，但 ES7 中的 async 和 await 更清晰，性能也比原生promise快

then语法

```js
function getData() {
	const params = { id: 123 };
	httpService
		.getTypes(params)
		.then((res) => {
			return httpService.getData(res.data.types);
		})
		.then((data) => {
			console.log(data);
		});
    anotherAsyncFn();
}
```

Async/Await（如果不需要await应该避免使用，因为会阻塞代码）

```js
async function getData() {
	const types = await getTypes();
	const params = { types };
	const res = await httpService.getData(params);
	console.log(res);
    anotherAsyncFn();
}
async function getTypes() {
	const params = { id: 123 };
	const res = await httpService.getTypes(params);
	return res.data.types;
}
```

### 使用Promise.all

```js
async function fetchInfo() {
   const username = await getUsername() 
   const userId = await getUserId()
   
   return { username, userId }
}
```

在两个Promise操作的结果互相不依赖的时候，可以用Promise.all去并行提高性能。

```js
async function fetchInfo() {
   const [username, uid] =  await Promise.all([
      getUsername(),
      getUid()
   ])
  return { username, uid }
}
```

> Promise.all中数组只要有一个promise被reject了那么就会直接返回了。所以如果你期望的是无论是成功还是失败都把整个promise数组执行完并返回带有一个对象数组，那么可以使用Promise.allSettled()

### 长函数分解

如果一个函数太长，可能会不好复用、调试和重构

在复杂的逻辑中，相关的逻辑尽量放在一起，并插入空行分开

```
async function doSomething() {
	// other code
	const res = await getData();
	let list = res.data.list;
	let results = [];
	// 不知道这段代码在做什么
	for (let i = 0; i < list.length; i++) {
		for (let j = 0; i < list[i].length; j++) {
			if (list[i][j].color === 'blue') {
				// other code
				results.push(list[i][j].data);
			}
		}
	}
	// other code
	render(results);
}
```

提出一个函数

```
function extractDataFromList(list) {
	let results = [];
	for (let i = 0; i < list.length; i++) {
		for (let j = 0; i < list[i].length; j++) {
			if (list[i][j].color === 'blue') {
				// other code
				results.push(list[i][j].data);
			}
		}
	}
	return results;
}
async function doSomething() {
	// other code
	const res = await getData();
	
	let list = res.data.list;
	let results = extractDataFromList(list);
	// other code
	render(results);
}
```

### 函数式编程

命令式编程(imperative programming)

```js
function extract(array) {
	let results = [];
	for (let i = 0; i < array.length; i++) {
		if (array[i].color === 'blue') {
			results.push(array[i].data);
		}
	}
	return results;
}
```

 如果是函数式编程(functional programming)

```js
const filterFn = (item) => item.color === 'blue';
const mapFn = (item) => item.data;
function extract(array, filterFn, mapFn) {
	return array.filter(filterFn).map(mapFn);
}
```

函数式编程的一些特点：

- 每个函数尽可能完成单一的功能
- 避免副作用，尽可能不引入或者少引入状态，比如纯函数，相同的输入永远得到相同的输出
- 提倡组合（composition），把函数当成变量，通过返回函数、作为参数传到另一个函数等方式组合函数。
- 屏蔽细节，告诉计算机我要做什么，而不是怎么做。我们看 filter / map，它们并未暴露自身的细节。一个 filter 函数的实现，在单核 CPU 上可能是一个循环，在多核 CPU 上可能是一个 dispatcher 和 aggregator，但我们可以暂时忽略它的实现细节，只需了解它的功能即可。

链式调用

返回this

## 函数设计

1. 参数传递，参数少， 在单个函数里从参数获得需要的数据 还是直接传需要的数据

