---
title: NoSQL-Redis-基础
article: false
category:
  - 中间件
  - NoSQL
  - Redis
---
## Redis
- 什么是Redis
  - 远程词典服务器(Remote Dictionary Server,Redis)，是一个基于内存的键值型NoSQL数据库。
- 特点
  - 键值（key-value）型，value支持多种不同数据结构，功能丰富
  - 单线程执行命令，每个命令具备原子性，线程安全
  - 虽然是单线程，但是低延迟，速度快（基于内存、IO多路复用、良好的编码实现）。
  - 支持数据持久化，定期把数据从内存持久化到磁盘，确保数据的安全性
  - 支持主从集群，从节点备份主节点的数据，确保数据的安全。主从读写分离，提高效率
  - 支持分片集群，数据拆分到不同节点，提高存储上限
  - 支持多语言客户端(C、Java、Python)



