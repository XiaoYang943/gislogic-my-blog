---
title: JUC-辅助类-CountDownLatch
article: false
category:
  - Java
  - JUC
---
## JUC-辅助类-减少计数(CountDownLatch)
### 发现问题
```java
// 六个同学陆续离开教室后，班长锁门
public class MyCountDownLatch {

    static CountDownLatch countDownLatch = new CountDownLatch(6);   // 设置初始值

    public static void main(String[] args) throws InterruptedException {
        for (int i = 1; i <= 6; i++) {
            new Thread(() -> {
                System.out.println(Thread.currentThread().getName() + " 离开了教室...");
            }, String.valueOf(i)).start();
        }
        System.out.println(Thread.currentThread().getName() + " 班长锁门走人");
    }
}
```
- 结果可能为：
```
1 离开了教室...
4 离开了教室...
6 离开了教室...
5 离开了教室...
2 离开了教室...
main 班长锁门走人
3 离开了教室...
```
### 解决问题
- CountDownLatch类可以设置一个计数器，然后通过`countDown`方法来进行减1的操作，使用`await`方法等待计数器不大于0，然后继续执行await方法之后的语句。
- 当一个或多个线程调用`await`方法时，这些线程会阻塞
- 其它线程调用`countDown`方法会将计数器减1（调用countDown方法的线程不会阻塞）
- 当计数器的值变为0时，因await方法阻塞的线程会被唤醒，继续执行
```java
// 六个同学陆续离开教室后，班长锁门
public class MyCountDownLatch {

    static CountDownLatch countDownLatch = new CountDownLatch(6);   // 设置初始值

    public static void main(String[] args) throws InterruptedException {
        for (int i = 1; i <= 6; i++) {
            new Thread(() -> {
                System.out.println(Thread.currentThread().getName() + " 离开了教室...");
                countDownLatch.countDown();   // 计数器-1
            }, String.valueOf(i)).start();
        }
        countDownLatch.await();   // 计数器没有变成0，就一直等待。变成0后，await 后的方法才执行
        System.out.println(Thread.currentThread().getName() + " 班长锁门走人");
    }
}
```
- 结果一定是：main线程最后结束，其他线程执行顺序不定
```
1 离开了教室...
4 离开了教室...
6 离开了教室...
5 离开了教室...
2 离开了教室...
3 离开了教室...
main 班长锁门走人

Process finished with exit code 0
```