---
title: MySQL-优化-主从同步
article: false
category:
  - 中间件
  - MySQL
---
## 主从同步
![主从同步](https://blog-image-9943.oss-cn-beijing.aliyuncs.com/202308171656979.png)
- 数据库中间件连接两个库，分别是主库和从库，主库负责写数据，从库负责读数据 ，当主库写数据时，把数据同步到从库中，该过程就叫主从同步。
### 好处
- 读写分开，分担访问压力
### 原理
- 二进制日志（BINLOG）记录了所有的 DDL（数据定义语言）语句和 DML（数据操纵语言）语句，但不包括数据查询（SELECT、SHOW）语句。
- 过程：当主库中进行insert等操作时，把这些数据写入binlog日志文件中，从库中有一个IOThread线程从主库的binlon文件中读取数据，然后把数据写入从库的中继日志(Relay log)中，再由从库的SQLThread线程读取中继日志文件，重新执行其中的命令，执行后从库中的数据旧实现了同步

![主从同步原理](https://blog-image-9943.oss-cn-beijing.aliyuncs.com/202308171702417.png)









