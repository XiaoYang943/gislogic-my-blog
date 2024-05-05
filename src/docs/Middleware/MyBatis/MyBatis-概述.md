---
title: MyBatis-概述
article: false
category:
  - Java
  - MyBatis
---
## Mybatis
- 基于Java的持久层框架，封装JDBC，访问并操作数据库
### 特点
1. 支持定制化SQL、存储过程以及高级映射的优秀的持久层框架
    - 定制化SQL：SQL语句自己编写，维护方便
2. 避免了几乎所有的 JDBC 代码和手动设置参数以及获取结果集
   - 封装了JDBC代码 
   - 手动设置参数：将前端传来的参数**拼接**到sql语句中，更加简便
3. 使用简单的XML或注解用于配置和原始映射，将接口和Java的POJO映射成数据库中的记录
4. 是一个半自动的ORM框架
   - ORM（Object Relation Mapping）：java中的实体类对象和关系型数据库的记录的关系
### Mybatis和其它持久化层技术对比
- JDBC
  - SQL 夹杂在Java代码中耦合度高，导致硬编码内伤，维护不易且实际开发需求中 SQL 有变化，频繁修改的情况多见
    - 若把sql写死在java代码中，java代码先编译再打包成jar包。若需要修改sql，则修改后需要重新编译打包
  - 代码冗长，开发效率低
- Hibernate 和 JPA
  - 操作简便，开发效率高
  - 程序中的长难复杂 SQL 需要绕过框架
  - 内部自动生产的 SQL，不容易做特殊优化
  - 基于全映射的全自动框架，大量字段的 POJO 进行部分映射时比较困难。
  - 反射操作太多，导致数据库性能下降
- MyBatis
  - 轻量级，性能出色
  - SQL 和 Java 编码分开，功能边界清晰。
    - xml和注解两种方式
  - Java代码专注业务、SQL语句专注数据开发效率稍逊于HIbernate，但是完全能够接受
### 环境搭建
- [官网](https://github.com/mybatis/mybatis-3)
- mysql版本
- MySQL不同版本的注意事项
  1. 驱动类driver-class-name
  - MySQL 5版本使用jdbc5驱动，驱动类使用：`com.mysql.jdbc.Driver`
  - MySQL 8版本使用jdbc8驱动，驱动类使用：`com.mysql.cj.jdbc.Driver`
  2. 连接地址url
  - MySQL 5版本的url：`jdbc:mysql://localhost:3306/ssm`
  - MySQL 8版本的url：`jdbc:mysql://localhost:3306/ssm?serverTimezone=UTC`
#### helloworld
- 新建maven模块
  - 注意gav和版本
```xml
<!-- 打包方式为jar，因为mybatis操作数据库 -->
<packaging>jar</packaging>

<dependencies>
    <!-- Mybatis -->
    <dependency>
        <groupId>org.mybatis</groupId>
        <artifactId>mybatis</artifactId>
        <version>3.5.7</version>
    </dependency>

    <!-- MySQL驱动，注意mysql版本 -->
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <version>8.0.16</version>
    </dependency>

    <!-- log4j日志，在单元测试时，可以在控制台输出一些日志信息(执行的sql语句、传的参数、执行的结果) -->
    <dependency>
        <groupId>log4j</groupId>
        <artifactId>log4j</artifactId>
        <version>1.2.17</version>
    </dependency>
</dependencies>
```
- 新建数据库表
- 写pojo实体类
  - 变量与表字段对应
  - 设置有参构造和无参构造
  - 设置get、set方法
  - 设置toString方法
- 设置核心配置文件：配置连接数据库的环境以及MyBatis的全局配置信息
  - resources下，mybatis-config.xml(习惯命名)
  - 官方文档-Getting Started
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "https://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
    <!-- 配置连接数据库的环境 -->
    <environments default="development">
        <environment id="development">
            <!-- 事务管理器 -->
            <transactionManager type="JDBC"/>
            <!-- 数据源 -->
            <dataSource type="POOLED">
                <property name="driver" value="com.mysql.cj.jdbc.Driver"/>
                <property name="url" value="jdbc:mysql://localhost:3306/ssm?serverTimezone=UTC"/>
                <property name="username" value="root"/>
                <property name="password" value="root"/>
            </dataSource>
        </environment>
    </environments>
    <!--引入mybatis的映射文件-->
    <mappers>
        <mapper resource="mappers/UserMapper.xml"/>
    </mappers>
</configuration>
```
- 映射文件：sql语句操作数据库
  - 文件位置`src/main/resources/mappers`
  - ORM（Object Relationship Mapping）对象关系映射。
    - 对象：Java的实体类对象
    - 关系：关系型数据库
    - 映射：二者之间的对应关系
      - Java概念和数据库概念对应：
        - 类-表
        - 属性-字段/列
        - 对象-记录/行
  - 命名规则：和mapper接口同名
    - 表t_user，映射的实体类为User，映射文件UserMapper.xml因此一个映射文件对应一张表的操作
    - mapper接口中的方法对应映射文件中的sql语句 
    - mapper接口的全类名和映射文件的命名空间（namespace）保持一致
    - mapper接口中方法的方法名和映射文件中编写SQL的标签的id属性保持一致
```xml
<!-- 映射文件 -->
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
    PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
    "https://mybatis.org/dtd/mybatis-3-mapper.dtd">

<!-- 映射文件的namespace要和mapper接口的全类名一致 -->
<mapper namespace="com.xxx.mapper.xxxMapper">

    <!-- 建议在每一个sql语句上方注释对应的方法 -->
    <!-- 方法名要和sql语句的id一致，当调用mapper中的方法时，会根据mapper接口的全类名找到映射文件，再根据方法名找到对应的sql并执行 -->
    <select id="selectBlog" resultType="Blog">
        select * from Blog where id = #{id}
    </select>
</mapper>
```