---
title: MongoDB-核心概念
article: false
category:
  - 中间件
  - NoSQL
---
## 核心概念
### 库-DataBase
- MongoDB中可以建立多个数据库。每一个库都有自己的集合和权限，不同的数据库也放置在不同的文件中。
### 集合-Collection
- 集合就是MongoDB文档组,集合存在于数据库中，一个库中可以创建多个集合。每个集合没有固定的结构，这意味着在对集合可以插入不同格式和类型的数据，但通常情况下插入集合的数据都会有一定的关联性。
### 文档-Document
- 文档集合中一条条记录，是一组键值(key-value)对。MongoDB的文档不需要设置相同的字段，并且相同的字段不需要相同的数据类型，这与关系型数据库有很大的区别，也是MongoDB非常突出的特点。
### 关系总结
| 关系型数据库 | MongoDB |
| :----- | :---- |
| 数据库-database | 数据库-database |
| 表-table | 集合-collection |
| 行-row | 文档-document |
| 列-colume | 字段-field |
