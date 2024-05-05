---
title: JVM-垃圾回收-可达性分析
article: false
category:
  - Java
  - JVM(jdk1.8)
---
## 可达性分析
- JVM的垃圾回收器采用可达性分析方法探索所有存活的对象，判断哪些对象可以被当作垃圾
### 根对象
- 根对象：肯定不能被当作垃圾的对象
- 哪些对象可以作为 GC Root
  - 使用Eclipse的Memory Analyzer(MAT)可视化界面工具搭配jamp命令
### 可达性分析流程
1. 在垃圾回收之前，对堆中的所有对象扫描
2. 看是否能够沿着GC Root对象为起点的引用链找到该对象，找不到，回收
    

