---
title: JVM-垃圾回收-五种引用
article: false
category:
  - Java
  - JVM(jdk1.8)
---
## JVM的五种引用
### 强引用
- new一个对象，把该对象通过等号赋值给变量，该变量就强引用了该对象
- 特点：强引用的对象不能被垃圾回收
  - 若把GC root对象和普通对象的引用关系比作一棵树，根节点的直系子节点(和root直接相连)就是强引用的
#### 应用
```java
/**
 * 强引用导致内存溢出问题
 * -Xmx20m -XX:+PrintGCDetails -verbose:gc
 */
public class Demo2_3 {

    private static final int _4MB = 4 * 1024 * 1024;

    public static void main(String[] args) throws IOException {
        ArrayList<Byte[]> list = new ArrayList<>();
        for (int i = 0; i < 5; i++) {
            // 这里是List强引用byte数组，list --> byte[]
            // 比如说强引用了很多高清大图资源，可以在内存不够时且不影响业务的情况下释放掉，二次用到时再重新读取
            list.add(new Byte[_4MB]);   // java.lang.OutOfMemoryError: Java heap space
        }
    }
}
```
### 软引用
- 特点：软引用的对象在垃圾回收时，内存不够的情况下，才会被回收
  - 若把GC root对象和普通对象的引用关系比作一棵树，根节点的叶子节点(和root间接相连)就是软引用的
```java
/**
 * 软引用解决内存溢出问题
 * -Xmx20m -XX:+PrintGCDetails -verbose:gc
 */
public class Demo2_3 {

    private static final int _4MB = 4 * 1024 * 1024;

    public static void main(String[] args) throws IOException {
        List<SoftReference<byte[]>> list = new ArrayList<>();
        for (int i = 0; i < 5; i++) {
            SoftReference<byte[]> ref = new SoftReference<>(new byte[_4MB]);
            System.out.println(ref.get());
            list.add(ref);  // list --> SoftReference --> byte[]
            System.out.println(list.size());

        }
        System.out.println("循环结束：" + list.size());
        for (SoftReference<byte[]> ref : list) {
            /**
             * null
                null
                null
                null
                [B@4b67cf4d
             */
            System.out.println(ref.get());
        }
    }
}
```
```java
// 回收软引用：四个null

/**
 * 演示软引用, 配合引用队列 -Xmx20m
 */
public class Demo2_4 {
    private static final int _4MB = 4 * 1024 * 1024;

    public static void main(String[] args) {
        List<SoftReference<byte[]>> list = new ArrayList<>();

        // 引用队列
        ReferenceQueue<byte[]> queue = new ReferenceQueue<>();

        for (int i = 0; i < 5; i++) {
            // 关联软引用对象和引用队列， 当软引用所关联的 byte[]被回收时，软引用自己会加入到 queue 中去
            SoftReference<byte[]> ref = new SoftReference<>(new byte[_4MB], queue);
            System.out.println(ref.get());
            list.add(ref);
            System.out.println(list.size());
        }

        // 从队列中获取无用的 软引用对象，并移除
        Reference<? extends byte[]> poll = queue.poll();
        while( poll != null) {
            list.remove(poll);
            poll = queue.poll();
        }

        System.out.println("===========================");
        for (SoftReference<byte[]> reference : list) {
            System.out.println(reference.get());
        }

    }
}
/**
 * [B@7f31245a
    1
    [B@6d6f6e28
    2
    [B@135fbaa4
    3
    [B@45ee12a7
    4
    [B@330bedb4
    5
    ===========================
    [B@330bedb4

    Process finished with exit code 0

 */
```
### 弱引用
- 特点：弱引用的对象在垃圾回收时，不管内存是否足够，都会被回收
  - 若把GC root对象和普通对象的引用关系比作一棵树，根节点的叶子节点(和root间接相连)就是弱引用的
```java
/**
 * 演示弱引用
 * -Xmx20m -XX:+PrintGCDetails -verbose:gc
 */
public class Demo2_5 {
    private static final int _4MB = 4 * 1024 * 1024;

    public static void main(String[] args) {
        //  list --> WeakReference --> byte[]
        List<WeakReference<byte[]>> list = new ArrayList<>();
        for (int i = 0; i < 10; i++) {
            WeakReference<byte[]> ref = new WeakReference<>(new byte[_4MB]);
            list.add(ref);
            for (WeakReference<byte[]> w : list) {
                System.out.print(w.get()+" ");
            }
            System.out.println();

        }
        System.out.println("循环结束：" + list.size());
    }
}
```
### 虚引用
- 和直接内存有关，创建ByteBuffer时，就会创建一个名为Cleaner的虚引用对象，ByteBuffer分配一块直接内存，把直接内存地址传递给虚引用对象。
  - 用处：因为ByteBuffer分配的直接内存没有被Java的垃圾回收所管理，当ByteBuffer没有强引用时，被回收后，直接内存也得回收，所以将虚引用对象进入引用队列
    - 引用队列如何处理虚引用中存储的直接内存的地址：有一个线程定时地遍历引用队列，若有新入队的虚引用对象，则调用unsafe对象，释放该直接内存，防止直接内存的内存泄漏
### 终结器引用
- 因为所有Java对象都继承自Object父类，Object类中有个finallize终结方法，当对象重写了终结方法，且没有强引用时，可以被当作垃圾进行回收，终结器引用加入引用队列，再由 Finalizer 线程定时查找，若有新的入队，则调用它的终结方法，第二次GC时回收该对象
  - 但是不推荐用finallize方法释放资源
    - Finalizer线程优先级较低，可能会让垃圾存活很久
    - 第一次GC，终结器引用加入引用队列，第二次GC时才回收该对象
### 引用的优先级
- 强引用的优先级高于其他引用
  - 若某个A对象被两个GC root对象所引用，其中一个GC root对象与A对象是强引用的，而另一个GC root对象与A对象是软弱引用的，则在垃圾回收时，不管内存是否足够。对象A都不会被回收
## 引用队列
- 软弱引用可以和引用队列搭配使用
  - 软引用和弱引用自身也是个对象，也占内存，当软弱引用引用的对象被回收后，如果想把软弱引用本身也回收，则把他们加入到引用队列，再回收
- 虚终引用必须和引用队列搭配使用


    

