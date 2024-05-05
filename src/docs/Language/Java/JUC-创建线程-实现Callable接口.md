---
title: JUC-创建线程-实现Callable接口
article: false
category:
  - Java
  - JUC
---
## JUC-创建线程-实现Callable接口
- 在线程终止时(即Run完成时)，线程有返回值。若无法计算结果，能抛出异常。
```java
class MyThread2 implements Callable {

    // 实现在完成时返回结果的call方法
    @Override
    public Integer call() throws Exception {
        return 200;
    }
}

public class MyCallable {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        // FutureTask
        // Future是主线程跟踪进度以及其他线程的结果的一种方式：
        // Future是保存结果的对象,当call方法完成时，结果存储在主线程已知的对象中，以便主线程可以知道该线程返回的结果

        // FutureTask<Integer> futureTask1 = new FutureTask<>(new MyThread2());

        // lam表达式 简化 FutureTask
        FutureTask<Integer> futureTask2 = new FutureTask<>(() -> {
            System.out.println(Thread.currentThread().getName() + " 创建成功");
            return 200;
        });

        // 创建线程
        new Thread(futureTask2, "threadA").start();

        while (!futureTask2.isDone()) { // 判断任务是否完成
            System.out.println("wait...");
        }
        
        System.out.println(futureTask2.get());  // 获取任务的结果

        System.out.println(Thread.currentThread().getName() + " 结束咧");
    }
}
```
- 结果
```
wait...
...
thread 创建成功
wait...
200
main 结束咧

Process finished with exit code 0
```
### FutureTask的总结
- 在主线程中需要执行比较耗时的操作时，但又不想阻塞主线程时，可以把这些任务交给Future对象在后台完成
  - 当主线程将来需要时，就可以通过Future对象获得后台任务的计算结果或者执行状态
  - 一般FutureTask多用于耗时的计算，主线程可以在完成自己的任务后，再去 获取结果。
  - 仅在计算完成时才能检索结果；如果计算尚未完成，则阻塞 get 方法
  - 一旦计算完成，就不能再重新开始或取消计算
  - get方法而获取结果只有在计算完成时获取，否则会一直阻塞直到任务转入完成状态，然后会返回结果或者抛出异常
  - get只计算一次,因此get方法放到最后
