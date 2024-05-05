---
title: NoSQL-Redis-数据结构-List
article: false
category:
  - 中间件
  - NoSQL
  - Redis
---
## List
- Redis中的List类型与Java中的LinkedList类似，可以看做是一个双向链表结构。既可以支持正向检索和也可以支持反向检索
- 特点：与LinkedList类似
  - 有序
  - 元素可以重复
  - 插入和删除快
  - 查询速度一般
### 应用
- 常用来存储一个有序数据
- 如何利用List结构模拟一个栈?
  - 入口和出口在同一边
- 如何利用List结构模拟一个队列?
  - 入口和出口在不同边
- 如何利用List结构模拟一个阻塞队列?
  - 入口和出口在不同边
  - 出队时采用BLPOP或BRPOP

## 命令
- LPUSH key  element ... ：向列表左侧插入一个或多个元素
- LPOP key：移除并返回列表左侧的第一个元素，没有则返回nil
- RPUSH key  element ... ：向列表右侧插入一个或多个元素
- RPOP key：移除并返回列表右侧的第一个元素
- LRANGE key star end：返回一段角标范围内的所有元素
- BLPOP和BRPOP：与LPOP和RPOP类似，只不过在没有元素时等待指定时间，而不是直接返回nil
![命令](https://blog-image-9943.oss-cn-beijing.aliyuncs.com/202308201748775.png)








