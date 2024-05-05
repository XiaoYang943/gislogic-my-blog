---
title: NoSQL-Redis-数据结构-Set
article: false
category:
  - 中间件
  - NoSQL
  - Redis
---
## List
- Redis的Set结构与Java中的HashSet类似，可以看做是一个value为null的HashMap
- 特点
  - 因为也是一个hash表，因此具备与HashSet类似的特征
    - 无序
    - 元素不可重复
    - 查找快
    - 支持交集、并集、差集等功能

### 应用

## 命令
- SADD key member ... ：向set中添加一个或多个元素
- SREM key member ... : 移除set中的指定元素
- SCARD key： 返回set中元素的个数
- SISMEMBER key member：判断一个元素是否存在于set中
- SMEMBERS：获取set中的所有元素
- SINTER key1 key2 ... ：求key1与key2的交集
- SDIFF key1 key2 ... ：求key1与key2的差集
- SUNION key1 key2 ..：求key1和key2的并集










