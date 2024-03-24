---
title: JUC-辅助类-Semaphore
article: false
category:
  - Java
  - JUC
---
## JUC-辅助类-信号灯(Semaphore)
- Semaphore的构造方法中传入的第一个参数是最大信号量(可以看成最大线程池)，每个信号量初始化为一个最多只能分发一个许可证。使用acquire方法获得许可证，release方法释放许可
```java
public class MySemaphore {
    // 六辆汽车，停三个停车位
    public static void main(String[] args) {
        Semaphore semaphore = new Semaphore(3);
        for (int i = 1; i <= 6; i++) {
            new Thread(() -> {
                try {
                    semaphore.acquire();    // 占车位
                    System.out.println(Thread.currentThread().getName() + "抢到了车位");

                    TimeUnit.SECONDS.sleep(new Random().nextInt(5));    // 设置停车时间

                    System.out.println(Thread.currentThread().getName() + "-----离开了车位");
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                } finally {
                    semaphore.release();    // 释放
                }
            }, String.valueOf(i)).start();
        }
    }
}
```
- 结果
```
5抢到了车位
6抢到了车位
1抢到了车位
6-----离开了车位
2抢到了车位
1-----离开了车位
3抢到了车位
3-----离开了车位
4抢到了车位
2-----离开了车位
5-----离开了车位
4-----离开了车位

Process finished with exit code 0
```
