---
title: SpringCloud-服务注册中心
article: false
category:
  - Java
  - SpringCloud
---
## 服务注册中心
- 服务注册中心里保存每个服务的信息。
- 服务注册中心解决以下三个问题
  - **Comsumer**如何获取**Provider**的地址信息？（服务发现）
  - 如果有多个**Provider**，消费者该如何选择？ (负载均衡)
  - **Comsumer**如何得知**Provider**的健康状态？ (心跳)
### 解决问题
- 服务注册中心里保存每个服务的名称、地址等信息。**Comsumer**从注册中心中拉取(服务发现)**Provider**的各项信息。
## Eureka
- 两个角色
  - 注册中心(服务端)：eureka-server
  - 客户端：eureka-client
    - **Comsumer**
    - 服务调用者
- 如何注册
  - 每个客户端启动时，都会自动注册(记录)到服务注册中心
- **Provider**的健康状态
  - **Provider**每隔30s都会向eureka发送一次心跳，更新该服务的健康状态
  - 若注册中心监听不到服务的心跳，则将该服务从服务列表中移除
### 搭建Eureka服务
1. 建module
2. 改pom
```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
</dependency>
```
3. 写yml
```yml
server:
  port: 8090
spring:
  application:
    name: eureka-server
eureka:
  client:
    service-url: 
      defaultZone: http://127.0.0.1:8090/eureka
```
4. 主启动
```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer // 表示该服务是Eureka-Server
public class EurekaApplication {
    public static void main(String[] args) {
        SpringApplication.run(EurekaApplication.class, args);
    }
}
```
### 服务注册
1. 建module
2. 改pom
```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
```
3. 写yml
```yml
spring:
  application:
    name: userservice
eureka:
  client:
    service-url:
      defaultZone: http://127.0.0.1:8090/eureka
```
4. 主启动
```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaClient // 表示该服务是Eureka-Client
public class EurekaClientApplication {
    public static void main(String[] args) {
        SpringApplication.run(EurekaClientApplication.class, args);
    }
}
```
### 服务发现
- 服务调用时，**Provider**的地址不能是硬编码，改为**Provider**的服务名称，即可自动从注册中心中拉取该**Provider**的实例列表
```java
// String url = "http://localhost:8081/user/" +  order.getUserId();
String url = "http://userservice/user/" +  order.getUserId();
```
### 负载均衡
- 在完成服务发现的前提下，给**Provider**的主启动的`RestTemplate`添加`@LoadBalanced`注解
  - 在使用`restTemplate.getForObject`发送http请求实现远程调用时，即可自动完成**负载均衡**
```java
String url = "http://userservice/user/" +  order.getUserId();
User user = restTemplate.getForObject(url, User.class); // 发送http请求，实现远程调用
```
## Nacos
### 服务实例的类型
- Nacos的服务实例分为两种类型
  - 临时实例：如果实例宕机超过一定时间，会从服务列表剔除，默认的类型
  - 非临时实例：如果实例宕机，不会从服务列表剔除，也可以叫永久实例。
```yml
spring:
  cloud:
    nacos:
      discovery:
        ephemeral: false # 设置为非临时实例
```
### 服务分级存储模型
- 一个**服务**可以有多个**实例**，例如user-service，可以有:
  - 127.0.0.1:8081
  - 127.0.0.1:8082
  - 127.0.0.1:8083
- 假如这些实例分布于全国各地的不同机房，例如：
  - 127.0.0.1:8081，在上海机房
  - 127.0.0.1:8082，在上海机房
  - 127.0.0.1:8083，在杭州机房
- Nacos就将同一机房内的实例，划分为一个**集群(cluster)**。也就是说，user-service是服务，一个服务可以包含多个集群，如杭州、上海，每个集群下可以有多个实例，形成分级模型
- 微服务互相访问时，应该尽可能访问同集群实例，因为本地访问速度更快。当本集群内不可用时，才访问其它集群
![服务分级存储模型](https://blog-image-9943.oss-cn-beijing.aliyuncs.com/202309091402977.png)
### 同集群优先的负载均衡
- 同集群优先的负载均衡即**Consumer**服务调用时，优先在本地集群的**Provider**中做负载均衡
  - 特点
    - 负载均衡策略是随机策略(存在问题，需要做加权负载均衡)
    - 若本地集群没有服务，则会夸集群访问，并抛出警告
- 配置：
1. 先配置`Comsumer`的服务发现的集群
```yml
spring:
  cloud:
    nacos:
      server-addr: localhost:8848
      discovery:
        cluster-name: HZ # 集群名称
```
2. 再配置`Comsumer`的负载均衡规则
```yml
userservice:
  ribbon:
    NFLoadBalancerRuleClassName: com.alibaba.cloud.nacos.ribbon.NacosRule # 修改负载均衡规则，优先选择本地集群
```
### 加权负载均衡
- Nacos提供了权重配置来控制访问频率，权重越大则访问频率越高。
- 如何修改权重
  - 在Nacos的控制台页面-编辑-权重
- 注意
  - 如果权重修改为0，则该实例永远不会被访问
### 服务隔离
- Nacos提供了**namespace**来实现服务隔离功能：不同namespace的服务不能互相访问
  - nacos中可以有多个namespace
  - namespace下可以有group、service等
  - 不同namespace之间相互隔离，例如不同namespace的服务互相不可见
## Nacos与Eureka的对比
- 共同点
  - 都支持服务注册和服务发现
  - 都支持**Provider**心跳方式做健康检测
- 区别
  - Nacos支持服务端主动检测**Provider**状态：临时实例采用心跳模式，非临时实例采用主动检测模式
  - 临时实例心跳不正常会被剔除，非临时实例则不会被剔除
  - Nacos支持服务列表变更的消息推送模式，服务列表更新更及时
  - Nacos集群默认采用AP方式，当集群中存在非临时实例时，采用CP模式；Eureka采用AP方式
