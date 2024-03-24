---
title: JVM-内存结构-堆
article: false
category:
  - Java
  - JVM(jdk1.8)
---
## 堆(线程共享)
- 通过new关键字，创建的对象都会使用堆内存(Heap)。
- 特点
  - 线程共享，堆中的对象需要考虑线程安全问题(有例外)。
  - 有垃圾回收机制
## 堆内存溢出问题
- 为什么堆内存有垃圾回收机制，还会出现内存溢出问题？
  - 对象被回收的条件是该对象没有被使用，但是如果不断地产生大量新对象，且被使用(不被回收)，就会出现内存溢出问题。
```java
public class OutOfMemory {
    public static void main(String[] args) {
        int i = 0;
        try {
            ArrayList<String> list = new ArrayList<>();
            String a = "Hello";
            while (true) {
                list.add(a);
                a = a + a;
                i++;
            }
        } catch (Throwable e) {
            e.printStackTrace();    // 报错：堆内存溢出，java.lang.OutOfMemoryError: Java heap space
            System.out.println(i);
        }
    }
}
// 如何设置栈内存：
// idea-启动类-Edit Configurations-VM options-设置：-Xmx8m
```
## 堆内存诊断
### 工具
1. jps工具
   - 查看当前系统中有哪些进程
2. jmap工具
   - 查看堆内存占用情况
3. jconsole工具
   - 图形界面工具 