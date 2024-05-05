---
title: JUC-线程-集合的线程安全问题
article: false
category:
  - Java
  - JUC
---
## 集合的线程安全问题
### ArrayList
#### 发现问题
```java
public static void main(String[] args) {
    java.util.ArrayList<String> list = new java.util.ArrayList<>();

    // 创建多个线程，在多个线程中，向集合中加入、取出元素，这个过程中会出现 并发修改 异常(java.util.ConcurrentModificationException)
    for (int i = 0; i < 30; i++) {
        new Thread(() -> {
            list.add("测试"); // 加入
            System.out.println(list);   // 取出
        }, String.valueOf(i)).start();
    }
}
```
- 问题原因：ArrayList源码的 add 方法没有加 synchronize 关键字，有线程不安全的问题
#### 如何解决
##### Vector
- 使用jdk1的 Vector 接口代替 ArrayList
```java
public static void main(String[] args) {
    Vector<String> list = new Vector<>();
    for (int i = 0; i < 30; i++) {
        new Thread(() -> {
            list.add("测试"); // 加入
            System.out.println(list);   // 取出
        }, String.valueOf(i)).start();
    }
}
```
##### Collections
- 使用 Collections 工具类的 synchronizedList 方法
```java
public static void main(String[] args) {
    List<Object> list = Collections.synchronizedList(new java.util.ArrayList<>());
    for (int i = 0; i < 30; i++) {
        new Thread(() -> {
            list.add("测试"); // 加入
            System.out.println(list);   // 取出
        }, String.valueOf(i)).start();
    }
}
```
##### CopyOnWriteArrayList(推荐)
- 当并发读集合中的内容时，向集合中写内容时使用 JUC 的 CopyOnWhiteArrayList 工具类(写时复制技术)，即读时并发读，写时独立写
  - 原理：写的时候先复制一份大小相同的区域，读的时候读原始的集合，写的时候写到复制出来的区域，写完之后将两块进行合并，再读时读合并后的集合的内容
```java
public static void main(String[] args) {
    CopyOnWriteArrayList<Object> list = new CopyOnWriteArrayList<>();
    for (int i = 0; i < 30; i++) {
        new Thread(() -> {
            list.add("测试"); // 加入
            System.out.println(list);   // 取出
        }, String.valueOf(i)).start();
    }
}
```
### HashSet
- 同理，使用 CopyOnWriteArraySet