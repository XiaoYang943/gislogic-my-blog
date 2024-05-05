---
title: NoSQL-Redis-数据结构-区分不同类型的key
article: false
category:
  - 中间件
  - NoSQL
  - Redis
---
## 区分不同类型的key
- Redis没有类似MySQL中的Table的概念，如何区分不同类型的key
  - 例如，需要存储用户、商品信息到redis，有一个用户id是1，有一个商品id恰好也是1
- key的结构
  - Redis的key允许有多个单词形成层级结构，多个单词之间用:隔开
![key的结构](https://blog-image-9943.oss-cn-beijing.aliyuncs.com/202308201744405.png)






