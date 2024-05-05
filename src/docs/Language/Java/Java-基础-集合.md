---
title: Java-基础-集合
article: false
category:
  - Java
  - Java基础
---
## 集合
1. 单列集合Collection
   - List接口
     - 有序，可重复
     - 实现类
       - Vector 数组结构，线程安全
       - ArrayList 数组结构，非线程安全
       - LinkedList 链表结构，非线程安全
   - Set接口
     - 无序，唯一
     - 实现类
       - HashSet 哈希表结构
       - TreeSet 红黑树结构
2. 双列集合Map
   - HashTable接口
   - HashMap接口
   - ConcurrentHashMap接口
   - TreeMap接口
## Vector
- 数组结构
- synchronized关键字加了锁，所以是线程安全的，性能较低
## ArrayList(重要)
- 特点
  - 数组结构
  - 非线程安全：没有加synchronized锁，性能较高
### 底层实现
- 底层数据结构：动态数组
- 初始容量：ArrayList初始容量为0，当第一次添加数据的时候才会初始化容量为10
- 扩容逻辑：ArrayList在进行扩容的时候是原来容量的1.5倍，每次扩容都需要拷贝数组
- 添加逻辑
  - 确保数组已使用长度（size）加1之后足够存下下一个数据​	
  - 计算数组的容量，如果当前数组已使用长度+1后的大于当前的数组长度，则调用grow方法扩容（原来的1.5倍）
  - 确保新增的数据有地方存储之后，则将新元素添加到位于size的位置上。​
  - 返回添加成功布尔值。
### 数组转List
- 数组转List：使用jdk的Arrays工具类的`asList`方法
- Arrays.asList转换list之后，如果修改了数组的内容，list会受影响，因为它的底层使用的Arrays类中的一个内部类ArrayList来构造的集合，在这个集合的构造器中，把我们传入的这个集合进行了包装而已，最终指向的都是同一个内存地址
- ![数组转List](https://blog-image-9943.oss-cn-beijing.aliyuncs.com/202308151700904.png)
```java
/**
 * @description TODO 数组转List测试
 * @param : null
 * @return void: null
 * @author hyy
 * 数组转List后，修改数组内容，List内容也被改了，因为Arrays.asList传入的数组和list只涉及到了对象的引用，没有创建新对象，指向的是同一个地址
 */
@Test
public void array2ListTest() {
    String[] arr = {"aaa", "bbb", "ccc"};
    List<String> list = Arrays.asList(arr);
    for (String s : list) {
        System.out.println(s);
    }

    System.out.println("=======");

    arr[0] = "zzz"; // 修改数组元素
    for (String s : list) {
        System.out.println(s);
    }
}
```
```
aaa
bbb
ccc
=======
zzz
bbb
ccc
```
### List转数组
- List转数组：使用List的`toArray`方法
- list用了toArray转数组后，如果修改了list内容，数组不会影响，当调用了toArray以后，在底层是它是进行了数组的拷贝，跟原来的元素就没啥关系了，所以即使list修改了以后，数组也不受影响

![List转数组](https://blog-image-9943.oss-cn-beijing.aliyuncs.com/202308151706767.png)
```java
/**
 * @description TODO List转数组测试
 * @param : null
 * @return void: null
 * @author hyy
 * List转数组后，修改list，array不会发生变化。因为list.toArray是拷贝了一份数据到新数组中,他们是不同的对象
 */
@Test
public void list2ArrayTest() {
    ArrayList<String> list = new ArrayList<>();
    list.add("aaa");
    list.add("bbb");
    list.add("ccc");
    String[] array = list.toArray(new String[list.size()]);
    for (String s : array) {
        System.out.println(s);
    }

    System.out.println("=======");

    list.add("zzz");
    for (String s : array) {
        System.out.println(s);
    }
}
```
```
aaa
bbb
ccc
=======
aaa
bbb
ccc
```
## LinkedList(重要)
- 双向链表结构
- 非线程安全
## ArrayList和LinkedList的区别
### 底层数据结构
- ArrayList 是动态数组的数据结构实现
- LinkedList 是双向链表的数据结构实现
### 操作数据效率
#### 查
- 下标查询：
  - ArrayList按照下标查询的时间复杂度O(1)【内存是连续的，根据寻址公式】
  - LinkedList不支持下标查询
- 未知索引查：
  - ArrayList需要遍历
  - LinkedList也需要遍历，时间复杂度都是O(n)
#### 新增和删除
- ArrayList尾部插入和删除，时间复杂度是O(1)；其他部分增删需要挪动数组，时间复杂度是O(n)
- LinkedList头尾节点增删时间复杂度是O(1)，其他都需要遍历链表，时间复杂度是O(n)
### 内存空间占用
- ArrayList底层是数组，内存连续，节省内存
- LinkedList 是双向链表需要存储数据，和两个指针，更占用内存
### 线程安全
- ArrayList和LinkedList都不是线程安全的
- 如果需要保证线程安全，有两种方案
  - 在方法内使用局部变量，局部变量每个线程都有一份，则是线程安全的
  - 用Collections工具类的synchronizedList包装集合，在底层加了synchronized锁，所以性能会下降
    - `List<Object> syncArrayList = Collections.synchronizedList(new ArrayList<>());`
    - `List<Object> syncLinkedList = Collections.synchronizedList(new LinkedList<>());`
## HashTable
## HashMap(重要)
### 底层数据结构
- 哈希表
### HashMap的实现原理
1. 当往HashMap中put元素时，利用key的hashCode方法重新hash计算出当前对象的元素在数组中的下标 
2. 存储时，如果出现hash值相同的key，此时有两种情况(哈希冲突)
   - 如果key相同，则覆盖原始值
   - 如果key不同（出现冲突），则将当前的key-value放入链表或红黑树中 树
3. 获取时，直接找到key的hash值对应的下标，在进一步判断key是否相同，从而找到对应值。
### jdk1.7和1.8中HashMap有什么区别
- JDK1.8之前采用的是拉链法
  - 将链表和数组相结合。也就是说创建一个链表数组，数组中每一格就是一个链表。若遇到哈希冲突，则将冲突的值加到链表中即可。
- jdk1.8在解决哈希冲突时有了较大的变化，当链表长度大于阈值（默认为8）时并且数组长度达到64时，将链表转化为红黑树，以减少搜索时间。
  - 扩容 resize( ) 时，红黑树拆分成的树的结点数小于等于临界值6个，则退化成链表
### HashMap的put方法的具体流程
1. 判断键值对数组table是否为空或为null，否则执行resize()进行扩容（初始化）
2. 根据键值key计算hash值得到数组索引
3. 判断table[i]==null，条件成立，直接新建节点添加
4. 如果table[i]==null ,不成立
  - 判断table[i]的首个元素是否和key一样，如果相同直接覆盖value
  - 判断table[i] 是否为treeNode，即table[i] 是否是红黑树，如果是红黑树，则直接在树中插入键值对
  - 遍历table[i]，链表的尾部插入数据，然后判断链表长度是否大于8，大于8的话把链表转换为红黑树，在红黑树中执行插入操 作，遍历过程中若发现key已经存在直接覆盖value
5. 插入成功后，判断实际存在的键值对数量size是否超多了最大容量threshold（数组长度*0.75），如果超过，进行扩容。

### HashMap的寻址算法
- 计算对象的 hashCode()
- 再进行调用 hash() 方法进行二次哈希， hashcode值右移16位再异或运算，让哈希分布更为均匀
- 最后 (capacity – 1) & hash 得到索引

### HashMap的扩容机制
- 在添加元素或初始化的时候需要调用resize方法进行扩容，第一次添加数据初始化数组长度为16，以后每次每次扩容都是达到了扩容阈值（数组长度 * 0.75）
- 每次扩容的时候，都是扩容之前容量的2倍； 
- 扩容之后，会新创建一个数组，需要把老数组中的数据挪动到新的数组中
  - 没有hash冲突的节点，则直接使用 e.hash & (newCap - 1) 计算新数组的索引位置
  - 如果是红黑树，走红黑树的添加
  - 如果是链表，则需要遍历链表，可能需要拆分链表，判断(e.hash & oldCap)是否为0，该元素的位置要么停留在原始位置，要么移动到原始位置+增加的数组大小这个位置上

### HashMap的数组长度
- 为何HashMap的数组长度一定是2的次幂
  - 计算索引时效率更高：如果是 2 的 n 次幂可以使用位与运算代替取模
  - 扩容时重新计算索引效率更高： hash & oldCap == 0 的元素留在原来位置 ，否则新位置 = 旧位置 + oldCap
### HashMap存储省市数据
```java
public static void main(String[] args) throws Exception {
    HashMap<String, List<String>> map = new HashMap<String, List<String>>();
    map.put("北京市", Arrays.asList("北京市"));
    map.put("海南省", Arrays.asList("海口市", "三亚市"));
    map.put("浙江省", Arrays.asList("绍兴市", "温州市", "湖州市", "嘉兴市", "台州市", "金华市", "舟山市", "衢州市", "丽水市"));

    Set<Entry<String, List<String>>> entrySet = map.entrySet();

    for (Entry<String, List<String>> entry : entrySet) {
        System.out.println(entry.getKey());
        List<String> value = entry.getValue();
        for (String string : value) {
            System.out.println("\t" + string);
        }
    }
}
```
## ConcurrentHashMap(重要)
## TreeMap