---
title: 消息队列-RabbitMQ-基础
article: false
category:
  - 中间件
  - MQ
---
## RabbitMQ
- RabbitMQ中的一些角色
  - publisher：生产者
  - consumer：消费者
  - exchange：交换机，负责消息路由
  - queue：队列，存储消息
  - virtualHost：虚拟主机，隔离不同租户的exchange、queue、消息的隔离
- 结构![结构](https://blog-image-9943.oss-cn-beijing.aliyuncs.com/202309091804121.png)
### Spring集成RabbitMQ
- SpringAMQP是基于RabbitMQ封装的一套模板，并且还利用SpringBoot对其实现了自动装配，使用起来非常方便
## RabbitMQ的消息模型
- 基本消息队列
- 工作消息队列
- 发布订阅，根据交换机类型不同，又分为
  - 广播
  - 路由
  - 主题