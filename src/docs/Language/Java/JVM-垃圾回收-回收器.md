---
title: JVM-垃圾回收-回收器
article: false
category:
  - Java
  - JVM(jdk1.8)
---
## 垃圾回收器
### 串行的垃圾回收器
- 底层是单线程的垃圾回收器
- 适用情况:堆内存较小，适合个人电脑
![串行的垃圾回收器](https://blog-image-9943.oss-cn-beijing.aliyuncs.com/202308102150740.png)
### 吞吐量优先的垃圾回收器
- 底层是多线程的垃圾回收器
- 适用情况:堆内存较大，需要多核CPU支持，适合服务器
- 在单位时间内，STW的时间最短
![吞吐量优先的垃圾回收器](https://blog-image-9943.oss-cn-beijing.aliyuncs.com/202308102152972.png)
### 响应时间优先的垃圾回收器
- 底层是多线程的垃圾回收器
- 适用情况:堆内存较大，需要多核CPU支持，适合服务器
- 尽可能让STW的单次时间最短
![响应时间优先的垃圾回收器](https://blog-image-9943.oss-cn-beijing.aliyuncs.com/202308102152025.png)
### Garbage First
TODO：未完待续...(学你🐎，学死得了)