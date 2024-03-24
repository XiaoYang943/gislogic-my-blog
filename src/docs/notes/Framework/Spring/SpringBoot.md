---
title: SpringBoot
article: false
category:
  - Java
  - SpringBoot
---
## SpringBoot
### 官网
[官网文档2.7版本](https://docs.spring.io/spring-boot/docs/current/reference/html/)
[版本新特性](https://github.com/spring-projects/spring-boot/wiki#release-notes)
::: details
- Getting Started入门
- Using Spring Boot进阶
- Core Features高级特性
- Production-ready Features监控
- Deploying Spring Boot Applications部署
- “How-to” Guides小技巧
- Application Properties所有配置预览
- Auto-configuration Classes所有自动配置
- Test Auto-configuration Annotations测试注释
- Executable Jars可执行jar
- Dependency Versions所有场景依赖版本
:::
### 自动版本仲裁机制
- 提供了自动版本仲裁机制，声明依赖的版本号
    - 引入依赖默认都可以不写版本，引入非版本仲裁的jar，要写版本号
    - 修改默认版本号：
        - 查看官网spring-boot-dependencies里面规定当前依赖的版本用的key
        - 在当前项目父pom里面重写配置:例如`<properties><mysql.version>5.1.43</mysql.version></properties>`
### 环境配置
- maven
::: details
```xml
<!-- S:\apache-maven-3.6.1\conf\settings.xml` -->
<!-- 下载jar包的镜像地址 -->
<mirrors>
	<mirror>
		<id>nexus-aliyun</id>
		<mirrorOf>central</mirrorOf>
		<name>Nexus aliyun</name>
		<url>http://maven.aliyun.com/nexus/content/groups/public</url>
	</mirror>
</mirrors>

<!-- jdk版本 -->
<profiles>
	<profile>
		<id>jdk-1.8</id>

		<activation>
			<activeByDefault>true</activeByDefault>
			<jdk>1.8</jdk>
		</activation>

		<properties>
			<maven.compiler.source>1.8</maven.compiler.source>
			<maven.compiler.target>1.8</maven.compiler.target>
			<maven.compiler.compilerVersion>1.8</maven.compiler.compilerVersion>
		</properties>
	</profile>
</profiles>
```
:::
- 依赖
::: details
- [热更新dev-tools官方文档](https://docs.spring.io/spring-boot/docs/current/reference/html/using.html#using.devtools)
```xml
<!-- 子pom.xml -->
<!--SpringBoot的父项-->
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.3.4.RELEASE</version>
</parent>


<dependencies>
    <!-- SpringBoot依赖 -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <!-- 热更新依赖 -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-devtools</artifactId>
        <optional>true</optional>
    </dependency>
    <!-- 处理器依赖，实现代码提示，且要在父pom打包build时不打包该处理器 -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-configuration-processor</artifactId>
        <optional>true</optional>
    </dependency>
</dependencies>
```
```xml
<!-- 与构建相关的配置 -->
  <build>
    <!-- 插件 -->
    <plugins>
      <plugin>
        <!-- 热更新插件 -->
        <!--打包部署
            右侧maven-lifecycle-选择clean和package-run-然后停止当前应用
            打包好后在左侧target中打开资源管理器-cmd-执行如下命令:
            java -jar 打包好的jar包名称
        -->
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-maven-plugin</artifactId>
        <version>2.2.6.RELEASE</version>
        <configuration>
          <fork>true</fork>
          <addResources>true</addResources>
        </configuration>
      </plugin>

        <!-- 代码提示插件 -->
      <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
            <configuration>
                <excludes>
                    <exclude>
                        <groupId>org.springframework.boot</groupId>
                        <artifactId>spring-boot-configuration-processor</artifactId>
                    </exclude>
                </excludes>
            </configuration>
        </plugin>
    </plugins>
  </build>
```
:::

- application.yml(推荐),或application.properties
::: details
- [配置信息](https://docs.spring.io/spring-boot/docs/2.3.7.RELEASE/reference/html/appendix-application-properties.html#common-application-properties-server)
- 语法
  1. key:空格value
  2. 大小写敏感
  3. 使用缩进表示层级关系
      - 使用空格或idea中使用tab
      - 缩进的空格数不重要，只要相同层级的元素左对齐即可
  4. '#'表示注释
  5. 字符串无需加引号，如果要加，单引号’'、双引号""表示字符串内容会被 转义、不转义
- 数据类型
  1. 字面量：单个的、不可再分的值。date、boolean、string、number、null
   - `k: v`
  2. 对象：键值对的集合。map、hash、set、object
```yaml
#行内写法：  

k: {k1:v1,k2:v2,k3:v3}

#或

k: 
  k1: v1
  k2: v2
  k3: v3
```
3. 数组：一组按次序排列的值。array、list、queue
```yaml
#行内写法：  

k: [v1,v2,v3]

#或者

k:
  - v1
  - v2
  - v3
```
:::

### 主启动
- java/com.hyy.boot/xxxMain或xxxMainApplication**类**
  - 注意要在java文件夹下新建包，在包中配置启动类，否则报`Your ApplicationContext is unlikely to start due to a @ComponentScan of the default package.`
    - 因为写在java文件夹下的Application类，是不从属于任何一个包的，因而启动类没有包。没有加`@ComponentScan指明对象扫描范围，默认指扫描当前启动类所在的包里的对象。
```java
@SpringBootApplication
public class MainApplication {
    public static void main(String[] args) {
        // IOC容器
        ConfigurableApplicationContext run = SpringApplication.run(MainApplication.class, args);
        System.out.println("启动成功!");

        // 查看容器中的组件
        // String[] names = run.getBeanDefinitionNames();
        // for (String name : names) {
        //     System.out.println(name);
        // }
    }
}
```
#### 注解
1. @SpringBootApplication
   - 主程序类(主配置类、主启动类)，是SpringBoot的启动程序
### `1`模型层
#### 实体类(Pojo)
- java/com.hyy.boot/entity/xxx**类**
- 每个实体类**对应数据库的每张表**
- 规范
   - 一般先写实体类(因为controller、mapper、service中的方法要借助实体类作为参数进行传递)
   - 实体类的类名(一般大写第一个字母)对应db的表名
   - 类中按照该表的字段名和数据类型编写属性
   - 数据库有几张表，一般要写几个类
   - 特殊的类并不对应数据库中的表
     - 用户登录表单信息,该类是将登陆信息传给后端
```java
@Data
@AllArgsConstructor
@NoArgsConstructor
//Serializable 序列化，后续微服务分布式部署会用得到
public class DataSource implements Serializable {
    // 对应数据库表中的字段
    private Long id;
    private Double lon;
    private Double lat;
    private String name;
}
```
##### 注解
- 配置Lombok
::: details
- Lombok简化开发：用标签方式代替构造器、getter/setter、toString()等鸡肋代码，简化Java Bean开发
- 配置依赖，在idea中下载插件，setting-build-compiler-annotation-default-勾选'允许注解处理'
```xml
  <dependency>
      <groupId>org.projectlombok</groupId>
      <artifactId>lombok</artifactId>
  </dependency>
```
:::
- `@Data`，在程序编译时自动生成getter、setter方法
- `@ToString`，在程序编译时自动生成toString方法
- `@NoArgsConstructor`，在程序编译时自动生成无参构造器
- `@AllArgsConstructor`，在程序编译时自动生成全参构造器
- `@Slf4j`日志类，`log.info("我执行了")`
- `@TableName("db表名")`,MyBatisPlus的注解，将该类与db对应的表进行关联，或写mapper.xml配置文件(推荐)
#### Dao层
##### Dao接口(Mapper接口)
- java/com.hyy.boot/dao/xxxDao**接口**
- 几张表对应几个接口，接口名称：表名+Mapper或xxxDao
```java
@Mapper
public interface xxxDao {
    // 写:新增add、create、save
    public int create(DataSource dataSource);

    // 读:
    public DataSource getById(@Param("id") Long id);

    public List<DataSource> getAll();
}
```
###### 注解
- `@Mapper`,若用MyBatis，推荐用Mapper注解
##### Mapper.xml
- resources/mapper/dao/xxxMapper.xml
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<!--判断文件头是否配置成功:Ctrl+左键+PaymentDao是否能进入-->
<mapper namespace="com.xxx.xxx.dao.xxxDao">
    <!-- 实体类名：因为在application.yml中配置了type-aliases-package: com.xxx.xxx.entities,就会在entities文件夹中自动找该实体类 -->
    <insert id="create" parameterType="实体类名" useGeneratedKeys="true" keyProperty="id">
        insert into 表名(字段名) values(#{要插入的值});
    </insert>

    <select id="getById" parameterType="Long" resultMap="BaseResultMap">
        select * from 表名 where id = #{id};
    </select>

    <select id="getAll"  resultMap="BaseResultMap">
        select * from 表名;
    </select>

     <!-- 推荐用结果集映射resultMap，当系统复杂后，若命名不规范，用映射能避免，先写select，再写resultMap   -->
    <!-- type从实体类中，在Payment上右键-copy reference，保证不出错 -->
    <resultMap id="BaseResultMap" type="com.xxx.xxx.entities.xxx">
        <id column="id" property="id" jdbcType="BIGINT" />

        <id column="lon" property="lon" jdbcType="DOUBLE" />
        <id column="lat" property="lat" jdbcType="DOUBLE" />
        <id column="name" property="name" jdbcType="VARCHAR" />
    </resultMap>
</mapper>
```
### `2`Service层
#### Service接口
- java/com.hyy.boot/service/xxxService**接口**
```java
public interface xxxService {
    public int create(实体类 实体类别名);

    public 实体类 getById(@Param("id") Long id);

    public List<实体类> getAll();
}
```
#### Service实现类
- java/com.hyy.boot/service/impl/xxxServiceImpl**类**
```java
@Service
public class xxxeServiceImpl implements xxxService {
    @Resource
    private dao接口 dao接口别名;

    public int create (实体类 实体类别名) {
        return xxxDao.create(实体类别名);
    }
    public 实体类 getById(Long id) {
        return xxxDao.getById(id);
    }

    public List<实体类> getAll() {
        return xxxDao.getAll();
    }
}
```
### `3`控制层
- java/com.hyy.boot/controller/xxxController**类**
```java
@RestController
public class HelloController {

    @RequestMapping("/datasource/getAll")
    public CommonResult getDataSourceAll() {
        List<DataSource> dataSource  = dataSourceService.getDataSourceAll();

        if(dataSource != null) {
            return new CommonResult(200,"查询成功!",dataSource); 
        } else {
            return new CommonResult(444,  "没有对应记录，查询失败!",null);
        }
    }
}
```
#### 注解
- `@ResponseBody`:该类的每一个方法的返回值都是以字符串形式传给浏览器，而不是跳转到某个页面
- `@Controller`:控制器
- `@RestController`:是`@ResponseBody`和`@Controller`的集合体
- `@RequestMapping("/xxx")`:映射请求
- `@GetMapping(value = "/xxx")`:映射请求，按照REST接口规范，若是get查询，替代`@RequestMapping`
- `@PostMapping(value = "/xxx")`:映射请求,按照REST接口规范，若是create新增，替代`@RequestMapping`
### 静态资源访问
1. 静态资源目录
   - src-main-resources
     - static或
     - public或
     - resources或 
     - /META-INF/resources
   - 不使用以上四种路径，则配置yml
    ```yml
    resources:
        # 可以选择多个文件夹，在数组中写 
    static-locations: [classpath:/自定义路径名/]
    ```
2. 如何访问
   - 当前目录根路径/ + 静态资源名
   - 静态映射/**
       - 客户端键入/静态资源名，请求进来，先去找Controller看能不能处理。不能处理的所有请求又都交给静态资源处理器。静态资源也找不到则响应404页面。
3. 静态资源访问前缀
   - 目前，根目录+静态资源名就能访问，但是当web应用有很多静态资源、动态请求时，应用中的拦截器，比如登录拦截器，只有当登陆了之后才能访问动态请求，但是拦截/**时，把静态资源也拦截了。
   - 所以为了拦截器配置方便，给静态资源访问加个前缀，让拦截器放行指定前缀路径的请求
   - 静态资源访问默认无前缀
   - 以后键入`/自定义的静态资源访问前缀/静态资源名`访问
    ```yml
    spring:
    mvc:
        static-path-pattern: /res/**
    ```
4. 欢迎页
   - [官方文档](https://link.csdn.net/?target=https%3A%2F%2Fdocs.spring.io%2Fspring-boot%2Fdocs%2F2.3.8.RELEASE%2Freference%2Fhtmlsingle%2F%23boot-features-spring-mvc-welcome-page)
   - 静态资源路径下index.html。
       - 可以配置静态资源路径
       - 但是不可以配置静态资源的访问前缀。否则导致 index.html不能被默认访问
   - controller能处理/index。
5. 自定义Favicon
   - favicon.ico 放在静态资源目录下即可。
### 视图解析与模板引擎
#### 视图解析
- 视图解析是SpringBoot在处理完请求后想要跳转到某个页面的过程
- 视图处理方式
    - 转发
    - 重定向
    - 处理完请求后可以转发或重定向到指定的jsp页面
    - SpringBoot打包方式是.jar压缩包，但是jsp不支持在压缩包内编译，所以springbooot默认不支持jsp，想要进行页面跳转渲染，需要引入第三方模板引擎
##### 模板引擎Thymeleaf
- (官方文档)[https://link.csdn.net/?target=https%3A%2F%2Fwww.thymeleaf.org%2Fdocumentation.html]
- 优点：语法贴近与jsp，上手较快
- 缺点：性能不高
## 其他注解
- 成员变量上添加`@Value("${...}")`：从配置文件读取配置