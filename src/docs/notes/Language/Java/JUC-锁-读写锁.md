---
title: JUC-锁-读写锁
article: false
category:
  - Java
  - JUC
---
## 读写锁
### 发现问题
- 对共享资源有读和写的操作，且写操作没有读操作那么频繁。在没有写操作的时候，多个线程同时读一个资源没有任何问题，所以应该允许多个线程同时读取共享资源；但是如果一个线程想去写这些共享资源，就不应该允许其他线程对该资源进行读和写的操作了。
```java
// 资源类
class MyCache {
    private volatile Map<String, Object> map = new HashMap<>();

    public void put(String key, Object value) throws InterruptedException {
        try {
            System.out.println("线程" + Thread.currentThread().getName() + " 正在写操作" + key);
            TimeUnit.MICROSECONDS.sleep(300); // 写数据，暂停一会
            map.put(key, value);
            System.out.println("线程" + Thread.currentThread().getName() + " 写完了" + key);
        } finally {
        }
    }


    public Object get(String key) throws InterruptedException {
        Object result = null;
        try {
            System.out.println("线程" + Thread.currentThread().getName() + " 正在读操作" + key);
            TimeUnit.MICROSECONDS.sleep(300); // 写数据，暂停一会
            result = map.get(key);
            System.out.println("线程" + Thread.currentThread().getName() + " 取完了" + key);
        } finally {
        }
        return result;
    }


}

public class MyReadWriteLock {
    public static void main(String[] args) throws InterruptedException {
        MyCache myCache = new MyCache();

        // 写
        for (int i = 1; i <= 5; i++) {
            final int num = i;
            new Thread(() -> {
                try {
                    myCache.put(num + "", num + "");
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
            }, String.valueOf(i)).start();
        }

        TimeUnit.MICROSECONDS.sleep(300);

        // 读
        for (int i = 1; i <= 5; i++) {
            final int num = i;
            new Thread(() -> {
                try {
                    myCache.get(num + "");
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
            }, String.valueOf(i)).start();
        }
    }
}
```
- 结果
```
线程2 正在写操作2
线程4 正在写操作4
线程5 正在写操作5
线程3 正在写操作3
线程1 正在写操作1
线程2 写完了2
线程5 写完了5
线程1 正在读操作1         -------> 此时1还没有写完，就执行了读操作，出现问题
线程3 写完了3
线程1 写完了1             -------> 此时1才写完
线程4 写完了4
线程5 正在读操作5
线程1 取完了1
线程4 正在读操作4
线程2 正在读操作2
线程3 正在读操作3
线程5 取完了5
线程4 取完了4
线程2 取完了2
线程3 取完了3

Process finished with exit code 0

```
### 解决问题
- JUC提供了读写锁`ReentrantReadWriteLock`，它表示两个锁：
  - 一个是读操作相关的锁，称为共享锁；
  - 一个是写相关的锁，称为排他锁(独占锁)
```java
// 资源类
class MyCache {
    // 创建读写锁对象
    private ReadWriteLock readWriteLock = new ReentrantReadWriteLock();

    // volatile 不断往里放内容，且不断往外取内容
    private volatile Map<String, Object> map = new HashMap<>();

    public void put(String key, Object value) throws InterruptedException {
        readWriteLock.writeLock().lock();   // 上写锁
        try {
            System.out.println("线程" + Thread.currentThread().getName() + " 正在写操作" + key);
            TimeUnit.MICROSECONDS.sleep(300); // 写数据，暂停一会
            map.put(key, value);
            System.out.println("线程" + Thread.currentThread().getName() + " 写完了" + key);
        } finally {
            readWriteLock.writeLock().unlock(); // 解锁
        }
    }


    public Object get(String key) throws InterruptedException {
        readWriteLock.readLock().lock();    // 上读锁
        Object result = null;
        try {
            System.out.println("线程" + Thread.currentThread().getName() + " 正在读操作" + key);
            TimeUnit.MICROSECONDS.sleep(300); // 写数据，暂停一会
            result = map.get(key);
            System.out.println("线程" + Thread.currentThread().getName() + " 取完了" + key);
        } finally {
            readWriteLock.readLock().unlock();  // 解锁
        }

        return result;
    }


}

public class MyReadWriteLock {
    public static void main(String[] args) throws InterruptedException {
        MyCache myCache = new MyCache();

        // 写
        for (int i = 1; i <= 5; i++) {
            final int num = i;
            new Thread(() -> {
                try {
                    myCache.put(num + "", num + "");
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
            }, String.valueOf(i)).start();
        }

        TimeUnit.MICROSECONDS.sleep(300);

        // 读
        for (int i = 1; i <= 5; i++) {
            final int num = i;
            new Thread(() -> {
                try {
                    myCache.get(num + "");
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
            }, String.valueOf(i)).start();
        }
    }
}
```
- 结果
```
线程3 正在写操作3
线程3 写完了3
线程2 正在写操作2
线程2 写完了2
线程5 正在写操作5
线程5 写完了5
线程4 正在写操作4
线程4 写完了4
线程1 正在写操作1
线程1 写完了1
线程1 正在读操作1       ------> 想要读之前，该资源也写完了，正确
线程2 正在读操作2
线程3 正在读操作3
线程5 正在读操作5
线程4 正在读操作4
线程3 取完了3
线程4 取完了4
线程2 取完了2
线程1 取完了1
线程5 取完了5

Process finished with exit code 0

```
### 线程进入锁的前提条件
- 线程进入读锁的前提条件
  - 没有其他线程的写锁
  - 没有写请求, 或者有写请求，但调用线程和持有锁的线程是同一个（可重入锁）
- 线程进入写锁的前提条件
  - 没有其他线程的读锁
  - 没有其他线程的写锁
### 特点
- 公平选择性：支持非公平（默认）和公平的锁获取方式，吞吐量还是非公平优于公平。
- 重进入：读锁和写锁都支持线程重进入。
- 锁降级：遵循获取写锁、获取读锁再释放写锁的次序，写锁能够降级成为读锁。
## 读写锁的演变
1. 无锁，多线程抢占资源，乱
2. 独占锁，使用 synchroinized 或 ReentrantLock ，这两种锁都是独占的，即每次只能一个操作，读读操作只能有一个线程(不能共享)，读写操作只能有一个线程，写写操作只能有一个线程
3. 读写锁：读读操作可以共享，提升操作性能，同时多人进行读操作。但是写写操作只能一个线程。缺点：造成锁饥饿，一直读，写操作执行不了，只有读完成后，才能写(锁降级的过程)
  - 锁降级：
    - 将写入锁降级(jdk8)为读锁(写操作的权限大于读操作)
    - 获取写锁，获取读锁，释放写锁，释放读锁

## 小结
- 在线程持有读锁的情况下，该线程不能取得写锁（因为获取写锁的时候，如果发现当前的读锁被占用，就马上获取失败，不管读锁是不是被当前线程持有）。
- 在线程持有写锁的情况下，该线程可以继续获取读锁（获取读锁时如果发现写锁被占用，只有写锁没有被当前线程占用的情况才会获取失败）
- 原因：
  - 当线程获取读锁的时候，可能有其他线程同时也在持有读锁，因此不能把 获取读锁的线程“升级”为写锁
  - 而对于获得写锁的线程，它一定独占了读写锁，因此可以继续让它获取读锁，当它同时获取了写锁和读锁后，还可以先释放写锁继续持有读锁，这样一个写锁就“降级”为了读锁。