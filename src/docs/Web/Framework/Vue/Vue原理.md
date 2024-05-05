---
title: Vue原理
article: false
category:
  - JavaScript
  - Vue
---
## MVVM模型
- M：模型(Model)
  - data中的数据
- V：视图(View) 
  - 模板代码（DOM代码）,vue的模板经过解析形成的页面DOM结构，就是看到的页面
- VM：视图模型(ViewModel)
  - Vue实例

## 数据绑定和数据监听
### 数据绑定
- 将数据存到model中，经过vue实例进行数据绑定，最后都出现在了vm身上，就把数据摆在了相应的页面上的位置
### 数据监听
对dom的监听，如果页面（模板）上有什么要更改，view通过VM去映射到data，改了data
### 结论
1. data中所有的属性，最后都出现在了vm身上。页面上显示的东西（模板）都是来自于vm，而vm的东西一部分来自于data
2. vm身上所有的属性 及 Vue原型上所有属性，在Vue模板中都可以直接使用。
## 数据代理
### 给对象添加属性-传统方法
1. 对象没有任何限制，可以遍历、修改和删除

```js
let person = {
    name:'张三',
    sex:'男',
    // 添加年龄
    age:"18"
}
// 打印时三个属性是深紫色，表示可以被枚举、可以修改、可以删除
```

2. 对象动态传值只限于第一次定义时

```js
let number = 18
let person = {
    name:'张三',
    sex:'男',
    // 添加年龄
    age:number
}
console.log(person.age)     // 18

number = 19;
console.log(person.age)     // 18，因为let person语句已经执行完毕，此时只改number，与person无瓜
```

### 给对象添加属性-Object.defineProperty 
1. `Object.defineProperty`可以对对象进行限制

```js
Object.defineProperty(person,'age',{
    value:18
})
// 打印时age属性是浅紫色，表示该属性不能被枚举，即不参与遍历
Object.defineProperty(person,'age',{
    value:18,
    // enumerable:true, //控制属性是否可以枚举，默认值是false
    // writable:true, //控制属性是否可以被修改，默认值是false
    // configurable:true //控制属性是否可以被删除，默认值是false
})
```

2. `Object.defineProperty`动态传值始终有效

```js
let number = 18
let person = {
    name:'张三',
    sex:'男',
}

Object.defineProperty(person,'age',{
    value:18,

    //当有人读取person的age属性时，get函数(getter)就会被调用，且返回值就是age的值
    // get:function{}简写为get(){}
    get(){
        console.log('有人读取age属性了')
        return number
    },

    //当有人修改person的age属性时，set函数(setter)就会被调用，且会收到修改的具体值
    set(value){
        console.log('有人修改了age属性，且值是',value)
        number = value
    }

})

console.log(person.age)     // 18

number = 19;
console.log(person.age)     // 19，因为此时调用age属性的getter，return的是最新的number
```
### 数据代理 
- 通过一个对象代理对另一个对象中属性的操作（读/写）
```js
// 通过obj2读取、修改x
let obj = {x:100}
let obj2 = {y:200}

Object.defineProperty(obj2,'x',{
    get(){
        return obj.x
    },
    set(value){
        obj.x = value
    }
})
```
#### vue中应用数据代理
- data中的属性的底层是通过`Object.defineProperty`加上去的,通过vm对象来代理data对象中属性的操作（读/写）
- Vue中数据代理的好处：更加方便的操作data中的数据,若没有数据代理，则模板字符串中应该写`_dada.xxx`,**不方便**
- 原理：
  - 通过Object.defineProperty()把data对象中所有属性添加到vm上。
  - 为每一个添加到vm上的属性，都指定一个getter/setter。
  - 在getter/setter内部去操作（读/写）data中对应的属性。
- vm._data中不是数据代理套娃，而是做了数据劫持(为了实现响应式，即data中变了，则页面中变，但是若_data中是写死的，不做映射，则无法监听到data变化，即无法实现响应式)

## 响应式

### v3 实现响应式——ref 函数和 reactive 函数

#### ref 定义具有响应式的基本数据类型(不推荐)

- 模板中不需要.value
  - v3 底层自动读取了.value 的值
    - 解析到这行时，发现是个 ref 对象，则自动读取了.value 的值
- ref 函数对基础数据类型加工后生成的对象，叫 RefImpl 引用实现的实例对象，简称：引用对象
  - 该引用对象的 value 属性是响应式的数据，其他属性是底层的，不用关注
    - 底层通过`Object.defineProperty`和`getter、setter`实现响应式(和 v2 的响应式实现相同)
- ref 加工一个变量，就要 return 一个，繁琐

```vue
<template>
  <h2>姓名：{{ name }}</h2>
  <button @click="changeInfo">修改人的信息</button>
</template>

<script>
import { ref } from "vue";
export default {
  setup() {
    let name = ref("张三");

    console.log(name);
    //  RefImpl {
    //    __v_isRef: true
    //     _rawValue: "张三"
    //     _shallow: false
    //     _value: "张三"
    //     value:（…）    // '张三'
    //   }

    function changeInfo() {
      name.value = "李四";
    }

    return {
      name,
      changeInfo,
    };
  },
};
</script>
```

#### ref 定义具有响应式的引用数据类型(不推荐)

- ref 函数对引用数据类型加工后生成的对象，叫 Proxy 引用实现的实例对象，简称：引用对象
  - Proxy 底层是用的 es6 的 Proxy
    - 底层将代理对象 Proxy 封装成 reactive 函数，实现响应式，通过 Reflect 操作源对象内部的数据

```vue
<template>
  <h3>工作种类：{{ job.type }}</h3>
  <button @click="changeInfo">修改人的信息</button>
</template>
<script>
import { ref } from "vue";
export default {
  setup() {
    let job = ref({
      type: "前端工程师",
    });

    console.log("job", job);
    // RefImpl {
    //   __v_isRef: true
    //   _rawValue: {type: '前端工程师'}
    //   _shallow: false
    //   _value: Proxy {type: '前端工程师'}
    //   value: （…） // Proxy
    // }

    console.log("job.type", job.type); // undefined
    console.log("job.value", job.value); // Proxy {type: '前端工程师'}
    console.log("job.value.type", job.value.type); // 前端工程师

    function changeInfo() {
      job.value.type = "UI设计师";
    }

    return {
      job,
      changeInfo,
    };
  },
};
</script>
```

#### reactive 定义具有响应式的引用数据类型(推荐)

- 好处：无论基础数据类型还是引用数据类型，都将功能点相关的变量包在对象中，只用 return 一个该对象，即可
- 存在问题：模板中该 person 对象用了多次，繁琐

```vue
<template>
  <h2>姓名：{{ person.name }}</h2>
  <h3>工作种类：{{ person.job.type }}</h3>
  <h3>爱好：{{ person.hobby }}</h3>
  <h3>测试的数据c：{{ person.job.a.b.c }}</h3>
  <button @click="changeInfo">修改人的信息</button>
</template>

<script>
import { reactive, ref } from "vue";
export default {
  setup() {
    let person = reactive({
      name: "张三",
      job: {
        salary: "30K",
        a: {
          b: {
            c: 666,
          },
        },
      },
      hobby: ["抽烟", "喝酒", "烫头"],
    });

    function changeInfo() {
      person.name = "李四";
      person.job.type = "UI设计师";
      person.job.a.b.c = 999;
      person.hobby[0] = "学习";
    }

    // 若用ref定义具有响应式的引用数据类型，则需要用.value拿到Proxy，然后才能拿到值
    // .value很多，繁琐

    // function changeInfo(){
    // 	person.value.name = '李四'
    // 	person.value.job.type = 'UI设计师'
    // 	person.value.job.a.b.c = 999
    // 	person.value.hobby[0] = '学习'
    // }

    return {
      person,
      changeInfo,
    };
  },
};
</script>
```

#### 最佳实践：reactive 函数 + ...语法 + toRefs 函数

- 无论基本数据类型还是引用数据类型，将相同功能点的变量统一定义在`xxxData`内部，并用`reactive`实现响应式
- 再通过`...toRefs(xxxData)`return 出去
  - 注意：模板中只能拿到`...toRefs(xxxData)`得到的对象的最外层的数据，深层次的属性在模板中还得通过.语法拿到

```vue
<template>
  <h4>{{ person }}</h4>

  <h2>姓名：{{ name }}</h2>
  <h2>年龄：{{ age }}</h2>
  <h2>薪资：{{ job.j1.salary }}K</h2>

  <button @click="name += '~'">修改姓名</button>
  <button @click="age++">增长年龄</button>
  <button @click="job.j1.salary++">涨薪</button>
</template>

<script>
import { ref, reactive, toRef, toRefs } from "vue";
export default {
  setup() {
    let person = reactive({
      name: "张三",
      age: 18,
      job: {
        j1: {
          salary: 20,
        },
      },
    });

    console.log(person.name); // 张三

    // toRef将普通对象转换成RefImpl对象
    console.log(toRef(person, "name"));

    // ObjectRefImpl {
    // 	__v_isRef: true
    // 	_key: "name"
    // 	_object: Proxy {name: '张三', age: 18, job: {…}}
    // 	value: （…）
    // }

    // toRefs批量创建多个RefImpl对象
    console.log(toRefs(person));
    // {
    // 	age: ObjectRefImpl {
    // 		_object: Proxy
    // 		value:（…）
    // 	}
    // 	job: ObjectRefImpl {
    // 		_object: Proxy
    // 		value:（…）
    // 	}
    // 	name: ObjectRefImpl {
    // 		_object: Proxy,
    // 		value:（…）
    // 	}
    // }

    //返回一个对象（常用）
    return {
      // 这样写没毛病，只是模板中要写很多的person
      // person,

      // 这样写，页面能变化，但是是错误的
      // 此时读取的是person.name字符串值，经过ref函数加工后，成了新的ref，若修改name，变的是ref(person.name)中的value，而源数据person不会变，所以是错误的。因为没有引用关系
      // name:ref(person.name),

      // toRef有引用关系的
      // 此时模板中不用写很多的person了，但是要写很多toRef函数，麻烦
      // name:toRef(person,'name'),
      // age:toRef(person,'age'),
      // salary:toRef(person.job.j1,'salary'),

      // 最佳实践
      // ...函数将toRefs(person)返回的对象展开，将每一组key-value都放在return的对象中
      // 将person最外层的属性拆出去，深层次的属性在模板中还得通过.语法拿到
      ...toRefs(person),
    };
  },
};
</script>
```

### v3-响应式数据的判断

- isRef: 检查一个值是否为一个 ref 对象
- isReactive: 检查一个对象是否是由 `reactive` 创建的响应式代理
- isReadonly: 检查一个对象是否是由 `readonly` 创建的只读代理
- isProxy: 检查一个对象是否是由 `reactive` 或者 `readonly` 方法创建的代理


### ref 函数——定义基本类型的响应式数据

- 作用: 定义一个响应式的数据，v2 中的 ref 是标签属性，为了给标签打标识，类似于原生的 id 属性，v3 中依旧可以使用 ref 标签属性，只是多了一个 ref 函数，注意区分即可.const dom = ref();名称和变量要相同,，且该变量要在 setup 函数中交出去，才能拿到
- 语法: `const xxx = ref(initValue)`
  - 创建一个包含响应式数据的引用对象（reference 对象，简称 ref 对象）
  - JS 中操作数据： `xxx.value`
  - 模板中读取数据: 不需要.value，直接：`<div>{{xxx}}</div>`
- 备注：
  - 接收的数据可以是：基本类型、也可以是对象类型。
  - 基本类型的数据：响应式依然是靠`Object.defineProperty()`的`get`与`set`完成的。
  - 对象类型的数据：内部 <i style="color:gray;font-weight:bold">“ 求助 ”</i> 了 Vue3.0 中的一个新函数—— `reactive`函数。
  - 如果不加 ref 函数，若值被修改了，但是 vue 没有监测到，所以页面不变化

```js
<script>
	import {ref} from 'vue'
	export default {
		name: 'App',
		setup(){
			//数据
			let name = ref('张三')
			let age = ref(18)
			let job = ref({
				type:'前端工程师',
				salary:'30K'
			})

			//方法
			function changeInfo(){
				// name.value = '李四'
				// age.value = 48
				console.log(job.value)
				// job.value.type = 'UI设计师'
				// job.value.salary = '60K'
				// console.log(name,age)

				// 若直接打印name，则是经过加工后的对象，该对象叫RefImpl引用实现的实例对象简称：引用对象。reference引用，implement实现
				/**
				 * RefImpl ：{
				 * 	...其他属性是底层的，不用关注
				 * value属性是响应式的数据，底层通过Object.defineProperty和getter、setter实现响应式(和v2的实现相同，v3的getter和setter被放在了原型对象中)
				 * }
				 */

				// 若直接打印job，则是经过加工后的对象，该对象叫Proxy引用实现的实例对象简称：引用对象。Proxy底层是使用的es6的proxy
				// ref函数传入基本数据类型，加工后变成RefImpl，经过getter、setter数据劫持，直接.value实现响应式
				// 传入引用数据类型，例如对象，所以底层将代理对象Proxy封装成reactive函数，实现响应式，不用多写个value了
			}

			//返回一个对象（常用）
			return {
				name,
				age,
				job,
				changeInfo
			}
		}
	}
</script>

```

#### customRef-自定义 ref

- 作用：创建一个自定义的 ref，并对其依赖项跟踪和更新触发进行显式控制。
- 应用
  - 防抖

### reactive 函数——定义对象类型的响应式数据

- 作用: 定义一个对象类型的响应式数据（基本类型不要用它，要用`ref`函数）
- 语法：`const 代理对象= reactive(源对象)`接收一个对象（或数组），返回一个<strong style="color:#DD5145">代理对象（Proxy 的实例对象，简称 proxy 对象）</strong>
- reactive 定义的响应式数据是“深层次的”。
- 内部基于 ES6 的 Proxy 实现，通过代理对象操作源对象内部数据进行操作。

```js
<script>
	import {reactive} from 'vue'
	export default {
		name: 'App',
		setup(){
			//数据,定义对象类型的响应式数据时，一般将一个类别的放到一个对象中，返回时只用返回这一个对象即可，不用写很多
			let person = reactive({
				name:'张三',
				age:18,
				job:{
					type:'前端工程师',
					salary:'30K',
					a:{
						b:{
							c:666
						}
					}
				},
				hobby:['抽烟','喝酒','烫头']
			})

			//方法
			function changeInfo(){
				person.name = '李四'
				person.age = 48
				person.job.type = 'UI设计师'
				person.job.salary = '60K'
				person.job.a.b.c = 999
				person.hobby[0] = '学习'
			}

			//返回一个对象（常用）
			return {
				person,
				changeInfo
			}
		}
	}
</script>
```
## 响应式

### 响应式原理——v2

- 实现原理：

  - 对象类型：通过`Object.defineProperty()`对属性的读取、修改进行拦截（数据劫持）。

  - 数组类型：通过重写更新数组的一系列方法来实现拦截。（对数组的变更方法进行了包裹）。

    ```js
    Object.defineProperty(data, "count", {
      get() {},
      set() {},
    });
    ```

- 存在问题：（数据已经改了，但是 v2 没有监听到，想要实现响应式，要用 this.$set()、this.$delete()或 Vue.set()、Vue.delete()），v3 中通过 reactive 函数实现响应式，则更方便的解决了以下两个问题

  - 对象中，新增属性、删除属性, 界面不会更新。
  - 数组中，直接通过下标修改数组, 界面不会自动更新。数组不用 delete，用 splice

### 响应式原理——v3

实现原理:

- 通过 Proxy（代理）: 拦截对象中任意属性的变化, 包括：属性值的读写、属性的添加、属性的删除等。
- 通过 Reflect（反射）: 对源对象的属性进行操作。
- MDN 文档中描述的 Proxy 与 Reflect：

  - Proxy：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy

  - Reflect：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect

```js
new Proxy(data, {
  // 拦截读取属性值
  get(target, prop) {
    return Reflect.get(target, prop);
  },
  // 拦截设置属性值或添加新属性
  set(target, prop, value) {
    return Reflect.set(target, prop, value);
  },
  // 拦截删除属性
  deleteProperty(target, prop) {
    return Reflect.deleteProperty(target, prop);
  },
});

proxy.name = "tom";
```

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Document</title>
  </head>
  <body>
    <script type="text/javascript">
      //源数据
      let person = {
        name: "张三",
        age: 18,
      };

      //模拟Vue2中实现响应式
      //#region
      /* let p = {}
			Object.defineProperty(p,'name',{
				configurable:true,
				get(){ //有人读取name时调用
					return person.name
				},
				set(value){ //有人修改name时调用
					console.log('有人修改了name属性，我发现了，我要去更新界面！')
					person.name = value
				}
			})
			Object.defineProperty(p,'age',{
				get(){ //有人读取age时调用
					return person.age
				},
				set(value){ //有人修改age时调用
					console.log('有人修改了age属性，我发现了，我要去更新界面！')
					person.age = value
				}
			}) */
      //#endregion

      //模拟Vue3中实现响应式
      //#region
      // Proxy是window内置的构造函数
      // const p = new Proxy(person,{})，不传任何配置只是实现了代理

      // p叫代理对象，person叫源对象
      const p = new Proxy(person, {
        //有人读取p的某个属性时调用
        // target就是传入的源对象
        // propName就是要修改的属性名
        get(target, propName) {
          console.log(`有人读取了p身上的${propName}属性`);
          // target[propName]是在修改源数据person
          // return target[propName]

          // 读取对象的数据：通过点语法、或通过es6的Reflect.get()
          return Reflect.get(target, propName);
        },
        //有人修改p的某个属性、或给p追加某个属性时调用
        // value修改的值
        set(target, propName, value) {
          // 此处模拟实现响应式
          console.log(`有人修改了p身上的${propName}属性，我要去更新界面了！`);
          // target[propName] = value
          Reflect.set(target, propName, value);
        },
        //有人删除p的某个属性时调用
        deleteProperty(target, propName) {
          console.log(`有人删除了p身上的${propName}属性，我要去更新界面了！`);
          // return delete target[propName]
          return Reflect.deleteProperty(target, propName);
        },
      });
      //#endregion

      let obj = { a: 1, b: 2 };
      //通过Object.defineProperty去操作
      //#region
      /* try {
				Object.defineProperty(obj,'c',{
					get(){
						return 3
					}
				})
				Object.defineProperty(obj,'c',{
					get(){
						return 4
					}
				})
			} catch (error) {
				console.log(error)
			} */
      //#endregion

      //通过Reflect.defineProperty去操作,对于封装框架而言，相对友好一些，因为报错明显，否则一堆try catch，不友好
      //#region
      /* const x1 = Reflect.defineProperty(obj,'c',{
				get(){
					return 3
				}
			})
			console.log(x1)
			
			const x2 = Reflect.defineProperty(obj,'c',{
				get(){
					return 4
				}
			}) 
			if(x2){
				console.log('某某某操作成功了！')
			}else{
				console.log('某某某操作失败了！')
			} */
      //#endregion

      // console.log('@@@')
    </script>
  </body>
</html>
```

### 保护响应式的数据——v3

#### readonly 和 shallowReadonly

1. readonly-深只读
2. shallowReadonly-浅只读
   - 应用场景：某个响应式数据不是本组件定义的，是在其他组件中定义的，在本组件中实现：只能用该数据(用 readonly 的返回值作为个新的变量)，而不能改，因为改了后，其他组件受影响了。

```vue
<script>
import { ref, reactive, toRefs, readonly, shallowReadonly } from "vue";
export default {
  setup() {
    let person = reactive({
      name: "张三",
      age: 18,
      job: {
        j1: {
          salary: 20,
        },
      },
    });

    // readonly将响应式的所有数据进行保护，变成只读
    // person = readonly(person)

    // shallowReadonly将响应式的所有第一层数据进行保护，变成只读,但是person在组件中已经被定义成响应式的，再去限制其只读，有点矛盾
    // person = shallowReadonly(person)
    return {
      ...toRefs(person),
    };
  },
};
</script>
```

#### toRaw 和 markRaw

- toRaw：
  - 作用：将一个由`reactive`生成的<strong style="color:orange">响应式对象</strong>转为<strong style="color:orange">普通对象</strong>。
  - 使用场景：用于读取响应式对象对应的普通对象，对这个普通对象的所有操作，不会引起页面更新。
- markRaw：
  - 作用：标记一个对象，使其永远不会再成为响应式对象。
  - 应用场景:
    1. 有些值不应被设置为响应式的，例如复杂的第三方类库等。
    2. 当渲染具有不可变数据源的大列表时，跳过响应式转换可以提高性能。

### reactive 对比 ref

- 从定义数据角度对比：
  - ref 用来定义：<strong style="color:#DD5145">基本类型数据</strong>。
  - reactive 用来定义：<strong style="color:#DD5145">对象（或数组）类型数据</strong>。
  - 备注：ref 也可以用来定义<strong style="color:#DD5145">对象（或数组）类型数据</strong>, 它内部会自动通过`reactive`转为<strong style="color:#DD5145">代理对象</strong>。
- 从原理角度对比：
  - ref 通过`Object.defineProperty()`的`get`与`set`来实现响应式（数据劫持）。
  - reactive 通过使用<strong style="color:#DD5145">Proxy</strong>来实现响应式（数据劫持）, 并通过<strong style="color:#DD5145">Reflect</strong>操作<strong style="color:orange">源对象</strong>内部的数据。
- 从使用角度对比：
  - ref 定义的数据：操作数据<strong style="color:#DD5145">需要</strong>`.value`，读取数据时模板中直接读取<strong style="color:#DD5145">不需要</strong>`.value`。
  - reactive 定义的数据：操作数据与读取数据：<strong style="color:#DD5145">均不需要</strong>`.value`。
  - 一般就用 reactive，将一个 data 对象交出去(否则要交出去很多东西，麻烦)，data 中是分类好的数据，类似于 v2 的 data 配置项

