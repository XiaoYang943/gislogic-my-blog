---
title: JVM-垃圾回收-回收算法
article: false
category:
  - Java
  - JVM(jdk1.8)
---
## 标记清除算法
1. 标记：标记哪些对象可以是垃圾
2. 清除：把垃圾释放，即把该对象占用内存的起始结束地址存入空闲地址列表，下次分配新对象的内存时，就可以使用空闲地址列表进行内存分配
- 特点
  - 优点：速度快，只需要记录占用内存的起始结束地址
  - 缺点：容易产生内存碎片(内存空间不连续)，没有把空闲的内存空间进一步的整理
    - 例如：如果要给一个大数组分配连续的空间，不能分批存入内存碎片
![标记清除算法](https://blog-image-9943.oss-cn-beijing.aliyuncs.com/202308102030801.png)
## 标记整理算法
1. 标记：同上
2. 整理：把可用的内存向前移动整理，使内存紧凑
- 特点
  - 优点：避免了内存碎片问题
  - 缺点：速度慢，由于整理过程涉及到对象的移动操作，这些对象的内存地址变化了，这些对象被引用时，引用地址也要发生变化
![标记整理算法](https://blog-image-9943.oss-cn-beijing.aliyuncs.com/202308102035288.png)
## 复制算法
- 把内存区划分成大小相等的两块区域，分别是FROM和TO，TO区域一开始时使空闲的
1. 标记：同上
2. 复制：把FROM上存活的对象复制到TO区域，同时完成碎片整理操作，复制完成后，FROM区域剩下的都是垃圾，全部释放。然后交换FROM和TO
- 特点
  - 优点：不会产生碎片
  - 缺点：占用双倍内存空间
![复制算法](https://blog-image-9943.oss-cn-beijing.aliyuncs.com/202308102040814.png)
![复制算法](https://blog-image-9943.oss-cn-beijing.aliyuncs.com/202308102042237.png)
## 分代回收(重点)
- 针对对象生命周期的不同特点，进行不同的垃圾回收策略
  - 老年代的垃圾回收很久进行一次(旧电脑旧手机，还有细微用处的)
  - 新生代的垃圾回收很频繁(每天产生的残羹剩饭，没有用处的)
- 把堆内存区域划分成两块
  - 新生代：用完就可以释放的对象存入新生代
    - 伊甸园
    - 幸存区FROM
    - 幸存区TO
  - 老年代：长时间使用的对象存入老年代
![堆内存区域划分成两块](https://blog-image-9943.oss-cn-beijing.aliyuncs.com/202308102045289.png)
- 工作机制：
  - 当创建一个新对象时，默认存入伊甸园...
  - 当伊甸园满了之后，触发第一次新生代的垃圾回收(Minor GC)
    - 采用可达性分析算法，标记，伊甸园中的对象初始年龄为0
    - 发生一次世界停顿(Stop The World)，暂停其他的用户线程(因为复制时地址发生改变，防止多线程地址引用错误)，让垃圾回收线程工作
    - 垃圾回收线程中，采用复制算法，把伊甸园中存活的对象复制到幸存区TO中，且让对象年龄+1
    - 垃圾回收线程中，由垃圾回收线程完成垃圾回收，把伊甸园中失活的对象进行释放
    - 垃圾回收线程中，交换幸存区FROM和TO的位置
    - 继续其他用户线程
  - 此时伊甸园内存充足，继续...
  - 当伊甸园满了之后，触发第二次新生代的垃圾回收(Minor GC)
    - 采用可达性分析算法，标记，伊甸园中的对象初始年龄为0
    - 发生一次世界停顿(Stop The World)，暂停其他的用户线程(因为复制时地址发生改变，防止多线程地址引用错误)，让垃圾回收线程工作
    - 垃圾回收线程中，采用复制算法，把伊甸园中存活的对象复制到幸存区TO中，且让对象年龄+1，**且把幸存区FROM中的继续幸存下来的对象年龄+1**
    - 垃圾回收线程中，垃圾回收，把伊甸园中失活的对象**和幸存区FROM中失活的对象**进行释放
    - 垃圾回收线程中，交换幸存区FROM和TO的位置
    - 继续其他用户线程
  - ...
  - 当幸存区中对象的年龄超出阈值(15)，说明该对象在程序中比较重要，经常使用，则将其晋升到老年代中。或者新生代内存紧张时，也会将其提前晋升到老年代中。
  - ...
  - 当新生代和老年代中都满了之后，触发一次老年代的垃圾回收(Full GC)，把新生代和老年代都清理
- 最大年龄(寿命)为15
  - 年龄保存在每个对象的对象头中，存寿命的部分是4bit，即最大情况是1111，转换成十进制即15