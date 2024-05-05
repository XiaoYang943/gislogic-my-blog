---
title: NoSQL-Redis-数据结构-Hash
article: false
category:
  - 中间件
  - NoSQL
  - Redis
---
## Hash
- Hash类型，也叫散列，其value是一个无序字典，类似于Java中的HashMap结构。
![Hash](https://blog-image-9943.oss-cn-beijing.aliyuncs.com/202308201745553.png)

## 命令
- HSET key field value：添加或者修改hash类型key的field的值
- HGET key field：获取一个hash类型key的field的值
- HMSET：批量添加多个hash类型key的field的值
- HMGET：批量获取多个hash类型key的field的值
- HGETALL：获取一个hash类型的key中的所有的field和value
- HKEYS：获取一个hash类型的key中的所有的field
- HVALS：获取一个hash类型的key中的所有的value
- HINCRBY:让一个hash类型key的字段值自增并指定步长
- HSETNX：添加一个hash类型的key的field值，前提是这个field不存在，否则不执行







