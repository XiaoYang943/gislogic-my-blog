---
title: MyBatis-动态sql
article: false
category:
  - Java
  - MyBatis
---
## 动态sql
- 根据特定条件动态**拼接SQL语句**
  - 例如多条件查询：提交表单进行查询时，有文本框、单选框、多选框等条件。当根据这些条件查询数据时，要把这些条件拼接到sql中，然后去查询。
    - 痛点在于：表单中的条件是可以设置或不设置的，不设置就不能拼接到sql中，不能根据这个条件去查询，用原生sql要写很多if判断，不方便。所以使用mybatis的动态sql。
    - 重点是**null**、**空串**
      - 若没有设置请求参数，则服务器获取到的是null
      - 文本框没有输入，则服务器获取到的是串
      - 单选框和复选框提交到服务器的是选中的单选框和复选框的value，所以当没有选中时进行提交，服务器获取到的是null。
    - 解决：
      - 若用原生sql，需要用很多if进行多层判断，麻烦，且不好处理where关键字和and关键字
      - mybatis的解决方案：动态sql的**if标签**
### if标签
- 没传，获取到的是null，文本框中没有设置值，获取到的是空串
- 标签体：`字段名 = #{实体类的属性名}`
- if标签可通过test属性的表达式进行判断
  - 若表达式的结果为true，则标签中的内容会执行；反之标签中的内容不会执行。表达式中可以直接用`resultType`定义的对象中的属性名来获取属性值
    - 当不是null且不是""时，则需要拼接
    - 当是null或是""，则不需要拼接
  - `<if test="实体类的属性名 != null and 实体类的属性名!= ''"></if>`
### where标签
- where和if一般结合使用
  - 若where标签中的if条件都不满足，则where标签没有任何功能，即不会添加where关键字
  - 若where标签中的if条件满足，则where标签会自动添加where关键字，并将条件最前方多余的and去掉
  - 注意
    - where标签不能去掉条件最后多余的and
      - 这种情况不能用where标签，要用trim标签
### trim
- trim用于去掉或添加标签中的内容
  - prefix：在trim标签中的内容的前面添加某些内容
  - prefixOverrides：在trim标签中的内容的前面去掉某些内容
  - suffix：在trim标签中的内容的后面添加某些内容
  - suffixOverrides：在trim标签中的内容的后面去掉某些内容
### choose、when、otherwise
- choose、when、 otherwise相当于if...else if..else
  - choose:父标签
  - when、otherwise：子标签
- 逆向工程中使用较多
### foreach
- 作用：实现批量操作
- 标签属性
  - collection：要循环的数组或集合
  - item：数组或数据中的每一个元素
  - separator：循环体间分隔符
  - open和close：foreach标签所循环的所有内容的开始和结束符
#### 批量删除
##### where id in 
- 前端id数组:[1，2，3]
```sql
delete from table where id in 
(1),(2),(3)
```
```xml
<!-- int deleteByIdsArray(@Param("ids") Integer[] ids); -->
<delete id="deleteByIdsArray">
  delete from table where id in 
    <foreach collection="ids" item="id" separator="," open="(" close=")">
      #{id}
    </foreach>
</delete>
```
```java
- mapper
/**
  传来的是数组或集合时，属于特殊情况，在mybatis中想要拿到数据，有特定的访问方式
  collection的ids访问不到传来的数组，mybatis会把传来的数组放到map中，以array为键，以数组为值
  所以要用@Param规定当前的访问方式,除了实体类对象和map集合，其他情况建议都要加@Param，一定能访问到
*/
int deleteByIdsArray(@Param("ids") Integer[] ids);
```
```java
int rows = mapper.deleteByIdsArray(new Integer[]{1,2,3});
```
##### where id = 1 or id = 2
- 前端id数组:[1，2，3]
```sql
delete from table where 
id = 1 or id = 2
```
```xml
<!-- int deleteByIdsArray(@Param("ids") Integer[] ids); -->
<delete id="deleteByIdsArray">
  delete from table where id in 
    <foreach collection="ids" item="id" separator="or">
      id = #{id}
    </foreach>
</delete>
```
#### 批量添加
- 应用场景
  - 多对多，给中间表添加数据
  - 添加线的所有坐标点

```java
- mapper
int insertMoreByList(@param("emps") List<Emp> emps);
```
```sql
insert into 表名 values (),(),...
```
```xml
  <!-- int insertMoreByList(@param("emps") List<Emp> emps); -->
  <insert id="insertMoreByList">
    insert into 表名 values 
    <foreach collection="emps" item="emp" separator=",">
      (null,#{emp.empName},#{emp.empAge})
    </foreach>
  </insert>
```
### SQL标签
- 提取一段公共sql片段，在使用的地方通过include标签进行引入
- select时，不写*，使用sql片段代替之
  - 减少磁盘IO开销、节约网络带宽
    - select *把text、MEDIUMTEXT、BLOB类型的字段都查出来了
  - 使查询结果可控、可维护
    - 当表结构发生变化时，*返回的结果可能会变
  - 防止敏感信息泄露
```xml
<sql id="columns">id,lon,lat</sql>

<select>
  select <include refid="columns"></include> from table
</select>
```

