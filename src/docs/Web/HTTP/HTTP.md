---
title: HTTP
article: false
category:
  - HTTP
---
## 网络基础知识
### 客户端（client）
- 通过发送请求获得服务器资源的Web浏览器叫做客户端。

### HTTP协议
- HyperText Transfer Protocol，超文本传输协议
- 客户端通过访问地址（url）获取或者上传服务器资源等信息的过程中，以HTTP协议为规范。
  - 浏览器与服务器之间的通信要遵守的规则。
#### 特点
- HTTP是一种不保存状态协议，即无状态（stateless）协议，协议本身不会保存之前的一切请求或相应报文的信息。
  - 优点：是能快速处理大量事务，确保协议的可伸缩性。
  - 缺点：用户登录一个购物网站，跳转到该站的其他页面之后，由于没有保存之前的信息，导致用户需要重新登录账号。
    -  解决方法：使用Cookie技术管理状态
### TCP/IP
- 是一个协议集合（协议族）

#### TCP/IP的分层管理
- 应用层：应用层决定了向用户提供应用服务时通信的活动
  - FTP（File Transfer Protocol，文件传输协议）
  - DNS（Domain Name System，域名系统）
  - HTTP
- 传输层：提供处于网络连接中的两台计算机之间的数据传输
  - TCP（Transmission Control Protocol，传输控制协议）
  - UDP（User Data Protocol，用户数据协议）
- 网络互连层：处理在网络上流动的数据包
  - 数据包是网络传输的最小数据单位
- 数据链路层：用来处理连接网络的硬件部分

##### 分层管理的好处
- 维护方便，某个地方需要改变设计时，只需要改变其所在的层即可
- 分工明确，每个层都有自己的任务，设计变得简单
##### 发送和接收HTTP的过程
- 客户端和服务器端发送和接收HTTP的过程：
  - 客户端在应用层（HTTP协议）发出一个Web页面的HTTP请求
  - 然后为了传输方便，在传输层（TCP）协议把从应用层收到的数据（HTTP请求报文）进行分割，并在各个报文上打上标记序号和端口号后转发给网路层。
  - 在网络层（IP协议），增加作为通信目的地的MAC地址后转发给数据链路层
  - 服务器在数据链路层接收到数据，往上层发送，一直到应用层时，服务器接收到客户端发来的HTTP请求
## HTTP请求
### 概念
- HTTP报文：用于HTTP协议交互的信息
- 请求报文：客户端的HTTP报文
- 响应报文：服务器端的HTTP报文
- 请求行：包含用于请求的方法，请求URI和HTTP版本
- 状态行：包含表名相应结果的状态码，原因短语和HTTP版本
- 首部字段：包含表示请求和响应的各种条件和属性的各类首部
- 通用首部：请求报文和响应报文都会使用的首部
- 请求首部：客户端向服务器端发送请求报文时使用的首部
- 响应首部：服务器端向客户端返回响应报文时使用的首部
- 实体首部：针对请求报文和响应报文的实体部分使用的首部
- 未定义首部（Cookie等）
- 状态码：描述从服务器端返回的请求结果

| 状态码 | 类别                               | 接收短语                   |
| ------ | ---------------------------------- | -------------------------- |
| 1XX    | Informational（信息性状态码）      | 接收的请求正在处理         |
| 2XX    | Success（成功状态码）              | 请求正常处理完毕           |
| 3XX    | Redirection（重定向状态码）        | 需要进行附加操作以完成请求 |
| 4XX    | Client Error（客户端错误状态码）   | 服务器无法处理请求         |
| 5XX    | Server Error（服务器端错误状态码） | 服务器处理请求出错         |



### 请求报文的结构
1. 请求行 
   - 请求类型：Get、Post...
   - URL路径：路径、查询字符串...
   - HTTP协议版本：HTTP/1.1...
2. 请求头
   - Host
   - Cookie
   - Content-type
   - User-Agent
   - ```请求头的格式：键值对的格式，特殊的是冒号后面有个空格```  
3. 空行
4. 请求体
   - Get类型时，请求体为空
   - Post类型时，请求体可以不为空

### 响应报文的结构
1. 响应行
   - HTTP协议版本：HTTP/1.1...
   - 响应状态码
   - 响应状态字符串
2. 响应头
   - Content-type
   -  Content-length
   -  Content-encoding
   -  ```响应头的格式：键值对的格式，特殊的是冒号后面有个空格 ```
3. 空行
4. 响应体：响应体是返回的结果

### 同步请求
- 在发送一个请求之后，需要等待服务器响应返回，才能够发送下一个请求。
#### 同步请求的缺点
1. 请求必须要等待响应
   - 当请求发生阻塞或网络延迟等情况时，用户需要等待，体验较差。
2. 请求时会携带所有的信息
- 当请求失败后，二次请求时，会引起页面的全部刷新，体验较差。
  - 例如：from表单登陆校验，当密码输入错误后，同步请求会刷新全部页面，用户名也要重新输入，而异步请求只需要重新输入密码即可
### 异步请求
### 如何区分普通http请求和Ajax请求
- AJAX请求头会多一个`x-requested-with`参数，值为`XMLHttpRequest`
## 跨域
### 同源策略
- 同源
  - 同一个来源，网页资源的来源
  - **协议**、**域名**、**端口号**必须完全相同。
- Ajax默认遵循同源策略
- 同源策略是浏览器的一种安全策略。
### 跨域
- 违背同源策略就是跨域
### 解决跨域的方法
#### 服务端添加跨域头
- 例如使用http-server服务的过程中，第一个终端开了一个服务，第二个终端也开了一个服务，第二个服务想要访问第一个服务的资源，则在第一个服务中添加跨域头
  - http-server添加跨域头的方法：`http-server --cors`
    - 这样一来响应头中会添加一个Access-Control-Allow-Origin，即解决了跨域问题
#### 添加代理服务器
- 若服务端不可控,需要添加代理服务器
#### JSONP
- JSONP(JSON with Padding)，是一个非官方的跨域解决方案，只支持get请求。
- 工作原理
  - 在网页有一些标签天生具有跨域能力，比如：`img`,`link`,`iframe`,`script`
    - JSONP就是利用`script标签`的跨域能力来发送请求的。
#### CORS
- CORS（Cross-Origin Resource Sharing），跨域资源共享,是官方的跨域解决方案
- 特点
  - 不需要在客户端做任何特殊的操作，完全在服务器中进行处理
  - 支持 get 和 post 请求
  - 跨域资源共享标准新增了一组 HTTP 首部字段，允许服务器声明哪些 源站通过浏览器有权限访问哪些资源
- 工作原理
  - 通过设置一个响应头来告诉浏览器，该请求允许跨域，浏览器收到该响应 以后就会对响应放行。
##### CORS 的使用
```javascript
// 主要是服务器端的设置
router.get("/testAJAX" , function (req , res) {
   //通过 res 来设置响应头，来允许跨域请求
   //res.set("Access-Control-Allow-Origin","http://127.0.0.1:3000"); 
   res.set("Access-Control-Allow-Origin","*");
   res.send("testAJAX  返回的响应");
});
```

## 同步和异步
### 异步
#### 实现方式
##### 回调函数
- 回调函数的缺点
  - 回调地狱
  - 高度耦合
  - 不易维护
  - 不能直接return
##### 事件驱动实现回调
- 把代码分离到若干个js文件中，进行解耦，便于实现模块化
- 缺点：运行流程不清晰。代码可读性差
##### 发布订阅
- window是个订阅发布中心
##### Promise
- 拉平回调函数，把嵌套的拉平为链式调用
- 优点
  - 流程清晰，可读性高
- 缺点
  - 代码冗余，不够简洁
  - 无法取消promise
  - 错误需要回调函数捕获
##### Generator
- 可以控制函数的执行
- 但是执行比较麻烦，可读性较差
##### 终极解决方案
- **async+await**

## Cookie
-  Cookie技术通过在请求和响应报文中写入Cookie信息来控制客户端的状态
-  实现过程：
   -  拿到响应报文中的`Set-Cookie`字段信息，通知客户端保存Cookie。
   -  当下次客户端再向该服务器发送请求时，客户端会自动在请求报文中加入Cookie值后发送出去。
   -  服务器端发现客户端发送过来的cookie之后，会去检查是从哪一个客户端发来的连接请求，然后对比服务器上的记录，最后得到之前的状态信息。