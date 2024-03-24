---
title: JUC-辅助类-CyclicBarrier
article: false
category:
  - Java
  - JUC
---
## JUC-辅助类-循环栅栏(CyclicBarrier)
- CyclicBarrier的构造方法第一个参数是目标障碍数，每次执行CyclicBarrier一次障碍数会加一，如果达到了目标障碍数，才会执行cyclicBarrier.await()之后的语句。
```java
// 集齐七颗龙珠即可召唤神龙
public class MyCyclicBarrier {

    private static final int NUMBER = 7;

    public static void main(String[] args) {
        CyclicBarrier cyclicBarrier = new CyclicBarrier(NUMBER, () -> {
            System.out.println("集齐七颗龙珠即可召唤神龙");
        });

        for (int i = 1; i <= 7; i++) {
            new Thread(() -> {
                System.out.println(Thread.currentThread().getName() + " 星龙珠被收集到了");
                try {
                    cyclicBarrier.await();  // 等待
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                } catch (BrokenBarrierException e) {
                    throw new RuntimeException(e);
                }
            }, String.valueOf(i)).start();
        }
    }
}
```
- 结果
```
1 星龙珠被收集到了
2 星龙珠被收集到了
5 星龙珠被收集到了
3 星龙珠被收集到了
4 星龙珠被收集到了
7 星龙珠被收集到了
6 星龙珠被收集到了
集齐七颗龙珠即可召唤神龙

Process finished with exit code 0
```
