---
title: SpringCloud-服务网关
article: false
category:
  - Java
  - SpringCloud
---
## 服务网关
- 架构![架构](https://blog-image-9943.oss-cn-beijing.aliyuncs.com/202309091638084.png)
- 作用
  - 网关路由和负载均衡
    - 一切请求都必须先经过gateway，但网关不处理业务，而是根据某种规则，把请求转发到某个微服务，这个过程叫做路由
    - 路由的目标服务有多个时，还需要做负载均衡
  - 权限控制
    - 网关作为微服务入口，需要校验用户是是否有请求资格，如果没有则进行拦截
  - 限流
    - 当请求流量过高时，在网关中按照下流的微服务能够接受的速度来放行请求，避免服务压力过大
## gateway
### 搭建网关服务
1. 网关依赖
```xml
<!--网关-->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-gateway</artifactId>
</dependency>
```
2. 启动类
```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class GatewayApplication {
	public static void main(String[] args) {
		SpringApplication.run(GatewayApplication.class, args);
	}
}
```
3. 配置文件
- 路由id：路由的唯一标识
- 路由目标（uri）：路由的目标地址，http代表固定地址，lb代表根据服务名负载均衡
- 路由断言（predicates）：判断路由的规则，
  - 将符合`Path` 规则的一切请求，都代理到 `uri`参数指定的地址。
    - 本例中，我们将 `/user/**`开头的请求，代理到`lb://userservice`，lb是负载均衡，根据服务名拉取服务列表，实现负载均衡。
- 路由过滤器（filters）：对请求或响应做处理
```yml
server:
  port: 10010 # 网关端口
spring:
  application:
    name: gateway # 服务名称
  cloud:
    nacos:
      server-addr: localhost:8848 # nacos地址
    gateway:
      routes: # 网关路由配置
        - id: user-service # 路由id，自定义，只要唯一即可
          # uri: http://127.0.0.1:8081 # 路由的目标地址 http就是固定地址
          uri: lb://userservice # 路由的目标地址 lb就是负载均衡，后面跟服务名称
          predicates: # 路由断言，也就是判断请求是否符合路由规则的条件
            - Path=/user/** # 这个是按照路径匹配，只要以/user/开头就符合要求
```
- 流程![流程](https://blog-image-9943.oss-cn-beijing.aliyuncs.com/202309091645884.png)
### 断言工厂
- 配置文件中写的断言规则只是字符串，这些字符串会被断言工厂`Predicate Factory`读取并处理，转变为路由判断的条件
  - 例如Path=/user/**是按照路径匹配，这个规则是由`org.springframework.cloud.gateway.handler.predicate.PathRoutePredicateFactory`类来处理的

| **名称**   | **说明**                       | **示例**                                                     |
| ---------- | ------------------------------ | ------------------------------------------------------------ |
| After      | 是某个时间点后的请求           | -  After=2037-01-20T17:42:47.789-07:00[America/Denver]       |
| Before     | 是某个时间点之前的请求         | -  Before=2031-04-13T15:14:47.433+08:00[Asia/Shanghai]       |
| Between    | 是某两个时间点之前的请求       | -  Between=2037-01-20T17:42:47.789-07:00[America/Denver],  2037-01-21T17:42:47.789-07:00[America/Denver] |
| Cookie     | 请求必须包含某些cookie         | - Cookie=chocolate, ch.p                                     |
| Header     | 请求必须包含某些header         | - Header=X-Request-Id, \d+                                   |
| Host       | 请求必须是访问某个host（域名） | -  Host=**.somehost.org,**.anotherhost.org                   |
| Method     | 请求方式必须是指定方式         | - Method=GET,POST                                            |
| Path(重要)     | 请求路径必须符合指定规则       | - Path=/red/{segment},/blue/**                               |
| Query      | 请求参数必须包含指定参数       | - Query=name, Jack或者-  Query=name                          |
| RemoteAddr | 请求者的ip必须是指定范围       | - RemoteAddr=192.168.1.1/24                                  |
| Weight     | 权重处理                       |                                                              |
### 过滤器工厂
- GatewayFilter是网关中提供的一种过滤器，可以对进入网关的请求和微服务返回的响应做处理
  - 对路由的请求或响应做加工处理，比如添加请求头
  - 配置在路由下的过滤器只对当前路由的请求生效
- 缺点
  - 每一种过滤器的作用都是固定的。如果我们希望拦截请求，做自己的业务逻辑则没办法实现。需要使用全局过滤器`GlobalFilter`处理业务逻辑
- 流程![流程](https://blog-image-9943.oss-cn-beijing.aliyuncs.com/202309091650300.png)

| **名称**             | **说明**                     |
| -------------------- | ---------------------------- |
| AddRequestHeader     | 给当前请求添加一个请求头     |
| RemoveRequestHeader  | 移除请求中的一个请求头       |
| AddResponseHeader    | 给响应结果中添加一个响应头   |
| RemoveResponseHeader | 从响应结果中移除有一个响应头 |
| RequestRateLimiter   | 限制请求的流量               |
### 全局过滤器
- 通过实现全局过滤器`GlobalFilter`，自定义逻辑
```java
public interface GlobalFilter {
    /**
     *  处理当前请求，有必要的话通过{@link GatewayFilterChain}将请求交给下一个过滤器处理
     *
     * @param exchange 请求上下文，里面可以获取Request、Response等信息
     * @param chain 用来把请求委托给下一个过滤器 
     * @return {@code Mono<Void>} 返回标示当前过滤器业务结束
     */
    Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain);
}
```
#### 登录状态判断
#### 权限校验
- 定义全局过滤器，拦截请求，判断请求的参数是否满足下面条件：
  - 参数中是否有authorization，
  - authorization参数值是否为admin
- 如果同时满足则放行，否则拦截
```java
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Order(-1)
@Component
public class AuthorizeFilter implements GlobalFilter {
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        // 1.获取请求参数
        MultiValueMap<String, String> params = exchange.getRequest().getQueryParams();
        // 2.获取authorization参数
        String auth = params.getFirst("authorization");
        // 3.校验
        if ("admin".equals(auth)) {
            // 放行
            return chain.filter(exchange);
        }
        // 4.拦截
        // 4.1.禁止访问，设置状态码
        exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
        // 4.2.结束处理
        return exchange.getResponse().setComplete();
    }
}
```
#### 请求限流等
### 过滤器执行顺序
- 请求进入网关会碰到三类过滤器：当前路由的过滤器、DefaultFilter、GlobalFilter
  - 请求路由后，会将当前路由过滤器和DefaultFilter、GlobalFilter，合并到一个过滤器链（集合）中，排序后依次执行每个过滤器
![过滤器执行顺序](https://blog-image-9943.oss-cn-beijing.aliyuncs.com/202309091700150.png)
- 排序的规则
  - 每一个过滤器都必须指定一个int类型的order值，**order值越小，优先级越高，执行顺序越靠前**。
  - GlobalFilter通过实现Ordered接口，或者添加`@Order`注解来指定order值，由我们自己指定
  - 路由过滤器和defaultFilter的order由Spring指定，默认是按照声明顺序从1递增。
  - 当过滤器的order值一样时，会按照 defaultFilter > 路由过滤器 > GlobalFilter的顺序执行。
### 解决跨域问题
- 跨域问题
  - 浏览器禁止请求的发起者与服务端发生跨域ajax请求，请求被浏览器拦截的问题，原因是域名不同或端口不同
    - 解决方案
      - 前端，跨域资源共享CORS，浏览器询问服务器是否允许该请求跨域
        - [参考文章](https://www.ruanyifeng.com/blog/2016/04/cors.html)
      - 后端，使用网关进行跨域检测，定义哪些请求允许跨域
- 网关服务的跨域检测配置
```yml
spring:
  cloud:
    gateway:
      # ...
      globalcors: # 全局的跨域处理
        add-to-simple-url-handler-mapping: true # 解决options请求被拦截问题
        corsConfigurations:
          '[/**]':
            allowedOrigins: # 允许哪些网站的跨域请求 
              - "http://localhost:8090"
            allowedMethods: # 允许的跨域ajax的请求方式
              - "GET"
              - "POST"
              - "DELETE"
              - "PUT"
              - "OPTIONS"
            allowedHeaders: "*" # 允许在请求中携带的头信息
            allowCredentials: true # 是否允许携带cookie
            maxAge: 360000 # 这次跨域检测的有效期
```
## gateway和zuul的区别
- Zuul是基于Servlet的实现，属于阻塞式编程
- 而SpringCloudGateway则是基于Spring5中提供的WebFlux，属于响应式编程的实现，具备更好的性能。
