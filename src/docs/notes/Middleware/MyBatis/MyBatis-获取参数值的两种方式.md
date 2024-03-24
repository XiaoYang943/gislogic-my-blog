---
title: MyBatis-获取参数值的两种方式
article: false
category:
  - Java
  - MyBatis
---
## Mybatis获取参数值的两种方式
|  | ${} | #{} |
| :-----: | :----: | :----: |
| 本质 | 字符串拼接sql | 占位符赋值拼接sql |
| 为字符串类型或日期类型的字段进行赋值时 | 需要手动加单引号：`'${}'` | 自动添加单引号 |
| 若mapper接口中的方法的参数为**单个字面量类型** | 特殊sql用`'${}'` | 一般用`#{}` |
| 若mapper接口中的方法的参数为**多个字面量类型**,MyBatis将这些参数放在一个map集合中,以arg或param+数字的形式为键 | `'${arg0}'`| `#{arg0}` |
| 若mapper接口中的方法的参数为**实体类对象** | `'${实体类对象中的属性名}'`| `#{实体类对象中的属性名}` |
| 用`@Param`标识mapper接口中的方法参数（**常用**） | `'${@Param的value属性值}'`| `#{@Param的value属性值}` |

### 特殊sql语句接收参数
#### 模糊查询
```sql
  -- 推荐
  select * from t_user where username like "%"#{customPara}"%"

  -- 一般，尽量都用#，否则容易混淆
  select * from t_user where username like '%${customPara}%'

  -- 一般
  select * from t_user where username like concat('%',#{customPara},'%')
```
- 为什么不能用`#{}`
  - `#{customPara}`，编译后customPara是占位符?，在''内部被当做字符串了，不会当做字符串来解析
#### 批量删除
```sql
delete from t_user where id in (${ids})
```
#### 动态设置表名
- 表名字段不能加''查询，所以不能用#
```sql
select * from ${tableName}
```

