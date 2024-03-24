---
title: NoSQL-Redis-SpringDataRedis
article: false
category:
  - 中间件
  - NoSQL
  - Redis
---
## SpringDataRedis
- SpringData是Spring中数据操作的模块，包含对各种数据库的集成，其中对Redis的集成模块就叫做SpringDataRedis
- 功能
  - 提供了对不同Redis客户端的整合（Lettuce和Jedis）
  - 提供了RedisTemplate统一API来操作Redis
  - 支持Redis的发布订阅模型
  - 支持Redis哨兵和Redis集群
  - 支持基于Lettuce的响应式编程
  - 支持基于JDK、JSON、字符串、Spring对象的数据序列化及反序列化
  - 支持基于Redis的JDKCollection实现
## RedisTemplate工具类
- 封装了各种对Redis的操作
![RedisTemplate工具类](https://blog-image-9943.oss-cn-beijing.aliyuncs.com/202308201754113.png)
## HelloWorld
- 依赖
```xml
 <!-- redis -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>

<!-- pool 对象池 -->
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-pool2</artifactId>
</dependency>
```
- application.yml
```yml
# Spring配置
spring:
  # redis 配置
  redis:
    # 地址
    host: localhost
    # 端口，默认为6379
    port: 6379
    # 数据库索引
    database: 0
    # 密码
    password:
    # 连接超时时间
    timeout: 10s
    lettuce:
      pool:
        # 连接池中的最小空闲连接
        min-idle: 0
        # 连接池中的最大空闲连接
        max-idle: 8
        # 连接池的最大数据库连接数
        max-active: 8
        # #连接池最大阻塞等待时间（使用负值表示没有限制）
        max-wait: -1ms
```
- HelloWorld
```java
public class RedisTest() {

  @Autowired
  private RedisTemplate redisTemplate;

  @Test
  public void test() {
    // 插入一条string类型数据      
    redisTemplate.opsForValue().set("name", "hyy");
    // 读取一条string类型数据
    Object name = redisTemplate.opsForValue().get("name");
    System.out.println("name = " + name);
  }
}
```
## 序列化
- 使用redisTemplate存入的所有数据，都会使用这四个序列化器进行序列化和反序列化![四个序列化器](https://blog-image-9943.oss-cn-beijing.aliyuncs.com/202308201837093.png)
- 默认的序列化器![默认的序列化器](https://blog-image-9943.oss-cn-beijing.aliyuncs.com/202308201838236.png)
- -RedisSerializer的继承关系![RedisSerializer的继承关系](https://blog-image-9943.oss-cn-beijing.aliyuncs.com/202308201852040.png)
### 发现问题
- SpringDataRedis的`redisTemplate.opsForValue().set()`方法可以接受任何类型的对象，并转成redis可以处理的字节
  - 默认使用的是JDK的序列化工具，底层使用ObjectOutPutStream()将java对象转成字节，再写入redis
    - 存在问题![存在问题](https://blog-image-9943.oss-cn-beijing.aliyuncs.com/202308201845196.png)
      - 缺点
        - 可读性差，读取查询时会出现问题
        - 内存占用较大
### 解决方式
- 设置RedisTemplate的序列化方式
```xml
<!-- JSON工具类 -->
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
</dependency>
```
```java
@Configuration
public class RedisConfig {
  @Bean
  public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory redisConnectionFactory) throws UnknownHostException {
    // 创建Template
    RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();
    // 设置连接工厂
    redisTemplate.setConnectionFactory(redisConnectionFactory);
    // 设置序列化工具
    GenericJackson2JsonRedisSerializer jsonRedisSerializer = new GenericJackson2JsonRedisSerializer();
    // key和 hashKey采用 string序列化
    redisTemplate.setKeySerializer(RedisSerializer.string());
    redisTemplate.setHashKeySerializer(RedisSerializer.string());
    // value和 hashValue采用 JSON序列化
    redisTemplate.setValueSerializer(jsonRedisSerializer);
    redisTemplate.setHashValueSerializer(jsonRedisSerializer);
    return redisTemplate;
  }
}
```
```java
public class RedisTest() {

  @Autowired
  private RedisTemplate<String,Object> redisTemplate;

  @Test
  public void test() {
    // 插入一条string类型数据      
    redisTemplate.opsForValue().set("name", "hyy");
    // 读取一条string类型数据
    Object name = redisTemplate.opsForValue().get("name");
    System.out.println("name = " + name);
  }
}
```
### 发现问题
- 当存入java对象时，自动序列化为json后，还会给json添加一个额外的属性:`@class`，属性值是java对象的全类名，目的是在自动反序列化时知道对象的类型，但是这样会带来额外的内存开销(每个对象有一个@class属性，且全类名有可能比其他数据更占内存)
### 解决问题
- 不使用JSON序列化器来处理value，而是统一使用String序列化器，要求只能存储String类型的key和value
- 当需要存储Java对象时，手动完成对象的序列化和反序列化。
- 使用Spring提供了的`StringRedisTemplate类`，它的key和value的序列化方式默认就是String方式。省去了我们自定义RedisTemplate的过程
```xml
<!-- SpringMVC默认使用的JSON工具类 -->
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
</dependency>
```
```java
@Autowired
private StringRedisTemplate stringRedisTemplate;
// JSON工具
private static final ObjectMapper mapper = new ObjectMapper();
@Test
void testStringTemplate() throws JsonProcessingException {
  // 准备对象
  User user = new User("hyy", 18);
  // 手动序列化
  String json = mapper.writeValueAsString(user);
  // 写入一条数据到redis
  stringRedisTemplate.opsForValue().set("user:200", json);
  // 读取数据
  String val = stringRedisTemplate.opsForValue().get("user:200");
  // 反序列化
  User user1 = mapper.readValue(val, User.class);
  System.out.println("user1 = " + user1);
}
```
![手动序列化](https://blog-image-9943.oss-cn-beijing.aliyuncs.com/202308201914761.png)




