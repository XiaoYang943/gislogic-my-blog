---
title: JUC-锁-概述
article: false
category:
  - Java
  - JUC
---
## Synchronized关键字
- synchronized 是Java中的关键字，是一种**同步锁**
- 其修饰的对象有以下几种
  - 修饰一个代码块，被修饰的代码块称为同步语句块，其作用的范围是大括号{}括起来的代码，作用的对象是调用这个代码块的对象
  - 修饰一个方法，被修饰的方法称为同步方法，其作用的范围是整个方法，作用的对象是调用这个方法的对象
    - synchronized并不属于方法定义的一部分，因此，synchronized关键字不能被继承。
    - 如果在父类中的某个方法使用了synchronized关键字，而在子类中覆盖了这个方法，在子类中的这个方法默认情况下并不是同步的，而必须显式地在子类的这个方法中加上synchronized关键字才可以。
    - 还可以在子类方法中调用父类中相应的方法，这样虽然子类中的方法不是同步的，但子类调用了父类的同步方法，因此，子类的方法也就相当于同步了。
  - 修改一个静态的方法，其作用的范围是整个静态方法，作用的对象是这个类的所有对象
  - 修改一个类，其作用的范围是synchronized后面括号括起来的部分，作用的对象是这个类的所有对象。
### 发现问题
- 如果一个代码块被synchronized修饰了，当一个线程A获取了对应的锁，并执行该代码块时，其他线程B便只能一直等待，等待获取线程A释放锁
  - 线程A释放锁只会有两种情况：
    - 线程A执行完了该代码块，然后释放对锁的占有
    - 线程A执行发生异常，此时JVM会让线程自动释放锁
- 发现问题：
  - 如果线程A由于要等待IO或者其他原因(比如调用sleep方法)被阻塞了，但是又没有释放锁，其他线程只能一直等下去，影响程序执行效率
### 解决问题
- 需要锁(Lock)这种机制，不让等待的线程一直无期限地等待下去(比如只等待一定的时间或者能够响应中断)
## 锁(Lock接口)
- 锁是一种机制，能解决线程阻塞问题
- 锁和Synchronized的区别
  - 锁比同步(Synchronized)更灵活
  - Lock是一个类，通过这个类可以实现同步访问；synchronized是Java语言的关键字
  - synchronized不需要手动释放锁，当synchronized修饰的方法执行完之后，系统会自动让线程释放对锁的占用；而Lock则必须要手动释放锁，如果没有主动释放锁，就有可能导致出现死锁现象。
  - Lock可以让等待锁的线程响应中断，而synchronized却不行，使用synchronized时，等待的线程会一直等待下去，不能够响应中断
  - 通过Lock可以知道有没有成功获取锁，而synchronized却无法办到
  - 大量线程同时竞争资源时，Lock性能较高
### 方法
```java
try {
  lock.lock();  // 上锁
  // ...处理任务
} finally {
  lock.unlock();  // 释放锁
}
```
### 可重入锁(ReentrantLock)
- ReentrantLock是唯一实现了Lock接口的类，并且ReentrantLock提供了更多的方法。
### 读写锁(ReadWriteLock)
- ReadWriteLock是一个接口，使用ReentrantReadWriteLock实现，定义了如下两个方法
  - readLock()：获取读锁
  - writeLock()：获取写锁
- 用处：将文件的读写操作分开，分成2个锁来分配给线程，从而使得多个线程可以同时进行读操作，大大提升了读操作的效率
## 等待/通知模式
- 实现方式
  - 关键字synchronized与wait()/notify()这两个方法一起使用可以实现
  - Lock锁的newContition()方法返回Condition对象，Condition类也可以实现
    - await()：使当前线程等待,同时会释放锁,当其他线程调用signal()时,线程会重新获得锁并继续执行。
    - signal()：从当前Condition对象的等待队列中，唤醒一个线程，唤醒的线程尝试获得锁，一旦获得锁成功就继续执行
    - 在调用await()/signal()方法前，也需要线程持有相关的Lock锁，调用await()后线程会释放这个锁
- 两种实现方式的不同点
  - 用notify()通知时，JVM会随机唤醒某个等待的线程，使用Condition类可以进行选择性通知
## 锁的范围和是不是同一把锁的问题
```java
/**
 * @description TODO 锁的范围和是不是同一把锁的问题
 * @author hyy
 */
class Phone {

    public static synchronized void sendSMS() throws Exception {
        //停留4秒
        TimeUnit.SECONDS.sleep(4);
        System.out.println("------SMS");
    }

    public synchronized void sendEmail() throws Exception {
        System.out.println("------Email");
    }

    public void sendHello() {
        System.out.println("------Hello");
    }
}

/**
 * 静态：加 static
 * 同步：加 synchronized
 * 普通方法：public void sendHello
 * 讨论的问题：synchronized 是否用的是同一把锁、锁的范围是什么
 *
 * 1-2对比：方法上加 synchronized 关键字，锁的是当前对象this，线程A调用发SMS(sleep4)的方法结束后，才轮到线程B调用发Email
 * 2-3对比：因为普通方法和锁无关，所以线程B先执行发Hello的普通方法，然后线程A再执行发SMS(sleep4)的方法
 * 4对比：两个对象，不是同一把锁，线程B先执行发Email的同步方法，等待四秒后，线程A再执行发SMS(sleep4)的方法
 * 5-6对比：给方法加static关键字后，锁的是当前类的Class对象(字节码对象)
 * 7-8对比：锁的范围不同，且用的不是同一把锁。发SMS(sleep4)的方法锁的是Class，发Email的方法锁的是当前的this
 *
 * 同一把锁的抽象例子：一栋大楼，锁住大门，楼里面的房间还可以开锁。static 理解为大门的锁，synchronized 理解为房间的锁
 *
 * 总结：java中的每个对象都可以作为锁，具体表现为：
 * 1. 对于普通同步方法，锁是当前实例对象this
 * 2. 对于静态同步方法，锁是当前类的Class对象
 * 3. 对于同步方法块，锁是synchronized括号里配置的对象
 1 一个手机对象，发短信是同步方法，发邮件是同步方法
 ------SMS
 ------Email

 2 一个手机对象，发短信是同步方法(sleep4)，发邮件是同步方法
 四秒后
 ------SMS
 ------Email

 3 一个手机对象，发短信是同步方法(sleep4)，发Hello的是普通方法
 ------Hello
 四秒后
 ------SMS

 4 两个手机对象，第一个手机对象执行：发短信的同步方法(sleep4)。第二个手机对象执行：发邮件的同步方法，
 ------Email
 四秒后
 ------SMS

 5 一个手机对象，发短信是静态同步方法(sleep4)，发邮件是静态同步方法
 四秒后
 ------SMS
 ------Email

 6 两个手机对象，第一个手机对象执行：发短信的静态同步方法(sleep4)。第二个手机对象执行：发邮件的静态普通同步方法，
 四秒后
 ------SMS
 ------Email

 7 一个手机对象，发短信是静态同步方法(sleep4)，发邮件是普通同步方法
 ------Email
 四秒后
 ------SMS

 8 两个手机对象，第一个手机对象执行：发短信的静态同步方法(sleep4)。第二个手机对象执行：发邮件的普通同步方法，
 ------Email
 四秒后
 ------SMS

 */

public class Lock_8 {
    public static void main(String[] args) throws Exception {

        Phone phone = new Phone();
        Phone phone2 = new Phone();

        new Thread(() -> {
            try {
                phone.sendSMS();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }, "threadA").start();

        Thread.sleep(100);  // start 方法什么时候创建不确定,加个 sleep（控制减少变量、使结果唯一）,方便观察问题

        new Thread(() -> {
            try {
                //phone.sendEmail();
                //phone.sendHello();
                phone2.sendEmail();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }, "threadB").start();
    }
}
```