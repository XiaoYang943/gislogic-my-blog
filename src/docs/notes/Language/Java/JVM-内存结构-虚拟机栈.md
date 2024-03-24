---
title: JVM-内存结构-虚拟机栈
article: false
category:
  - Java
  - JVM(jdk1.8)
---
## 虚拟机栈(线程私有)
- 虚拟机栈(JVM Stacks)是每个线程运行时需要的内存空间，n个线程有n个虚拟机栈
### 栈帧
- 栈内的元素叫做栈帧
  - 一个栈帧就对应着一次方法的调用，线程是为了执行代码的，代码由一个个方法组成，线程运行时，每个方法需要的内存就是一个栈帧(存的是方法的参数、局部变量、返回地址...)
  - 调用方法时，栈帧入栈
  - 方法运行完了，栈帧出栈(释放栈帧中参数、局部变量、返回地址...的内存)
- 栈内有可能存在多个栈帧，例如，调用方法A，方法A中又调用了方法B
- 活动栈帧 
  - 每个线程只能由一个活动栈帧，对应这当前执行的方法，即栈顶的那个方法
## 垃圾回收是否管理栈内存
- 不需要，因为栈帧内存在每一次方法调用结束后都出栈了(被自动回收了)
## 栈内存的分配越大越好吗
- 不是，因为物理内存的大小是一定的，栈内存越大，线程数变少
  - 栈内存的大小由操作系统的默认栈内存大小决定

## 变量的线程安全问题
- 决定性因素是：变量是多线程共享的还是私有的
  - 如果方法内部局部变量没有逃离方法的作用访问(私有的)，不用考虑线程安全问题
  -  如果是局部变量引用了对象，并逃离方法的作用访问(共享的)，需要考虑线程安全问题
### 局部变量
  - 方法内的变量属于方法的局部变量，一个线程对应一个栈，线程内每一次方法调用都会产生一个新的栈帧，该栈帧中的局部变量是该线程私有的，是线程安全的，互不干扰
```java
public class ThreadSafety {
    public static void main(String[] args) {
        StringBuilder stringBuilder = new StringBuilder();
        stringBuilder.append(4);
        stringBuilder.append(5);
        stringBuilder.append(6);
        new Thread(() -> {
          method1();  // 123
        }, "ThreadA").start();
    }

    // 没有线程安全问题，stringBuilder是方法内部的局部变量，局部变量是私有的，其他线程不能访问
    public static void method1() {
        StringBuilder stringBuilder = new StringBuilder();
        stringBuilder.append(1);
        stringBuilder.append(2);
        stringBuilder.append(3);
        System.out.println(stringBuilder.toString());
    }
}
```
### 方法的参数
```java
public class ThreadSafety {
    public static void main(String[] args) {
        StringBuilder stringBuilder = new StringBuilder();
        stringBuilder.append(4);
        stringBuilder.append(5);
        stringBuilder.append(6);
        new Thread(() -> {
            method2(stringBuilder); // 456123
        }, "ThreadA").start();
    }

    // 有线程安全问题，stringBuilder是方法的参数，参数是共享的，其他线程能访问
    public static void method2(StringBuilder stringBuilder) {
        stringBuilder.append(1);
        stringBuilder.append(2);
        stringBuilder.append(3);
        System.out.println(stringBuilder.toString());
    }
}
```
### 方法的返回值
```java
public class ThreadSafety {
    public static void main(String[] args) {
        new Thread(() -> {
            StringBuilder stringBuilder = method3();
            stringBuilder.append(4);
            stringBuilder.append(5);
            stringBuilder.append(6);
            System.out.println(stringBuilder.toString()); // 123456
        }, "ThreadA").start();
    }

    // 有线程安全问题，stringBuilder是方法的返回值，返回值是共享的，其他线程能访问
    public static StringBuilder method3() {
        StringBuilder stringBuilder = new StringBuilder();
        stringBuilder.append(1);
        stringBuilder.append(2);
        stringBuilder.append(3);
        return stringBuilder;
    }
}
```
### 类的成员变量
```java
public class ThreadSafety {
    public static void main(String[] args) {
        new Thread(() -> {
            num = 5;
            method4();  // 678
        }, "ThreadA").start();
    }

    private static int num = 0;

    // 有线程安全问题，静态变量num不是局部变量，是共享的
    public static void method4() {
        StringBuilder stringBuilder = new StringBuilder();
        for (int i = 0; i < 3; i++) {
            num++;
            stringBuilder.append(num);
        }
        System.out.println(stringBuilder.toString());
    }
}
```
## 栈内存溢出问题
### 栈帧过多导致栈内存溢出
- 因为栈内存的大小由操作系统的默认栈内存大小决定，是固定的，而栈帧太多，会导致栈内存溢出
  - 例如递归方法，没有设置正确的结束条件或者没有写递归出口
- 如何解决
```java
public class OutOfMemory {
    private static int count;

    public static void main(String[] args) {
        try {
            method1();
        } catch (Throwable e) {
            e.printStackTrace();  // 报错：无限递归-栈内存溢出：Infinite recursion(java.lang.StackOverflowError)
            System.out.println(count);
        }
    }

    public static void method1() {
        count++;
        method1();
    }
}
// 如何设置栈内存：
// idea-启动类-Edit Configurations-VM options-设置：-Xss256k
```
#### 场景应用
- 递归场景：
  - 两个类循环引用问题，导致将java对象解析到json字符串的过程中，出现栈内存溢出问题
  - 解决：在json转换时，打破循环引用，例如在一方进行中断
### 栈帧过大导致栈内存溢出
- 场景不多
## 线程运行诊断
### cpu占用过多
- linux中
  - 先用`top`定位哪个进程对cpu的占用过高
  - 再用`ps H pid,tid,%cpu | grep 进程id`打印进程id、十进制的线程id、cpu占用比
  - 再用jdk的`jstack 进程id`打印该进程的所有Java线程，其中线程编号时16进制的
  - 十进制线程id转为十六进制的线程id，找到`jstack`中对应的线程，该线程就是占用了cpu较高，找到对应的Java代码行数，该行Java代码存在问题
### 程序运行时间都没有结果
- 有可能时出现了死锁问题
  - 解决
    - `nohup java Java程序`得到进程号
    - 再用jdk的`jstack 进程id`打印该进程的所有Java线程，若出现Found one Java-level deadlock则说明存在死锁问题
    - 在打印的信息中找到对应的Java代码行数，该行Java代码存在问题