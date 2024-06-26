---
title: Java-数据结构-搜索树
article: false
category:
  - Java
  - Java数据结构
---
## 二叉搜索树
- 前言
  - 数组、链表队列等线性数据结构的查询效率并不高
    - 数组插入和删除等操作时间复杂度较高
    - 链表的查询操作时间复杂度较高
  - 二分查找是对数时间O(logn)，但是是有限制的，是针对已经排序的数组
- 是什么
  - 二叉搜索树(二叉排序树、二叉查找树)是查询效率较高的数据结构
- 作用
  - 快速查找，且加入元素时，排好序，不需要额外排序
- 特点
  - 树节点添加key属性，用来比较大小，key不可重复
  - 对于任意一个树节点，它的key比左子树的key都大，比右子树的key都小
  - 查找的性能与树高有关
- 查找流程
  - 查找某个元素A是否在树中，不需要把每个节点和该元素比较
  - 而是直接从根节点开始，比较根节点和待查找元素
  - 若小于A,则在根节点的右子树中找，而左子树都不用比较了，大大提高了效率...(二分查找的思想)
- 若二叉搜索树的结构相对平衡（左右高度相差不大），则查找的效率是对数级别O(logn)，即查找第一层(root)需要2的0次方即1次比较，查找第二层需要2的1次方即2次比较...所以是logn
- 最坏情况：不平衡的二叉搜索树，变成了链表结构，查找的效率降低到线性时间O(n)。
![二叉搜索树](https://blog-image-9943.oss-cn-beijing.aliyuncs.com/202308151744628.png)
![不平衡的二叉搜索树](https://blog-image-9943.oss-cn-beijing.aliyuncs.com/202308151751572.png)
![二叉搜索树的前驱](https://blog-image-9943.oss-cn-beijing.aliyuncs.com/202308161349989.png)
![二叉搜索树的后继](https://blog-image-9943.oss-cn-beijing.aliyuncs.com/202308161408338.png)
## AVL树
- 是什么
  - AVL树是一种自平衡的二叉搜索树
- 非平衡二叉搜索树的缺点：
  - 二叉搜索树在插入和删除时，节点可能失衡
  - 若一棵二叉搜索树不平衡，则其查询效率较低。最坏情况下：例如只有左子树时，查其叶子结点则要遍历完整棵树O(n)
- 解决：让树自平衡
  - 如果在插入和删除时通过旋转(旋转后不会破坏二叉搜索树的性质：左小右大), 维持二叉搜索树的平衡状态, 称为自平衡的二叉搜索树O(logn)
  - 平衡的树为什么搜索效率高：减少比较次数
  - 如何判断一棵树不平衡：若节点的左右孩子的高度差超过1，则该节点失衡，需要旋转
## B树
- 是什么
  - B树(Balance-Tree)是一种多路平衡搜索树，相对于二叉树，B树每个节点可以有多个分支
- 举例
  - 最大度数（max-degree）为5(5阶)的b-tree为例，那这个B树每个节点最多存储4个key
![B树举例](https://blog-image-9943.oss-cn-beijing.aliyuncs.com/202308171224395.png)
- B树是一种自平衡的树形数据结构，它可以存储大量数据，并支持高效地增删查操作。
- B树用于解决磁盘存储器上的数据管理问题，设计目标是减少磁盘I/O操作的次数，从而提高数据访问的效率。
- 缺点
  - 因为节点多了，遍历时路径上的这些节点是包含数据的，所以把这些没用的数据查出来是没有必要的
### 特点
- 度degree指树中节点孩子数
- 阶order指所有节点孩子数最大值
- 最小度数：非叶子节点的个数
- 除根节点和叶子节点外，其他每个节点至少有(order/2)再向上取整个孩子，例如阶数为3，则中间节点至少有2个孩子，否则树不平衡
- 所有叶子节点都在同一层(高度相同)
- 每个节点的关键字key可以有多个(n)(二叉搜索树节点的key只有一个)
  - 每个非叶子结点有n+1个孩子   (order/2)再向上取整 <= n <= order-1
- 存储的数据也是升序排列的，即左小右大
![B树](https://blog-image-9943.oss-cn-beijing.aliyuncs.com/202308171248326.png)
## B+树
- B+树是B树基础上的优化
  - 不同点
    - 非叶子结点只存储指针，数据存在叶子节点中
    - 非叶子结点作用：导航找到叶子节点
    - 磁盘读写代价更低
      - 非叶子结点只存储指针，存储压力较低
      - 例如：若查叶子结点，B树从根节点开始，把根节点数据查出来，左小右大比较...再把数据查出来，左小右大...最后才能定位到数据。
    - 查询效率更稳定
      - 所有叶子节点高度相同，效率差不多
    - 方便于扫库和区间查询
      - 叶子节点之间是通过双向指针连接，区间查询，找到区间的某个端点后就能获得区间其他数据，而不用从根节点重新遍历
- 为什么B+树应用于MySQL的索引
  - B+树适合做磁盘中的数据管理
  - B+树的叶子节点是双向链表
    - 方便扫库
    - 方便区间查询
      - 只要知道区间的某个端点即可获取区间所有数据，而不需要从根节点重新遍历
![B+树](https://blog-image-9943.oss-cn-beijing.aliyuncs.com/202308171252806.png)
## B树、AVL树、红黑树的区别和联系
### 适合存储什么数据
- AVL树和红黑树适合做内存中的数据管理
- B树适合做磁盘中的数据管理
- 原因
  - AVL树和红黑树的效率取决于树的高度，树的高度越低，比较次数越少
    - AVL：一百万数据，树高大约为20，log2的1000000约等于20。最坏情况下，若查找叶子节点，则要比较20次
    - 而在磁盘上做20次读写，效率慢。内存上读写是纳秒级，磁盘上读写是毫秒级
    - B树：100万数据，最小度数为500，树高大约为3，最坏情况下，若查找叶子节点，则要比较3次