---
title: MySQL-优化-SQL语句优化
article: false
category:
  - 中间件
  - MySQL
---

## SQL语句优化
- SELECT语句务必指明字段名称（避免直接使用select * ）
- SQL语句要避免造成索引失效的写法
- 尽量用union all代替union
  - union会多一次过滤，效率低
- 避免在where子句中对字段进行表达式操作
- Join优化 能用innerjoin 就不用left join right join，如必须使用 一定要以小表为驱动，
  - 内连接会对两个表进行优化，优先把小表放到外边，把大表放到里边。left join 或 right join，不会重新调整顺序











