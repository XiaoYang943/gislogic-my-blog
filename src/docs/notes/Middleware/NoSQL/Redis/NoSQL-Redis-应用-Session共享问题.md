---
title: NoSQL-Redis-应用-Session共享问题
article: false
category:
  - 中间件
  - NoSQL
  - Redis
---
## session共享问题
### 发现问题
- 用nginx做反向代理(负载均衡)，将客户端发来的请求分发到不同服务器中，此时会出现session共享问题
- 将登陆信息存在session中
  - 第一次登陆时，session保存在第一台服务器中
  - 第二次登陆，由于负载均衡，可能向第二台服务器发出请求，但是此时第二台服务器中没有session对象，不是登录状态
### 解决问题
1. 方式一：将session存到前端cookie中
  - 好处：每次请求都会带着cookie
  - 缺点：在客户端存储信息，安全性差
2. 方式二：session复制
  - 将第一次登陆时，服务器获取到的session复制多份，并保存到其他集群服务器
  - 缺点：复制，内容相同，造成数据冗余、空间浪费
3. 方式三：将session存到redis中
  - 好处：在内存中存储，没有IO操作，速度快



