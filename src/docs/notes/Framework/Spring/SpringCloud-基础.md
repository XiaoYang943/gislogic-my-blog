---
title: SpringCloud-基础
article: false
category:
  - Java
  - SpringCloud
---
## SpringCloud
### 什么是微服务
- 基于分布式的微服务架构是一种架构模式，将单一应用程序**划分成一组组小的服务**，服务之间相互协调配合，每个服务运行在其**独立的进程**中，服务与服务之间采用**轻量级的通信机制**相互协作。
### 版本选择
- SpringBoot和SpringCloud版本适配见[官网](https://spring.io/projects/spring-cloud)的**Release train Spring Boot compatibility表**
- 详细版本见[版本信息](https://start.spring.io/actuator/info)
  - 单独用SpringBoot时，springboot可以选择最新版本
  - SpringBoot和SpringCloud一起使用时，cloud版本决定boot版本，打开[cloud当前最新版本](https://docs.spring.io/spring-cloud/docs/current/reference/html/)，官方会推荐boot版本`Supported Boot Version`
### Cloud各种组件的停更/升级/替换
- 停更不停用-老技术还可以用，但是不更新了
1. 服务注册中心
    - Eureka(不推荐)
    - Zookeeper(一般)
    - Consul(一般) 
    - **Nacos(推荐)**
2. 服务调用
    - Ribbon(不推荐)
    - Loadbalance(推荐)
3. 服务调用2
    - Feign(不推荐)
    - OpenFeign(推荐)
4. 服务降级(熔断)
    - Hystrix(不推荐)
    - Resilience4j(一般) 
    - Alibaba Sentinel(推荐)
5. 服务网关
    - Zuul(不推荐)
    - Gateway(推荐)
6. 服务配置
   - Config(一般)
   - **Nacos(推荐)**
7. 服务总线
    - Bus(一般)
    - **Nacos(推荐)**
### IDEA配置
#### 热更新
1. 添加依赖和插件
2. 设置-构建-编译-勾选Automatically、Display、Build、Compile四个框
3. 在父pom中ctrl+alt+shift+/    
    - 注册
    - 勾选compiler.automake.allow.when.app.running
    - 勾选actionSystem.assertFocusAccessFromEdt
    - 关闭窗口后重启idea
4. 开发阶段要打开，项目上线后的生产部署阶段要关闭
## 提供者与消费者
- 服务提供者(Provider)：暴露接口给其它微服务调用
- 服务消费者(Consumer)：调用其它微服务提供的接口
- 特点
  - 提供者与消费者角色是相对的
  - 一个服务可以同时是服务提供者和服务消费者