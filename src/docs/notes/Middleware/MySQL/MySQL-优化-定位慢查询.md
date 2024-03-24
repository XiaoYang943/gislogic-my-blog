---
title: MySQL-优化-定位慢查询
article: false
category:
  - 中间件
  - MySQL
---
## 慢查询出现的情况
### 表现形式
- 页面加载过慢、接口压测响应时间过长（超过1s）
### 情况
- 聚合查询
- 多表查询
- 表数据量过大查询
- 深度分页查询
## 定位慢查询
### 开源工具定位慢查询
- 调试工具：Arthas
  - 使用命令监控已经上线的项目，跟踪执行较慢的方法，查看方法的执行时间，确定是哪方面出现了问题
- 运维工具：Prometheus 、Skywalking
  - 实时查看接口的响应情况
### MySQL的慢日志定位慢查询
- mysql配置文件
```
# 开启MySQL慢日志查询开关
slow_query_log=1
# 设置慢日志的时间为2秒，SQL语句执行时间超过2秒，就会视为慢查询，记录慢查询日志
long_query_time=2
```
## 分析SQL语句
- 若慢查询的原因是sql语句的问题，需要分析sql语句
### EXPLAIN关键字
- 使用执行计划关键字获取该sql语句的执行计划：语法`EXPLAIN + select...`或`DESC + select...`
- 执行计划结果分析
  - possible_key：当前sql可能使用到的索引
  - key：当前sql实际命中的索引
  - key_len：索引占用的大小
  - Extra：额外的优化建议
    - Using where; Using Index：查找使用了索引，需要的数据都在索引列中能找到，不需要回表查询数据
    - Using index condition：查找使用了索引，但是需要回表查询数据
  - type：这条sql的连接的类型，性能由好到差为：
    - NULL：sql语句执行时没有使用到表
    - system：sql语句查询的表是mysql内置的表
    - const：根据主键索引查询时
    - eq_ref：sql的查询条件是根据主键索引查询或唯一索引查询
    - ref：sql的查询条件是使用索引查询
    - range：sql执行时走的是索引，但是是范围查询
    - index(该sql需要优化)：走的是全索引查询，会遍历索引树，去检索结果
    - all(该sql需要优化)：不走索引，全盘扫描数据
- 总结：
  - 通过key和key_len检查是否命中了索引（索引本身存在是否有失效的情况）
  - 通过type字段查看sql是否有进一步的优化空间，是否存在全索引扫描或全盘扫描
  - 通过extra建议判断，是否出现了回表的情况，如果出现了，可以尝试添加索引或修改返回字段来修复






