---
title: Java-基础-异常处理
article: false
category:
  - Java
  - Java基础
---
## 异常处理
- 异常：将程序执行中发生的不正常情况称为异常，开发过程中的语法错误和逻辑错误不是异常
### Error
- Java 虚拟机无法解决的严重问题
  - JVM 系统内部错误
  - 资源耗尽等严重情况
- 如何处理
  - 一般不编写针对性的代码进行处理
### Exception
- 其它因编程错误或偶然的外在因素导致的一般性问题
  - 空指针访问
  - 试图读取不存在的文件
  - 网络连接中断
  - 数组角标越界
- 如何处理
  - 可以使用针对性的代码进行处理
### 解决方法
- 遇到错误就终止程序的运行
- 在编写程序时就考虑到错误的检测、错误消息的提示以及错误的处理
  - 何时捕获错误
    - 编译期间的异常：必须处理
    - 运行期间的异常：要积极避免
      - 除数为0:`java.lang.ArithmeticException : / by zero`
      - 数组下标越界：`java.lang.ArrayIndexOutOfBoundsException`
      - 空指针：`java.lang.NullPointerException`
      - 继承对象之间的强制转换:`java.lang.ClassCastException`
### try catch finally
```java
try{
   // 可能产生异常的代码
}
catch(ExceptionName 1 e) {
   // 当产生 ExceptionName 1 型异常时的处置措施
}
catch(ExceptionName 2 e) {
   // 当产生 ExceptionName 2 型异常时的处置措施
}
finally {
   // 无论是否发生异常,都无条件执行的语句
}
```
### throws
- 不能确定如何处理这种异常,则此方法应显式地声明抛出异常，表明该方法将不对这些异常进行处理，而由该方法的调用者负责处理
### 自定义异常类


