---
title: MySQL-基础-数据操作语言
article: false
category:
  - 中间件
  - MySQL
---
## DML
- DML：Data Manipulation Language，数据操作语言，主要用于增删改
## 插入
- 方式一
  - 插入的值的类型要与列的类型一致或兼容
  - 列的顺序可以调换
  - 列数和值的个数必须一致
  - 可以省略列名，默认所有列，此时列的顺序和表中列的顺序一致
  - 支持插入多行
  - 支持子查询
```sql
insert into 表名(列名,...) 
values(值1,...);
```
---
- 方式二
  - 不支持插入多行
  - 不支持子查询
```sql
insert into 表名
set 列名=值,列名=值,...
```
## 修改
### 修改单表记录
```sql
UPDATE 表名 
SET 字段 = 值
WHERE 
```
### 修改多表记录
```sql
UPDATE 表名
INNER JOIN
ON 
SET
WHERE
```
## 删除
- 方式一：`delete`
- 方式二：`truncate`
- 对比
  - delete 可以加where 条件，truncate不能加
  - truncate删除，效率高一点
  - 假如要删除的表中有自增长列
    - 如果用delete删除后，再插入数据，自增长列的值从断点开始
    - 而truncate删除后，再插入数据，自增长列的值从1开始。
  - truncate删除没有返回值，delete删除有返回值
  - truncate删除不能回滚，delete删除可以回滚.
### 单表删除
```sql
delete from 表名 
where
```
### 多表删除
```sql
delete 表1的别名,表2的别名
from 表1 别名
join 表2 别名 on 连接条件
where 筛选条件;
```
