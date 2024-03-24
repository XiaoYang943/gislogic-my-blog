---
title: JUC-线程-线程间的通信
article: false
category:
  - Java
  - JUC
---
## 线程间的通信
- 线程间通信的模型有两种：共享内存和消息传递
- 线程通信的两个方案
  - synchronized
  - Lock
```java
// 第一步，创建资源类，定义属性和方法
class Share {
    private int number = 0;
    private final Lock lock = new ReentrantLock();
    private final Condition condition = lock.newCondition();
    
    // 加一方法
    public void increase() throws InterruptedException {
        lock.lock();    // 上锁
        try {
            // 第二步：判断 干活 通知
            if (number != 0) {  // 判断
                condition.await();
            }
            number++;   // 干活
            System.out.println(Thread.currentThread().getName() + "::" + number);
            condition.signalAll();  // 通知其他线程，要-1了
        } finally {
            lock.unlock();  // 解锁
        }
    }

    // 减一方法
    public void decrease() throws InterruptedException {
        lock.lock();    // 上锁
        try {
            // 第二步：判断 干活 通知
            if (number != 1) {  // 判断
                condition.await();
            }
            number--;   // 干活
            System.out.println(Thread.currentThread().getName() + "::" + number);
            condition.signalAll();  // 通知其他线程，要+1了
        } finally {
            lock.unlock();  // 解锁
        }
    }
}

/**
 * @description TODO 使用 Lock 接口 实现线程间的通信
 * @author hyy
 */
public class ThreadCommunication {
    // 第三步：创建多个线程，调用资源类的方法
    public static void main(String[] args) {
        Share share = new Share();

        // 创建线程
        new Thread(() -> {
            for (int i = 1; i <= 10; i++) {
                try {
                    share.increase();
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
            }
        }, "threadA").start();

        new Thread(() -> {
            for (int i = 1; i <= 10; i++) {
                try {
                    share.decrease();
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
            }
        }, "threadB").start();
    }
}
```
- 结果
```
threadA::1
threadB::0
threadA::1
threadB::0
threadA::1
threadB::0
...两个线程交替加一减一
```
### 发现问题(虚假唤醒问题)
- 以上 ThreadCommunication 类的main方法中，如果创建四个线程，分别调用+1 -1 +1 -1的方法，结果不对，出现了虚假唤醒问题
  - 因为四个线程都调用 start 方法进行创建，但是谁先创建是不一定的，因为 start 方法的底层 使用 native 关键字修饰
- 问题复现
  - 假设A线程最先被创建，完成了+1操作，释放锁，执行 notifyAll 通知其他线程
  - 此时假设C线程抢到了资源，发现number为1，所以执行 wait,释放锁，执行 notifyAll 通知其他线程
  - 此时假设A线程抢到了资源，发现number为1，所以执行 wait,释放锁，执行 notifyAll 通知其他线程
  - 关键：此时假设C线程抢到了资源，但是C线程再之前已经执行了 wait ，此时被A线程的 notifyAll 方法唤醒 ，被唤醒后，由于是用的**if判断**，所以wait之外的判断逻辑没有执行，继续执行后面的代码(number++)，导致结果变为2，与目标不一致，即出现了虚假唤醒问题
### 如何解决
- 把 if 判断换成 while 循环，不管是否 wait 了，都重新执行 while 中的判断，避免了虚假唤醒问题
## 线程间定制化通信(指定线程的执行顺序)
```java
class ShareResource {
    private int flag = 1;   // 创建标记，用于约定：1：A线程，2：B线程，3：C线程
    private Lock lock = new ReentrantLock();

    private Condition c1 = lock.newCondition();
    private Condition c2 = lock.newCondition();
    private Condition c3 = lock.newCondition();

    public void methodA() {
        lock.lock();    // 上锁
        try {
            while (flag != 1) {
                c1.await();  // 等待
            }
            System.out.println(Thread.currentThread().getName() + ":执行了");
            flag = 2;   // 修改标记
            c2.signal();    // 通知B线程
            System.out.println("通知B线程执行任务...");
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        } finally {
            lock.unlock();  // 解锁
        }
    }

    public void methodB() {
        lock.lock();    // 上锁
        try {
            while (flag != 2) {
                c2.await();  // 等待
            }
            System.out.println(Thread.currentThread().getName() + ":执行了");
            flag = 3;   // 修改标记
            c3.signal();    // 通知C线程
            System.out.println("通知C线程执行任务...");
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        } finally {
            lock.unlock();  // 解锁
        }
    }

    public void methodC() {
        lock.lock();    // 上锁
        try {
            while (flag != 3) {
                c3.await();  // 等待
            }
            System.out.println(Thread.currentThread().getName() + ":执行了");
            flag = 1;   // 修改标记
            c1.signal();    // 通知A线程
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        } finally {
            lock.unlock();  // 解锁
        }
    }


}

/**
 * @description TODO 实现线程的定制化通信(指定线程的执行顺序)
 * @author hyy
 * 开启三个线程，A线程先执行，然后执行B线程，然后执行C线程
 */
public class ThreadCustomizedCommunication {
    public static void main(String[] args) {
        ShareResource shareResource = new ShareResource();
        new Thread(() -> {
            shareResource.methodA();
        }, "threadA").start();

        new Thread(() -> {
            shareResource.methodB();
        }, "threadB").start();

        new Thread(() -> {
            shareResource.methodC();
        }, "threadC").start();
    }
}
```
- 结果
```
threadA:执行了
通知B线程执行任务...
threadB:执行了
通知C线程执行任务...
threadC:执行了
```