---
title: JUC-创建线程-继承Thread类
article: false
category:
  - Java
  - JUC
---
## JUC-创建线程-继承Thread类
```java
public static void main(String[] args) {
    Thread threadA = new Thread(() -> { // 创建一个 用户线程
        System.out.println(Thread.currentThread().getName() + "线程是（false为用户线程，true为守护线程）：" + Thread.currentThread().isDaemon());
        while (true) {
            //System.out.println("主线程结束了，用户线程还在运行，jvm是存活状态");
        }
    }, "threadA");
    threadA.start();    // 运行该 用户线程
    System.out.println(Thread.currentThread().getName() + " 主线程结束了");
}
```
- 结果
```
main 主线程结束了
threadA线程是（false为用户线程，true为守护线程）：false

主线程结束了，用户线程还在运行，jvm是存活状态
...
```

```java
public static void main(String[] args) {
    Thread threadA = new Thread(() -> { // 创建一个 用户线程
        System.out.println(Thread.currentThread().getName() + "线程是（false为用户线程，true为守护线程）：" + Thread.currentThread().isDaemon());
        while (true) {
            System.out.println("主线程结束了，主线程中没有用户线程，都是守护线程，jvm是结束状态");
        }
    }, "threadA");
    threadA.setDaemon(true);    // 设置为 守护线程
    System.out.println(Thread.currentThread().getName() + "线程是（false为用户线程，true为守护线程）：" + Thread.currentThread().isDaemon());
    threadA.start();    // 运行该 守护线程
    System.out.println(Thread.currentThread().getName() + " 主线程结束了");
}
```
- 结果
```
main线程是（false为用户线程，true为守护线程）：false
main 主线程结束了
threadA线程是（false为用户线程，true为守护线程）：true
主线程结束了，主线程中没有用户线程，都是守护线程，jvm是结束状态
...
Process finished with exit code 0
```

