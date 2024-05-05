---
title: JVM-内存结构-本地方法栈
article: false
category:
  - Java
  - JVM(jdk1.8)
---
## 本地方法栈(线程私有)
- 本地方法栈(Native Method Stacks):JVM调用本地方法时，给本地方法提供的内存空间
  - 本地方法
    - 不是由Java编写的方法。由于Java的一些限制，不能直接和操作系统底层进行通信，需要一些其他语言编写的本地方法。Java代码可以间接地通过本地方法调用底层地功能。
    - 例如Object类的clone方法`protected native Object clone() throws CloneNotSupportedException;`
