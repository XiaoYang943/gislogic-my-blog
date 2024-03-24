---
title: SpringCloud-统一配置管理
article: false
category:
  - Java
  - SpringCloud
---
## 统一配置管理
- 当微服务部署的实例越来越多，逐个修改微服务配置就很麻烦，而且很容易出错。需要一种统一配置管理方案，可以集中管理所有实例的配置
- 流程
  - 统一更改配置
  - 通知微服务，完成配置热更新
## Nacos
- 流程
  - 发布配置
  - 微服务拉取配置
### 发布配置
- Nacos控制台页面-配置管理-配置列表
  - DataId
    - 命名规范
      - 服务名称-运行环境.yml
      - 确保唯一
      - 不能叫`application.yml`
  - 分组
    - 默认即可
- 注意
  - 需要热更新的配置才有放到nacos管理的必要
    - 例如一些开关配置、模板配置
  - 基本不会变更的一些配置还是保存在微服务本地的配置文件比较好。
### 拉取配置
- 没有nacos配置中心时，服务如何获取配置
  - 项目启动
  - 读取本地配置文件`application.yml`
  - 创建spring容器
  - 加载bean
- 有nacos配置中心时，服务如何获取配置
  - 项目启动
  - 读取引导文件`bootstrap.yml`，获取：去哪里读取配置文件(nacos地址)、读取哪个文件(配置文件id)
  - 读取nacos配置
  - 读取本地配置文件`application.yml`
  - **合并以上两个配置**
  - 创建spring容器
  - 加载bean
#### 流程
- 首先，在某个服务中，引入nacos-config的客户端依赖
```xml
<!--nacos配置管理依赖-->
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
</dependency>
```
- 然后，在某个服务中，添加一个bootstrap.yaml文件
```yaml
# name+active+file-extension = nacos中配置的DataId
spring:
  application:
    name: userservice # 服务名称
  profiles:
    active: dev #开发环境
  cloud:
    nacos:
      server-addr: localhost:8848 # Nacos地址
      config:
        file-extension: yaml # 文件后缀名
```
### 配置热更新
- 修改nacos中的配置后，微服务中无需重启即可让配置生效，即**配置热更新**
#### 方式一
- 在`@Value`注入的变量所在类上添加注解`@RefreshScope`
#### 方式二
- 使用`@ConfigurationProperties`注解代替`@Value`注解
1. 在服务中，添加一个类，读取配置文件中的patterrn.dateformat属性
```java
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@Data
@ConfigurationProperties(prefix = "pattern")
public class PatternProperties {
    private String dateformat;
}
```
2. 使用这个类代替`@Value`
```java
private PatternProperties patternProperties;
```
### 配置共享
- 当某个配置在开发、生产、测试等环境下的值是相同的，可以将其共享
- 共享的原理：
  - 微服务启动时，会去nacos读取多个配置文件
    - `[spring.application.name]-[spring.profiles.active].yaml`
      - 例如：userservice-dev.yaml、userservice-test.yaml、userservice-prod.yaml
    - `[spring.application.name].yaml`
      - 例如：userservice.yaml
      - 当环境变化时，该文件的内容不变，所以共享的配置放在这里
- 优先级
  - 当nacos、服务本地同时出现相同属性时，优先级有高低之分![优先级](https://blog-image-9943.oss-cn-beijing.aliyuncs.com/202309091542847.png)