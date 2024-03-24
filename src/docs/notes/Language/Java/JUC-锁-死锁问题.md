---
title: JUC-锁-死锁问题
article: false
category:
  - Java
  - JUC
---
## 死锁问题
### 发现问题
- 两个或者两个以上的线程在执行的过程中，因为争夺资源而造成的互相等待的现象，如果没有外部的干涉，无法继续执行
    - 即线程A持有锁A，线程B持有锁B，此时线程A想要获取锁B，线程B想要获取锁A，出现死锁现象，程序没有停止
      - 但是程序没有停止有多种情况（比如死循环等），需要验证代码是否出现了死锁
```java
public class DeadLock {
    static Object lockA = new Object();
    static Object lockB = new Object();

    public static void main(String[] args) {
        new Thread(() -> {
            synchronized (lockA) {
                System.out.println(Thread.currentThread().getName() + "持有锁A，试图获取锁B...");

                try {
                    TimeUnit.SECONDS.sleep(1);  // 因为创建线程是不确定的，加sleep，减少变量，关注主要问题
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }

                synchronized (lockB) {
                    System.out.println(Thread.currentThread().getName() + "获取到锁B");
                }
            }
        }, "threadA").start();

        new Thread(() -> {
            synchronized (lockB) {
                System.out.println(Thread.currentThread().getName() + "持有锁B，试图获取锁A...");

                try {
                    TimeUnit.SECONDS.sleep(1);  // 因为创建线程是不确定的，加sleep，减少变量，关注主要问题
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }

                synchronized (lockA) {
                    System.out.println(Thread.currentThread().getName() + "获取到锁A");
                }
            }
        }, "threadB").start();
    }
}
```
- 结果
```
threadA持有锁A，试图获取锁B...
threadB持有锁B，试图获取锁A...

注意：程序没有结束，一直在运行中...
```
### 如何验证代码是否出现了死锁
- jps命令 + jstack命令(是jvm自带的堆栈跟踪工具)
  - jdk-bin-jps.exe，将bin配置到环境变量中，terminal中输入 jps -l
  - 然后拿到可能发生死锁的进程号 ，输入 jstack 进程号,结果为： Found 1 deadlock.证明程序有死锁问题
### 产生死锁的原因
1. 系统资源不足
2. 进行运行推进顺序不合适
3. 资源分配不当