---
title: Promise
article: false
category:
  - HTTP
---

## Promise(ES6)
### Primise
- Promise是ES6中进行异步编程的新解决方案（旧方案是单纯使用回调函数 ）。
- 从语法上来说: Promise 是一个构造函数 
- 从功能上来说: promise 对象用来`封装异步操作`并可以获取其成功/ 失败的结果值

## 异步
### 定义
- 异步编程允许当执行一个长时间任务时，程序不需要进行等待，而是继续执行之后的代码，直到这些任务完成之后再回来通知（回调函数）。
### 异步编程的优势
- 避免了程序的阻塞，提高了CPU的执行效率
  - 如文件读取、网络访问、数据库查询等操作。
### 有哪些异步操作
- node.js下的fs文件操作
```js
require('fs').readFile('./index.html', (err,data)=>{})
```
- 数据库操作
- AJAX 
```js
$.get('/server', (data)=>{})
```
- 定时器 
```js
setTimeout(()=>{}, 2000);
```

### 实现异步的两种方式
1. 传统的回调函数
2. Promise
### 为什么要用Promise
1. 指定回调函数的方式更加灵活 
   - 传统方式: 必须在启动异步任务前指定 
   - promise: 启动异步任务 => 返回promie对象 => 给promise对象绑定回调函数(甚至可以在异步任务结束后指定/多个) 

2. 支持链式调用, 解决回调地狱问题 
   - 回调地狱: 回调函数嵌套调用, 外部回调函数异步执行的结果是嵌套的回调执行的条件 
     - 回调地狱的缺点:不便于阅读,不便于异常处理 
     - 解决方案:promise 链式调用，用一种链式结构将多个异步操作串联起来，只是向下方增长，而不是向右增长，导致嵌套
     - 终极解决方案:async/await 

### Promise的工作流程
1. new Promise()创建一个Promise对象
2. 在Promise中封装异步操作
3. 若异步操作成功，则调用`resolve()`函数，该函数将Promise状态改为成功，然后调用then方法的第一个回调函数，然后then方法返回一个新的Promise对象
4. 若异步操作失败，则调用`reject()`函数，该函数将Promise状态改为失败，然后调用then方法的第一个回调函数，然后then方法返回一个新的Promise对象

### Promise的状态改变（实例对象中属性PromiseState）
1. 有哪些状态：
   - pending  原始状态，待定的
   - resolved / fullfilled  成功
   - rejected  失败
2. 两种状态改变方式
   - pending 变为 resolved 
   - pending 变为 rejected 
3. 一个Promise对象只能改变一次，无论变为成功还是失败, 都会有一个结果数据，成功的结果数据一般称为value, 失败的结果数据一般称为reason 

###  Promise 对象的值
- 属性中保存着异步任务『成功/失败』的结果
  - resolve，当成功时调用
  - reject ，当失败时调用
- 在后序的then方法中，就可以把这个值取出来，对这个值进行相关操作
### Promise API
#### Promise 构造函数
- `Promise (excutor) {} `
1. executor 函数:  执行器  (resolve, reject) => {}  ，把Promise函数的参数称为执行器函数
2. resolve 函数: 内部定义成功时我们调用的函数 value => {} 
3. reject 函数: 内部定义失败时我们调用的函数 reason => {} 
   - 说明: executor 会在 Promise 内部立即同步调用（即代码执行到执行器函数时会立刻执行，在封装时要注意）,异步操作在执行器中执行 

#### then 方法
- (onResolved, onRejected) => {} 
1. onResolved 函数: 成功的回调函数  (value) => {}
2. onRejected 函数: 失败的回调函数 (reason) => {} 
说明: 指定用于得到成功 value 的成功回调和用于得到失败 reason 的失败回调返回一个新的 promise 对象 

#### catch 方法
- (onRejected) => {} 
  - 失败的回调函数 (reason) => {} 
- 在链式结构的末尾添加catch方法，为了捕获错误。如果之前任意一个阶段发生了错误，catch被触发，之后的then()不会被执行

#### resolve 方法
- (value) => {} 
1. value: 成功的数据或 promise 对象
  - 说明: 返回一个成功/失败的 promise 对象 
2. 和then、catch相比，resolve方法是属于Promise函数对象的方法，而不是实例对象的
3. 作用：接收一个参数。返回一个成功、或失败的Promise对象，为了快速得到一个Promise对象，且能封装一个值，将这个值转化为Promise对象

#### reject 方法
- (reason) => {} 
1. reason: 失败的原因，说明: 返回一个失败的 promise 对象 
2. 和then、catch相比，reject方法是属于Promise函数对象的方法，而不是实例对象的

#### all 方法
- (promises) => {} 
  - promises: 包含 n 个 promise 的数组 ，参数结构内部每一个都是一个Promise对象
- 说明: 返回一个新的 promise对象, 该Promise对象的状态由数组中的Promise对象的状态决定
  - 只有所有的 promise 都成功才成功（成功的结果是每一个promise成功结果组成的数组）
  - 只要有一个失败了就直接失败 （失败的结果是在这个数组当中，失败的那个promise对象失败的结果）

#### race 方法
- (promises) => {} 
  - promises: 包含 n 个 promise 的数组 
- 说明: 返回一个新的 promise, 第一个完成的 promise 的结果状态就是最终的结果状态 ，谁先改变了状态，谁就是返回的结果的状态

### Promise关键问题
#### 如何改变 promise 的状态? 
1. resolve(value): 如果当前是 pending 就会变为 resolved 
2. reject(reason): 如果当前是 pending 就会变为 rejected 
3. 抛出异常: 如果当前是 pending 就会变为 rejected 
 
#### 都会调用吗
- 一个 promise 指定多个成功/失败回调函数, 都会调用吗? （即，若使用then方法为一个promise对象指定多个回调函数，这些回调是否都会执行）
  - 当 promise 改变为对应状态时都会调用 ，即状态改变之后，对应的回调函数都会执行

#### 执行顺序
- 改变 promise 状态和指定回调函数谁先谁后执行? （即resolve改变状态先执行，还是then指定回调先执行）
1. 都有可能, 正常情况下是先指定回调再改变状态, 但也可以先改状态再指定回调 
2. 如何先改状态再指定回调? 
  - 在执行器中直接调用 resolve()/reject() 
  - 延迟更长时间才调用 then() ，比如说resolve是一秒的定时器，而then是两秒的定时器
3. 什么时候才能得到数据? （回调函数什么时候执行）（封装中很重要的环节）
  - 如果先指定的回调, 那当状态发生改变时, 回调函数就会调用, 得到数据 
  - 如果先改变的状态, 那当指定回调时, 回调函数就会调用, 得到数据 
 
#### 结果状态由什么决定
- promise.then()返回的新 promise 的结果状态由什么决定? 
1. 简单表达: 由 then()指定的回调函数执行的结果决定 
2. 详细表达: 
  - 如果抛出异常, 新 promise 变为 rejected, reason 为抛出的异常 
  - 如果返回的是非 promise 的任意值, 新 promise 变为 resolved, value 为返回的值
  - 如果返回的是另一个新 promise, 此 promise 的结果就会成为新 promise 的结果

#### 如何串连多个操作任务
1. promise 的 then()返回一个新的 promise, 可以开成 then()的链式调用 
2. 通过 then 的链式调用串连多个同步/异步任务 
   
#### 异常传透?
1. 当使用 promise 的 then 链式调用时, 可以在最后指定失败的回调,  
2. 前面任何操作出了异常, 都会传到最后失败的回调中处理 

#### 中断promise链
1. 当使用 promise 的 then 链式调用时, 在中间中断, 不再调用后面的回调函数 
2. 办法: 在回调函数中返回一个 pendding 状态的 promise 对象 

### Promise的封装——async和await
#### async
1. 将函数标记为异步函数（返回值为 promise 对象的函数叫异步函数 ）
2. promise 对象的结果由 async 函数执行的返回值决定 
#### await
1. 在async标记的异步函数中，可以调用其他的异步函数，可以不使用then，而是使用更简洁的await
2. await等待promise完成之后直接返回最终的结果
3. await 右侧的表达式一般为 promise 对象, 但也可以是其它的值 
  - 如果表达式是 promise 对象, await 返回的是 promise 成功的值 
  - 如果表达式是其它值, 直接将此值作为 await 的返回值 
4. await 必须写在 async 函数中, 但 async 函数中可以没有 await 
5. 如果 await 的 promise 失败了, 就会抛出异常, 需要通过 try...catch 捕获处理 

##### 注意
1. 不要分别await两个异步操作,这样会打破这两个fetch()操作的并行，因为要等到第一个任务完成之后再执行第二个任务
```javascript
async function() f(){
  const a =await fetch("http://.../post/1");
  const b =await fetch("http://.../post/2");
}
```

- 更高效的做法：将所有Promise用all组合起来,然后再去await
```javascript
async function() f(){
  const promiseA =fetch("http://.../post/1");
  const promiseB =fetch("http://.../post/2");

  const [a,b] = await Promise.all([promiseA,promiseB])
}
```

2. 如果要在循环中执行异步操作，不能直接调用forEach或者map这类方法，forEach不会暂停等到所有异步操作都执行完毕，他会立刻返回。若希望等待循环中的异步操作都一一完成之后才继续执行，应该使用for循环，如果想要循环中的所有操作都并发进行，使用for await
3. 不能在全局或普通函数中直接使用await关键字，await只能被用在异步函数中
