---
title: Spring-概述
article: false
category:
  - Java
  - Spring
---
## Spring
- Spring是什么
  - Spring是一款主流的Java EE轻量级开源框架
- 子模块
  -  Spring Framework：是Spring的基础
  -  Spring MVC
  -  Spring Boot
  -  Spring Cloud
  -  Spring Data
  -  Spring Security
### 模块组成
![模块组成](https://blog-image-9943.oss-cn-beijing.aliyuncs.com/202308191520555.png)
- Spring Core（核心容器）
  - spring-core ：IOC和DI的基本实现
  - spring-beans：BeanFactory和Bean的装配管理(BeanFactory)
  - spring-context：Spring context上下文，即IOC容器(AppliactionContext)
  - spring-expression：spring表达式语言
- Spring AOP
  - spring-aop：面向切面编程的应用模块，整合ASM，CGLib，JDK Proxy
  - spring-aspects：集成AspectJ，AOP应用框架
  - spring-instrument：动态Class Loading模块
- Spring Data Access
  - spring-jdbc：spring对JDBC的封装，用于简化jdbc操作
  - spring-orm：java对象与数据库数据的映射框架
  - spring-oxm：对象与xml文件的映射框架
  - spring-jms： Spring对Java Message Service(java消息服务)的封装，用于服务之间相互通信
  - spring-tx：spring jdbc事务管理
- Spring Web
  - spring-web：最基础的web支持，建立于spring-context之上，通过servlet或listener来初始化IOC容器
  - spring-webmvc：实现web mvc
  - spring-websocket：与前端的通信协议
  - spring-webflux：Spring 5.0提供的，用于取代传统java servlet，非阻塞式Reactive Web框架，异步，非阻塞，事件驱动的服务
- Spring Message
  - Spring-messaging：spring 4.0提供的，为Spring集成一些基础的报文传送服务
  - Spring test**
- spring-test：集成测试支持，主要是对junit的封装