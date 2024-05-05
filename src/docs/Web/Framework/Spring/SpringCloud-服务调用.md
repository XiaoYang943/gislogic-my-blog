---
title: 微服务-服务调用
article: false
category:
  - Java
  - SpringCloud
---
## 服务调用
- 微服务架构中，服务间调用的实现方式
  - `RestTemplate`
    - 缺点
      - 代码可读性差
      - 参数复杂URL难以维护
  - Feign组件
    - 优点
      - 优雅的实现http请求的发送
## RestTemplate
- 微服务架构中，有订单模块，用户模块。根据订单id查询订单和用户
  - 用户服务，暴露了用户查询的接口，是**Provider**
  - 订单服务，调用了查询用户的接口，是**Consumer**
1. 在订单模块的配置类中注入`RestTemplate`
```java
@SpringBootApplication
public class OrderApplication {
  public static void main(String[] args) {
      SpringApplication.run(OrderApplication.class, args);
  } 
    
  @Bean
  public RestTemplate restTemplate(){
    return new RestTemplate();
  }
}
```
2. 订单模块中
```java
@Service
public class OrderService {
  @Autowired
  private RestTemplate restTemplate;

  public Order queryOrderById(Long orderId) {
    // 1.查询订单
    Order order = orderMapper.findById(orderId);

    // 2.查询用户模块中对应的用户
    String url = "http://localhost:8081/user/" +  order.getUserId();  // 此处硬编码问题需要用服务注册中心解决或使用Feigh组件解决
    User user = restTemplate.getForObject(url, User.class); // 发送http请求，实现远程调用

    // 3.封装user信息
    order.setUser(user);
    // 4.返回
    return order;
  }
}
```
### 负载均衡
- 流程
  - 在客户端**Comsumer**中使用`restTemplate.getForObject`发送http请求实现远程调用时
  - 负载均衡拦截器将该请求拦截，去注册中心拉取服务，找到名为`userservice`的**Provider**的实例列表
  - 然后根据负载均衡策略，完成负载均衡
```java
String url = "http://userservice/user/" +  order.getUserId();
User user = restTemplate.getForObject(url, User.class); // 发送http请求，实现远程调用
```
## Feign
- Feign是一个声明式的http客户端，优雅的实现http请求的发送
### 步骤
1. 消费者服务的依赖
```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```
2. 消费者服务的主启动类
- 添加`@EnableFeignClients`注解
3. 业务类
- 编写FeignClient接口
```java
import cn.itcast.order.pojo.User;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient("userservice")
public interface UserClient {
    @GetMapping("/user/{id}")
    User findById(@PathVariable("id") Long id);
}
```
- 使用FeignClient中定义的方法代替RestTemplate
```java
@Service
public class OrderService {
  @Autowired
  private RestTemplate restTemplate;

  public Order queryOrderById(Long orderId) {
    // 1.查询订单
    Order order = orderMapper.findById(orderId);

    // 2.使用Feign发起http请求，查询用户模块中对应的用户
    User user = userClient.findById(order.getUserId());

    // 3.封装user信息
    order.setUser(user);
    // 4.返回
    return order;
  }
}
```
### 自定义配置
- 一般情况下，默认值就能满足我们使用，如果要自定义时，只需要创建自定义的@Bean覆盖默认Bean即可

| 类型                   | 作用             | 说明                                                   |
| ---------------------- | ---------------- | ------------------------------------------------------ |
| **feign.Logger.Level** | 修改日志级别     | 包含四种不同的级别：NONE、BASIC、HEADERS、FULL         |
| feign.codec.Decoder    | 响应结果的解析器 | http远程调用的结果做解析，例如解析json字符串为java对象 |
| feign.codec.Encoder    | 请求参数编码     | 将请求参数编码，便于通过http请求发送                   |
| feign.Contract        | 支持的注解格式   | 默认是SpringMVC的注解                                  |
| feign.Retryer         | 失败重试机制     | 请求失败的重试机制，默认是没有，不过会使用Ribbon的重试 |
### 修改日志级别
- 日志级别
  - NONE：不记录任何日志信息，这是默认值。
  - BASIC：仅记录请求的方法，URL以及响应状态码和执行时间
  - HEADERS：在BASIC的基础上，额外记录了请求和响应的头信息
  - FULL：记录所有请求和响应的明细，包括头信息、请求体、元数据。

```yml
feign:  
  client:
    config: 
      userservice: # 针对某个微服务的配置
        loggerLevel: FULL
      ----------------------------------------------------
      # default: # 全局配置
      #   loggerLevel: FULL
```
### Feign优化
- Feign底层发起http请求，依赖于其它的框架
  - URLConnection：默认实现，不支持连接池
  - Apache HttpClient ：支持连接池
  - OKHttp：支持连接池
- 优化
  - 日志级别尽量用basic
  - 使用HttpClient或OKHttp代替URLConnection
### Feigh最佳实践
- 抽取方式
## Ribbon
### 负载均衡策略
- 默认是轮询
![Ribbon负载均衡策略](https://blog-image-9943.oss-cn-beijing.aliyuncs.com/202309091327286.png)
### 懒加载和饥饿加载
- 在创建`LoadBalanceClient`并拉取服务列表时，耗时较长
  - 两种策略
    - 懒加载(默认)，第一次访问服务时才会创建`LoadBalanceClient`
    - 饥饿加载，在项目启动时创建`LoadBalanceClient`，降低第一次访问的耗时
- 饥饿加载配置
```yml
ribbon:
  eager-load:
    enabled: true
    clients: userservice  # 是否是全部服务生效
```
### 修改负载均衡策略
- 方式一：`Consumer`的启动类中定义一个新的`IRule`
```java
@Bean
public IRule randomRule(){
    return new RandomRule();
}
```
- 方式二：`Consumer`的配置文件中，修改规则
```yml
userservice: # 给某个微服务配置负载均衡规则，这里是userservice服务
  ribbon:
    NFLoadBalancerRuleClassName: com.netflix.loadbalancer.RandomRule # 负载均衡规则 
```
