---
title: Ajax
article: false
category:
  - HTTP
---
## AJAX

### 什么是AJAX

- AJAX(Asynchronous JavaScript And XML)，异步的JS和XML。

### XML和JSON

1. XML是可扩展标记语言。XML被设计用来传输和存储数据。XML和HTML类似，不同的是HTML中都是预定义标签，而XML中没有预定义标签，全都是自定义标签，用来表示一些数据。Ajax数据交换使用的格式就是XML，服务器端给浏览器返回的就是XML格式的数据，前端JS接到结果后，对内容进行解析，把数据提取出来，做处理
2. XML现在已经被JSON替代了，JSON更简洁，数据转换更加容易，直接借助API将字符串转换成JSON对象

### AJAX的优点

1. 不刷新页面：可以无需刷新页面而与服务器端进行通信。
2. 局部更新：允许根据用户事件来更新部分页面内容。

### AJAX的缺点

1. 没有浏览历史，不能回退
2. 存在跨域问题(同源)，例如：a.com向b.com请求数据，默认情况下不允许
3. 搜索引擎优化(SEO),不友好

### AJAX的应用

1. 搜索框，关键字提醒
2. 树级结构懒加载
3. 网页无限滚动谷歌浏览器

## 调试
- 谷歌浏览器，只查看ajax请求
![20230411234228](https://blog-image-9943.oss-cn-beijing.aliyuncs.com/20230411234228.png)
