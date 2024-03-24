---
title: JVM-内存结构-程序计数器
article: false
category:
  - Java
  - JVM(jdk1.8)
---
## 程序计数器（寄存器）(线程私有)
- 程序计数器（PC寄存器）（Program Counter Register）
   - 是java对物理硬件寄存器的抽象
      - 寄存器是cpu中读取速度最快的单元
### Java源代码的执行流程
- Java源代码不能被操作系统直接执行，源代码经过编译成二进制的字节码(JVM指令)，字节码经过解释器解释成机器码，然后交给cpu执行
### 作用
:::tip
- 类似于日常工作中的代办，还没办完，写个代办，下次继续从这开始
::: 
![作用](https://blog-image-9943.oss-cn-beijing.aliyuncs.com/202308091556381.png)
### 特点
- 每个线程都私有一个程序计数器
![线程私有](https://blog-image-9943.oss-cn-beijing.aliyuncs.com/202308091602082.png)
- 在JVM规范中，唯一一个不会存在内存溢出的区域