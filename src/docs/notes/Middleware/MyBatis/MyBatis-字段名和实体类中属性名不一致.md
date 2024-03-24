---
title: MyBatis-字段名和实体类中属性名不一致
article: false
category:
  - Java
  - MyBatis
---
## sql语句字段名和实体类中属性名不一致
- 字段名`project_name`
- 属性名`projectName`
### 起别名
- 给字段起别名，设置别名和实体类的属性名一致
  - `select id,project_name projectName from `
### mybatis全局配置
- mybatis全局配置文件,在properties和typeAliases标签之间，设置settings全局配置标签
  - 将字段名中的下划线自动映射成驼峰
```xml
<settings>
  <setting name="mapUnderscoreToCamelCase" value="true"/>
</settings>
```
### resultMap自定义映射关系
- resultMap标签-type属性：设置映射关系的实体类类型
  - id标签，设置主键的映射关系
  - result标签，设置普通字段的映射关系
