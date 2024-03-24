---
title: JVM-内存结构-方法区
article: false
category:
  - Java
  - JVM(jdk1.8)
---
## 方法区(线程共享)
- 方法区(Method Area)，也叫元空间(Metaspace)，包含类、类加载器、运行时常量池等
- JVM的方法区在jdk1.8及之后的版本中，不被JVM内存结构所管理，而是被移除到**本地操作系统的物理内存中**，内存溢出的情况较少
- JVM的串池(StringTable)在jdk1.8及之后的版本中，不被JVM内存结构所管理，而是被移除到**JVM的堆内存中**
## 方法区的内存溢出
```java
// 因为jdk1.8及以后的版本，方法区在操作系统的物理内存中，为了演示内存溢出，修改参数：-XX:MaxMetaspaceSize=8m
// java.lang.OutOfMemoryError: Metaspace
public class OutOfMemory2 extends ClassLoader { // ClassLoader 加载类的二进制字节码
    public static void main(String[] args) {
        int j = 0;
        try {
            OutOfMemory2 test = new OutOfMemory2();
            for (int i = 0; i < 10000; i++, j++) {  // 加载1w个新的类
                // ClassWriter 作用是生成类的二进制字节码
                ClassWriter cw = new ClassWriter(0);
                // 版本号， public， 类名, 包名, 父类， 接口
                cw.visit(Opcodes.V1_8, Opcodes.ACC_PUBLIC, "Class" + i, null, "java/lang/Object", null);
                // 返回 byte[]
                byte[] code = cw.toByteArray();
                // 执行了类的加载
                test.defineClass("Class" + i, code, 0, code.length); // Class 对象
            }
        } finally {
            System.out.println(j);
        }
    }
}
```
## 方法区的运行时常量池
### 常量池（Constant Pool）
- 常量池就是一张表，JVM指令根据这张常量表找到要执行的类名、方法名、参数类型、字面量等信息
- 编译成的二进制字节码的组成
  - 类的基本信息
  - 类的常量池
  - 类的方法定义(包含JVM指令)
- 使用`javap -v xxx.class`反编译字节码，打印详细信息
- 解释器解释JVM指令时，拿到指令中的编号，去常量池的表中查对应的常量，再去解释
### 运行时常量池
- 常量池时*.class文件中的，当该类被加载运行，它的常量池信息就会放入运行时常量池，并把里面的编号地址变为真实的内存地址
## StringTable
- 串池(StringTable)
### 特点
- 串池中的字符串对象具有唯一性
- 常量池中的字符串仅是符号，第一次用到时才变为对象
- 利用串池的机制，来避免重复创建字符串对象
- 字符串变量拼接的原理是 StringBuilder （1.8）
- 字符串常量拼接的原理是编译期优化
- 可以使用 intern 方法，主动将串池中还没有的字符串对象放入串池
  - 1.8 将这个字符串对象尝试放入串池，如果有则并不会放入，如果没有则放入串池，会把串池中的对象返回
  - 1.6 将这个字符串对象尝试放入串池，如果有则并不会放入，如果没有会把此对象复制一份， 放入串池，会把串池中的对象返回
### 字符串拼接原理
```java
// StringTable [ "a", "b" ,"ab" ]  hashtable 结构，不能扩容
// 常量池中的信息，都会被加载到运行时常量池中， 这时 a b ab 都是常量池中的符号，还没有变为 java 字符串对象
// 堆中的字符串对象和串池中的不同，但是值是相同的
public static void main(String[] args) {
    // 先build-recompile编译，再javap -v 反编译。一行行执行，遇到一个串池中没有的就加入(字符串的延迟加载)
    String s1 = "a"; // ldc #2 会把 a 符号变为 "a" 字符串对象，在串池StringTable中查找是否有"a" 字符串对象,若没有,则放入，若有，则使用它
    String s2 = "b";    // ldc #3 会把 b 符号变为 "b" 字符串对象，在串池StringTable中查找是否有"b" 字符串对象,若没有,则放入，若有，则使用它
    String s3 = "ab";   // ldc #4 会把 ab 符号变为 "ab" 字符串对象，在串池StringTable中查找是否有"ab" 字符串对象,若没有,则放入，若有，则使用它

    String s4 = s1 + s2; // 因为s1和s2是变量，在运行期间，用StringBuilder动态拼接，new StringBuilder().append("a").append("b").toString()  new String("ab")存入s4变量
    String s5 = "a" + "b";  // 和String s3 = "ab"一样，都是到串池中找值为ab的符号，此时因为已经有了，所以直接使用，而不是重新创建。是javac在编译期间的优化，已经确定了，与String s4 = s1 + s2不同，s1和s2是变量，运行时引用的值有可能修改

    System.out.println(s3 == s4);   // false，因为s3是串池中的变量，而s4是new出来的，是存入堆的
    System.out.println(s3 == s5);   // true，是串池中同一个变量，s3在本例中是创建出来的，s5在本例中是沿用s3的
}
```
### intern(jdk1.8)
```java
//  ["ab", "a", "b"]
public static void main(String[] args) {
    String x = "ab";
    String s = new String("a") + new String("b");

    // 堆  new String("a")   new String("b")  new String("ab")(我是StringBuilder拼接出来的，存到堆中)
    String s2 = s.intern(); // intern 将这个字符串对象尝试放入串池，如果有则并不会放入，如果没有则放入串池， 并把串池中的对象返回

    System.out.println( s2 == x);   // true,s2是串池中的ab，x是串池中的ab
    System.out.println( s == x );   // false,s是堆中的ab，x是串池中的ab
}
```
```java
//  ["a", "b","ab"]
public static void main(String[] args) {
    String s = new String("a") + new String("b");

    // 堆  new String("a")   new String("b")  new String("ab")(我是StringBuilder拼接出来的，存到堆中)
    String s2 = s.intern(); // intern 将这个字符串对象尝试放入串池，如果有则并不会放入，如果没有则放入串池， 并把串池中的该对象返回

    System.out.println( s2 == "ab");   // true,s2是串池中的ab，值和"ab"相同
    System.out.println( s == "ab");   // true，s是堆中的ab，值和"ab"相同
}
```
### 垃圾回收
- 当内存空间不足时，StringTable中没有被引用的字符串常量会被垃圾回收
### 性能调优
#### 调整哈希表的桶个数
- StringTable底层时哈希表，即数组中是链表。调优主要是调整哈希表的桶的个数
- 哈希表的性能与其大小相关
  - 若哈希表的桶的个数较多，则元素较分散，哈希碰撞几率较低，查找速度较快
  - 若哈希表的桶的个数较少，哈希碰撞几率较搞，链表长度较长，查找速度较慢
```java
/**
 * 演示串池大小对性能的影响
 * 垃圾回收只有当内存紧张时才会出发，所以调整虚拟机参数，演示效果
 * -Xms500m
 * -Xmx500m
 * -XX:+PrintStringTableStatistics 打印串池统计信息
 * -XX:StringTableSize=200000 串池桶个数
 */
/*
-XX:+PrintStringTableStatistics 打印串池统计信息
* Number of buckets 桶个数
 * */
public class Demo1_24 {

    public static void main(String[] args) throws IOException {
        // 桶个数越小，花费时间越长，因为每往串池中放一个字符串之前，都要在哈希表中查看是否有这个字符串 
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(new FileInputStream("linux.words"), "utf-8"))) {  // linux的字典，约48万行，200000个桶。48万个单词，分散在20w大小的桶中，平均每个桶的链表的长度两个单词左右，所以效率快
            String line = null;
            long start = System.nanoTime();
            while (true) {
                line = reader.readLine();
                if (line == null) {
                    break;
                }
                line.intern();  // 入池
            }
            System.out.println("cost:" + (System.nanoTime() - start) / 1000000);    // 毫秒
        }


    }
}
```
#### intern
- 当有大量字符串且大量重复时，使用intern将重复的字符串不入池，大大减少了堆内存使用
```java
/**
 * 演示 intern 减少内存占用，可以使用Java VisualVM图形界面和System.in.read()方法，演示内存情况
 * -XX:StringTableSize=200000 -XX:+PrintStringTableStatistics
 * -Xsx500m -Xmx500m -XX:+PrintStringTableStatistics -XX:StringTableSize=200000
 */
public class Demo1_25 {

    public static void main(String[] args) throws IOException {

        List<String> address = new ArrayList<>();
        System.in.read();
        for (int i = 0; i < 10; i++) {  // 重复存字符串
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(new FileInputStream("linux.words"), "utf-8"))) {
                String line = null;
                long start = System.nanoTime();
                while (true) {
                    line = reader.readLine();
                    if(line == null) {
                        break;
                    }
                    address.add(line);
                    //address.add(line.intern());
                }
                System.out.println("cost:" +(System.nanoTime()-start)/1000000);
            }
        }
        System.in.read();
    }
}
```
## 直接内存
- 直接内存(Direct Memory)不属于JVM的内存管理，而是属于操作系统内存
- 常见于 NIO 操作时，用于数据缓冲区内存，例如ByteBuffer
- 分配回收成本较高，但读写性能比IO高
- 不受 JVM 内存回收管理
### 大文件读写效率高的原理
- Java本身不具备磁盘读写能力，必须要调用本地方法。即CPU从用户态(Java)切换到内核态(System),由本地方法读取磁盘文件内容，在操作系统内存中划分一块系统缓冲区，磁盘的内容就先分次读到系统缓冲区中，但是该系统缓冲区Java不能直接操作，所以Java在JVM堆内存中划分一块Java缓冲区，然后Java再把系统缓冲区中的内容读到Java缓冲区，再调用输出流的读写。但是此时出现问题，有两个缓冲区，数据要存两份，效率低。直接内存是在操作系统中划分出一块缓冲区，该缓冲区Java代码能直接访问，提高效率
### 直接内存溢出
```java
public class Demo1_10 {
    static int _100Mb = 1024 * 1024 * 100;
    public static void main(String[] args) {
        List<ByteBuffer> list = new ArrayList<>();
        int i = 0;
        try {
            while (true) {
                ByteBuffer byteBuffer = ByteBuffer.allocateDirect(_100Mb);  // OutOfMemoryError: Direct buffer memory
                list.add(byteBuffer);
                i++;
            }
        } finally {
            System.out.println(i);
        }
    }
}
```
### 直接内存分配和回收原理
```java
public class Demo1_26 {
    static int _1Gb = 1024 * 1024 * 1024;

    /*
     * -XX:+DisableExplicitGC 禁用显式的GC回收 Full GC，即使System.gc()无效，而该 ByteBuffer 直接内存只有等到真正的垃圾回收时，才会被回收。所以直接内存的释放推荐用unsafe手动释放
     */
    public static void main(String[] args) throws IOException {
        ByteBuffer byteBuffer = ByteBuffer.allocateDirect(_1Gb);
        System.out.println("分配完毕...");
        System.in.read();   // 查看任务管理器
        System.out.println("开始释放...");
        byteBuffer = null;
        System.gc(); // 查看任务管理器，发现直接内存被释放了
        System.in.read();
    }
}
```
- 使用了 jdk底层的 Unsafe 对象完成直接内存的分配回收，并且回收需要主动调用 freeMemory 方法
- ByteBuffer 的实现类内部，使用了 Cleaner （虚引用）来监测 ByteBuffer 对象，一旦 ByteBuffer 对象被垃圾回收，那么就会由 ReferenceHandler 线程通过 Cleaner 的 clean 方法调 用 freeMemory 来释放直接内存

```java
/**
 * 直接内存分配的底层原理：Unsafe
 */
public class Demo1_27 {
    static int _1Gb = 1024 * 1024 * 1024;

    public static void main(String[] args) throws IOException {
        Unsafe unsafe = getUnsafe();
        // 分配内存
        long base = unsafe.allocateMemory(_1Gb);
        unsafe.setMemory(base, _1Gb, (byte) 0);
        System.in.read();

        // 释放内存
        unsafe.freeMemory(base);
        System.in.read();
    }

    public static Unsafe getUnsafe() {
        try {
            Field f = Unsafe.class.getDeclaredField("theUnsafe");
            f.setAccessible(true);
            Unsafe unsafe = (Unsafe) f.get(null);
            return unsafe;
        } catch (NoSuchFieldException | IllegalAccessException e) {
            throw new RuntimeException(e);
        }
    }
}
```